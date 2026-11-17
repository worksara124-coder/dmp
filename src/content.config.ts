/**
 * Content collections, one JSON file per category in src/data:
 *   blog.json       blog posts
 *   services.json   services
 *   jobs.json       job offers ("company" holds the slug of an entry in companies.json)
 *   companies.json  companies that publish the jobs
 *
 * Each file is an array of entries; the "slug" of an entry is its id and its URL.
 * The dev server reloads a file as soon as it is saved. Images are paths in /public,
 * e.g. { "url": "/images/blog/photo.webp", "alt": "Description of the photo" }.
 */
import { readFile } from 'node:fs/promises';
import { defineCollection, reference } from 'astro:content';
import { file, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Astro's file() loader, except that a JSON syntax error stops the build:
 * file() alone only logs it and would publish the site with an empty list.
 */
function jsonFile(fileName: string): Loader {
  const loader = file(fileName);
  return {
    ...loader,
    load: async (context) => {
      const text = await readFile(new URL(fileName, context.config.root), 'utf8');
      try {
        JSON.parse(text);
      } catch (error) {
        throw new Error(`${fileName} n'est pas un JSON valide : ${(error as Error).message}`);
      }
      await loader.load(context);
    },
  };
}

// ---------- shared shapes

const imageSchema = z.object({
  url: z.string(),
  alt: z.string().default(''),
});

// Rich text: an array of HTML lines (paragraphs, headings, list items, images), joined in order
const richTextSchema = z
  .array(z.string())
  .default([])
  .transform((lines) => lines.join(''));

const personSchema = z.object({
  name: z.string(),
  role: z.string().nullable().default(null),
  photo: imageSchema.nullable().default(null),
});

// ---------- collections

const blog = defineCollection({
  loader: jsonFile('src/data/blog.json'),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    publishedDate: z.coerce.date(),
    category: z.string().nullable().default(null),
    featured: z.boolean().default(false),
    mainImage: imageSchema,
    author: personSchema,
    body: richTextSchema,
    gallery: z.array(imageSchema).default([]),
    bodyContinued: richTextSchema,
  }),
});

const companies = defineCollection({
  loader: jsonFile('src/data/companies.json'),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    companyType: z.string().default(''),
    logo: imageSchema.nullable().default(null),
    website: z.string().default(''),
    industry: z.string().default(''),
    employees: z.string().default(''),
    location: z.string().default(''),
  }),
});

const jobs = defineCollection({
  loader: jsonFile('src/data/jobs.json'),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    company: reference('companies'),
    location: z.string(),
    jobType: z.string(),
    workMode: z.string(),
    department: z.string(),
    experience: z.string(),
    monthlySalary: z.string(),
    salaryRange: z.string(),
    postedDate: z.coerce.date(),
    featuredOnHome: z.boolean().default(false),
    showInRelated: z.boolean().default(false),
    shortSummary: z.string(),
    overview: richTextSchema,
    responsibilities: richTextSchema,
    requiredQualifications: richTextSchema,
    niceToHave: richTextSchema,
    whatWeOffer: richTextSchema,
    contactEmail: z.string().default(''),
    contactPhone: z.string().default(''),
  }),
});

const services = defineCollection({
  loader: jsonFile('src/data/services.json'),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    cardTitle: z.string(),
    sortOrder: z.number().default(0),
    shortDescription: z.string(),
    icon: imageSchema,
    mainImage: imageSchema,
    detailsImage: imageSchema.nullable().default(null),
    offerings: z.array(z.string()).default([]),
    price: z.string().default(''),
    priceUnit: z.string().default(''),
    priceNote: z.string().default(''),
    author: personSchema.nullable().default(null),
    overview: richTextSchema,
    stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    overviewContinued: richTextSchema,
  }),
});

export const collections = { blog, companies, jobs, services };
