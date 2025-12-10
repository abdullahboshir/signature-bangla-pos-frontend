"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Store, Loader2, MapPin, Phone, User as UserIcon, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import Swal from "sweetalert2";

interface BusinessUnit {
  _id: string;
  id: string;
  branding: {
    name: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  location: {
    city: string;
    country: string;
  };
  status: string;
  businessUnitType?: string;
}

export default function SuperAdminBusinessUnitsPage() {
  const router = useRouter();
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessUnits = async () => {
      try {
        const response = await axiosInstance.get('/super-admin/business-unit');
        console.log("Business Unit Response:", response);

        // Defensive parsing
        let data: BusinessUnit[] = [];

        // Scenario 1: Interceptor returns { success: true, data: [...] }
        if ((response as any)?.data && Array.isArray((response as any).data)) {
          data = (response as any).data;
        }
        // Scenario 2: Interceptor returns direct array [...]
        else if (Array.isArray(response)) {
          data = response as BusinessUnit[];
        }
        // Scenario 3: data property exists but somehow at top level (unlikely with this interceptor but possible)
        else if (Array.isArray((response as any)?.data?.data)) {
          data = (response as any).data.data;
        }

        setBusinessUnits(data);
      } catch (error) {
        console.error("Failed to fetch business units", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load business units.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessUnits();
  }, []);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  // Calculate stats safely
  const activeCount = Array.isArray(businessUnits) ? businessUnits.filter(u => u.status === 'published' || u.status === 'active').length : 0;
  const totalCount = Array.isArray(businessUnits) ? businessUnits.length : 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Units</h1>
          <p className="text-muted-foreground">
            Manage all business units in the system
          </p>
        </div>
        <Button onClick={() => router.push('business-units/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Business Unit
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Units</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Business Units</CardTitle>
          <CardDescription>View and manage business units</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="h-12 px-4 align-middle font-medium">Name</th>
                  <th className="h-12 px-4 align-middle font-medium">Type</th>
                  <th className="h-12 px-4 align-middle font-medium">Location</th>
                  <th className="h-12 px-4 align-middle font-medium">Contact</th>
                  <th className="h-12 px-4 align-middle font-medium">Status</th>
                  <th className="h-12 px-4 align-middle font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(businessUnits) || businessUnits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-muted-foreground">No business units found</td>
                  </tr>
                ) : (
                  businessUnits.map((unit) => (
                    <tr key={unit._id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{unit.branding?.name}</td>
                      <td className="p-4 align-middle capitalize">{unit.businessUnitType || 'General'}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {unit.location?.city || 'N/A'}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col text-xs">
                          <span>{unit.contact?.email}</span>
                          <span className="text-muted-foreground">{unit.contact?.phone}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={unit.status === "published" || unit.status === "active" ? "default" : "secondary"}>
                          {unit.status}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/dashboard/${unit._id}`}>Dashboard</a>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
