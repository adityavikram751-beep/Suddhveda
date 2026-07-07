
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import About from "@/sections/about/page"
import Timeline from "@/sections/about/timeline";
import OurValues from "@/sections/about/ourvalue";
import Process from "@/sections/about/process";
import TouchSection from "@/sections/home/TouchSection";


import Footer from "@/components/layout/Footer";
export default function AboutPage() {
  return (
    <>
    <TopBar />
      <Header />
      <About/>
      <Timeline/>
      <OurValues/>
      <Process/>
      <TouchSection/>
        <Footer/>
    </>
  );
}