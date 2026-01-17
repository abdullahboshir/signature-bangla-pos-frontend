'use client';

import React, { useState, useMemo } from 'react';
import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns';
import { enUS, bn } from 'date-fns/locale';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  CalendarIcon,
  Clock,
  Globe,
  Calendar,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type DateFormatType =
  | 'short'        // 12/25/24
  | 'medium'       // Dec 25, 2024
  | 'long'         // December 25, 2024
  | 'full'         // Wednesday, December 25, 2024
  | 'time'         // 14:30
  | 'datetime'     // Dec 25, 2024 14:30
  | 'relative'     // 2 hours ago
  | 'distance'     // in 2 days
  | 'iso'          // 2024-12-25T14:30:00Z
  | 'timestamp'    // 1735133400
  | 'custom';

export type TimezoneType =
  | 'local'        // User's local timezone
  | 'utc'          // UTC/GMT
  | 'asia/dhaka'   // Bangladesh time
  | 'custom';

interface DateCellProps {
  date: string | Date | number | null | undefined;
  formatType?: DateFormatType;
  timezone?: TimezoneType;
  customFormat?: string;
  showTooltip?: boolean;
  showTimezone?: boolean;
  showRelative?: boolean;
  className?: string;
  locale?: 'en' | 'bn';
}

// Format patterns based on type
const formatPatterns: Record<DateFormatType, string> = {
  short: 'MM/dd/yy',
  medium: 'MMM dd, yyyy',
  long: 'MMMM dd, yyyy',
  full: 'EEEE, MMMM dd, yyyy',
  time: 'HH:mm',
  datetime: 'MMM dd, yyyy HH:mm',
  relative: 'relative',
  distance: 'distance',
  iso: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  timestamp: 'timestamp',
  custom: 'MMM dd, yyyy',
};

// Timezone offsets (in minutes)
const timezoneOffsets: Record<TimezoneType, number> = {
  'local': 0, // Will be handled dynamically
  'utc': 0,
  'asia/dhaka': 360, // UTC+6 for Bangladesh
  'custom': 0 // Handled by custom logic or default
};

