// app/(public)/about/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="text-muted-foreground text-lg">
            Learn more about Signature Bangla POS System
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About Signature Bangla POS</CardTitle>
            <CardDescription>Your complete Point of Sale solution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Signature Bangla POS is a comprehensive point of sale system designed to help
              businesses manage their sales, inventory, and operations efficiently.
            </p>
            <p className="text-muted-foreground">
              Our system provides powerful features for managing products, customers, suppliers,
              and generating detailed reports to help you make informed business decisions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Multi-business unit management</li>
              <li>Role-based access control</li>
              <li>Real-time inventory tracking</li>
              <li>Sales and purchase management</li>
              <li>Comprehensive reporting</li>
              <li>Customer and supplier management</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

