"use client";

import { useParams } from "next/navigation";
import { UserProfileForm } from "@/components/shared/UserProfileForm";

export default function AdminUserProfilePage() {
    const params = useParams();
    const userId = params.id as string;

    return <UserProfileForm userId={userId} />;
}
