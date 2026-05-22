import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white selection:bg-gray-900 selection:text-white">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <FeaturedProducts />
        <Testimonials />
        <Footer />
      </main>
    </div>
  );
}

export default App;