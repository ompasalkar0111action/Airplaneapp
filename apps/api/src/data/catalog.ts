// CabinClass is reused in flights, seats, and booking records.
export type CabinClass = "economy" | "premium-economy" | "business";

// Airport shape used in dropdowns and flight display.
export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

// FlightTemplate is the raw source data used to generate real flights by date.
export interface FlightTemplate {
  id: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
  seatProfile: "narrow-body" | "wide-body";
  originCode: string;
  destinationCode: string;
  departureTime: string;
  durationMinutes: number;
  stops: number;
  stopoverAirportCode?: string;
  baseFares: Record<CabinClass, number>;
  amenities: string[];
  reliability: string;
}

// Static airport list used by the demo app.
export const airports: Airport[] = [
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

// Static flight list used by the demo app.
// The backend filters this data based on user search input.
export const flightTemplates: FlightTemplate[] = [
  {
    id: "aurora-del-dxb-1",
    airline: "Aurora Air",
    flightNumber: "AU 318",
    aircraft: "Airbus A321neo",
    seatProfile: "narrow-body",
    originCode: "DEL",
    destinationCode: "DXB",
    departureTime: "07:10",
    durationMinutes: 220,
    stops: 0,
    baseFares: {
      economy: 8500,
      "premium-economy": 12800,
      business: 21500,
    },
    amenities: ["Wi-Fi", "Streaming entertainment", "Hot meals"],
    reliability: "92% on-time in the last 30 days",
  },
  {
    id: "aurora-del-dxb-2",
    airline: "Aurora Air",
    flightNumber: "AU 552",
    aircraft: "Boeing 787-9",
    seatProfile: "wide-body",
    originCode: "DEL",
    destinationCode: "DXB",
    departureTime: "18:45",
    durationMinutes: 230,
    stops: 0,
    baseFares: {
      economy: 9600,
      "premium-economy": 13900,
      business: 22800,
    },
    amenities: ["Wi-Fi", "Lie-flat business seats", "Priority boarding"],
    reliability: "95% on-time in the last 30 days",
  },
  {
    id: "aerolink-bom-sin-1",
    airline: "Aerolink",
    flightNumber: "AL 224",
    aircraft: "Boeing 787-8",
    seatProfile: "wide-body",
    originCode: "BOM",
    destinationCode: "SIN",
    departureTime: "09:25",
    durationMinutes: 330,
    stops: 0,
    baseFares: {
      economy: 14200,
      "premium-economy": 19800,
      business: 32200,
    },
    amenities: ["Fast Wi-Fi", "Chef-curated meals", "USB-C power"],
    reliability: "94% on-time in the last 30 days",
  },
  {
    id: "aerolink-bom-sin-2",
    airline: "Aerolink",
    flightNumber: "AL 448",
    aircraft: "Airbus A330-900",
    seatProfile: "wide-body",
    originCode: "BOM",
    destinationCode: "SIN",
    departureTime: "22:20",
    durationMinutes: 345,
    stops: 0,
    baseFares: {
      economy: 13600,
      "premium-economy": 18900,
      business: 30800,
    },
    amenities: ["Quiet cabin lighting", "Extra baggage allowance", "Work tables"],
    reliability: "91% on-time in the last 30 days",
  },
  {
    id: "stratos-blr-lhr-1",
    airline: "Stratos Airways",
    flightNumber: "ST 901",
    aircraft: "Boeing 787-9",
    seatProfile: "wide-body",
    originCode: "BLR",
    destinationCode: "LHR",
    departureTime: "05:40",
    durationMinutes: 605,
    stops: 0,
    baseFares: {
      economy: 32900,
      "premium-economy": 45800,
      business: 78900,
    },
    amenities: ["Long-haul Wi-Fi", "Amenity kits", "Lounge access in business"],
    reliability: "93% on-time in the last 30 days",
  },
  {
    id: "stratos-blr-lhr-2",
    airline: "Stratos Airways",
    flightNumber: "ST 731",
    aircraft: "Airbus A350-900",
    seatProfile: "wide-body",
    originCode: "BLR",
    destinationCode: "LHR",
    departureTime: "13:10",
    durationMinutes: 690,
    stops: 1,
    stopoverAirportCode: "DOH",
    baseFares: {
      economy: 28400,
      "premium-economy": 40200,
      business: 69500,
    },
    amenities: ["Large overhead bins", "Mood lighting", "Smart seat controls"],
    reliability: "96% on-time in the last 30 days",
  },
  {
    id: "nova-del-jfk-1",
    airline: "Nova Atlantic",
    flightNumber: "NV 117",
    aircraft: "Boeing 777-300ER",
    seatProfile: "wide-body",
    originCode: "DEL",
    destinationCode: "JFK",
    departureTime: "02:05",
    durationMinutes: 905,
    stops: 0,
    baseFares: {
      economy: 56200,
      "premium-economy": 74800,
      business: 126000,
    },
    amenities: ["High-speed Wi-Fi", "Deep recline seats", "Premium meal selection"],
    reliability: "90% on-time in the last 30 days",
  },
  {
    id: "nova-jfk-del-1",
    airline: "Nova Atlantic",
    flightNumber: "NV 118",
    aircraft: "Boeing 777-300ER",
    seatProfile: "wide-body",
    originCode: "JFK",
    destinationCode: "DEL",
    departureTime: "11:10",
    durationMinutes: 880,
    stops: 0,
    baseFares: {
      economy: 54800,
      "premium-economy": 72900,
      business: 123000,
    },
    amenities: ["High-speed Wi-Fi", "Signature cabins", "Large meal service"],
    reliability: "89% on-time in the last 30 days",
  },
  {
    id: "coastline-sfo-sin-1",
    airline: "Coastline Pacific",
    flightNumber: "CP 481",
    aircraft: "Airbus A350-1000",
    seatProfile: "wide-body",
    originCode: "SFO",
    destinationCode: "SIN",
    departureTime: "12:55",
    durationMinutes: 1020,
    stops: 0,
    baseFares: {
      economy: 64100,
      "premium-economy": 84600,
      business: 138000,
    },
    amenities: ["Satellite Wi-Fi", "Quiet zone", "Large 4K screens"],
    reliability: "94% on-time in the last 30 days",
  },
  {
    id: "lumiere-bom-cdg-1",
    airline: "Lumiere Air",
    flightNumber: "LU 601",
    aircraft: "Airbus A330-300",
    seatProfile: "wide-body",
    originCode: "BOM",
    destinationCode: "CDG",
    departureTime: "07:55",
    durationMinutes: 615,
    stops: 1,
    stopoverAirportCode: "DOH",
    baseFares: {
      economy: 29600,
      "premium-economy": 41800,
      business: 70200,
    },
    amenities: ["Bistro menu", "Stretch zone", "Family boarding"],
    reliability: "93% on-time in the last 30 days",
  },
  {
    id: "lumiere-cdg-bom-1",
    airline: "Lumiere Air",
    flightNumber: "LU 602",
    aircraft: "Airbus A330-300",
    seatProfile: "wide-body",
    originCode: "CDG",
    destinationCode: "BOM",
    departureTime: "14:20",
    durationMinutes: 605,
    stops: 1,
    stopoverAirportCode: "DOH",
    baseFares: {
      economy: 30100,
      "premium-economy": 42500,
      business: 71100,
    },
    amenities: ["Bistro menu", "Stretch zone", "Quiet boarding flow"],
    reliability: "93% on-time in the last 30 days",
  },
];
