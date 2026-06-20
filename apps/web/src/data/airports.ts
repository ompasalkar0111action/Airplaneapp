import type { Airport } from "../types";

export const fallbackAirports: Airport[] = [
  { code: "DEL", city: "New Delhi", name: "Indira Gandhi International", country: "India" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", country: "India" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International", country: "India" },
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "United Arab Emirates" },
  { code: "LHR", city: "London", name: "Heathrow", country: "United Kingdom" },
  { code: "SIN", city: "Singapore", name: "Singapore Changi", country: "Singapore" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
  { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar" },
];
