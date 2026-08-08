import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import HowItWorks from "../../components/home/HowItWorks";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import CTA from "../../components/home/CTA";
import Testimonials from "../../components/home/Testimonials"; 

export default function Home() {
  return (
    <>
      <Hero />

      <Categories />

      <HowItWorks />

      <FeaturedProducts />

      <Testimonials />

      <CTA />
    </>
  );
}