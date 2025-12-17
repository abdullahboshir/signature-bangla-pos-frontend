"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useUserRegisterMutation } from "@/redux/api/authApi";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function LoginModal({ open = false, onOpenChange }: LoginModalProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/auth/login";
    const { login: authLogin } = useAuth();

    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [registerUser] = useUserRegisterMutation();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    // Always stay in login tab when at /auth/login
    useEffect(() => {
        if (isLoginPage) setActiveTab("login");
    }, [isLoginPage]);

    // FORM INPUT HANDLER
    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // FINAL SUBMIT HANDLER
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let res;

            if (activeTab === "signup") {
                // CREATE USER
                const reg = await registerUser(formData).unwrap();

                if (!reg?.success) throw new Error("Account creation failed");

                Swal.fire({
                    icon: "success",
                    title: "Account created! Please login.",
                    timer: 1500,
                    showConfirmButton: false,
                });

                // Switch to login tab
                setActiveTab("login");
                setIsLoading(false);
                return;
            }

            // LOGIN USER
            res = await authLogin({
                email: formData.email,
                password: formData.password,
            });

            if (!res?.success || !res?.accessToken) {
                throw new Error("Invalid credentials");
            }

            Swal.fire({
                icon: "success",
                title: "Logged in successfully",
                timer: 1500,
                showConfirmButton: false,
            });

            // After login → close modal if not on login page
            if (!isLoginPage && onOpenChange) onOpenChange(false);

            if (res.redirect) {
                router.push(res.redirect);
            } else {
                router.push("/super-admin/telemedicine");
            }

            setFormData({ firstName: "", lastName: "", email: "", password: "" });
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Login failed",
                text: err?.message || "Something went wrong",
            });
        }

        setIsLoading(false);
    };

    return (
        <Dialog open={isLoginPage ? true : open} onOpenChange={(o) => !isLoginPage && onOpenChange?.(o)}>
            <DialogContent
                className="sm:max-w-md"
                onInteractOutside={(e) => isLoginPage && e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">
                        {activeTab === "login" ? "Welcome Back" : "Create Account"}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {activeTab === "login"
                            ? "Sign in to your Signature Bangla POS dashboard"
                            : "Create your Signature Bangla POS account"}
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                    <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    {/* FORM */}
                    <form onSubmit={handleSubmit}>
                        {/* LOGIN */}
                        <TabsContent value="login" className="space-y-4">
                            <div className="space-y-2">
                                <label>Email</label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label>Password</label>
                                    <Link href="/forgot-password" className="text-xs text-primary">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
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
                                        <span className="sr-only">
                                            {showPassword ? "Hide password" : "Show password"}
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            <Button disabled={isLoading} className="w-full">
                                {isLoading ? "Processing..." : "Login"}
                            </Button>
                        </TabsContent>

                        {/* SIGNUP */}
                        <TabsContent value="signup" className="space-y-4">
                            <Input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                            <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                            <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

                            <Button disabled={isLoading} className="w-full">
                                {isLoading ? "Processing..." : "Create Account"}
                            </Button>
                        </TabsContent>
                    </form>
                </Tabs>

                <div className="text-center text-sm">
                    {activeTab === "login" ? (
                        <p>
                            Don’t have an account?
                            <button className="text-primary ml-1" onClick={() => setActiveTab("signup")}>
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?
                            <button className="text-primary ml-1" onClick={() => setActiveTab("login")}>
                                Login
                            </button>
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
