// Structured dropdown options — no free-text alternatives allowed.

export const COUNTIES = [
  "Nairobi", "Kiambu", "Nakuru", "Uasin Gishu", "Trans Nzoia", "Bungoma",
  "Kakamega", "Vihiga", "Kisii", "Nyamira", "Migori", "Homa Bay", "Kisumu",
  "Siaya", "Busia", "Meru", "Embu", "Tharaka Nithi", "Kirinyaga", "Murang'a",
  "Nyeri", "Laikipia", "Baringo", "Elgeyo Marakwet", "Nandi", "Bomet", "Kericho",
  "Narok", "Kajiado", "Machakos", "Makueni", "Kitui",
];

export const SOIL_TYPES = [
  "Sandy", "Loamy", "Clay", "Silty", "Sandy Loam", "Clay Loam", "Volcanic",
  "Black Cotton", "Red Soil",
];

export const TEXTURE_OPTIONS = [
  { value: "sand", label: "Sand" },
  { value: "loam", label: "Loam" },
  { value: "clay", label: "Clay" },
  { value: "silt", label: "Silt" },
  { value: "sandy_loam", label: "Sandy Loam" },
  { value: "clay_loam", label: "Clay Loam" },
] as const;

export const CROP_TYPES = [
  "Maize", "Beans", "Sorghum", "Millet", "Rice", "Wheat", "Cassava",
  "Sweet Potato", "Irish Potato", "Coffee", "Tea", "Sugarcane", "Cotton",
  "Sunflower", "Soybean", "Groundnut", "Banana", "Tomato", "Onion", "Kale",
];

export const FERTILIZER_TYPES = [
  "DAP", "CAN", "Urea", "NPK 17-17-17", "NPK 23-23-0", "NPK 20-20-20",
  "SSP", "TSP", "MOP", "Sulphate of Ammonia", "Organic Manure", "Compost",
  "Foliar Feed",
];

export const APPLICATION_STAGES = [
  { value: "basal", label: "Basal (at planting)" },
  { value: "top_dressing_1", label: "Top dressing 1" },
  { value: "top_dressing_2", label: "Top dressing 2" },
  { value: "foliar", label: "Foliar spray" },
] as const;

export const QUALITY_GRADES = [
  { value: "A", label: "Grade A — Premium" },
  { value: "B", label: "Grade B — Standard" },
  { value: "C", label: "Grade C — Low" },
] as const;
