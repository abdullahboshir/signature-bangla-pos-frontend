"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import Swal from "sweetalert2";

interface OpenRegisterModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OpenRegisterModal({ open, onOpenChange }: OpenRegisterModalProps) {
    const [openingBalance, setOpeningBalance] = useState("");
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            Swal.fire({
                icon: "success",
                title: "Register Opened",
                text: `Register opened with balance: ${openingBalance}`,
                timer: 1500,
                showConfirmButton: false,
            });

            onOpenChange(false);
            setOpeningBalance("");
            setNotes("");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to open register",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Open Register</DialogTitle>
                    <DialogDescription>
                        Enter the initial cash amount to start your shift.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Opening Balance</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                className="pl-9"
                                value={openingBalance}
                                onChange={(e) => setOpeningBalance(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input
                            id="notes"
                            placeholder="e.g., Morning Shift"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? "Opening..." : "Open Register"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
