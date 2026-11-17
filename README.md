# DMP Services — Astro website (AlphaWave theme)

Website of DMP Services, built on the AlphaWave theme for [Astro](https://astro.build). Blog posts, services, jobs and companies are stored in JSON files in `src/data/`, so the whole site is managed from this repository: no CMS, no database, no server.

- 12 pages: Home, About, Services, Jobs, Blogs, Contact, Style Guide, Licenses, Changelog, Instructions, Password and 404
- Detail pages generated from the JSON files: `/blog/[slug]`, `/job/[slug]`, `/service/[slug]`
- Page-load, scroll and hover animations (GSAP), smooth scrolling (Lenis), sliders, FAQ accordions and a mobile menu
- Static output: no server needed in production, the site is rebuilt when content changes

## Requirements

- Node.js 22.23.4 or newer
- npm (any package manager works; the scripts below use npm)

## Quick start

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # static site in dist/
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PUBLIC_FORM_ENDPOINT` | no | URL that receives form submissions (Formspree, Basin, Getform or your own API). Without it, forms show their success message but send nothing. |

Copy `.env.example` to `.env` to set it locally.

## Project structure

```text
├── public/
│   ├── images/            # theme images, icons and favicons
│   │   ├── blog/          # blog post images
│   │   ├── services/      # service images and icons
│   │   └── companies/     # company logos (jobs)
│   ├── documents/         # Lottie animations
│   └── js/                # interaction runtime (webflow.js) and jQuery
├── src/
│   ├── components/
│   │   ├── cards/         # BlogCard, JobCard, ServiceCard, EmptyState
│   │   ├── layout/        # Header, Footer
│   │   ├── sections/      # page sections, one folder per page (+ shared)
│   │   ├── ui/            # buttons, social icons
│   │   └── SeoMeta.astro
│   ├── config/            # config.json, menu.json, social.json
│   ├── data/              # content: blog.json, services.json, jobs.json, companies.json
│   ├── layouts/           # BaseLayout
│   ├── lib/               # content queries, Webflow helpers
│   ├── pages/             # routes, including blog/, job/ and service/ [slug] pages
│   ├── scripts/           # animations and forms (client side)
│   ├── styles/            # theme CSS
│   └── content.config.ts  # content collections (schemas of the JSON files)
```

## Content (`src/data`)

Each file is an array of entries. The `slug` of an entry is its id and its URL (`/blog/<slug>`, `/job/<slug>`, `/service/<slug>`), so it must be unique, lowercase and without spaces. The fields are validated by the schemas in `src/content.config.ts`, so a mistake stops the build instead of publishing a broken page: a JSON syntax error names the file, line and column; a missing or wrong field names the collection, the entry and the field.

| File | Main fields | Used on |
| --- | --- | --- |
| `blog.json` | title, slug, excerpt, publishedDate, category, featured, mainImage, author (name, role, photo), body, gallery, bodyContinued | Home, About and Services sliders; Blogs page; article pages |
| `jobs.json` | title, slug, **company** (slug of a company), location, jobType, workMode, department, experience, monthlySalary, salaryRange, postedDate, featuredOnHome, showInRelated, shortSummary, overview, responsibilities, requiredQualifications, niceToHave, whatWeOffer, contactEmail, contactPhone | Home; Jobs page; job pages |
| `companies.json` | name, slug, companyType, logo, website, industry, employees, location | Job cards and job pages |
| `services.json` | name, slug, cardTitle, sortOrder, shortDescription, icon, mainImage, detailsImage, offerings, price, priceUnit, priceNote, author, overview, stats, overviewContinued | Home slider; Services page; service pages |

Formats:

- **Images**: `{ "url": "/images/blog/photo.webp", "alt": "Description of the photo" }`. Put the file in `public/images/` (the `url` starts after `public`).
- **Dates**: ISO format, e.g. `"2026-06-05"` or `"2026-06-05T09:00:00.000Z"`.
- **Rich text** (body, overview, responsibilities...): an array of HTML lines, joined in order. Use `<p>`, `<h2>`, `<h3>`, `<strong>`, lists (`"<ul>"`, one `"<li>...</li>"` per line, `"</ul>"`) and images (`"<figure class='w-richtext-align-fullwidth w-richtext-figure-type-image'><div><img src='/images/blog/photo.webp' alt='...'></div></figure>"`). Use single quotes inside the HTML so the JSON stays readable.
- **Jobs and companies**: the `company` of a job is the `slug` of an entry in `companies.json`. The build stops with a clear message if that company does not exist.

Which entries appear where:

- Home, About and Services sliders: the 6 latest blog posts
- Blogs page: featured posts (top) and all other posts (grid); articles show the featured posts below the text
- Home: jobs with `"featuredOnHome": true` (3, newest first); Jobs page: the 12 latest jobs; job pages: jobs with `"showInRelated": true` (4)
- Services: all services by `sortOrder`; service pages show the first two

The queries live in `src/lib/content.ts`.

### Publishing changes

The site is static: edit a JSON file, then rebuild (`npm run build`) and deploy. In development the dev server reloads a JSON file as soon as it is saved. When the host (Vercel, Netlify...) is connected to the git repository, pushing the change triggers the new deploy.

## Customization

- **Site settings, SEO defaults, footer text**: `src/config/config.json`
- **Navigation**: `src/config/menu.json`; **social links**: `src/config/social.json`
- **Page titles and descriptions**: the `BaseLayout` props in each file in `src/pages`
- **Colors, spacing and typography**: the CSS variables at the top of `src/styles/alphawave.css`
- **Fonts**: `fonts` in `astro.config.mjs` (self-hosted by Astro)
- **Forms**: set `PUBLIC_FORM_ENDPOINT`; the handler is `src/scripts/forms.ts`

### Animations

Animations are attached with attributes such as `page-load-1`, `hero-title`, `section-title` and `Reveal-anim-2`. They are played by the interaction runtime in `public/js/webflow.js`, which also runs the sliders, dropdowns, lightbox, mobile menu and Lottie animations. Each page passes its `wfPage` id to `BaseLayout`; keep it when you edit a page, because the runtime uses it to load that page's animations.

## Deployment

Build with `npm run build` and deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages...). Set `site.base_url` in `src/config/config.json` to your domain.

## Credits

Fonts, photos and icons are listed on the Licenses page.

## Troubleshooting

- **Build fails with a content error**: the message names the JSON file and the line (syntax error), or the entry and the field (missing or wrong value). Check the commas between fields and entries, the double quotes around keys and values, and the required fields.
- **An entry does not appear**: check that its `slug` is unique, and for the Home lists check `featuredOnHome` (jobs) or `featured` (blog).
- **An image does not show**: its `url` must match a file in `public/` (`/images/blog/photo.webp` is `public/images/blog/photo.webp`), with the same upper and lower case.
