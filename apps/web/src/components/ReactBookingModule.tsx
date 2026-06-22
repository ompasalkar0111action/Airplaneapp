/*
INPUT:
- search form values
- selected flight id
- booking form values

PROCESS:
- loads airports
- searches flights
- loads one flight with seats
- sends booking to backend

OUTPUT:
- flight list
- selected flight details
- booking confirmation or error
*/
import { useEffect, useState } from "react";

import { api } from "../api/client";
import { fallbackAirports } from "../data/airports";
import type { Airport, BookingRecord, FlightDetail, FlightSummary } from "../types";

export function ReactBookingModule() {
  // Airport list for dropdowns.
  const [airports, setAirports] = useState<Airport[]>(fallbackAirports);
  // Flights returned after searching.
  const [flights, setFlights] = useState<FlightSummary[]>([]);
  // Full details for one selected flight.
  const [selectedFlight, setSelectedFlight] = useState<FlightDetail | null>(null);
  // Simple loading and message states.
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingResult, setBookingResult] = useState<BookingRecord | null>(null);

  // Search form values.
  const [search, setSearch] = useState({
    origin: "DEL",
    destination: "DXB",
    date: tomorrowIsoDate(),
    cabin: "economy" as "economy" | "premium-economy" | "business",
  });

  // Booking form values.
  const [booking, setBooking] = useState({
    seatId: "",
    firstName: "",
    lastName: "",
    email: "",
    checkedBags: 0,
    priorityBoarding: false,
  });

  useEffect(() => {
    // On first load:
    // 1. load airports
    // 2. run one default search
    async function loadData() {
      try {
        const airportData = await api.listAirports();
        setAirports(airportData.length > 0 ? airportData : fallbackAirports);
      } catch {
        setAirports(fallbackAirports);
      }

      await searchFlights();
    }

    void loadData();
  }, []);

  async function searchFlights() {
    // Clear old messages before a new search.
    setSearchError("");
    setBookingError("");
    setBookingResult(null);

    // Basic form validation.
    if (search.origin === search.destination) {
      setSearchError("Origin and destination must be different.");
      return;
    }

    setLoadingFlights(true);

    try {
      // Frontend calls the backend flight search API.
      const result = await api.searchFlights({
        ...search,
        passengers: 1,
      });

      // Store the flights and clear any old selected flight.
      setFlights(result);
      setSelectedFlight(null);
    } catch {
      setSearchError("Could not load flights.");
    } finally {
      setLoadingFlights(false);
    }
  }

  async function selectFlight(flightId: string) {
    // When a flight is selected, load its full details including seat map.
    setBookingError("");
    setBookingResult(null);
    setBooking((current) => ({ ...current, seatId: "" }));

    try {
      const result = await api.getFlight(flightId);
      setSelectedFlight(result);
    } catch {
      setBookingError("Could not load flight details.");
    }
  }

  async function createBooking() {
    // Clear old result/messages before creating a new booking.
    setBookingError("");
    setBookingResult(null);

    // Check whether required booking fields are filled.
    if (!selectedFlight || !booking.seatId || !booking.firstName || !booking.lastName || !booking.email) {
      setBookingError("Fill all details before booking.");
      return;
    }

    try {
      // Send booking data to the backend.
      const result = await api.createBooking({
        flightId: selectedFlight.id,
        cabin: search.cabin,
        seatId: booking.seatId,
        passenger: {
          firstName: booking.firstName,
          lastName: booking.lastName,
          email: booking.email,
        },
        extras: {
          checkedBags: booking.checkedBags,
          priorityBoarding: booking.priorityBoarding,
        },
      });

      // Save booking result and clear form after success.
      setBookingResult(result);
      setBooking({
        seatId: "",
        firstName: "",
        lastName: "",
        email: "",
        checkedBags: 0,
        priorityBoarding: false,
      });

      // Load the selected flight again so the booked seat disappears from available seats.
      await selectFlight(selectedFlight.id);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Could not complete booking.");
    }
  }

  // Show only available seats for the selected cabin.
  const availableSeats = selectedFlight
    ? selectedFlight.seatMap.filter((seat) => seat.cabin === search.cabin && seat.isAvailable)
    : [];

  return (
    <section className="student-layout">
      <div className="glass-card student-card">
        <p className="eyebrow">ReactJS Module</p>
        <h2>Simple Flight Booking</h2>
        <p className="student-text">This module solves the flight booking problem using ReactJS.</p>

        {/* Search form */}
        <div className="student-grid">
          <label>
            <span>From</span>
            <select value={search.origin} onChange={(event) => setSearch({ ...search, origin: event.target.value })}>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.city} ({airport.code})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>To</span>
            <select value={search.destination} onChange={(event) => setSearch({ ...search, destination: event.target.value })}>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.city} ({airport.code})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Date</span>
            <input type="date" value={search.date} onChange={(event) => setSearch({ ...search, date: event.target.value })} />
          </label>

          <label>
            <span>Cabin</span>
            <select value={search.cabin} onChange={(event) => setSearch({ ...search, cabin: event.target.value as typeof search.cabin })}>
              <option value="economy">Economy</option>
              <option value="premium-economy">Premium Economy</option>
              <option value="business">Business</option>
            </select>
          </label>

          <button className="primary-button simple-button" type="button" onClick={() => void searchFlights()}>
            Search Flights
          </button>
        </div>

        {/* Search error message */}
        {searchError ? <p className="error-banner plain-message">{searchError}</p> : null}
      </div>

      <div className="student-columns">
        <div className="glass-card student-card">
          <p className="eyebrow">Flights</p>
          {/* Search results area */}
          {loadingFlights ? <p className="student-text">Loading flights...</p> : null}
          {!loadingFlights && flights.length === 0 ? <p className="student-text">No flights found.</p> : null}

          <div className="student-list">
            {flights.map((flight) => (
              <button key={flight.id} className="student-item" type="button" onClick={() => void selectFlight(flight.id)}>
                <div className="student-item-top">
                  <strong>
                    {flight.airline} {flight.flightNumber}
                  </strong>
                  <span>{formatInr(flight.cabinAvailability[search.cabin].fare)}</span>
                </div>
                <div className="student-text">
                  {flight.origin?.code} to {flight.destination?.code}
                </div>
                <div className="student-text">
                  {flight.departureTime} - {flight.arrivalTime} | {flight.durationLabel}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card student-card">
          <p className="eyebrow">Booking</p>

          {/* If no flight is selected, tell the user what to do next */}
          {!selectedFlight ? <p className="student-text">Select a flight to continue.</p> : null}

          {selectedFlight ? (
            <>
              {/* Selected flight details */}
              <h2>
                {selectedFlight.airline} {selectedFlight.flightNumber}
              </h2>
              <p className="student-text">
                {selectedFlight.origin?.code} to {selectedFlight.destination?.code}
              </p>

              <div className="student-grid">
                <label>
                  <span>Seat</span>
                  <select value={booking.seatId} onChange={(event) => setBooking({ ...booking, seatId: event.target.value })}>
                    <option value="">Choose a seat</option>
                    {availableSeats.map((seat) => (
                      <option key={seat.id} value={seat.id}>
                        {seat.id} - {formatInr(seat.priceModifier)}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>First name</span>
                  <input value={booking.firstName} onChange={(event) => setBooking({ ...booking, firstName: event.target.value })} />
                </label>

                <label>
                  <span>Last name</span>
                  <input value={booking.lastName} onChange={(event) => setBooking({ ...booking, lastName: event.target.value })} />
                </label>

                <label>
                  <span>Email</span>
                  <input type="email" value={booking.email} onChange={(event) => setBooking({ ...booking, email: event.target.value })} />
                </label>

                <label>
                  <span>Checked bags</span>
                  <select
                    value={booking.checkedBags}
                    onChange={(event) => setBooking({ ...booking, checkedBags: Number(event.target.value) })}
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </label>

                <label className="student-check">
                  <input
                    type="checkbox"
                    checked={booking.priorityBoarding}
                    onChange={(event) => setBooking({ ...booking, priorityBoarding: event.target.checked })}
                  />
                  <span>Priority boarding</span>
                </label>

                <button className="primary-button simple-button" type="button" onClick={() => void createBooking()}>
                  Confirm Booking
                </button>
              </div>
            </>
          ) : null}

          {/* Booking status messages */}
          {bookingError ? <p className="error-banner plain-message">{bookingError}</p> : null}
          {bookingResult ? (
            <p className="success-banner plain-message">
              Booking confirmed. PNR {bookingResult.pnr} | Total {formatInr(bookingResult.totalPrice)}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function tomorrowIsoDate(): string {
  // Returns tomorrow's date in YYYY-MM-DD format for the default search.
  const value = new Date();
  value.setDate(value.getDate() + 1);
  return formatDateForApi(value);
}

function formatDateForApi(value: Date): string {
  const year = value.getFullYear();
  const month = (value.getMonth() + 1).toString().padStart(2, "0");
  const day = value.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatInr(value: number): string {
  // Format numbers like 12500 -> INR 12,500
  return `INR ${value.toLocaleString("en-IN")}`;
}
