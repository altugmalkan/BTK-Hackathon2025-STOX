import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Award, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            About BTKshop
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your premier destination for luxury products and exceptional shopping experiences. 
            We connect discerning customers with curated collections from the world's finest sellers.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At BTKshop, we believe that quality products should be accessible to everyone. Our platform 
              brings together carefully curated products from trusted sellers, ensuring that every 
              purchase meets our high standards for quality and authenticity.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're committed to creating a seamless shopping experience that combines the convenience 
              of online shopping with the personalized service you'd expect from a luxury boutique.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 flex items-center justify-center">
            <div className="text-center">
              <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Curated with Love</h3>
              <p className="text-muted-foreground">
                Every product is handpicked for quality and style
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-0 shadow-lg bg-background/50 backdrop-blur">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Trusted Community</CardTitle>
              <CardDescription>
                Join thousands of satisfied customers and verified sellers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Our platform fosters a community of quality-conscious buyers and reputable sellers, 
                ensuring every transaction is built on trust and transparency.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-background/50 backdrop-blur">
            <CardHeader className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Quality Assured</CardTitle>
              <CardDescription>
                Rigorous quality control and authentication processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Every product undergoes thorough verification to ensure authenticity and quality, 
                giving you peace of mind with every purchase.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-background/50 backdrop-blur">
            <CardHeader className="text-center">
              <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Premium Experience</CardTitle>
              <CardDescription>
                Luxury shopping redefined for the digital age
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                From our intuitive interface to our exceptional customer service, 
                we provide a shopping experience that matches the quality of our products.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Verified Sellers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Products Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Luxury?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of luxury enthusiasts and discover products that elevate your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/">Start Shopping</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/seller-login">Become a Seller</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 