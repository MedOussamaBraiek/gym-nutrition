import HeroSlider from "@/components/sections/HeroSlider";
import Brands from "@/components/sections/Brands";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import WhyUs from "@/components/sections/WhyUs";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Brands />
      <FeaturedProducts />
      <WhyUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}
