
import { cn } from "@/lib/utils";
import { OrganizationColumn } from "./columns";
import { Building, MapPin, Phone, Globe, Calendar, Users, Briefcase, Mail, Shield, Settings, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { TenantConfigForm } from "./TenantConfigForm";
import { useState } from "react";

interface OrganizationDetailsProps {
    data: OrganizationColumn;
}

export function OrganizationDetails({ data }: OrganizationDetailsProps) {
    const [open, setOpen] = useState(false);
    const tenantConfig = (data as any).tenantConfig;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            {/* Column 1: Core Identity & Contact */}
            <div className="space-y-4">
                <h4 className="font-semibold text-muted-foreground flex items-center gap-2">
                    <Building className="w-4 h-4" /> Organization Profile
                </h4>
                <div className="space-y-2 pl-6 border-l-2 border-muted">
                    <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="text-muted-foreground">Legal Name:</span>
                        <span className="font-medium">{data.name}</span>

                        <span className="text-muted-foreground">Reg No:</span>
                        <span>{data.registrationNumber}</span>

                        <span className="text-muted-foreground">Type:</span>
                        <span className="capitalize">{data.businessType.replace(/_/g, " ")}</span>

                        <span className="text-muted-foreground">Joined:</span>
                        <span>{new Date(data.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                </div>

                <div className="space-y-2 mt-4">
                    <h4 className="font-semibold text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Location
                    </h4>
                    <div className="pl-6 text-muted-foreground">
                        <p>{data.location?.address}</p>
                        <p>{data.location?.city}, {data.location?.country}</p>
                    </div>
                </div>
            </div>

            {/* Column 2: Legal Rep & Contact Persons */}
            <div className="space-y-4">
                <h4 className="font-semibold text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" /> Key People
                </h4>
                <div className="space-y-3 pl-6 border-l-2 border-muted">
                    {data.legalRepresentative && (
                        <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Legal Representative</p>
                            <p className="font-medium">{data.legalRepresentative.name}</p>
                            <p className="text-muted-foreground text-xs">{data.legalRepresentative.designation}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {data.legalRepresentative.email}</span>
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {data.legalRepresentative.contactPhone}</span>
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Primary Contact</p>
                        <div className="flex flex-col gap-1 text-xs">
                            <span className="flex items-center gap-2">
                                <Mail className="w-3 h-3 text-muted-foreground" />
                                {data.contact.email}
                            </span>
                            <span className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                {data.contact.phone}
                            </span>
                            {data.contact.website && (
                                <span className="flex items-center gap-2">
                                    <Globe className="w-3 h-3 text-muted-foreground" />
                                    <a href={data.contact.website} target="_blank" rel="noreferrer" className="hover:underline text-blue-500">
                                        {data.contact.website}
                                    </a>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 3: System & Governance */}
            <div className="space-y-4">
                <h4 className="font-semibold text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4" /> System & Modules
                </h4>
                <div className="pl-6 border-l-2 border-muted space-y-3">
                    <div>
                        <p className="text-xs text-muted-foreground mb-2">Active Modules:</p>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(data.activeModules).map(([key, isActive]) => {
                                if (!isActive) return null;
                                return (
                                    <span key={key} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] uppercase font-semibold border">
                                        {key}
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-md mt-4">
                        <p className="text-xs font-medium mb-1">System Status</p>
                        <div className="flex items-center gap-2 text-xs">
                            <span className={cn("w-2 h-2 rounded-full", data.isActive ? "bg-emerald-500" : "bg-red-500")} />
                            {data.isActive ? "Operational & Active" : "Suspended / Inactive"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Expended Section: Governance & Board (Full Width) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                {/* Board of Directors */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-muted-foreground flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Board of Directors & Shareholders
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6 border-l-2 border-muted">
                        <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Directors</p>
                            {data.directors?.length ? (
                                <ul className="space-y-1">
                                    {data.directors.map((d, i) => (
                                        <li key={i} className="text-xs flex flex-col">
                                            <span className="font-medium">{d.name} {d.isManagingDirector && <span className="text-[10px] text-blue-600 bg-blue-100 px-1 rounded ml-1">MD</span>}</span>
                                            <span className="text-muted-foreground">{d.designation}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-xs text-muted-foreground italic">No directors listed</p>}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Key Shareholders</p>
                            {data.shareholders?.length ? (
                                <ul className="space-y-1">
                                    {data.shareholders.map((s, i) => (
                                        <li key={i} className="text-xs flex justify-between">
                                            <span>{s.name}</span>
                                            <span className="font-mono text-muted-foreground">{s.sharePercentage}%</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-xs text-muted-foreground italic">No shareholders listed</p>}
                        </div>
                    </div>
                </div>

                {/* Financials & Operations */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Operations & Financials
                    </h4>
                    <div className="space-y-2 pl-6 border-l-2 border-muted text-sm">
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="text-muted-foreground">Employees:</span>
                            <span>{data.numberOfEmployees || 0} People</span>

                            <span className="text-muted-foreground">Established:</span>
                            <span>{data.establishedDate ? new Date(data.establishedDate).toLocaleDateString() : 'N/A'}</span>

                            {data.capital && (
                                <>
                                    <span className="text-muted-foreground mt-2 font-medium">Authorized Cap:</span>
                                    <span className="mt-2 font-mono">{data.capital.currency} {data.capital.authorizedCapital?.toLocaleString()}</span>

                                    <span className="text-muted-foreground">Paid-up Cap:</span>
                                    <span className="font-mono">{data.capital.currency} {data.capital.paidUpCapital?.toLocaleString()}</span>
                                </>
                            )}

                            {data.subscription && data.subscription.status !== 'inactive' && (
                                <>
                                    <div className="col-span-2 mt-3 pt-3 border-t">
                                        <p className="font-semibold mb-2">Subscription</p>
                                    </div>
                                    <span className="text-muted-foreground">Plan:</span>
                                    <span className="font-medium text-primary">{data.subscription.planName}</span>

                                    <span className="text-muted-foreground">Status:</span>
                                    <span className={cn("uppercase text-xs font-bold", data.subscription.status === 'active' ? "text-emerald-600" : "text-red-600")}>
                                        {data.subscription.status}
                                    </span>

                                    {data.subscription.expiresAt && (
                                        <>
                                            <span className="text-muted-foreground">Next Renewal:</span>
                                            <span>{new Date(data.subscription.expiresAt).toLocaleDateString()}</span>
                                        </>
                                    )}

                                    <span className="text-muted-foreground">Last Payment:</span>
                                    <Badge variant="outline" className="w-fit text-[10px] bg-green-50 text-green-700 border-green-200">
                                        PAID (Active)
                                    </Badge>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tenant Configuration Section (Super Admin Only) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 pt-4 border-t mt-2">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-muted-foreground flex items-center gap-2">
                        <Server className="w-4 h-4" /> Tenant Configuration (Super Admin)
                    </h4>
                    
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                                <Settings className="w-3.5 h-3.5 mr-1" />
                                Manage Configuration
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Tenant Configuration</DialogTitle>
                                <DialogDescription>
                                    Configure deployment type, database connection, and storage for <strong>{data.name}</strong>.
                                </DialogDescription>
                            </DialogHeader>
                            <TenantConfigForm 
                                organizationId={(data as any)._id} 
                                initialConfig={tenantConfig} 
                                onSuccess={() => setOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="mt-3 pl-6 border-l-2 border-muted grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="flex flex-col gap-1">
                       <span className="text-xs text-muted-foreground uppercase tracking-wider">Deployment Type</span>
                       <Badge variant={tenantConfig?.deploymentType === 'dedicated' ? 'default' : 'secondary'} className="w-fit">
                            {tenantConfig?.deploymentType === 'dedicated' ? 'Dedicated Cloud' : 'Shared (Multi-Tenant)'}
                       </Badge>
                   </div>
                   
                   {tenantConfig?.customDomain && (
                       <div className="flex flex-col gap-1">
                           <span className="text-xs text-muted-foreground uppercase tracking-wider">Custom Domain</span>
                           <span className="font-mono text-sm">{tenantConfig.customDomain}</span>
                       </div>
                   )}

                   {tenantConfig?.deploymentType === 'dedicated' && (
                       <div className="flex flex-col gap-1">
                           <span className="text-xs text-muted-foreground uppercase tracking-wider">Storage Provider</span>
                           <span className="font-medium flex items-center gap-1">
                               {tenantConfig.storageConfig?.provider === 's3' ? 'AWS S3' : 
                                tenantConfig.storageConfig?.provider === 'cloudinary' ? 'Cloudinary' : 'Local'}
                           </span>
                       </div>
                   )}
                </div>
            </div>
        </div>
    )
}
