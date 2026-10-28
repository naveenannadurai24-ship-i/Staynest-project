const express = require("express");
const { load, save } = require("../db");

const router = express.Router();

// GET /api/listings — optional query filters: ?city=Pune&gender=female&maxPrice=10000
router.get("/", (req, res) => {
  const db = load();
  let results = db.listings;
  const { city, gender, maxPrice, area } = req.query;

  if(city) results = results.filter(l => l.city.toLowerCase() === city.toLowerCase());
  if(gender && gender !== "any") results = results.filter(l => l.gender === gender);
  if(maxPrice) results = results.filter(l => l.rent <= Number(maxPrice));
  if(area) results = results.filter(l => l.location.toLowerCase().includes(area.toLowerCase()));

  res.json(results);
});

// GET /api/listings/:id
router.get("/:id", (req, res) => {
  const db = load();
  const listing = db.listings.find(l => l.id === req.params.id);
  if(!listing) return res.status(404).json({ error: "Listing not found" });
  res.json(listing);
});

// POST /api/listings/:id/reviews  { name, rating, comment }
router.post("/:id/reviews", (req, res) => {
  const db = load();
  const listing = db.listings.find(l => l.id === req.params.id);
  if(!listing) return res.status(404).json({ error: "Listing not found" });

  const { name, rating, comment } = req.body;
  if(!name || !rating || !comment){
    return res.status(400).json({ error: "name, rating and comment are required" });
  }

  const review = {
    name,
    rating: Math.max(1, Math.min(5, Number(rating))),
    comment,
    date: new Date().toISOString().slice(0, 10)
  };
  listing.reviewsList.unshift(review);
  listing.reviews = listing.reviewsList.length;
  listing.rating = Number(
    (listing.reviewsList.reduce((s, r) => s + r.rating, 0) / listing.reviewsList.length).toFixed(1)
  );

  save(db);
  res.status(201).json(review);
});

module.exports = router;
