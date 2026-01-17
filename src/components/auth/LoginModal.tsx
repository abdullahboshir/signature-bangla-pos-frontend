"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoadingStore } from "@/store/loadingStore";

import { useUserRegisterMutation } from "@/redux/api/iam/authApi";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { USER_ROLES, isSuperAdmin, normalizeAuthString, matchesRole } from "@/config/auth-constants";

interface LoginModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function LoginModal({ open = false, onOpenChange }: LoginModalProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/auth/login";
    const { login: authLogin } = useAuth();
    const { setLoading } = useLoadingStore();

    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [registerUser] = useUserRegisterMutation();

    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { if (isLoginPage) setActiveTab("login"); }, [isLoginPage]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (activeTab === "signup") {
                const reg = await registerUser(formData).unwrap();
                if (!reg?.success) throw new Error("Account creation failed");
                Swal.fire({ icon: "success", title: "Account created! Please login.", timer: 1500, showConfirmButton: false });
                setActiveTab("login");
                setIsLoading(false);
                return;
            }

            const res = await authLogin({ email: formData.email, password: formData.password });
            if (!res?.success) throw new Error(res?.message || "Invalid credentials");
            if (!res?.accessToken) throw new Error("Invalid response: Missing access token");
            if (res?.status !== "active") throw new Error(`This user is ${res?.status}`);

            toast.success("Logged in successfully!");
            setLoading(true, "Loading dashboard...");
            if (!isLoginPage && onOpenChange) onOpenChange(false);

            if (res.redirect) {
                router.push(res.redirect);
            } else {
                let roleName = normalizeAuthString(res?.user?.role as any || (res?.user?.role as any)?.name);
                if (matchesRole(roleName, [USER_ROLES.SHAREHOLDER, 'investor', 'board-member'])) {
                    router.push('/governance');
                } else if (isSuperAdmin(roleName)) {
                    router.push('/super-admin/dashboard');
                } else if (res?.user?.businessAccess && res.user.businessAccess.length > 0) {
                    const access = res.user.businessAccess[0];
                    const slug = (typeof access.businessUnit === 'object' && access.businessUnit !== null)
                        ? (access.businessUnit.slug || access.businessUnit.id)
                        : access.businessUnit;
                    router.push(`/${roleName}/${slug}/dashboard`);
                } else {
                    router.push("/platform/companies");
                }
            }
            setFormData({ firstName: "", lastName: "", email: "", password: "" });
        } catch (err: any) {
            setError(err?.message || "Something went wrong");
            setIsLoading(false);
            setLoading(false);
        }
    };

    return (
        <Dialog open={isLoginPage ? true : open} onOpenChange={(o) => !isLoginPage && onOpenChange?.(o)}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => isLoginPage && e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">{activeTab === "login" ? "Welcome Back" : "Create Account"}</DialogTitle>
                    <DialogDescription className="text-center">
                        {activeTab === "login" ? "Sign in to your Signature Bangla POS dashboard" : "Create your Signature Bangla POS account"}
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setError(null); }} className="w-full">
                    <TabsList className="grid grid-cols-2"><TabsTrigger value="login">Login</TabsTrigger><TabsTrigger value="signup">Sign Up</TabsTrigger></TabsList>
                    <form onSubmit={handleSubmit}>
                        <TabsContent value="login" className="space-y-4">
                            <div className="space-y-2"><label>Email</label><Input name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center"><label>Password</label><span className="text-xs text-primary pointer-events-none opacity-50 cursor-not-allowed">Forgot Password?</span></div>
                                <div className="relative">
                                    <Input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required className="pr-10" />
                                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                    </Button>
                                </div>
                            </div>
                            {error && activeTab === "login" && <div className="text-destructive text-sm font-medium text-center p-2 bg-destructive/10 rounded-md border border-destructive/20">{error}</div>}
                            <Button disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : "Login"}</Button>
                        </TabsContent>
                        <TabsContent value="signup" className="space-y-4">
                            <Input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                            <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                            <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                            {error && activeTab === "signup" && <div className="text-destructive text-sm font-medium text-center p-2 bg-destructive/10 rounded-md border border-destructive/20">{error}</div>}
                            <Button disabled={isLoading} className="w-full">{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</> : "Create Account"}</Button>
                        </TabsContent>
                    </form>
                </Tabs>
                <div className="text-center text-sm">{activeTab === "login" ? <p>Don't have an account?<button className="text-primary ml-1" onClick={() => setActiveTab("signup")}>Sign Up</button></p> : <p>Already have an account?<button className="text-primary ml-1" onClick={() => setActiveTab("login")}>Login</button></p>}</div>
            </DialogContent>
        </Dialog>
    );
}
