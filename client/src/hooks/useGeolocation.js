import { useState } from 'react';

export const getAddressFromCoordinates = async (lat, lng) => {
    try {
        const services = [
            {
                name: "BigDataCloud",
                url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
                parser: (data) => ({
                    city: data.city || data.locality || "",
                    state: data.principalSubdivision || "",
                    country: data.countryName || "India"
                })
            },
            {
                name: "OpenStreetMap (Fallback)",
                url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
                parser: (data) => ({
                    city: data.address?.city || data.address?.town || data.address?.village || "",
                    state: data.address?.state || data.address?.region || "",
                    country: data.address?.country || "India"
                })
            }
        ];

        for (const service of services) {
            try {
                const response = await fetch(service.url, { timeout: 5000 });
                if (response.ok) {
                    const data = await response.json();
                    const address = service.parser(data);
                    if (address.city || address.state) return address;
                }
            } catch { continue; }
        }
        return { city: "", state: "", country: "India" };
    } catch {
        return { city: "", state: "", country: "India" };
    }
};

export const detectGeolocation = () => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({ success: false, error: "Geolocation not supported" });
            return;
        }
        const options = { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 };
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                resolve({
                    success: true,
                    coordinates: { latitude: position.coords.latitude, longitude: position.coords.longitude }
                });
            },
            (error) => {
                let errorType = "unknown";
                if (error.code === error.PERMISSION_DENIED) errorType = "permission_denied";
                if (error.code === error.POSITION_UNAVAILABLE) errorType = "position_unavailable";
                if (error.code === error.TIMEOUT) errorType = "timeout";
                resolve({ success: false, error: errorType, message: error.message });
            },
            options
        );
    });
};

export const getLocationByIP = async () => {
    try {
        const services = ["https://ipapi.co/json/", "https://ipinfo.io/json?token=demo", "https://geolocation-db.com/json/"];
        for (const url of services) {
            try {
                const response = await fetch(url, { timeout: 5000 });
                if (response.ok) {
                    const data = await response.json();
                    let city = data.city || "", state = data.region || data.state || "";
                    if (city || state) return { city, state };
                }
            } catch { continue; }
        }
        return { city: "", state: "" };
    } catch { return { city: "", state: "" }; }
};

export default function useGeolocation() {
    const [userLocation, setUserLocation] = useState({
        city: "", state: "", loading: true, hasLocation: false,
        showAddLocation: false, error: null, errorMessage: ""
    });

    const loadUserLocation = async () => {
        setUserLocation(prev => ({ ...prev, loading: true, error: null }));
        try {
            const geoResult = await detectGeolocation();
            if (geoResult.success && geoResult.coordinates) {
                const address = await getAddressFromCoordinates(geoResult.coordinates.latitude, geoResult.coordinates.longitude);
                if (address.city || address.state) {
                    setUserLocation({
                        city: address.city || "Unknown", state: address.state || "Unknown",
                        loading: false, hasLocation: true, showAddLocation: false, error: null, errorMessage: ""
                    });
                    return;
                }
            }
            if (geoResult.error === "timeout") {
                const ipLocation = await getLocationByIP();
                if (ipLocation.city && ipLocation.state) {
                    setUserLocation({
                        city: ipLocation.city, state: ipLocation.state,
                        loading: false, hasLocation: true, showAddLocation: false, error: "timeout", errorMessage: "Using approximate location"
                    });
                    return;
                }
            }
            setUserLocation(prev => {
                if (prev.hasLocation) return { ...prev, loading: false, error: "", errorMessage: "" };
                return {
                    city: "", state: "", fullAddress: "Location Unavailable", loading: false,
                    hasLocation: false, showAddLocation: false, error: geoResult.error || "no_location", errorMessage: "Location not available"
                };
            });
        } catch {
            setUserLocation({ city: "", state: "", loading: false, hasLocation: false, showAddLocation: true, error: "exception", errorMessage: "Failed to detect location" });
        }
    };

    return { userLocation, setUserLocation, loadUserLocation };
}
