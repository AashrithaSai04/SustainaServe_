import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Package, Award, TrendingUp, Users, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

const Volunteers = () => {
  const navigate = useNavigate();
  const [claimedCount, setClaimedCount] = useState(0);
  const [pointsTotal, setPointsTotal] = useState(0);
  const [deliveriesTotal, setDeliveriesTotal] = useState(0);
  const [foodSavedKg, setFoodSavedKg] = useState(0);

  // Initialize counters from localStorage so they persist across redirects
  useEffect(() => {
    const lp = Number(localStorage.getItem("vol_points") || 0);
    setPointsTotal(Number.isFinite(lp) ? lp : 0);
    const ld = Number(localStorage.getItem("vol_deliveries") || 0);
    setDeliveriesTotal(Number.isFinite(ld) ? ld : 0);
    const lf = Number(localStorage.getItem("vol_food_saved") || 0);
    setFoodSavedKg(Number.isFinite(lf) ? lf : 0);
  }, []);

  const handleClaimDelivery = (delivery: string, points: number) => {
    // Update numbers only on claim and persist them
    const nextDeliveries = deliveriesTotal + 1;
    setDeliveriesTotal(nextDeliveries);
    localStorage.setItem("vol_deliveries", String(nextDeliveries));

    const nextPoints = pointsTotal + points;
    setPointsTotal(nextPoints);
    localStorage.setItem("vol_points", String(nextPoints));

    const nextFood = foodSavedKg + 2; // simple placeholder increment
    setFoodSavedKg(nextFood);
    localStorage.setItem("vol_food_saved", String(nextFood));

    setClaimedCount((n) => n + 1);
    toast.success(`Delivery claimed! Route details for ${delivery} sent to your phone.`);
    // Redirect to home after a short delay
    setTimeout(() => navigate("/"), 1000);
  };

  const [items, setItems] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
  const data = await api.listDeliveries("open");
        if (mounted) setItems(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load deliveries");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  function fmtTimeLeft(expiryISO: string) {
    const now = new Date();
    const exp = new Date(expiryISO);
    const ms = exp.getTime() - now.getTime();
    if (ms <= 0) return "expired";
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  const availableDeliveries = useMemo(() => {
    const list = (items ?? []);
    return list.map((i) => ({
      id: i.id,
      food: i.foodName,
      pickup: i.provider || "Provider",
      dropoff: i.ngoName || "Nearest NGO",
      distance: "~2 km",
      timeLeft: fmtTimeLeft(i.expiryTime),
      points: Number.isFinite(i.points) ? i.points : 10,
      freshness: typeof i.freshness === 'number' ? i.freshness : 90,
    }));
  }, [items]);

  const leaderboard = [
    { rank: 1, name: "Priya Sharma", points: 450, deliveries: 18 },
    { rank: 2, name: "Arjun Patel", points: 380, deliveries: 15 },
    { rank: 3, name: "Maya Singh", points: 320, deliveries: 13 },
    { rank: 4, name: "You", points: 180, deliveries: 7 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Volunteer Portal</h1>
          <p className="text-xl text-muted-foreground">
            Make a difference one delivery at a time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-1">{pointsTotal}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-1">{deliveriesTotal}</div>
              <div className="text-sm text-muted-foreground">Deliveries</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-1">{foodSavedKg} kg</div>
              <div className="text-sm text-muted-foreground">Food Saved</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-1">#4</div>
              <div className="text-sm text-muted-foreground">Rank This Month</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">Available Deliveries</h2>
            
            {loading && <p className="text-muted-foreground">Loading deliveries...</p>}
            {error && <p className="text-destructive">{error}</p>}
            <div className="space-y-6">
              {availableDeliveries.map((delivery) => (
                <Card key={delivery.id} className="border-2 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-1">{delivery.food}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Earn {delivery.points} impact points
                        </CardDescription>
                      </div>
                      {/* Freshness badge removed as requested */}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">Pickup</div>
                          <div className="text-sm text-muted-foreground">{delivery.pickup}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Navigation className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">Drop-off</div>
                          <div className="text-sm text-muted-foreground">{delivery.dropoff}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{delivery.distance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{delivery.timeLeft === 'expired' ? 'expired' : `${delivery.timeLeft} left`}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={() => handleClaimDelivery(delivery.food, delivery.points)}>
                        Claim Delivery
                      </Button>
                      <Button variant="outline">View Route</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {availableDeliveries.length === 0 && (
                <Card className="border-2 border-dashed">
                  <CardContent className="py-12 text-center">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No deliveries available right now. Check back soon!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Leaderboard</h2>
            
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Top Volunteers
                </CardTitle>
                <CardDescription>This month's champions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((volunteer) => (
                    <div
                      key={volunteer.rank}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        volunteer.name === "You"
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted/50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          volunteer.rank === 1
                            ? "bg-accent text-accent-foreground"
                            : volunteer.name === "You"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted-foreground/20"
                        }`}
                      >
                        #{volunteer.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{volunteer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {volunteer.deliveries} deliveries
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{volunteer.points}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 mt-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Why Volunteer?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                  <p>Earn impact points and climb the leaderboard</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                  <p>Make a direct difference in your community</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                  <p>Flexible schedule - deliver when you're available</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                  <p>Track your environmental impact</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Volunteers;
