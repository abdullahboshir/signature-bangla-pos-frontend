
import React from 'react';
import { IOrder } from './order.types';
import { format } from 'date-fns';

interface InvoicePrintProps {
    order: IOrder;
    settings?: any; // Business settings like logo, address
}

export const InvoicePrint = React.forwardRef<HTMLDivElement, InvoicePrintProps>(({ order, settings }, ref) => {
    return (
        <div ref={ref} className="p-8 bg-white text-black print:block hidden" id="printable-invoice">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                    <p className="text-sm font-semibold">Order ID: {order.orderId}</p>
                    <p className="text-sm text-gray-500">Date: {format(new Date(order.createdAt), "MMMM dd, yyyy")}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold">{settings?.shopName || "Signature Bangla"}</h2>
                    <p className="text-sm">{settings?.address || "123 Business Street"}</p>
                    <p className="text-sm">{settings?.phone || "Phone: +880 1234 567890"}</p>
                    <p className="text-sm">{settings?.email || "info@signaturebangla.com"}</p>
                </div>
            </div>

            {/* Bill To / Ship To */}
            <div className="flex justify-between mb-8">
                <div className="w-1/2">
                    <h3 className="text-lg font-bold mb-2 text-gray-700">Bill To:</h3>
                    <p className="font-semibold">{(order.customer as any)?.name?.firstName} {(order.customer as any)?.name?.lastName}</p>
                    <p>{(order.customer as any)?.email}</p>
                    <p>{(order.customer as any)?.phone}</p>
                    <p>{order.shippingAddress?.street}</p>
                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                </div>
                <div className="w-1/2 text-right">
                    {/* Optional: Ship To different from Bill To? For now same */}
                    <div className="inline-block text-left">
                        <h3 className="text-lg font-bold mb-2 text-gray-700">Ship To:</h3>
                        <p className="font-semibold">{(order.customer as any)?.name?.firstName} {(order.customer as any)?.name?.lastName}</p>
                        <p>{order.shippingAddress?.street}</p>
                        <p>{order.shippingAddress?.city} {order.shippingAddress?.postalCode}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-800">
                        <th className="text-left py-2">Item</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-center py-2">Qty</th>
                        <th className="text-right py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="py-2">
                                <div className="font-bold">{(item.product as any)?.name}</div>
                                <div className="text-xs text-gray-500">SKU: {(item.product as any)?.sku}</div>
                            </td>
                            <td className="text-right py-2">{item.price}</td>
                            <td className="text-center py-2">{item.quantity}</td>
                            <td className="text-right py-2 font-bold">{item.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-1/2 sm:w-1/3">
                    <div className="flex justify-between py-1 border-b">
                        <span>Subtotal:</span>
                        <span>{order.subTotal} BDT</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                        <span>Tax:</span>
                        <span>{order.tax} BDT</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                        <span>Discount:</span>
                        <span>- {order.discount} BDT</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                        <span>Shipping:</span>
                        <span>{order.shippingCost} BDT</span>
                    </div>
                    <div className="flex justify-between py-2 text-xl font-bold bg-gray-100 mt-2 px-2">
                        <span>Total:</span>
                        <span>{order.totalAmount} BDT</span>
                    </div>
                    <div className="flex justify-between py-1 mt-2 text-sm">
                        <span>Paid:</span>
                        <span className="text-green-600">{order.paidAmount} BDT</span>
                    </div>
                    <div className="flex justify-between py-1 text-sm border-t border-black pt-1">
                        <span>Due:</span>
                        <span className="text-red-600">{order.dueAmount} BDT</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 text-center text-sm text-gray-500 border-t pt-4">
                Thank you for your business!
            </div>
        </div>
    );
});

InvoicePrint.displayName = "InvoicePrint";
