import type { BookingRecord, CabinClass, FlightDetail } from "../types";

interface PassengerFormState {
  firstName: string;
  lastName: string;
  email: string;
  checkedBags: number;
  priorityBoarding: boolean;
}

interface BookingPanelProps {
  flight: FlightDetail | null;
  cabin: CabinClass;
  passengers: number;
  selectedSeatId: string;
  booking: BookingRecord | null;
  bookingError: string | null;
  bookingInFlight: boolean;
  form: PassengerFormState;
  onSeatSelect: (seatId: string) => void;
  onFormChange: (field: keyof PassengerFormState, value: string | number | boolean) => void;
  onBook: () => void;
}

export function BookingPanel({
  flight,
  cabin,
  passengers,
  selectedSeatId,
  booking,
  bookingError,
  bookingInFlight,
  form,
  onSeatSelect,
  onFormChange,
  onBook,
}: BookingPanelProps) {
  if (!flight) {
    return (
      <aside className="booking-panel glass-card">
        <span className="eyebrow">Booking</span>
        <h2>Select a flight to continue.</h2>
        <p className="panel-copy">After selecting a flight, you can choose a seat and fill passenger details here.</p>
      </aside>
    );
  }

  const seats = flight.seatMap.filter((seat) => seat.cabin === cabin);
  const selectedSeat = seats.find((seat) => seat.id === selectedSeatId) ?? null;
  const baseFare = flight.cabinAvailability[cabin].fare;
  const extrasTotal = form.checkedBags * 1200 + (form.priorityBoarding ? 600 : 0);
  const estimatedTotal = baseFare + (selectedSeat?.priceModifier ?? 0) + extrasTotal;

  return (
    <aside className="booking-panel glass-card">
      <div className="panel-header sticky-header">
        <div>
          <span className="eyebrow">Booking</span>
          <h2>
            {flight.airline} {flight.flightNumber}
          </h2>
        </div>
        <div className="fare-pill accent">{formatInr(estimatedTotal)}</div>
      </div>

      <div className="mini-itinerary">
        <div>
          <strong>{flight.departureTime}</strong>
          <span>{flight.origin?.code}</span>
        </div>
        <div className="timeline-line solid" />
        <div>
          <strong>{flight.arrivalTime}</strong>
          <span>{flight.destination?.code}</span>
        </div>
      </div>

      {passengers > 1 ? (
        <div className="inline-notice">
          This demo books one passenger at a time.
        </div>
      ) : null}

      <div className="seat-section">
        <div className="section-heading">
          <div>
            <h3>{cabinLabel(cabin)} seat map</h3>
            <span>{seats.filter((seat) => seat.isAvailable).length} seats still open</span>
          </div>
          <div className="seat-legend">
            <span className="legend-dot available" /> Available
            <span className="legend-dot selected" /> Selected
            <span className="legend-dot taken" /> Taken
          </div>
        </div>

        <div className="seat-map">
          {seats.map((seat) => (
            <button
              key={seat.id}
              type="button"
              className={`seat-button ${seat.id === selectedSeatId ? "is-selected" : ""} ${!seat.isAvailable ? "is-disabled" : ""}`}
              onClick={() => onSeatSelect(seat.id)}
              disabled={!seat.isAvailable}
            >
              <strong>{seat.id}</strong>
              <span>
                {seat.isExtraLegroom || seat.priceModifier > 0 ? `+${formatNumber(seat.priceModifier)}` : "Included"}
              </span>
            </button>
          ))}
        </div>

        <div className="seat-detail-card">
          <strong>{selectedSeat ? `Seat ${selectedSeat.id}` : "Choose a seat"}</strong>
          <span>
            {selectedSeat ? `${selectedSeat.zoneLabel} seat selected` : "Seat price is shown on each seat."}
          </span>
        </div>
      </div>

      <div className="form-grid">
        <label>
          <span>First name</span>
          <input value={form.firstName} onChange={(event) => onFormChange("firstName", event.target.value)} />
        </label>
        <label>
          <span>Last name</span>
          <input value={form.lastName} onChange={(event) => onFormChange("lastName", event.target.value)} />
        </label>
        <label className="full-width">
          <span>Email address</span>
          <input type="email" value={form.email} onChange={(event) => onFormChange("email", event.target.value)} />
        </label>
        <label>
          <span>Checked bags</span>
          <select value={form.checkedBags} onChange={(event) => onFormChange("checkedBags", Number(event.target.value))}>
            <option value={0}>0 bags</option>
            <option value={1}>1 bag</option>
            <option value={2}>2 bags</option>
          </select>
        </label>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={form.priorityBoarding}
            onChange={(event) => onFormChange("priorityBoarding", event.target.checked)}
          />
          <span>Priority boarding</span>
        </label>
      </div>

      <div className="price-card">
        <div>
          <span>Base fare</span>
          <strong>{formatInr(baseFare)}</strong>
        </div>
        <div>
          <span>Seat charge</span>
          <strong>{formatInr(selectedSeat?.priceModifier ?? 0)}</strong>
        </div>
        <div>
          <span>Add-ons</span>
          <strong>{formatInr(extrasTotal)}</strong>
        </div>
        <div className="total-row">
          <span>Total</span>
          <strong>{formatInr(estimatedTotal)}</strong>
        </div>
      </div>

      {bookingError ? <div className="error-banner">{bookingError}</div> : null}

      {booking ? (
        <div className="success-banner">
          <strong>Booking confirmed</strong>
          <span>
            PNR {booking.pnr} for seat {booking.seatId}. Total: {formatInr(booking.totalPrice)}.
          </span>
        </div>
      ) : null}

      <button className="primary-button booking-button" type="button" onClick={onBook} disabled={bookingInFlight}>
        {bookingInFlight ? "Booking..." : "Confirm Booking"}
      </button>
    </aside>
  );
}

function cabinLabel(cabin: CabinClass): string {
  if (cabin === "premium-economy") {
    return "Premium Economy";
  }

  return cabin.charAt(0).toUpperCase() + cabin.slice(1);
}

function formatInr(value: number): string {
  return `INR ${value.toLocaleString("en-IN")}`;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-IN");
}

export type { PassengerFormState };
