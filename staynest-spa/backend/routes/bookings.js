const express = require("express");
const { load, save } = require("../db");

const router = express.Router();

// POST /api/bookings
// { listingId, roomType, rent, deposit, contact: { name, email, phone }, paymentMethod }
router.post("/", (req, res) => {
  const db = load();
  const { listingId, roomType, rent, deposit, contact, paymentMethod } = req.body;

  const listing = db.listings.find(l => l.id === listingId);
  if(!listing) return res.status(404).json({ error: "Listing not found" });

  const booking = {
    id: "SN" + Math.random().toString(36).slice(2, 9).toUpperCase(),
    listingId,
    listingName: listing.name,
    roomType,
    rent,
    deposit,
    total: Number(rent) + Number(deposit),
    contact: contact || {},
    paymentMethod: paymentMethod || "unspecified",
    // IMPORTANT: this endpoint only records the booking request.
    // Real payment capture must happen through a licensed gateway
    // (Razorpay/Stripe/PayU) server-side — never store card numbers here.
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  db.bookings.push(booking);
  save(db);
  res.status(201).json(booking);
});

// GET /api/bookings/:id
router.get("/:id", (req, res) => {
  const db = load();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if(!booking) return res.status(404).json({ error: "Booking not found" });
  res.json(booking);
});

module.exports = router;
