
import PackageForm from "@/components/modules/saas/PackageForm";

export const metadata = {
    title: "Create Package | Platform Admin",
    description: "Create a new SaaS subscription plan.",
};

export default function NewPackagePage() {
    return <PackageForm />;
}
