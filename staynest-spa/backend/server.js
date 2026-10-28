const express = require("express");
const cors = require("cors");

const listingsRouter = require("./routes/listings");
const bookingsRouter = require("./routes/bookings");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "StayNest API is running" });
});

app.use("/api/listings", listingsRouter);
app.use("/api/bookings", bookingsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`StayNest backend running at http://localhost:${PORT}`);
});
