import { flightTemplates, type FlightTemplate } from "../../data/catalog.js";

export class FlightsRepository {
  listTemplates(): FlightTemplate[] {
    // Return all raw flight templates.
    return flightTemplates;
  }

  findTemplateById(templateId: string): FlightTemplate | undefined {
    // Return one flight template by its id.
    return flightTemplates.find((template) => template.id === templateId);
  }
}
