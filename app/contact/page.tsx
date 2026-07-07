
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";

import Contact from "@/sections/contact/page"
import TouchSection from "@/sections/home/TouchSection";
import Footer from "@/components/layout/Footer";
export default function ContactusPage() {
  return (
    <>
    <TopBar />
      <Header />
      <Contact/>
      <TouchSection/>
        <Footer/>
        
    </>
  );
}