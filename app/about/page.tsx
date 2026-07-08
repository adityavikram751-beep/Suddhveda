
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import About from "@/sections/about/page"
import FeaturesBar from "@/sections/home/FeaturesBar";
import Timeline from "@/sections/about/timeline";
import OurValues from "@/sections/about/ourvalue";
import Stats  from "@/sections/about/stats";
import Process from "@/sections/about/process";
import TouchSection from "@/sections/home/TouchSection";


import Footer from "@/components/layout/Footer";
export default function AboutPage() {
  return (
    <>
    <TopBar />
      <Header />
      <About/>
      <FeaturesBar/>
      <Timeline/>
      <OurValues/>
      <Stats/>
      <Process/>
      <TouchSection/>
        <Footer/>
    </>
  );
}