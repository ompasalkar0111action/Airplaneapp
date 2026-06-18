import { airports, type Airport } from "../../data/catalog.js";

export class AirportsRepository {
  list(): Airport[] {
    // Return airports sorted by city so dropdowns look neat.
    return [...airports].sort((left, right) => left.city.localeCompare(right.city));
  }

  findByCode(code: string): Airport | undefined {
    // Find one airport using its short code like DEL or DXB.
    return airports.find((airport) => airport.code === code);
  }
}
