import React from 'react';

const Testimonials = () => {
    const reviews = [
        {
            name: 'Ram Patil',
            role: 'Farmer, Nashik',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
            quote: 'Earlier I used to get low rates at mandi with delayed payments. On AgriConnect I get instant payment and fair prices.',
            rating: 5,
            tag: '🌾 Farmer'
        },
        {
            name: 'Fresh Mart',
            role: 'Vendor, Pune',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
            quote: 'Buying bulk vegetables is now super easy. Quality is always fresh because it comes straight from the farm.',
            rating: 5,
            tag: '🏪 Vendor'
        },
        {
            name: 'Priya Sharma',
            role: 'Customer, Mumbai',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
            quote: 'I love knowing exactly where my food comes from. The QR code traceability is amazing!',
            rating: 4,
            tag: '🛒 Customer'
        }
    ];

    return (
        <section className="py-16 sm:py-24 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-full text-amber-700 text-xs font-bold mb-4">
                        <span className="material-symbols-outlined text-sm">star</span>
                        Testimonials
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
                        Trusted by <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Thousands</span>
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-slate-500">
                        Hear from the community changing Indian agriculture.
                    </p>
                </div>

                {/* Mobile: horizontal scroll / Desktop: grid */}
                <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 gap-4 sm:gap-6 snap-x snap-mandatory md:snap-none -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    {reviews.map((review, index) => (
                        <div key={index}
                            className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-auto snap-center bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 relative">
                            {/* Tag */}
                            <div className="absolute top-4 right-4 px-2.5 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
                                {review.tag}
                            </div>

                            {/* Quote Icon */}
                            <span className="text-4xl sm:text-5xl text-slate-100 leading-none block mb-3">"</span>

                            {/* Quote */}
                            <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-5 italic">
                                {review.quote}
                            </p>

                            {/* Stars */}
                            <div className="flex gap-0.5 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-base ${i < review.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                                ))}
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                <img src={review.image} alt={review.name}
                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white shadow-md" />
                                <div>
                                    <h3 className="font-bold text-sm text-slate-800">{review.name}</h3>
                                    <p className="text-xs text-green-600 font-medium">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile scroll indicator */}
                <div className="flex justify-center gap-1.5 mt-4 md:hidden">
                    {reviews.map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-slate-200" />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
