import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Luxury Shopping Experience" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
          <Star className="h-4 w-4 text-premium" fill="currentColor" />
          <span className="text-sm font-medium">Premium Quality Products</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Discover
          <span className="block bg-gradient-to-r from-white to-premium bg-clip-text text-transparent">
            Luxury
          </span>
          Shopping
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
          Experience the finest collection of premium products, curated just for you. 
          Elevate your lifestyle with our exclusive selection.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="hero-button px-8 py-3 text-lg min-w-48"
          >
            Explore Collection
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-3 text-lg min-w-48 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
          >
            Watch Video
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-premium">10K+</div>
            <div className="text-sm text-white/80">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-premium">500+</div>
            <div className="text-sm text-white/80">Premium Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-premium">99%</div>
            <div className="text-sm text-white/80">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;