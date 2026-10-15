import TopBar from '@/components/TopBar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import WorkSection from '@/components/WorkSection';
import ExtrasSection from '@/components/ExtrasSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div id="top" className="relative flex flex-col min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Fixed Neo-Brutalist Top Bar */}
      <TopBar />

      {/* Main Content Sections */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <WorkSection />
        <ExtrasSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
