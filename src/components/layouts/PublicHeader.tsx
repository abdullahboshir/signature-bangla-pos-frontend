"use client";

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, Globe, User, ArrowRight, ChevronDown, Sparkles, Zap, Store, Stethoscope, Plane, ShoppingBasket, BadgeCheck, Shield, Clock, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from '../mode-toggle';
import LoginModal from '@/app/(public)/auth/login/page';

interface PublicHeaderProps {
  onLoginClick?: () => void;
}

const PublicHeader = ({ 
  onLoginClick
}: PublicHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation with mega menu
  const navItems = [
    {
      label: "Features",
      href: "#features",
      megaMenu: true,
      sections: [
        {
          title: "Core Features",
          items: [
            { label: "Multi-Branch Management", icon: Store },
            { label: "Real-time Analytics", icon: Zap },
            { label: "Inventory Control", icon: ShoppingBag },
            { label: "Customer CRM", icon: User }
          ]
        },
        {
          title: "Advanced Tools",
          items: [
            { label: "AI Predictions", icon: Sparkles },
            { label: "Automated Reports", icon: Clock },
            { label: "API Integration", icon: Globe },
            { label: "Cloud Backup", icon: Shield }
          ]
        }
      ]
    },
    {
      label: "Solutions",
      href: "#solutions",
      megaMenu: true,
      sections: [
        {
          title: "By Industry",
          items: [
            { label: "Clothing & Fashion", icon: Store },
            { label: "Telemedicine", icon: Stethoscope },
            { label: "Travel & Tourism", icon: Plane },
            { label: "Grocery & Retail", icon: ShoppingBasket }
          ]
        },
        {
          title: "By Business Size",
          items: [
            { label: "Startups", description: "1-5 locations" },
            { label: "SMBs", description: "5-20 locations" },
            { label: "Enterprises", description: "20+ locations" },
            { label: "Franchises", description: "Multi-brand" }
          ]
        }
      ]
    },
    {
      label: "Pricing",
      href: "#pricing"
    },
    {
      label: "Resources",
      href: "#resources",
      dropdown: [
        { label: "Documentation", badge: "New" },
        { label: "Blog", badge: null },
        { label: "Case Studies", badge: "Hot" },
        { label: "API Docs", badge: null },
        { label: "Video Tutorials", badge: "30+" }
      ]
    },
    {
      label: "Company",
      href: "#company",
      dropdown: [
        { label: "About Us", badge: null },
        { label: "Careers", badge: "5 Open" },
        { label: "Partners", badge: null },
        { label: "Contact", badge: null }
      ]
    }
  ];

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    if (onLoginClick) onLoginClick();
  };

  return (
    <>
      {/* Premium Top Bar */}
      <div className={`hidden lg:block transition-all duration-500 ${
        isScrolled ? 'h-0 opacity-0' : 'h-12 opacity-100'
      } bg-gradient-to-r from-blue-700/5 via-purple-500/5 to-pink-500/5 border-b`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Trusted by 10,000+ businesses
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  #1 POS 2024 Award
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Globe className="w-4 h-4" />
                    English
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Spanish</DropdownMenuItem>
                  <DropdownMenuItem>French</DropdownMenuItem>
                  <DropdownMenuItem>Arabic</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="w-px h-4 bg-border" />
              
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Contact Sales: +1 (555) 123-4567
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? "shadow-2xl bg-background/95 backdrop-blur-xl border-b"
          : "bg-transparent"
      }`}>
        <div className=" mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex h-20 lg:h-20 items-center justify-between">
            
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-purple-600 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all">
                    <ShoppingBag className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Zap className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
                    Signature Bangla POS
                  </h1>
                  <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                    <BadgeCheck className="w-3 h-3" />
                    Multi-Business Platform
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden xl:flex items-center gap-1 ml-8">
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative group"
                    onMouseEnter={() => setActiveHover(item.label)}
                    onMouseLeave={() => setActiveHover(null)}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
                    >
                      {item.label}
                      {(item.megaMenu || item.dropdown) && (
                        <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                      )}
                    </Link>

                    {/* Mega Menu */}
                    {item.megaMenu && (
                      <div className="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        <div className="w-[800px] rounded-2xl shadow-2xl border bg-popover">
                          <div className="p-6">
                            <div className="grid grid-cols-2 gap-8">
                              {item.sections?.map((section, idx) => (
                                <div key={idx}>
                                  <h3 className="text-sm font-semibold mb-4 text-popover-foreground">
                                    {section.title}
                                  </h3>
                                  <div className="space-y-3">
                                    {section.items.map((sectionItem, itemIdx) => (
                                      <Link
                                        key={itemIdx}
                                        href="#"
                                        className="flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.02] hover:bg-accent"
                                      >
                                        {'icon' in sectionItem && sectionItem.icon && (
                                          <div className="p-2 rounded-lg bg-accent">
                                            <sectionItem.icon className="w-4 h-4 text-primary" />
                                          </div>
                                        )}
                                        <div>
                                          <div className="font-medium text-popover-foreground">{sectionItem.label}</div>
                                          {'description' in sectionItem && sectionItem.description && (
                                            <div className="text-xs text-muted-foreground">
                                              {sectionItem.description}
                                            </div>
                                          )}
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-6 pt-6 border-t">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-popover-foreground">
                                    Ready to transform your business?
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Get started with a personalized demo
                                  </p>
                                </div>
                                <Button className="bg-gradient-to-r from-blue-700 to-purple-600 hover:from-blue-700/90 hover:to-purple-600/90">
                                  Book Demo
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Regular Dropdown */}
                    {item.dropdown && !item.megaMenu && (
                      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="min-w-56 rounded-xl shadow-lg border bg-popover">
                          {item.dropdown.map((dropdownItem, idx) => (
                            <Link
                              key={idx}
                              href="#"
                              className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-accent first:rounded-t-xl last:rounded-b-xl"
                            >
                              <span className="text-popover-foreground">{dropdownItem.label}</span>
                              {dropdownItem.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {dropdownItem.badge}
                                </Badge>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>


            <div>
                   <div className="hidden lg:block relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search features, docs..."
                    className="pl-10 pr-4 w-64 bg-muted/50"
                  />
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">

              
              <ModeToggle/>

              {/* Login Button */}
              <Button
                variant="ghost"
                onClick={handleLoginClick}
                className="hidden md:flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Login
              </Button>



              {/* Primary CTA */}
              <Button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-700 to-purple-600 hover:from-blue-700/90 hover:to-purple-600/90 shadow-lg shadow-primary/30">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                  <SheetHeader className="mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-purple-600 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <SheetTitle className="text-2xl">Signature Bangla POS</SheetTitle>
                        <p className="text-sm text-muted-foreground">
                          Multi-Business Platform
                        </p>
                      </div>
                    </div>
                  </SheetHeader>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Button onClick={handleLoginClick} className="w-full" variant="outline">
                        <User className="w-4 h-4 mr-2" />
                        Login to Dashboard
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-blue-700 to-purple-600">
                        Get Started Free
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <div className="pt-6 border-t">
                      {navItems.map((item) => (
                        <div key={item.label} className="mb-2">
                          <Link
                            href={item.href}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium hover:bg-accent"
                          >
                            {item.label}
                            {(item.megaMenu || item.dropdown) && (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Link>
                          
                          {item.dropdown && !item.megaMenu && (
                            <div className="ml-4 mt-1 space-y-1">
                              {item.dropdown.map((dropdownItem, idx) => (
                                <Link
                                  key={idx}
                                  href="#"
                                  className="flex items-center justify-between px-4 py-2 rounded-lg text-sm hover:bg-accent"
                                >
                                  {dropdownItem.label}
                                  {dropdownItem.badge && (
                                    <Badge variant="secondary" className="text-xs">
                                      {dropdownItem.badge}
                                    </Badge>
                                  )}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

<LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  );
};

export default PublicHeader;