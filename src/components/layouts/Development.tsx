'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Wrench,
  Clock,
  Code,
  GitBranch,
  Layers,
  AlertCircle,
  ArrowRight,
  Home
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function DevelopmentLaout() {
  const pathname = usePathname();
  const [progress, setProgress] = useState<any>(0);

  // Parse the path
  const pathSegments = pathname.split('/').filter(segment => segment);
  const currentPage = pathSegments[pathSegments.length - 1] || 'dashboard';
  const parentPage = pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] : null;

  // Simulate progress animation
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  // Format page name for display
  const formatPageName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Development status data
  const developmentData = {
    status: 'in-development',
    estimatedCompletion: 'December 2024',
    team: ['Frontend Team', 'Backend Team', 'UI/UX Team'],
    dependencies: ['API Integration', 'Database Schema', 'Payment Gateway'],
  };

  return (
    <div className="max-w-6xl mx-auto my-10 px-2">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => (
            <div key={segment} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === pathSegments.length - 1 ? (
                  <BreadcrumbPage className="font-semibold">
                    {formatPageName(segment)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={`/${pathSegments.slice(0, index + 1).join('/')}`}>
                    {formatPageName(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Left Column - Main Message */}
        <div className="md:col-span-2 lg:col-span-2">
          <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">
                    <Clock className="h-3 w-10 mr-1" />
                    Under Development
                  </Badge>
                  <CardTitle className="text-3xl">
                    {formatPageName(currentPage)} Page
                  </CardTitle>
                  {parentPage && (
                    <CardDescription className="text-lg mt-1">
                      Child of: {formatPageName(parentPage)}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Development in Progress</h4>
                      <p className="text-yellow-700 mt-1">
                        This page is currently being developed. Our team is working hard to bring you this feature soon.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Development Progress
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-md">
                      <span>Development Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Spinner values={progress} className="h-5" />
                    <p className="text-sm text-gray-600">
                      Estimated completion: {developmentData.estimatedCompletion}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Current Path
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                    <div className="text-gray-500">Location:</div>
                    <div className="mt-1 text-blue-600">{pathname}</div>
                    <div className="mt-4 text-gray-500">Path Structure:</div>
                    <div className="mt-2 space-y-1">
                      {pathSegments.map((segment, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-6 text-gray-400">{'├─'}</div>
                          <span className={index === pathSegments.length - 1 ? 'font-bold' : ''}>
                            {formatPageName(segment)}
                            {index === pathSegments.length - 1 && ' (Current)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Bottom Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-2 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <p className="text-sm text-gray-600">Developers Working</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">12</div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">5</div>
                <p className="text-sm text-gray-600">Tasks Remaining</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600">85%</div>
                <p className="text-sm text-gray-600">Code Coverage</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          {/* Development Team Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Development Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {developmentData.team.map((team, index) => (
                  <li key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>{team}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Dependencies Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dependencies</CardTitle>
              <CardDescription>Required for completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {developmentData.dependencies.map((dep, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">{dep}</span>
                    <Badge variant={index === 0 ? "default" : "outline"}>
                      {index === 0 ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Stay Updated</CardTitle>
              <CardDescription className="text-blue-200">
                Get notified when this page launches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-blue-100 text-sm">
                  We'll notify you as soon as this feature becomes available.
                </p>
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  Notify Me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard Home
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/products">
                    Products
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/orders">
                    Orders
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>


      </div>

    </div>
  );
}
