"use client";

import { useState, useEffect } from 'react';
import { ShoppingBag, User, Zap, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ModeToggle } from '../mode-toggle';
import LoginModal from "@/components/auth/LoginModal";

interface PublicHeaderProps {
  onLoginClick?: () => void;
}

const PublicHeader = ({
  onLoginClick
}: PublicHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    if (onLoginClick) onLoginClick();
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${isScrolled
        ? "shadow-md bg-background/95 backdrop-blur-xl border-b"
        : "bg-transparent border-b border-transparent"
        }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                    <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center border-2 border-background">
                    <Zap className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
                    Signature Bangla
                  </h1>
                  <p className="text-[10px] font-medium flex items-center gap-1 text-muted-foreground uppercase tracking-wider">
                    <BadgeCheck className="w-3 h-3" />
                    POS System
                  </p>
                </div>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <ModeToggle />

              {/* Login Button */}
              <Button
                onClick={handleLoginClick}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-purple-600 hover:from-blue-700/90 hover:to-purple-600/90 shadow-lg shadow-primary/20"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login to Dashboard</span>
                <span className="sm:hidden">Login</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  );
};

export default PublicHeader;