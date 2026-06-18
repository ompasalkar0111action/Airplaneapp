import type { Airport, CabinClass, SearchRequest } from "../types";

interface SearchPanelProps {
  airports: Airport[];
  form: SearchRequest;
  isLoading: boolean;
  onChange: (field: keyof SearchRequest, value: string | number | CabinClass) => void;
  onSubmit: () => void;
}

export function SearchPanel({ airports, form, isLoading, onChange, onSubmit }: SearchPanelProps) {
  return (
    <section className="hero-card glass-card">
      <div className="eyebrow">Simple Flight Booking App</div>
      <h1>Search flights, choose a seat, and book your ticket.</h1>
      <p className="hero-copy">This project shows a simple flight booking flow for a college project demo.</p>

      <div className="stats-grid">
        <article>
          <strong>Search</strong>
          <span>select route, date, cabin and passengers</span>
        </article>
        <article>
          <strong>Select</strong>
          <span>pick a flight and choose your seat</span>
        </article>
        <article>
          <strong>Book</strong>
          <span>enter details and get a booking confirmation</span>
        </article>
      </div>

      <div className="search-shell">
        <div className="search-grid">
          <label>
            <span>From</span>
            <select value={form.origin} onChange={(event) => onChange("origin", event.target.value)}>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.city} ({airport.code})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>To</span>
            <select value={form.destination} onChange={(event) => onChange("destination", event.target.value)}>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.city} ({airport.code})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Departure</span>
            <input type="date" value={form.date} onChange={(event) => onChange("date", event.target.value)} />
          </label>

          <label>
            <span>Cabin</span>
            <select value={form.cabin} onChange={(event) => onChange("cabin", event.target.value as CabinClass)}>
              <option value="economy">Economy</option>
              <option value="premium-economy">Premium Economy</option>
              <option value="business">Business</option>
            </select>
          </label>

          <label>
            <span>Travelers</span>
            <input
              type="number"
              min={1}
              max={9}
              value={form.passengers}
              onChange={(event) => onChange("passengers", Number(event.target.value))}
            />
          </label>
        </div>

        <button className="primary-button" type="button" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : "Search Flights"}
        </button>
      </div>
    </section>
  );
}
