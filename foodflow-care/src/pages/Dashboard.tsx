import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, TrendingUp, Users, Package, Clock, MapPin, Award, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const [userRole] = useState("admin"); // In real app, get from auth context
  const [health, setHealth] = useState<string>("Checking...");
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [light, setLight] = useState(300);
  const [airQuality, setAirQuality] = useState(40);

  const loadHealth = async () => {
    try {
      const res = await api.health();
      setHealth(`${res.status} @ ${new Date(res.timestamp).toLocaleTimeString()}`);
    } catch (e: any) {
      setHealth(`Unavailable (${e?.message || "error"})`);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const submitPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setPredicting(true);
    setPrediction(null);
    try {
      const res = await api.predict(file, {
        temperature,
        humidity,
        light,
        air_quality: airQuality,
      });
      setPrediction(res.error ? `Error: ${res.error}` : res.prediction);
    } catch (err: any) {
      setPrediction(err?.message || "Prediction failed");
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your impact and activities</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15,420</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Food Saved</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8,240 kg</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-xs text-muted-foreground">+24 new this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CO₂ Reduced</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,350 kg</div>
                  <p className="text-xs text-muted-foreground">Environmental impact</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Backend Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">{health}</div>
                  <Button className="mt-2" size="sm" variant="outline" onClick={loadHealth}>Retry</Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fresh vs Stale Prediction</CardTitle>
                  <CardDescription>Upload an image and sensor metadata</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitPrediction} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="file">Food Image</Label>
                      <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <Label htmlFor="temp">Temp (°C)</Label>
                        <Input id="temp" type="number" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} required />
                      </div>
                      <div>
                        <Label htmlFor="hum">Humidity (%)</Label>
                        <Input id="hum" type="number" value={humidity} onChange={(e) => setHumidity(parseFloat(e.target.value))} required />
                      </div>
                      <div>
                        <Label htmlFor="light">Light (lux)</Label>
                        <Input id="light" type="number" value={light} onChange={(e) => setLight(parseFloat(e.target.value))} required />
                      </div>
                      <div>
                        <Label htmlFor="aq">Air Quality (AQI)</Label>
                        <Input id="aq" type="number" value={airQuality} onChange={(e) => setAirQuality(parseFloat(e.target.value))} required />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button type="submit" disabled={predicting || !file}>
                        <Upload className="h-4 w-4 mr-2" />
                        {predicting ? "Predicting..." : "Predict"}
                      </Button>
                      {prediction && (
                        <div className="text-sm">Result: <span className="font-semibold">{prediction}</span></div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Deliveries</CardTitle>
                  <CardDescription>Latest food redistribution activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">Campus Cafeteria → Hope Foundation</div>
                          <div className="text-sm text-muted-foreground">50kg rice and curry</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Delivered 2 hours ago by Volunteer #12
                          </div>
                        </div>
                        <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-semibold">
                          95% Fresh
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Contributors</CardTitle>
                  <CardDescription>Leaderboard this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Raj's Canteen", points: 245, type: "Provider" },
                      { name: "Priya Sharma", points: 189, type: "Volunteer" },
                      { name: "Hope Foundation", points: 156, type: "NGO" },
                    ].map((user, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="bg-accent/10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-accent">
                          #{i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.type}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-accent" />
                          <span className="font-semibold">{user.points} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Detailed insights and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Charts and graphs will be displayed here with real data
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Backend integration required for live analytics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>All recent platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Food listed", user: "Campus Cafeteria", time: "5 mins ago", icon: Package },
                    { action: "Delivery completed", user: "Volunteer #24", time: "15 mins ago", icon: Clock },
                    { action: "Food claimed", user: "Care Home NGO", time: "32 mins ago", icon: MapPin },
                    { action: "New volunteer joined", user: "Sarah Johnson", time: "1 hour ago", icon: Users },
                    { action: "Food listed", user: "Bistro Corner", time: "2 hours ago", icon: Package },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-muted-foreground">{activity.user}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
