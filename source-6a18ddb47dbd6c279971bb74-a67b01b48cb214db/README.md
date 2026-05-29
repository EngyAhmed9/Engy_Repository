# Amal & Mohamed Wedding Invitation

A digital wedding invitation for Amal & Mohamed, celebrating their marriage on **July 17, 2026**.

## Features

- Animated envelope reveal — tap the wax seal to open the invitation
- Live countdown timer to the wedding day
- Elegant gold-and-cream design with falling petal animation
- Responsive layout for mobile and desktop
- Quranic verse, venue placeholder, and RSVP section

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — React SSR framework
- [Tailwind CSS v4](https://tailwindcss.com/) + custom CSS
- [Netlify](https://netlify.com) — hosting & deployment

## Running Locally

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`.

## Customization

- **Venue**: Edit `src/routes/index.tsx` — find the `.venue-wrap` section and update the venue name/detail text. Uncomment the map link when ready.
- **RSVP**: Replace the disabled button with an `<a>` tag pointing to a Google Form or RSVP service.
- **Wedding time**: Update the `WEDDING_DATE` constant at the top of `src/routes/index.tsx`.
