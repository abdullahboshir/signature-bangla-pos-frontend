import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CenteredFormLayoutProps {
    /** Page title */
    title: string;
    /** Optional subtitle/description */
    description?: string;
    /** Form content */
    children: ReactNode;
    /** Maximum width of form container */
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    /** Show back button */
    showBackButton?: boolean;
    /** Custom back navigation path */
    backPath?: string;
    /** Additional className for container */
    className?: string;
}

const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
};


export function CenteredFormLayout({
    title,
    description,
    children,
    maxWidth = "lg",
    showBackButton = true,
    backPath,
    className,
}: CenteredFormLayoutProps) {
    const router = useRouter();

    const handleBack = () => {
        if (backPath) {
            router.push(backPath);
        } else {
            router.back();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 md:p-8 lg:p-12">
            <div className={cn("w-full", maxWidthClasses[maxWidth], className)}>
                {/* Header Section */}
                <div className="mb-8">
                    {showBackButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="mb-4 -ml-2"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    )}

                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground mt-2">{description}</p>
                    )}
                </div>

                {/* Form Content */}
                <div className="space-y-6">{children}</div>
            </div>
        </div>
    );
}
