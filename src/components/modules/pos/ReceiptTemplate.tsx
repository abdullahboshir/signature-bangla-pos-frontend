import { format } from "date-fns";
import React, { forwardRef } from "react";

interface ReceiptProps {
    data: any; // Order data
    settings: any; // BusinessUnitSettings
}

export const ReceiptTemplate = forwardRef<HTMLDivElement, ReceiptProps>(({ data, settings }, ref) => {
    if (!data || !settings) return null;

    const { pos, inventory, prefixes } = settings;
    const isThermal = pos?.receiptLayout === 'thermal';
    const showLogo = pos?.showLogo;
    const logoPosition = pos?.logoPosition || 'top';

    // Styles for print
    // We use a style tag here to ensure these styles are applied when printing
    // In a real app, these might be in a global css file
    const printStyles = `
        @media print {
            body * {
                visibility: hidden;
            }
            #printable-receipt, #printable-receipt * {
                visibility: visible;
            }
            #printable-receipt {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            @page {
                size: ${isThermal ? '80mm auto' : 'auto'};
                margin: 0;
            }
        }
    `;

    return (
        <div className="hidden print:block" id="printable-receipt" ref={ref}>
            <style>{printStyles}</style>

            <div className={`p-4 bg-white text-black ${isThermal ? 'w-[80mm] text-xs' : 'w-full max-w-[210mm] mx-auto'}`}>

                {/* Header */}
                <div className={`text-center mb-4 ${isThermal ? 'space-y-1' : 'space-y-2 border-b pb-4'}`}>
                    {showLogo && logoPosition === 'top' && (
                        <div className="font-bold text-xl uppercase tracking-widest mb-2">
                            {/* Placeholder for Logo if actual image URL exists in future settings */}
                            LOGO
                        </div>
                    )}

                    <h1 className={`${isThermal ? 'text-lg' : 'text-2xl'} font-bold`}>
                        {settings.businessUnit?.name || "Store Name"}
                    </h1>

                    {pos?.receiptHeader && (
                        <p className="whitespace-pre-wrap opacity-80">{pos.receiptHeader}</p>
                    )}

                    <div className="text-[10px] opacity-60 mt-2">
                        {format(new Date(), 'dd/MM/yyyy HH:mm')} | Ref: {data.orderId || data._id}
                    </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-1">Item</th>
                                <th className="py-1 text-center">Qty</th>
                                <th className="py-1 text-right">Price</th>
                                <th className="py-1 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {data.items?.map((item: any, idx: number) => (
                                <tr key={idx} className="border-b border-dashed border-gray-200">
                                    <td className="py-1 pr-1 truncate max-w-[40mm]">
                                        {item.product?.name || "Item"}
                                    </td>
                                    <td className="py-1 text-center">{item.quantity}</td>
                                    <td className="py-1 text-right">{item.price}</td>
                                    <td className="py-1 text-right">{item.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className={`flex flex-col gap-1 items-end pt-2 border-t font-medium ${isThermal ? 'text-sm' : 'text-base'}`}>
                    <div className="flex justify-between w-full md:w-1/2">
                        <span>Subtotal:</span>
                        <span>{data.subTotal?.toFixed(2)}</span>
                    </div>
                    {data.tax > 0 && (
                        <div className="flex justify-between w-full md:w-1/2 text-xs opacity-70">
                            <span>Tax:</span>
                            <span>{data.tax?.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between w-full md:w-1/2 text-lg font-bold border-t border-black pt-1 mt-1">
                        <span>Total:</span>
                        <span>{data.totalAmount?.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="mt-4 pt-2 border-t border-dashed text-xs">
                    <div className="flex justify-between">
                        <span>Paid via {data.paymentMethod}:</span>
                        <span>{data.paidAmount?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Return/Change:</span>
                        <span>{((data.paidAmount || 0) - (data.totalAmount || 0)).toFixed(2)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center space-y-2">
                    {/* Barcode Placeholder - leveraging prefixes */}
                    <div className="font-mono text-[10px] tracking-widest">
                        *{data.orderId || data._id}*
                    </div>

                    {pos?.receiptFooter && (
                        <p className="whitespace-pre-wrap opacity-80 text-[10px]">{pos.receiptFooter}</p>
                    )}

                    {showLogo && logoPosition === 'bottom' && (
                        <div className="font-bold text-lg uppercase mt-2">LOGO</div>
                    )}

                    <p className="text-[8px] opacity-50 mt-2">Powered by Signature Bangla POS</p>
                </div>
            </div>
        </div>
    );
});

ReceiptTemplate.displayName = "ReceiptTemplate";
