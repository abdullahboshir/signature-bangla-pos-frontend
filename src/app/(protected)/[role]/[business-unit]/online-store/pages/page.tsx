"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetAllPagesQuery, useDeletePageMutation } from "@/redux/api/storefrontApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash, Eye, Globe } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";

export default function StorePagesPage() {
    const params = useParams();
    const router = useRouter();
    const businessUnitId = params["business-unit"] as string;
    const role = params["role"] as string;

    // API
    const { data: pagesData, isLoading } = useGetAllPagesQuery(businessUnitId);
    const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();

    // Handlers
    const handleDelete = async (pageId: string) => {
        if (confirm("Are you sure you want to delete this page? This cannot be undone.")) {
            try {
                await deletePage({ businessUnitId, pageId }).unwrap();
                toast.success("Page deleted successfully");
            } catch (error) {
                toast.error("Failed to delete page");
                console.error(error);
            }
        }
    };

    console.log("PagesData:", JSON.stringify(pagesData, null, 2));
    const pages = Array.isArray(pagesData?.data) ? pagesData.data : [];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
                    <p className="text-muted-foreground">Manage your storefront pages and layouts.</p>
                </div>
                <Button onClick={() => router.push(`/${role}/${businessUnitId}/online-store/ui-builder`)}>
                    <Plus className="w-4 h-4 mr-2" /> Create New Page
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Pages</CardTitle>
                    <CardDescription>A list of all pages in your online store.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="animate-spin w-8 h-8 text-primary" />
                        </div>
                    ) : pages.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <Globe className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No pages found. Create your first page to get started!</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pages.map((page: any) => (
                                    <TableRow key={page._id}>
                                        <TableCell className="font-medium">{page.title}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                /{page.slug}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {page.updatedAt ? format(new Date(page.updatedAt), "MMM d, yyyy h:mm a") : "N/A"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(`/shop/${businessUnitId}/${page.slug}`, '_blank')}
                                                    title="View Live"
                                                >
                                                    <Eye className="w-4 h-4 text-green-600" />
                                                </Button>
                                                <Link href={`/${role}/${businessUnitId}/online-store/ui-builder?slug=${page.slug}`}>
                                                    <Button variant="ghost" size="sm" title="Edit Layout">
                                                        <Edit className="w-4 h-4 text-blue-600" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(page._id)}
                                                    disabled={isDeleting}
                                                    title="Delete Page"
                                                >
                                                    <Trash className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
