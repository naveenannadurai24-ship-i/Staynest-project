# StayNest Backend

A small reference API for the StayNest frontend: listings, reviews, and
bookings. It's not connected to the frontend automatically — the frontend
currently uses its own built-in data (`data.js`) so it works by just
double-clicking `index.html`. Wire them together only when you're ready
(see "Connecting the frontend" below).

## Requirements
- [Node.js](https://nodejs.org) 18 or newer (includes `npm`)

## Run it

Open a terminal **inside the `backend` folder** (not the project root) and run:

```
npm install
npm start
```

You should see:

```
StayNest backend running at http://localhost:4000
```

Leave that terminal window open — closing it stops the server.

## Endpoints

| Method | Route                          | What it does                          |
|--------|---------------------------------|----------------------------------------|
| GET    | `/api/listings`                 | All listings (filter with `?city=`, `?gender=`, `?maxPrice=`, `?area=`) |
| GET    | `/api/listings/:id`             | One listing                           |
| POST   | `/api/listings/:id/reviews`     | Add a review `{ name, rating, comment }` |
| POST   | `/api/bookings`                 | Create a booking record               |
| GET    | `/api/bookings/:id`             | Look up a booking                     |

Data is stored in `db.json` (created automatically on first run), so it
survives restarts without needing to install a real database.

## Connecting the frontend

Right now `app.js` reads listings from the hardcoded `window.LISTINGS` in
`data.js`. To make it fetch from this backend instead, replace that with:

```js
fetch("http://localhost:4000/api/listings")
  .then(res => res.json())
  .then(listings => { window.LISTINGS = listings; render(); });
```

and call it once before the first `render()` runs.

## Important: payments

This backend's `/api/bookings` endpoint only **records** a booking — it does
not process real money. Card numbers must never reach your own server or
database. For real payments, integrate a licensed gateway such as
[Razorpay](https://razorpay.com), Stripe, or PayU on the server side, and
have your frontend call their SDK/checkout directly.

## Going to production

For a real deployment you'd typically swap `db.json` for a proper database
(PostgreSQL, MongoDB, etc.), add authentication, and host this on a service
like Render, Railway, or a VPS — happy to help with any of those next.
