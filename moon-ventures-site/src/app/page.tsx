import { Hero } from "@/components/sections/Hero";
import { ForWho } from "@/components/sections/ForWho";
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
      <Process />
      <Pricing />
      <Demo />
      <FAQ />
      <AuditCTA />
    </>
  );
}
