import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, Users, TrendingUp, Target, Lightbulb } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="bg-primary p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Leaf className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">About SustainaServe</h1>
            <p className="text-xl text-muted-foreground">
              Bridging technology, sustainability, and compassion
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <Card className="border-2 mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  SustainaServe bridges technology, sustainability, and compassion — ensuring every 
                  meal finds a plate instead of a landfill. We connect surplus food from providers 
                  with communities in need, creating a hyper-local network that reduces waste, 
                  feeds people, and protects our environment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-accent" />
                  The Problem We Solve
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Every day, cafeterias, restaurants, and food businesses discard edible food simply 
                  because it's unsold or surplus. Meanwhile, countless people in nearby communities 
                  struggle with food insecurity. The gap isn't lack of food—it's lack of visibility 
                  and coordination.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  SustainaServe solves this by creating a real-time platform that makes surplus food 
                  instantly visible and actionable, ensuring it reaches those who need it within hours, 
                  not days.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Our Unique Innovations
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      1. Real-Time Freshness Scoring
                    </h3>
                    <p className="text-muted-foreground">
                      Our AI analyzes food type, preparation time, and storage conditions to predict 
                      remaining safe hours. This ensures recipients only get quality, safe food and 
                      helps prioritize time-sensitive items.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      2. Dual Delivery System
                    </h3>
                    <p className="text-muted-foreground">
                      Unlike other platforms, we support both volunteer networks AND NGO delivery partners. 
                      If no volunteer is available, NGOs can assign their own delivery staff, ensuring 
                      guaranteed timely pickup even during peak hours.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      3. Hyper-Local Focus
                    </h3>
                    <p className="text-muted-foreground">
                      Designed specifically for college campuses and local communities, we ensure food 
                      travels minimal distances and reaches people within hours. This maximizes freshness 
                      and minimizes environmental impact.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      4. Impact Analytics & Gamification
                    </h3>
                    <p className="text-muted-foreground">
                      We don't just track meals delivered—we measure CO₂ saved, waste reduced, and 
                      community impact. Volunteers earn points, NGOs gain credibility badges, and 
                      providers get recognition, creating a motivated, engaged community.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      5. Visual Transparency
                    </h3>
                    <p className="text-muted-foreground">
                      Real-time dashboards make impact visible and tangible. Users can see exactly how 
                      their actions contribute to local sustainability goals, driving continuous participation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Heart className="h-6 w-6 text-accent" />
                  Built for Impact
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  SustainaServe was created for the Sustainability Hackathon with a singular goal: 
                  to prove that technology can drive meaningful social and environmental change at the 
                  local level.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Every feature—from AI freshness scoring to dual delivery systems—was designed to 
                  remove friction and maximize impact. We believe that solving food waste isn't just 
                  about redistribution; it's about creating an accountable, transparent, and motivated 
                  community ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Join Us
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Whether you're a food provider looking to reduce waste, an NGO serving communities in 
                  need, or a volunteer wanting to make a difference—SustainaServe welcomes you.
                </p>
                <p className="text-muted-foreground leading-relaxed font-semibold">
                  Together, we can ensure every meal finds a home, every community thrives, and every 
                  action counts toward a sustainable future.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
