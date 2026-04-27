import Hero from "@/components/sections/Hero";
import StorySection from "@/components/sections/StorySection";
import MenuPreview from "@/components/sections/MenuPreview";
import ReservationSection from "@/components/sections/ReservationSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import LocationSection from "@/components/sections/LocationSection";

export default function Home() {
  return (
    <>
      <Hero />
      <StorySection />
      <MenuPreview />
      <ReservationSection />
      <ReviewsSection />
      <LocationSection />
    </>
  );
}
