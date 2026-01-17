import { CheckCircle, XCircle, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BooleanCellProps {
  value: boolean | null | undefined;
  trueLabel?: string;
  falseLabel?: string;
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export function BooleanCell({ 
  value, 
  trueLabel = 'Yes', 
  falseLabel = 'No',
  showIcon = true,
  showText = true,
  className 
}: BooleanCellProps) {
  if (value === null || value === undefined) {
    return (
      <div className={cn('flex items-center gap-1 text-muted-foreground', className)}>
        <Minus className="h-4 w-4" />
        {showText && <span>N/A</span>}
      </div>
    );
  }

  const isTrue = Boolean(value);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {showIcon && (
        isTrue ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600" />
        )
      )}
      {showText && (
        <span className={isTrue ? 'text-green-700' : 'text-red-700'}>
          {isTrue ? trueLabel : falseLabel}
        </span>
      )}
    </div>
  );
}
