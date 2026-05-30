export type LoginResponse = { token: string; role: string };
export type HealthResponse = { status: string; timestamp: string };
export type FoodListingIn = {
  name: string;
  provider: string;
  quantity: number;
  type: string;
  storage: string;
  preparedTime: string; // ISO
  expiryTime: string; // ISO
  location: string;
  notes?: string;
  imageUrl?: string;
  freshness?: number;
  prediction?: string;
};
export type FoodListingOut = FoodListingIn & { id: string; createdAt: string };

const BASE = import.meta.env.VITE_API_BASE_URL || ""; // use proxy when empty

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: () => http<HealthResponse>("/api/health"),
  upload: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return http<{ url: string }>("/api/upload", { method: "POST", body: form });
  },
  login: (email: string, password: string) =>
    http<LoginResponse>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),
  signup: (email: string, password: string, role: string) =>
    http<{ msg: string }>("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    }),
  createFood: (item: FoodListingIn) =>
    http<{ id: string }>("/api/food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }),
  listFood: () => http<FoodListingOut[]>("/api/food"),
  claimFood: (foodId: string, ngoName?: string) =>
    http<{ deliveryId: string }>(`/api/food/${foodId}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ngoName }),
    }),
  listDeliveries: (status?: string) => http<any[]>(`/api/deliveries${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  predict: async (
    file: File,
    meta: { temperature: number; humidity: number; light: number; air_quality: number }
  ) => {
    const form = new FormData();
    form.append("file", file);
    form.append("temperature", String(meta.temperature));
    form.append("humidity", String(meta.humidity));
    form.append("light", String(meta.light));
    form.append("air_quality", String(meta.air_quality));
    return http<{ prediction: string; stored_in_mongodb?: boolean; error?: string }>(
      "/api/predict",
      { method: "POST", body: form }
    );
  },
};
