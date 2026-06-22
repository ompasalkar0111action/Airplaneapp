/*
INPUT:
- frontend requests like search data or booking data

PROCESS:
- sends HTTP requests to backend API using fetch
- handles success and error responses

OUTPUT:
- parsed backend data returned to frontend code
*/
import type { Airport, BookingRecord, BookingRequest, FlightDetail, FlightSummary, SearchRequest } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://airplaneapp-api.onrender.com";

console.log("API BASE:", API_BASE_URL);

// This custom error helps us show backend errors on the frontend.
class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // All frontend API calls come through this helper.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new ApiError(errorPayload?.error?.message ?? "Request failed", response.status);
  }

  const payload = (await response.json()) as { data: T };
  return payload.data;
}

export const api = {
  
  // Get airport list for dropdowns.
  listAirports: () => request<Airport[]>("/api/airports"),
  
  // Search flights using query parameters.
  searchFlights: (criteria: SearchRequest) =>
    request<FlightSummary[]>(
      `/api/flights/search?${new URLSearchParams({
        origin: criteria.origin,
        destination: criteria.destination,
        date: criteria.date,
        cabin: criteria.cabin,
        passengers: criteria.passengers.toString(),
      })}`,
    ),
  
    // Get one flight with seat map.
  getFlight: (flightId: string) => request<FlightDetail>(`/api/flights/${encodeURIComponent(flightId)}`),
  
  // Create a booking from the form data.
  createBooking: (booking: BookingRequest) =>
    request<BookingRecord>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    }),
};