export function DateCell({
  date,
  formatType = 'medium',
  timezone = 'local',
  customFormat,
  showTooltip = true,
  showTimezone = false,
  showRelative = false,
  className,
  locale = 'en',
}: DateCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<DateFormatType>(formatType);
  const [selectedTimezone, setSelectedTimezone] = useState<TimezoneType>(timezone);

  // Memoized date processing
  const processedDate = useMemo(() => {
    if (!date) return null;

    try {
      let parsedDate: Date;

      if (date instanceof Date) {
        parsedDate = date;
      } else if (typeof date === 'number') {
        parsedDate = new Date(date * 1000); // Assuming Unix timestamp
      } else if (typeof date === 'string') {
        // Try to parse ISO or other common formats
        parsedDate = parseISO(date);
      } else {
        return null;
      }

      // Validate date
      if (!isValid(parsedDate)) return null;

      // Apply timezone adjustment
      let adjustedDate = parsedDate;
      if (selectedTimezone === 'local') {
        // Local timezone - no adjustment needed
      } else if (selectedTimezone === 'utc') {
        adjustedDate = new Date(parsedDate.getTime() + parsedDate.getTimezoneOffset() * 60000);
      } else {
        const offset = timezoneOffsets[selectedTimezone] || 0;
        const localOffset = parsedDate.getTimezoneOffset();
        adjustedDate = new Date(parsedDate.getTime() + (offset - localOffset) * 60000);
      }

      return adjustedDate;
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  }, [date, selectedTimezone]);

  // Format date based on selected format
  const formattedDate = useMemo(() => {
    if (!processedDate) return '-';

    const selectedLocale = locale === 'bn' ? bn : enUS;

    try {
      switch (selectedFormat) {
        case 'relative':
          return formatDistance(processedDate, new Date(), {
            addSuffix: true,
            locale: selectedLocale,
          });

        case 'distance':
          return formatDistance(processedDate, new Date(), {
            locale: selectedLocale,
          });

        case 'timestamp':
          return Math.floor(processedDate.getTime() / 1000).toString();

        case 'custom':
          return format(processedDate, customFormat || formatPatterns.medium, {
            locale: selectedLocale,
          });

        default:
          return format(processedDate, formatPatterns[selectedFormat], {
            locale: selectedLocale,
          });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }, [processedDate, selectedFormat, customFormat, locale]);

  // Get timezone display name
  const getTimezoneDisplay = () => {
    if (selectedTimezone === 'local') {
      return `Local (${Intl.DateTimeFormat().resolvedOptions().timeZone})`;
    } else if (selectedTimezone === 'utc') {
      return 'UTC';
    } else if (selectedTimezone === 'asia/dhaka') {
      return 'Bangladesh (UTC+6)';
    }
    return selectedTimezone;
  };

  // Get additional info for tooltip
  const getAdditionalInfo = () => {
    if (!processedDate) return null;

    const info = [];

    // ISO format
    info.push(`ISO: ${format(processedDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")}`);

    // Timestamp
    info.push(`Timestamp: ${Math.floor(processedDate.getTime() / 1000)}`);

    // Day of week
    info.push(`Day: ${format(processedDate, 'EEEE', { locale: locale === 'bn' ? bn : enUS })}`);

    // Week number
    info.push(`Week: ${format(processedDate, 'w')}`);

    // Quarter
    info.push(`Quarter: Q${Math.ceil((processedDate.getMonth() + 1) / 3)}`);

    return info.join('\n');
  };

  // Format options for dropdown
  const formatOptions: Array<{ value: DateFormatType; label: string; example: string }> = [
    { value: 'short', label: 'Short Date', example: '12/25/24' },
    { value: 'medium', label: 'Medium Date', example: 'Dec 25, 2024' },
    { value: 'long', label: 'Long Date', example: 'December 25, 2024' },
    { value: 'full', label: 'Full Date', example: 'Wednesday, December 25, 2024' },
    { value: 'time', label: 'Time Only', example: '14:30' },
    { value: 'datetime', label: 'Date & Time', example: 'Dec 25, 2024 14:30' },
    { value: 'relative', label: 'Relative', example: '2 hours ago' },
    { value: 'distance', label: 'Time Distance', example: 'in 2 days' },
    { value: 'iso', label: 'ISO Format', example: '2024-12-25T14:30:00Z' },
    { value: 'timestamp', label: 'Timestamp', example: '1735133400' },
  ];

  // Timezone options
  const timezoneOptions = [
    { value: 'local' as TimezoneType, label: 'Local Time' },
    { value: 'utc' as TimezoneType, label: 'UTC' },
    { value: 'asia/dhaka' as TimezoneType, label: 'Bangladesh (UTC+6)' },
  ];

  if (!processedDate) {
    return <span className={cn('text-muted-foreground', className)}>-</span>;
  }

  const mainContent = (
    <div className={cn('flex items-center gap-2', className)}>
      <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      <span className="truncate">{formattedDate}</span>

      {showTimezone && (
        <Badge variant="outline" className="text-xs h-5">
          <Globe className="h-2.5 w-2.5 mr-1" />
          {selectedTimezone === 'local' ? 'L' : selectedTimezone.toUpperCase()}
        </Badge>
      )}

      {showRelative && selectedFormat !== 'relative' && selectedFormat !== 'distance' && (
        <span className="text-xs text-muted-foreground">
          ({formatDistance(processedDate, new Date(), { addSuffix: true })})
        </span>
      )}
    </div>
  );

  if (!showTooltip) {
    return mainContent;
  }

  return (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'h-auto p-0 hover:bg-transparent',
                  'flex items-center gap-2 w-full justify-start'
                )}
              >
                {mainContent}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
          </PopoverTrigger>

          <TooltipContent side="top" className="max-w-md">
            <div className="space-y-2">
              <div className="font-medium">Date Information</div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-semibold">Full Date:</div>
                  <div>{format(processedDate, 'PPPP', { locale: locale === 'bn' ? bn : enUS })}</div>
                </div>

                <div>
                  <div className="font-semibold">Time:</div>
                  <div>{format(processedDate, 'hh:mm:ss a')}</div>
                </div>

                <div>
                  <div className="font-semibold">ISO:</div>
                  <div className="text-xs">{format(processedDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")}</div>
                </div>

                <div>
                  <div className="font-semibold">Timestamp:</div>
                  <div>{Math.floor(processedDate.getTime() / 1000)}</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="font-semibold mb-1">Timezone:</div>
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  {getTimezoneDisplay()}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Click to change format
              </div>
            </div>
          </TooltipContent>
        </Tooltip>

        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Format
              </div>

              <div className="grid grid-cols-2 gap-2">
                {formatOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedFormat === option.value ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start h-auto py-2"
                    onClick={() => {
                      setSelectedFormat(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <div className="text-left">
                      <div className="font-medium text-xs">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.example}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Timezone
              </div>

              <div className="flex flex-wrap gap-2">
                {timezoneOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant={selectedTimezone === option.value ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedTimezone(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Quick Actions
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(processedDate.toISOString());
                  }}
                >
                  Copy ISO
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(Math.floor(processedDate.getTime() / 1000).toString());
                  }}
                >
                  Copy Timestamp
                </Button>
              </div>
            </div>

            {customFormat && (
              <div className="space-y-2">
                <div className="font-medium">Custom Format</div>
                <code className="text-xs bg-muted p-2 rounded block">
                  {customFormat}
                </code>
              </div>
            )}

            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedFormat(formatType);
                  setSelectedTimezone(timezone);
                  setIsOpen(false);
                }}
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Reset to Default
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

// Helper function to use DateCell with specific configurations
export function createDateCell(
  config: Partial<Omit<DateCellProps, 'date'>> = {}
) {
  return function ConfiguredDateCell(props: Omit<DateCellProps, keyof typeof config>) {
    return <DateCell {...config} {...props} />;
  };
}

// Pre-configured DateCell components for common use cases
export const ShortDateCell = createDateCell({ formatType: 'short' });
export const MediumDateCell = createDateCell({ formatType: 'medium' });
export const DateTimeCell = createDateCell({ formatType: 'datetime' });
export const RelativeDateCell = createDateCell({ formatType: 'relative' });
export const BangladeshDateCell = createDateCell({
  formatType: 'datetime',
  timezone: 'asia/dhaka',
  locale: 'bn'
});
export const UTCDateCell = createDateCell({
  formatType: 'datetime',
  timezone: 'utc'
});
export const TimestampCell = createDateCell({ formatType: 'timestamp' });

// Batch date formatter utility
export function formatDates(
  dates: Array<string | Date | number>,
  formatType: DateFormatType = 'medium',
  locale: 'en' | 'bn' = 'en'
): string[] {
  return dates.map(date => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
      if (!isValid(dateObj)) return 'Invalid Date';

      return format(dateObj, formatPatterns[formatType], {
        locale: locale === 'bn' ? bn : enUS,
      });
    } catch {
      return 'Invalid Date';
    }
  });
}

// Date validation utility
export function isValidDate(date: string | Date | number): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    return isValid(dateObj);
  } catch {
    return false;
  }
}

// Date difference utility
export function getDateDifference(
  date1: string | Date | number,
  date2: string | Date | number,
  unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
): number {
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : new Date(date1);
    const d2 = typeof date2 === 'string' ? parseISO(date2) : new Date(date2);

    if (!isValid(d1) || !isValid(d2)) return NaN;

    const diffMs = Math.abs(d2.getTime() - d1.getTime());

    switch (unit) {
      case 'days': return diffMs / (1000 * 60 * 60 * 24);
      case 'hours': return diffMs / (1000 * 60 * 60);
      case 'minutes': return diffMs / (1000 * 60);
      case 'seconds': return diffMs / 1000;
      default: return diffMs;
    }
  } catch {
    return NaN;
  }
}
