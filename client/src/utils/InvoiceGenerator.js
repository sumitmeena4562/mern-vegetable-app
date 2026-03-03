import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateInvoice = (order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text('TAX INVOICE', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Order ID: #${order.orderId || order.id || order._id}`, 14, 30);
    doc.text(`Date: ${new Date(order.createdAt || order.date).toLocaleDateString()}`, 14, 35);

    // Addresses
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('From (Farmer):', 14, 50);
    doc.setFontSize(10);
    doc.text(order.farmer?.fullName || order.farmer || 'Farmer Details', 14, 56);
    doc.text(order.farmer?.mobile || '', 14, 61);

    doc.setFontSize(12);
    doc.text('To (Vendor):', 120, 50);
    doc.setFontSize(10);
    doc.text('AgriConnect Vendor', 120, 56);

    // Table
    const tableData = (order.products || []).map(p => [
        p.name,
        `${p.quantity} ${p.unit}`,
        `INR ${p.pricePerUnit}`,
        `INR ${p.quantity * p.pricePerUnit}`
    ]);

    doc.autoTable({
        startY: 75,
        head: [['Product', 'Quantity', 'Rate', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillStyle: [30, 41, 59], textColor: [255, 255, 255] },
        styles: { fontSize: 9, cellPadding: 5 }
    });

    // Total
    const finalY = doc.previousAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229); // indigo-600
    doc.text(`Total Amount: INR ${order.finalAmount || order.total}`, 140, finalY);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('Computer generated invoice. No signature required.', 105, 280, null, null, 'center');

    doc.save(`Invoice_${order.orderId || order.id}.pdf`);
};
