import React from "react";
import { cn } from "@/lib/utils"; // className utility (optional)

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px]", className)}>
      {children}
    </div>
  );
};

export default Container;
