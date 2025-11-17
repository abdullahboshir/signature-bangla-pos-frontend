// import Navbar from "@/components/shared/Navbar";
// import Footer from "@/components/shared/Footer";
import type { ReactNode } from "react";

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* <Navbar /> */}
      {children}  {/* this will render your page.tsx */}
      {/* <Footer /> */}
    </div>
  );
}
