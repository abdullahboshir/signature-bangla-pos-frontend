"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle, Download, FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BulkImportModalProps {
    trigger: React.ReactNode;
    title: string;
    description?: string;
    onImport: (data: any[], reset: () => void) => Promise<void>;
    validateRow: (row: any) => { isValid: boolean; errors: string[] };
    sampleData: any[]; // For template download
    sampleFilename?: string;
}

export function BulkImportModal({
    trigger,
    title,
    description,
    onImport,
    validateRow,
    sampleData,
    sampleFilename = "import-template.csv"
}: BulkImportModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [validationResults, setValidationResults] = useState<{ isValid: boolean; errors: string[] }[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const reset = () => {
        setFile(null);
        setParsedData([]);
        setValidationResults([]);
        setProgress(0);
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseFile(selectedFile);
        }
    };

    const parseFile = (file: File) => {
        setIsParsing(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data;
                setParsedData(data);

                // Validate all rows immediately
                const validations = data.map((row: any) => validateRow(row));
                setValidationResults(validations);

                setIsParsing(false);
            },
            error: (error) => {
                toast.error(`Error parsing parsing file: ${error.message}`);
                setIsParsing(false);
            }
        });
    };

    const handleDownloadTemplate = () => {
        const csv = Papa.unparse(sampleData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", sampleFilename);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleImport = async () => {
        if (!parsedData.length) return;

        // Check overall validity
        const validCount = validationResults.filter(v => v.isValid).length;
        if (validCount === 0) {
            toast.error("No valid data rows found to import.");
            return;
        }

        if (validCount < parsedData.length) {
            if (!confirm(`Found ${parsedData.length - validCount} invalid rows. They will be skipped. Proceed with ${validCount} valid rows?`)) {
                return;
            }
        }

        setIsImporting(true);
        try {
            // Only send valid rows to the parent handler
            // But we pass ALL data so the parent can decide how to handle logic, 
            // OR simpler: we filter here. Let's filter here for safety.
            const validRows = parsedData.filter((_, idx) => validationResults[idx].isValid);
            await onImport(validRows, reset);
            setIsOpen(false);
        } catch (error) {
            // Error handling usually done in parent
            console.error(error);
        } finally {
            setIsImporting(false);
        }
    };

    const validRowsCount = validationResults.filter(r => r.isValid).length;
    const invalidRowsCount = validationResults.length - validRowsCount;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!isImporting) {
                setIsOpen(open);
                if (!open) reset();
            }
        }}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description || "Upload a CSV file to bulk import data."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col gap-4 py-4">
                    {/* Actions Bar */}
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                                <Download className="mr-2 h-4 w-4" /> Download Template
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            {file ? (
                                <Button variant="ghost" size="sm" onClick={reset} disabled={isImporting}>
                                    <X className="mr-2 h-4 w-4" /> Remove File
                                </Button>
                            ) : (
                                <div className="relative">
                                    <Button size="sm" variant="secondary">
                                        <Upload className="mr-2 h-4 w-4" /> Select CSV File
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv,.txt"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        disabled={isParsing || isImporting}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Area */}
                    {!file && (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-md bg-muted/10 p-12 text-center">
                            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No file selected</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Upload a CSV file to preview and validate data.
                            </p>
                        </div>
                    )}

                    {isParsing && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Parsing file...</p>
                            </div>
                        </div>
                    )}

                    {file && !isParsing && parsedData.length > 0 && (
                        <div className="flex flex-col flex-1 min-h-0 gap-4">
                            {/* Stats */}
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center text-green-600 gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="font-medium">{validRowsCount} Valid</span>
                                </div>
                                {invalidRowsCount > 0 && (
                                    <div className="flex items-center text-red-600 gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="font-medium">{invalidRowsCount} Invalid</span>
                                    </div>
                                )}
                            </div>

                            {/* Table */}
                            <div className="border rounded-md flex-1 overflow-hidden relative">
                                <ScrollArea className="h-full w-full">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-background z-10">
                                            <TableRow>
                                                <TableHead className="w-[100px]">Status</TableHead>
                                                {Object.keys(parsedData[0] || {}).map((header) => (
                                                    <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>
                                                ))}
                                                <TableHead>Errors</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {parsedData.map((row, idx) => {
                                                const validation = validationResults[idx];
                                                return (
                                                    <TableRow key={idx} className={!validation.isValid ? "bg-red-50 hover:bg-red-100" : ""}>
                                                        <TableCell>
                                                            {validation.isValid ? (
                                                                <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">Valid</Badge>
                                                            ) : (
                                                                <Badge variant="destructive">Invalid</Badge>
                                                            )}
                                                        </TableCell>
                                                        {Object.values(row).map((val: any, i) => (
                                                            <TableCell key={i} className="whitespace-nowrap max-w-[200px] truncate" title={String(val)}>
                                                                {val}
                                                            </TableCell>
                                                        ))}
                                                        <TableCell className="text-red-600 text-xs text-wrap max-w-[250px]">
                                                            {!validation.isValid && validation.errors.join(", ")}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isImporting}>Cancel</Button>
                    <Button onClick={handleImport} disabled={!parsedData.length || isImporting || validRowsCount === 0}>
                        {isImporting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...
                            </>
                        ) : (
                            `Import ${validRowsCount} Rows`
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Simple Badge Helper if ui/badge doesn't support variants easily
function Badge({ variant, className, children }: any) {
    if (variant === "success") {
        return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>{children}</span>
    }
    // fallback to standard classes for destructive
    return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-destructive text-destructive-foreground hover:bg-destructive/80", className)}>{children}</span>

}
