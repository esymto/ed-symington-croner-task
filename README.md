# Ed Symington Croner Technical Task

[Live Demo](https://esymto.github.io/ed-symington-croner-task)

## Features

- Uses TanStack Router, Query & Table
- Table sorting and pagination state persists in URL/browser history
- Indicates whether an absence has conflicts
- Table sortable by employee name, dates and absence type
- End date calculation excludes weekends (start date + days absent skipping weekend days)
- Uses Zod to validate API data and URL parameters
- Styled to reflect actual BrightHR branding
- Responsive across screen sizes
- Shows an animated loading skeleton while fetching data
- Tests table sorting and pagination using Vitest with React Testing Library running in jsdom. Each test renders the page through the actual router with mocked API data, then checks the row order, the pagination label, aria-sort values and URL search parameters.

## What I'd Do With More Time

- Add an option to sort employee names by last name
- Add options to include weekend days or different shift patterns to more accurately calculate absence end dates
- Improve colour contrast to optimize accessibility
- Improve error styling
- Server-side render components to improve performance and SEO
- Add animated loading skeletons to the conflicts column
- Add unit tests for the Zod schemas

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 22 (22.12 or later) or 24+
- npm (comes with Node.js)

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/esymto/ed-symington-croner-task.git
cd ed-symington-croner-task
npm install
```

### Running locally

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command           | Description                                         |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the development server with hot reload        |
| `npm run build`   | Type-check and build for production into `dist/`    |
| `npm run preview` | Serve the production build locally                  |
| `npm test`        | Run the tests in watch mode                         |
| `npm run lint`    | Lint the code with Oxlint                           |

To run the tests once:

```bash
npx vitest run
```

## Deployment

Every push to `main` builds the app and deploys it to GitHub Pages using the workflow in `.github/workflows/deploy.yml`.
