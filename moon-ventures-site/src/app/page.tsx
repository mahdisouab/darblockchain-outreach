import { Hero } from "@/components/sections/Hero";
import { ForWho } from "@/components/sections/ForWho";
import { CalculatorSection } from "@/components/sections/Calculator";
import { Process } from "@/components/sections/Process";
import { Pricing } from "@/components/sections/Pricing";
import { Demo } from "@/components/sections/Demo";
import { FAQ } from "@/components/sections/FAQ";
import { AuditCTA } from "@/components/sections/AuditCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ForWho />
      <CalculatorSection />
      <Process />
      <Pricing />
      <Demo />
      <FAQ />
      <AuditCTA />
    </>
  );
}
