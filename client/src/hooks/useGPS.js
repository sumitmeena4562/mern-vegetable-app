import { useState } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for GPS location capture.
 * Shared between FarmerRegistration and VendorRegistration.
 *
 * @param {Function} onSuccess - Callback with { longitude, latitude } on success
 * @param {string}   successMsg - Toast message on success (default: "Location captured!")
 */
const useGPS = (onSuccess, successMsg = "Location captured successfully!") => {
    const [gpsLoading, setGpsLoading] = useState(false);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }
        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                onSuccess({
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude,
                });
                toast.success(successMsg);
                setGpsLoading(false);
            },
            (error) => {
                setGpsLoading(false);
                let errorMsg = "Unable to retrieve your location";
                switch (error.code) {
                    case 1:
                        errorMsg = "⚠️ Permission Denied! Please allow location access in your browser settings.";
                        break;
                    case 2:
                        errorMsg = "📡 GPS Unavailable! Please ensure your device location is turned ON.";
                        break;
                    case 3:
                        errorMsg = "⏳ Request Timed Out! Please try again in an open area.";
                        break;
                    default:
                        errorMsg = `❌ Location Error: ${error.message}`;
                }
                toast.error(errorMsg, { duration: 5000 });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return { gpsLoading, handleGetLocation };
};

export default useGPS;
