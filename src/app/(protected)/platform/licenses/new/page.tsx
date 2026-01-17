
import LicenseForm from "@/components/modules/saas/LicenseForm";

export const metadata = {
    title: "Issue License | Platform Admin",
    description: "Generate new license keys for clients.",
};

export default function NewLicensePage() {
    return <LicenseForm />;
}
