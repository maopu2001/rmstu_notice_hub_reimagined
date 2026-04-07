# RMSTU Notice Hub

RMSTU Notice Hub is a web app that collects and presents official RMSTU notices in a cleaner, faster browsing experience.

The app is built with TanStack Start, fetches notice data on the server, and supports notice categories, pagination, detail pages, PDF viewing, and dark/light theme switching.

## Features

- Home page with quick links to notice categories
- Category-wise notice listing (News, Events, General Notices, Academic Notices)
- Server-side scraping and parsing of notice pages
- Notice detail page with title, publish date, image, text, and optional PDF
- Pagination for notice list pages
- Route loading states
- Theme toggle with local storage persistence and no page-transition flash

## Tech Stack

- React 19
- TanStack Start + TanStack Router
- TanStack Query
- Tailwind CSS v4 + shadcn/ui style components
- Cheerio for HTML parsing on the server
- react-pdf for in-app PDF rendering
- TypeScript + ESLint + Prettier + Vitest

## Requirements

- Node.js 20+
- pnpm 9+

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_EXTERNAL_LINK=https://rmstu.ac.bd
VITE_APP_TITLE=RMSTU Notice Hub
```

Notes:

- `VITE_EXTERNAL_LINK` is required by server functions that fetch notice list/details.
- `VITE_APP_TITLE` is optional and can be used in the app where needed.

## Run Locally

```bash
pnpm install
pnpm dev
```

By default, Vite starts on port `3000`. If the port is busy, it will pick the next available port.

## Available Scripts

```bash
pnpm dev      # Start dev server
pnpm build    # Build for production
pnpm start    # Run built server (PORT=8080)
pnpm preview  # Preview Vite build
pnpm test     # Run tests once with Vitest
pnpm lint     # Run ESLint
pnpm format   # Check formatting with Prettier
pnpm check    # Write Prettier fixes + run ESLint --fix
```

## Project Structure

```text
src/
  components/
    Header.tsx
    Footer.tsx
    Loading.tsx
    PDFViewer.tsx
    ThemeToggle.tsx
    ui/
  lib/
    noticeTitle.ts
    utils.ts
  routes/
    __root.tsx
    index.tsx
    notices/
      $typeID.tsx
      $typeID.$postID.tsx
  server/
    notices.ts
  router.tsx
  styles.css
```

## Routing Overview

- `/` home page
- `/notices/$typeID` notice list by category with pagination
- `/notices/$typeID/$postID` notice detail page

Internal navigation uses TanStack Router links for SPA transitions.

## How Data Fetching Works

Server functions in `src/server/notices.ts` fetch and parse HTML from RMSTU pages:

- `getAllNotices` fetches notice lists by category and page
- `getNotice` fetches one notice detail
- If a PDF is present, it is fetched and converted to base64 for viewing

Routes call these server functions via route loaders.

## PDF Viewer Notes

The PDF viewer loads `react-pdf` dynamically on the client. This avoids server runtime errors such as `DOMMatrix is not defined` during SSR module evaluation.

## Troubleshooting

### Theme flicker on navigation

Theme class is initialized early in the root document and links use SPA routing. If you reintroduce regular internal `<a href="/...">` navigation, page reloads can bring back flicker.

### No notices are loading

- Confirm `.env` exists and `VITE_EXTERNAL_LINK` is correct.
- Check if the external RMSTU page structure changed (selectors in `src/server/notices.ts` may need updates).

### Dev server not on port 3000

If port 3000 is already in use, Vite automatically starts on the next free port.

## Maintainer

Developed by M. Aktaruzzaman Opu.
