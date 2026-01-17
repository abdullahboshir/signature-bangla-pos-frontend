import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AvatarCellProps {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarCell({ src, fallback, size = 'md', className }: AvatarCellProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const getFallback = () => {
    // Ensure fallback is a valid string
    if (!fallback || typeof fallback !== 'string' || fallback === 'N/A') {
      return <User className="h-4 w-4" />;
    }

    // Extract initials from name
    const words = fallback.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return fallback.slice(0, 2).toUpperCase();
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {src ? (
        <AvatarImage src={src} alt={fallback} />
      ) : null}
      <AvatarFallback className="bg-primary/10 text-primary">
        {getFallback()}
      </AvatarFallback>
    </Avatar>
  );
}
