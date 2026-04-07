import { type SchemaTypeDefinition } from "sanity";
import { startseite } from "./startseite";
import { tools } from "./tools";
import { artikel } from "./artikel";
import { testimonials } from "./testimonials";
import { workshop } from "./workshop";
import { beratung } from "./beratung";
import { zuhoeren } from "./zuhoeren";
import { ueberMich } from "./ueberMich";

export const schemaTypes: SchemaTypeDefinition[] = [
  startseite,
  tools,
  artikel,
  testimonials,
  workshop,
  beratung,
  zuhoeren,
  ueberMich,
];
