
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";

import Contact from "@/sections/contact/page"
import Contactsection from "@/sections/contact/contactsection";
import Faq from "@/sections/contact/faq";
import Footer from "@/components/layout/Footer";
export default function ContactusPage() {
  return (
    <>
    <TopBar />
      <Header />
      <Contact/>
      <Contactsection/>
      <Faq/>
        <Footer/>
        
    </>
  );
}