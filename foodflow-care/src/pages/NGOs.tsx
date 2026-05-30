import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Package, ThermometerSnowflake, Leaf, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api, type FoodListingOut } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const NGOs = () => {
  const navigate = useNavigate();
  const handleClaimFood = async (food: FoodListingOut) => {
    try {
      await api.claimFood(food.id, localStorage.getItem("ngoName") || "NGO");
      toast.success(`Food claimed successfully! Coordinating delivery for ${food.name}`);
      setTimeout(() => navigate("/"), 800);
    } catch (e: any) {
      toast.error(e?.message || "Failed to claim food");
    }
  };
  const [items, setItems] = useState<FoodListingOut[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.listFood();
        if (mounted) setItems(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load listings");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">NGO & Recipient Portal</h1>
          <p className="text-xl text-muted-foreground">
            Browse available food and coordinate deliveries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2">
            <CardContent className="pt-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Freshness Scoring</h3>
              <p className="text-sm text-muted-foreground">
                Real-time quality assessment for safe consumption
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6 text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Location-Based</h3>
              <p className="text-sm text-muted-foreground">
                See only nearby food for quick delivery
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Instant Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Get notified when fresh food is listed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Food Near You</h2>
          {loading && (
            <p className="text-muted-foreground">Loading listings...</p>
          )}
          {error && (
            <p className="text-destructive">{error}</p>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(items ?? []).map((food) => (
              <Card key={food.id} className="border-2 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{food.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {food.provider}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{food.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Leaf className="h-4 w-4 text-muted-foreground" />
                      <span>{food.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Best before: {new Date(food.expiryTime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm col-span-2">
                      <ThermometerSnowflake className="h-4 w-4 text-muted-foreground" />
                      <span>{food.storage}</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md text-sm">
                    <p className="font-semibold mb-1">Delivery Options:</p>
                    <p className="text-muted-foreground">
                      • Volunteer pickup available<br />
                      • Or assign your own delivery partner
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={() => handleClaimFood(food)}>
                      Claim Food
                    </Button>
                    <Button variant="outline">View on Map</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-2">
          <CardHeader>
            <CardTitle>No Volunteer Available?</CardTitle>
            <CardDescription>
              You can assign your own delivery partner for guaranteed pickup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              When you claim food, if no volunteer is available within a few minutes, 
              you'll get an option to enter your delivery partner's details (name, contact, vehicle). 
              They'll receive the pickup information and route automatically.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary">
              <Package className="h-5 w-5" />
              <span className="font-semibold">
                This ensures timely delivery even during peak hours!
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default NGOs;
