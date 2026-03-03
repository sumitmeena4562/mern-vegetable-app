import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../api/axios';

const VendorInvoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/vendors/orders/${id}`);
                if (res.data.success) {
                    setOrder(res.data.data);
                }
            } catch (error) {
                console.error('Fetch order error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 h-screen">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-2xl animate-spin mb-4"></div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Generating Invoice...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Invoice Not Found</h2>
                <button onClick={() => navigate('/vendor-dashboard/orders')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Back to Orders</button>
            </div>
        );
    }

    const { farmer, products, orderId, createdAt, finalAmount, totalAmount, deliveryCharges, tax, discount } = order;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 print:p-0 print:bg-white flex flex-col items-center">

            {/* Header Actions - Hidden when printing */}
            <div className="w-full max-w-4xl mb-6 flex justify-between items-center print:hidden">
                <button
                    onClick={() => navigate('/vendor-dashboard/orders')}
                    className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors bg-white px-4 py-2 rounded-xl border border-indigo-100 shadow-sm"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Orders
                </button>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/25 transition-all"
                >
                    <span className="material-symbols-outlined text-lg">download</span>
                    Download PDF / Print
                </button>
            </div>

            {/* A4 Printable Invoice Area */}
            <div className="w-full max-w-4xl bg-white rounded-3xl md:p-12 p-6 shadow-2xl print:shadow-none print:rounded-none">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-8 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-2xl">eco</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none pt-1">AgriConnect</h1>
                        </div>
                        <p className="text-slate-500 font-medium">B2B Sourcing Invoice</p>
                    </div>
                    <div className="mt-6 md:mt-0 text-left md:text-right">
                        <h2 className="text-xl font-bold text-slate-800 text-indigo-600">INVOICE #{orderId}</h2>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
                            Date: {new Date(createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                            Generated on: {new Date().toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-3 border-b border-slate-200 pb-2">Supplier (Billed From)</p>
                        <h3 className="font-bold text-slate-800 text-lg">{farmer?.farmName || farmer?.fullName || 'Verified Farmer'}</h3>
                        <p className="text-slate-500 text-sm mt-1 mb-2 font-medium">{farmer?.address || 'India'}</p>
                        <p className="text-slate-600 text-xs font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[14px]">phone</span>
                            {farmer?.mobile || 'N/A'}
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 border-b border-slate-100 pb-2">Buyer (Billed To)</p>
                        <h3 className="font-bold text-slate-800 text-lg">{order.deliveryAddress?.name || 'Vendor Business'}</h3>
                        <p className="text-slate-500 text-sm mt-1 mb-2 font-medium">
                            {order.deliveryAddress?.address ?
                                `${order.deliveryAddress.address}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}`
                                : 'Business Address'
                            }
                        </p>
                        <p className="text-slate-600 text-xs font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[14px]">phone</span>
                            {order.deliveryAddress?.phone || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-12 border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-200">Description</th>
                                <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-200 text-right">Qty</th>
                                <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-200 text-right">Rate</th>
                                <th className="py-4 px-6 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-200 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {products?.map((item, index) => (
                                <tr key={item._id || index} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6 font-bold text-slate-800">{item.name}</td>
                                    <td className="py-4 px-6 font-semibold text-slate-600 text-right">{item.quantity} {item.unit || 'kg'}</td>
                                    <td className="py-4 px-6 font-semibold text-slate-600 text-right">₹{item.pricePerUnit?.toLocaleString()}</td>
                                    <td className="py-4 px-6 font-black text-slate-800 text-right">₹{item.totalPrice?.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div className="w-full md:w-1/2 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-500 leading-relaxed italic">
                        <strong className="block text-slate-700 not-italic mb-2 text-xs uppercase tracking-widest">Authorized Transaction</strong>
                        This is a computer-generated invoice and does not require a physical signature. Returns/Refunds are subject to platform policy.
                    </div>
                    <div className="w-full md:w-1/3">
                        <div className="space-y-3 font-semibold text-sm text-slate-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{totalAmount?.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Discount</span>
                                    <span>-₹{discount?.toLocaleString()}</span>
                                </div>
                            )}
                            {tax > 0 && (
                                <div className="flex justify-between">
                                    <span>Taxes</span>
                                    <span>+₹{tax?.toLocaleString()}</span>
                                </div>
                            )}
                            {deliveryCharges > 0 && (
                                <div className="flex justify-between">
                                    <span>Logistics</span>
                                    <span>+₹{deliveryCharges?.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-4 mt-4 border-t-2 border-slate-200 font-black text-xl text-indigo-700">
                                <span>Total Paid</span>
                                <span>₹{(finalAmount || totalAmount)?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Center aligned */}
                <div className="text-center border-t border-slate-100 pt-8">
                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">
                        Thank you for doing business with AgriConnect!
                    </p>
                    <p className="text-xs text-slate-400 font-medium">www.agriconnect.com | support@agriconnect.com</p>
                </div>

            </div>
        </div>
    );
};

export default VendorInvoice;
