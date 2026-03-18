import { type SchemaTypeDefinition } from "sanity";
import { startseite } from "./startseite";
import { tools } from "./tools";
import { artikel } from "./artikel";
import { testimonials } from "./testimonials";

export const schemaTypes: SchemaTypeDefinition[] = [
  startseite,
  tools,
  artikel,
  testimonials,
];
