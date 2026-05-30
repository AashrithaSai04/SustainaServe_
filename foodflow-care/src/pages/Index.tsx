import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Users, TrendingUp, Heart, MapPin, Clock, CheckCircle, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

const Index = () => {
  const [stats, setStats] = useState({ meals: 0, foodSaved: 0, co2Reduced: 0 });

  useEffect(() => {
    // Animate counters
    const targetStats = { meals: 15420, foodSaved: 8240, co2Reduced: 12350 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        meals: Math.floor(targetStats.meals * progress),
        foodSaved: Math.floor(targetStats.foodSaved * progress),
        co2Reduced: Math.floor(targetStats.co2Reduced * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary-glow text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-block mb-6">
              <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                🌍 Making a difference, one meal at a time
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Connecting surplus food with those who need it
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Instantly and responsibly — bridging technology, sustainability, and compassion
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/providers">
                <Button size="lg" variant="secondary" className="font-semibold px-8">
                  Donate Food
                </Button>
              </Link>
              <Link to="/ngos">
                <Button size="lg" variant="outline" className="font-semibold px-8 bg-primary-foreground/10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/20">
                  Join as NGO
                </Button>
              </Link>
              <Link to="/volunteers">
                <Button size="lg" variant="outline" className="font-semibold px-8 bg-primary-foreground/10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/20">
                  Become a Volunteer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stats.meals.toLocaleString()}+
              </div>
              <div className="text-muted-foreground font-medium">🍛 Meals Delivered</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stats.foodSaved.toLocaleString()} kg
              </div>
              <div className="text-muted-foreground font-medium">🌾 Food Saved</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stats.co2Reduced.toLocaleString()} kg
              </div>
              <div className="text-muted-foreground font-medium">🌍 CO₂ Reduced</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple, fast, and impactful</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Leaf className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">1. Food Listed</h3>
                <p className="text-center text-muted-foreground">
                  Providers upload surplus food details with real-time freshness tracking
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="text-accent h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">2. AI Matching</h3>
                <p className="text-center text-muted-foreground">
                  Smart algorithm matches food with nearby NGOs based on freshness and location
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Truck className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">3. Delivery</h3>
                <p className="text-center text-muted-foreground">
                  Volunteers or NGO partners ensure safe and timely delivery
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="text-accent h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">4. Impact Tracked</h3>
                <p className="text-center text-muted-foreground">
                  Every delivery measured for meals served, waste reduced, and CO₂ saved
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why SustainaServe?</h2>
            <p className="text-xl text-muted-foreground">Innovative solutions for maximum impact</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <Clock className="text-primary h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Real-Time Freshness Scoring</h3>
                <p className="text-muted-foreground">
                  AI predicts remaining safe hours for food, ensuring quality and safety before redistribution
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Truck className="text-accent h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Dual Delivery System</h3>
                <p className="text-muted-foreground">
                  Volunteer network + NGO delivery partners ensure timely delivery even during peak hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <MapPin className="text-primary h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Hyper-Local Focus</h3>
                <p className="text-muted-foreground">
                  Designed for colleges and local communities — food reaches people within hours, not days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="text-accent h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Impact Analytics</h3>
                <p className="text-muted-foreground">
                  Track meals delivered, waste reduced, and environmental impact with visual dashboards
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Users className="text-primary h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Community-Driven</h3>
                <p className="text-muted-foreground">
                  Volunteers earn impact points, NGOs gain credibility badges, providers get recognition
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Heart className="text-accent h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Visual Transparency</h3>
                <p className="text-muted-foreground">
                  Real-time dashboards show local impact, motivating continuous participation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground">Real impact from real communities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    RS
                  </div>
                  <div>
                    <div className="font-semibold">Raj's Canteen</div>
                    <div className="text-sm text-muted-foreground">Food Provider</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "We used to throw away 20kg of food daily. Now it feeds 50+ people every day. Amazing platform!"
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    HC
                  </div>
                  <div>
                    <div className="font-semibold">Hope Care Foundation</div>
                    <div className="text-sm text-muted-foreground">NGO Partner</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "The real-time alerts and delivery system have transformed how we serve our community. Incredible tool!"
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    PS
                  </div>
                  <div>
                    <div className="font-semibold">Priya Sharma</div>
                    <div className="text-sm text-muted-foreground">Volunteer</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "Earned 150 impact points in my first month. It's rewarding to see the difference I'm making!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Every meal saved is a step toward a sustainable future. Be part of the solution today.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="font-semibold px-12">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
