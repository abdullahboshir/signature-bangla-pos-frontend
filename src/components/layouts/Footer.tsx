// components/layout/Footer.tsx
"use client"

import { Heart, Github, Twitter, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SB</span>
              </div>
              <span className="font-bold text-lg">Signature Bangla</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Comprehensive POS solution for multi-business management. 
              Streamline your operations with our powerful tools.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-3">
            <h4 className="font-semibold">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer">POS System</li>
              <li className="hover:text-foreground cursor-pointer">Inventory Management</li>
              <li className="hover:text-foreground cursor-pointer">Customer CRM</li>
              <li className="hover:text-foreground cursor-pointer">Analytics Dashboard</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer">Help Center</li>
              <li className="hover:text-foreground cursor-pointer">Documentation</li>
              <li className="hover:text-foreground cursor-pointer">API Reference</li>
              <li className="hover:text-foreground cursor-pointer">Contact Sales</li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer">Privacy Policy</li>
              <li className="hover:text-foreground cursor-pointer">Terms of Service</li>
              <li className="hover:text-foreground cursor-pointer">Cookie Policy</li>
              <li className="hover:text-foreground cursor-pointer">Security</li>
            </ul>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear} Signature Bangla POS. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for better business management</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>v1.0.0</span>
            <span>•</span>
            <span>All systems operational</span>
            <span>•</span>
            <Button variant="link" className="p-0 h-auto text-sm">
              Status
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
