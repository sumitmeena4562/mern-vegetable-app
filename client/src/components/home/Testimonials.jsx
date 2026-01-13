import React from 'react';

const Testimonials = () => {
    const reviews = [
        {
            name: 'Ram Patil',
            role: 'Farmer, Nashik',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
            quote: 'Pehle mandi mein rates kam milte the aur payment late hoti thi. AgriConnect pe mujhe Turant payment milti hai aur sahi daam bhi.',
            rating: 5
        },
        {
            name: 'Fresh Mart',
            role: 'Vendor, Pune',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
            quote: 'Bulk Vegetables khareedna ab bahut aasaan hai. Quality ekdum fresh hoti hai kyunki seedha khet se aata hai.',
            rating: 5
        },
        {
            name: 'Priya Sharma',
            role: 'Customer, Mumbai',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
            quote: 'I love knowing exactly where my food comes from. The QR code traceability is amazing!',
            rating: 4
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
                        Trusted by <span className="text-green-600">Thousands</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Hear from the community changing Indian agriculture.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-green-50/30 p-6 md:p-8 rounded-3xl border border-green-100 hover:border-green-300 transition-colors relative">
                            {/* Quote Icon */}
                            <span className="material-symbols-outlined absolute top-6 right-6 text-4xl text-green-200">format_quote</span>

                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={review.image}
                                    alt={review.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-900">{review.name}</h3>
                                    <p className="text-sm text-green-700 font-medium">{review.role}</p>
                                </div>
                            </div>

                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="material-symbols-outlined text-xl fill-current">
                                        {i < review.rating ? 'star' : 'star_border'}
                                    </span>
                                ))}
                            </div>

                            <p className="text-gray-600 italic leading-relaxed">
                                "{review.quote}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
