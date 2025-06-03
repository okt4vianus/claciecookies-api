import { z } from "zod";

export const SearchQuerySchema = z.object({
  q: z.string(), //query string
});
