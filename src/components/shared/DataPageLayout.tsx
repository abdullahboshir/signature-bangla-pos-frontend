"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { DateRange } from "react-day-picker";

interface DataPageLayoutProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    createAction?: {
        label: string;
        onClick: () => void;
    };
    stats?: React.ReactNode;
    tabs?: {
        value: string;
        label: string;
    }[];
    activeTab?: string;
    onTabChange?: (value: string) => void;
    dateFilter?: {
        dateRange: DateRange | undefined;
        setDateRange: (range: DateRange | undefined) => void;
        dateFilter: string;
        setDateFilter: (filter: string) => void;
        isCalendarOpen: boolean;
        setIsCalendarOpen: (open: boolean) => void;
    };
    children: React.ReactNode;
    extraFilters?: React.ReactNode;
}

export function DataPageLayout({
    title,
    description,
    action,
    createAction,
    stats,
    tabs,
    activeTab,
    onTabChange,
    dateFilter,
    children,
    extraFilters
}: DataPageLayoutProps) {
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                    {description && <p className="text-muted-foreground">{description}</p>}
                </div>
                <div className="flex items-center gap-2">
                    {action}
                    {createAction && (
                        <Button onClick={createAction.onClick}>
                            <Plus className="mr-2 h-4 w-4" /> {createAction.label}
                        </Button>
                    )}
                </div>
            </div>

            {/* Statistics Section */}
            {/* Statistics Section */}
            {stats}

            {/* Main Content Area */}
            {tabs ? (
                <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="flex items-center gap-2 w-full">
                                <div className="overflow-x-auto max-w-[700px]">
                                    <TabsList>
                                        {tabs.map((tab) => (
                                            <TabsTrigger key={tab.value} value={tab.value}>
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>

                                <div className="ml-auto flex items-center gap-2">
                                    {dateFilter && (
                                        <DateRangeFilter
                                            dateFilter={dateFilter.dateFilter}
                                            setDateFilter={dateFilter.setDateFilter}
                                            dateRange={dateFilter.dateRange}
                                            setDateRange={dateFilter.setDateRange}
                                            isCalendarOpen={dateFilter.isCalendarOpen}
                                            setIsCalendarOpen={dateFilter.setIsCalendarOpen}
                                        />
                                    )}
                                    {extraFilters}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {children}
                        </CardContent>
                    </Card>
                </Tabs>
            ) : (
                <Card>
                    {(dateFilter || extraFilters) && (
                        <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-4">
                            <div className="flex items-center gap-2">
                                {dateFilter && (
                                    <DateRangeFilter
                                        dateFilter={dateFilter.dateFilter}
                                        setDateFilter={dateFilter.setDateFilter}
                                        dateRange={dateFilter.dateRange}
                                        setDateRange={dateFilter.setDateRange}
                                        isCalendarOpen={dateFilter.isCalendarOpen}
                                        setIsCalendarOpen={dateFilter.setIsCalendarOpen}
                                    />
                                )}
                                {extraFilters}
                            </div>
                        </CardHeader>
                    )}
                    <CardContent>
                        {children}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
