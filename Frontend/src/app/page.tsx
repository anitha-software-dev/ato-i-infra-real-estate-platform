import HeroSection from "@/components/home/HeroSection";
import TrustIndicators from "@/components/home/TrustIndicators";
import PropertyCategories from "@/components/home/PropertyCategories";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import LeaseHoldSection from "@/components/home/LeaseHoldSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import InvestmentDestinations from "@/components/home/InvestmentDestinations";
import HowWeWork from "@/components/home/HowWeWork";
import WhyInvestWithUs from "@/components/home/WhyInvestWithUs";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import ContactSection from "@/components/home/ContactSection";
import CTABanner from "@/components/home/CTABanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustIndicators />
      <PropertyCategories />
      <FeaturedProperties />
      <LeaseHoldSection />
      <WhyChooseUs />
      <InvestmentDestinations />
      <HowWeWork />
      <WhyInvestWithUs />
      <Testimonials />
      <FAQ />
      <ContactSection />
      <CTABanner />
    </>
  );
}
