import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, MapPin, Clock, Package, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const Providers = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [foodType, setFoodType] = useState("");
  const [storageType, setStorageType] = useState("");
  const [preparedTime, setPreparedTime] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!/\.(png|jpg|jpeg|webp|gif)$/i.test(file.name)) {
      toast.error("Please upload an image (png, jpg, jpeg, webp, gif)");
      return;
    }
    try {
      setUploading(true);
      const res = await api.upload(file);
      setImageUrl(res.url);
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!foodType || !storageType) {
        toast.error("Please select food and storage type");
        setIsSubmitting(false);
        return;
      }
      const providerName = localStorage.getItem("providerName") || "Provider";
      await api.createFood({
        name: foodName,
        provider: providerName,
        quantity: Number(quantity || 0),
        type: foodType,
        storage: storageType,
        preparedTime: new Date(preparedTime).toISOString(),
        expiryTime: new Date(expiryTime).toISOString(),
        location,
        notes,
        imageUrl: imageUrl || undefined,
      });
  toast.success("Food listing created successfully! NGOs will be notified.");
      setFoodName(""); setQuantity(""); setFoodType(""); setStorageType("");
  setPreparedTime(""); setExpiryTime(""); setLocation(""); setNotes(""); setImageUrl(null);
  // Redirect to NGOs page to view the new listing
  setTimeout(() => navigate("/ngos"), 500);
    } catch (e: any) {
      toast.error(e?.message || "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Food Provider Portal</h1>
            <p className="text-xl text-muted-foreground">
              List your surplus food and make an immediate impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-2">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Real-Time Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Your food is instantly visible to nearby NGOs
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 text-center">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Smart Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  AI calculates freshness scores automatically
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Local Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Help your community within hours
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>List Surplus Food</CardTitle>
              <CardDescription>
                Fill in the details below. We'll match you with nearby recipients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="foodName">Food Name *</Label>
                    <Input id="foodName" placeholder="e.g., Rice and Curry" value={foodName} onChange={(e)=>setFoodName(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input id="quantity" type="number" placeholder="e.g., 50 (kg or servings)" value={quantity ?? ""} onChange={(e)=>setQuantity(e.target.value === "" ? "" : Number(e.target.value))} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="foodType">Food Type *</Label>
                    <Select value={foodType} onValueChange={setFoodType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="veg">Vegetarian</SelectItem>
                        <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="packaged">Packaged/Sealed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storageType">Storage Type *</Label>
                    <Select value={storageType} onValueChange={setStorageType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select storage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="refrigerated">Refrigerated</SelectItem>
                        <SelectItem value="room-temp">Room Temperature</SelectItem>
                        <SelectItem value="frozen">Frozen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="preparedTime">Prepared Time *</Label>
                    <Input id="preparedTime" type="datetime-local" value={preparedTime} onChange={(e)=>setPreparedTime(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryTime">Best Before Time *</Label>
                    <Input id="expiryTime" type="datetime-local" value={expiryTime} onChange={(e)=>setExpiryTime(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Pickup Location *</Label>
                  <div className="flex gap-2">
                    <Input id="location" placeholder="Enter address or use location" value={location} onChange={(e)=>setLocation(e.target.value)} required />
                    <Button type="button" variant="outline" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Auto-detection will be enabled with backend integration
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" placeholder="Any special instructions or dietary information..." rows={3} value={notes} onChange={(e)=>setNotes(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Food Image (Optional)</Label>
                  <label
                    htmlFor="imageInput"
                    onDragOver={(e)=>{e.preventDefault();}}
                    onDrop={(e)=>{e.preventDefault(); handleFiles(e.dataTransfer.files);}}
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors block"
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" /> Uploading...
                      </div>
                    ) : imageUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-8 w-8 text-primary" />
                        <p className="text-sm text-muted-foreground truncate max-w-full">{imageUrl}</p>
                        <Button type="button" variant="outline" onClick={()=>setImageUrl(null)}>Remove</Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                      </>
                    )}
                    <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={(e)=>handleFiles(e.target.files)} />
                  </label>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold text-primary mb-2">What happens next?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ AI calculates freshness score based on your inputs</li>
                    <li>✓ Nearby NGOs receive instant notifications</li>
                    <li>✓ Volunteers are alerted for delivery coordination</li>
                    <li>✓ You'll be notified when food is claimed and delivered</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "List Food Now"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Providers;
