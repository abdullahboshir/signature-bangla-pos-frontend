
export function exportToCSV(data: any[], filename: string) {
    if (!data || !data.length) {
        return;
    }

    // Flatten object if needed or just take top level keys
    // For simplicity, we assume data is somewhat flat or we just take headers from first obj
    const headers = Object.keys(data[0]);
    
    const csvContent = [
        headers.join(","), // Header row
        ...data.map(row => headers.map(fieldName => {
            let value = row[fieldName];
            // Handle objects/arrays roughly
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            // Escape quotes and wrap in quotes
            return `"${String(value).replace(/"/g, '""')}"`;
        }).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
