import slugify from "slugify";

export function createNewSlug(text: string): string {
  return slugify(text, { lower: true });
}
