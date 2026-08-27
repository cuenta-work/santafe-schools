import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import LevelShowcase from "@/components/LevelShowcase";
import Featured from "@/components/Featured";
import FamilyWizard from "@/components/FamilyWizard";
import CareerFinder from "@/components/CareerFinder";
import NearMe from "@/components/NearMe";
import Explorer from "@/components/Explorer";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import ModalHost from "@/components/ModalHost";
import { FiltersProvider } from "@/context/FiltersContext";
import { institutions } from "@/lib/data";
import { buildStructuredData } from "@/lib/structuredData";

export default function Home() {
  return (
    <FiltersProvider institutions={institutions}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildStructuredData(institutions)) }}
      />
      <div className="flex flex-1 flex-col bg-background">
        <NavBar />
        <Hero />
        <LevelShowcase />
        <Featured />
        <FamilyWizard />
        <CareerFinder />
        <NearMe />
        <Explorer />
        <ContactCTA />
        <Footer />
        <ModalHost />
      </div>
    </FiltersProvider>
  );
}
