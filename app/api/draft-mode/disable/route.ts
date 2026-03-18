import { draftMode } from "next/headers";

// Called by the VisualEditing component's "Exit preview" button
export async function GET(request: Request): Promise<Response> {
  const { origin } = new URL(request.url);
  (await draftMode()).disable();
  return Response.redirect(origin);
}
