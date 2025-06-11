import Navbar               from '../components/Navbar';
import Hero                 from '../components/Hero';
import About                from '../components/About';
import Features             from '../components/Features';
import PartnersCarousel     from '../components/PartnersCarousel';
import Footer               from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="font-sans text-gray-800">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <PartnersCarousel />
      <Footer />
    </div>
  );
}
