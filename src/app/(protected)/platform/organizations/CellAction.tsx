
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CreditCard, Copy, Eye } from "lucide-react";
import { OrganizationColumn } from "./columns";
import { SubscriptionDialog } from "./SubscriptionDialog";

interface CellActionProps {
    data: OrganizationColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const [openSubscription, setOpenSubscription] = useState(false);

    return (
        <>
            <SubscriptionDialog
                organization={data}
                open={openSubscription}
                onOpenChange={setOpenSubscription}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(data.id)}
                    >
                        <Copy className="mr-2 h-4 w-4" /> Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenSubscription(true)}>
                        <CreditCard className="mr-2 h-4 w-4" /> Manage Subscription
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
