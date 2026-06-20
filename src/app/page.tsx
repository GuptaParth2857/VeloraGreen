import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection, CTASection } from '@/components/home/LandingSections';
import { EarthSection } from '@/components/earth/EarthSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="relative">
        <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      </div>
      <FeaturesSection />
      <EarthSection />
      <CTASection />
    </main>
  );
}
