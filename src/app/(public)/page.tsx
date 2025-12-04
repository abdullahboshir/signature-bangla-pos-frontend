"use client";

import Home from "@/components/Home";
import { Footer } from "@/components/layouts/Footer";
import PublicHeader from "@/components/layouts/PublicHeader";


const HomePage = () => {
  return (
    <div>
      <PublicHeader/>
      <Home/>
      <Footer />
    </div>
  );
};

export default HomePage;
