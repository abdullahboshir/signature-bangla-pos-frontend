// import Navbar from "@/components/shared/Navbar";
// import Footer from "@/components/shared/Footer";
import type { ReactNode } from "react";
import { LoadingClearer } from "@/components/shared/LoadingClearer";

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <LoadingClearer />
      {/* <Navbar /> */}
      {children}  {/* this will render your page.tsx */}
      {/* <Footer /> */}
    </div>
  );
}
