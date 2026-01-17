"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSetupPasswordMutation, useResendSetupInvitationMutation } from "@/redux/api/iam/authApi";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";

function SetupPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [setupPassword, { isLoading }] = useSetupPasswordMutation();
    const [resendInvitation, { isLoading: isResending }] = useResendSetupInvitationMutation();

    // Mode: 'setup' | 'resend'
    const [viewMode, setViewMode] = useState<'setup' | 'resend'>('setup');
    const [resendEmail, setResendEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // If no token initially, default to Invalid Link view which allows switching to 'resend'
    const isTokenMissing = !token;

    const handleResendSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!resendEmail) return;

        try {
            const result = await resendInvitation({ email: resendEmail }).unwrap();
            toast.success(result?.message || "Invitation sent! Please check your email.");
            // Reset to login after success? or just show success state.
            // Let's keep them here but maybe clear email.
            setResendEmail("");
        } catch (err: any) {
            console.error("Resend error:", err);
            toast.error(err?.data?.message || "Failed to resend invitation.");
        }
    };

    const handleSetupSubmit = async (e: React.FormEvent) => {
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
            const result = await setupPassword({ token: token!, password }).unwrap();
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

    // VIEW: RESEND INVITATION
    if (viewMode === 'resend') {
        return (
            <Dialog open={true}>
                <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            Resend Invitation
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Enter the email address associated with your account to receive a new setup link.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleResendSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input
                                type="email"
                                value={resendEmail}
                                onChange={(e) => setResendEmail(e.target.value)}
                                placeholder="name@organization.com"
                                required
                            />
                        </div>

                        <Button disabled={isResending} className="w-full" type="submit">
                            {isResending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send New Link"
                            )}
                        </Button>

                        <div className="text-center mt-2">
                            <Button variant="link" className="text-xs" type="button" onClick={() => isTokenMissing ? router.push("/auth/login") : setViewMode('setup')}>
                                {isTokenMissing ? "Back to Login" : "Back to Setup"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    // VIEW: INVALID LINK (Missing Token)
    if (isTokenMissing) {
        return (
            <Dialog open={true}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2 text-destructive">
                            <AlertTriangle className="w-6 h-6" />
                            Invalid or Missing Link
                        </DialogTitle>
                        <DialogDescription className="text-center space-y-2">
                            <p>This password setup link is invalid or has expired.</p>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 mt-4">
                        <Button variant="default" onClick={() => setViewMode('resend')}>
                            Resend Invitation Link
                        </Button>
                        <Button variant="outline" onClick={() => router.push("/auth/login")}>
                            Go to Login
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // VIEW: SETUP FORM
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

                <form onSubmit={handleSetupSubmit} className="space-y-4 mt-4">
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
                        <div className="flex flex-col gap-2">
                            <div className="text-destructive text-sm font-medium text-center p-2 bg-destructive/10 rounded-md border border-destructive/20">
                                {error}
                            </div>
                            {/* If error suggests expiry, offer resend */}
                            <Button variant="outline" size="sm" onClick={() => setViewMode('resend')}>
                                Link Expired? Request New One
                            </Button>
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
