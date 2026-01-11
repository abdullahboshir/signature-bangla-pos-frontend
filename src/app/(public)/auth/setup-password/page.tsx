"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSetupPasswordMutation } from "@/redux/api/iam/authApi";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";

function SetupPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [setupPassword, { isLoading }] = useSetupPasswordMutation();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // No token = show error state
    if (!token) {
        return (
            <Dialog open={true}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2 text-destructive">
                            <AlertTriangle className="w-6 h-6" />
                            Invalid Link
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            This password setup link is invalid or has expired.
                            Please contact support for a new invitation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center mt-4">
                        <Button onClick={() => router.push("/auth/login")}>
                            Go to Login
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const result = await setupPassword({ token, password }).unwrap();
            toast.success(result?.message || "Password set successfully!");

            // Redirect to login
            setTimeout(() => {
                router.push("/auth/login");
            }, 1500);
        } catch (err: any) {
            console.error("Setup password error:", err);
            setError(err?.data?.message || err?.message || "Failed to set password. The link may have expired.");
        }
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        Setup Your Password
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Create a secure password for your Signature Bangla POS account.
                        Your password must be at least 8 characters.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                                placeholder="Enter your password"
                                required
                                minLength={8}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm Password</label>
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                            placeholder="Confirm your password"
                            required
                            minLength={8}
                        />
                    </div>

                    {error && (
                        <div className="text-destructive text-sm font-medium text-center p-2 bg-destructive/10 rounded-md border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <Button disabled={isLoading} className="w-full" type="submit">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Setting up...
                            </>
                        ) : (
                            "Set Password & Continue"
                        )}
                    </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-4">
                    After setting your password, you will be redirected to the login page.
                </p>
            </DialogContent>
        </Dialog>
    );
}

export default function SetupPasswordPage() {
    return (
        <Suspense fallback={
            <Dialog open={true}>
                <DialogContent className="sm:max-w-md">
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </DialogContent>
            </Dialog>
        }>
            <SetupPasswordContent />
        </Suspense>
    );
}
