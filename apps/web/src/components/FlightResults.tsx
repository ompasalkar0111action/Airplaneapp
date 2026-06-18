import type { CabinClass, FlightSummary } from "../types";

interface FlightResultsProps {
  flights: FlightSummary[];
  selectedFlightId: string | null;
  cabin: CabinClass;
  isLoading: boolean;
  sortBy: "departure" | "price" | "duration";
  maxStops: 0 | 1;
  onSelect: (flightId: string) => void;
  onSortChange: (sortBy: "departure" | "price" | "duration") => void;
  onMaxStopsChange: (maxStops: 0 | 1) => void;
}

export function FlightResults({
  flights,
  selectedFlightId,
  cabin,
  isLoading,
  sortBy,
  maxStops,
  onSelect,
  onSortChange,
  onMaxStopsChange,
}: FlightResultsProps) {
  return (
    <section className="results-panel glass-card">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Flights</span>
          <h2>{flights.length} flights found</h2>
        </div>

        <div className="toolbar">
          <label>
            <span>Sort</span>
            <select value={sortBy} onChange={(event) => onSortChange(event.target.value as "departure" | "price" | "duration")}>
              <option value="departure">Departure</option>
              <option value="price">Price</option>
              <option value="duration">Fastest</option>
            </select>
          </label>

          <label>
            <span>Stops</span>
            <select value={maxStops} onChange={(event) => onMaxStopsChange(Number(event.target.value) as 0 | 1)}>
              <option value={1}>Any</option>
              <option value={0}>Non-stop only</option>
            </select>
          </label>
        </div>
      </div>

      {isLoading ? <div className="empty-state">Loading flights...</div> : null}

      {!isLoading && flights.length === 0 ? (
        <div className="empty-state">No flights found for this search.</div>
      ) : null}

      <div className="results-list">
        {flights.map((flight, index) => {
          const cabinOffer = flight.cabinAvailability[cabin];
          const isSelected = selectedFlightId === flight.id;

          return (
            <button
              key={flight.id}
              className={`flight-card ${isSelected ? "is-selected" : ""}`}
              type="button"
              onClick={() => onSelect(flight.id)}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flight-card-top">
                <div>
                  <div className="flight-brand">
                    <strong>{flight.airline}</strong>
                    <span>{flight.flightNumber}</span>
                  </div>
                  <div className="flight-route">
                    {flight.origin?.code} to {flight.destination?.code}
                  </div>
                </div>

                <div className="fare-pill">{formatInr(cabinOffer.fare)}</div>
              </div>

              <div className="timeline">
                <div>
                  <strong>{flight.departureTime}</strong>
                  <span>{flight.origin?.city}</span>
                </div>
                <div className="timeline-center">
                  <span>{flight.durationLabel}</span>
                  <div className="timeline-line" />
                  <small>{flight.stops === 0 ? "Non-stop" : `1 stop via ${flight.stopoverAirport?.code}`}</small>
                </div>
                <div>
                  <strong>{flight.arrivalTime}</strong>
                  <span>{flight.destination?.city}</span>
                </div>
              </div>

              <div className="meta-row">
                <span>{cabinLabel(cabin)} seats left: {cabinOffer.seatsLeft}</span>
                <span>{flight.aircraft}</span>
              </div>

              <div className="chip-row">
                {flight.amenities.slice(0, 3).map((amenity) => (
                  <span key={amenity} className="chip">
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="reliability-strip">{flight.reliability}</div>
            </button>
          );
        })}
      </div>
    </section>
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
