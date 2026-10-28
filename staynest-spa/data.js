/* ===========================================================
   Shared data for the StayNest SPA — replace with your API
   response(s). Used by app.js for both the home grid and the
   details view.
=========================================================== */

const CITIES = [
  { name: "Bengaluru", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=400&auto=format&fit=crop" },
  { name: "Pune",      image: "https://images.unsplash.com/photo-1595921050068-2f7ae64b3a12?q=80&w=400&auto=format&fit=crop" },
  { name: "Hyderabad", image: "https://images.unsplash.com/photo-1572443413963-9a2f6f9b4bb2?q=80&w=400&auto=format&fit=crop" },
  { name: "Chennai",   image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=400&auto=format&fit=crop" },
  { name: "Gurugram",  image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=400&auto=format&fit=crop" }
];

/* Per-bed pricing for 1 to 6 sharing, generated per hostel from a
   base (single-occupancy) rent and deposit. Sharing more beds in a
   room brings the per-person rent down. */
function buildRoomOptions(baseRent, baseDeposit){
  const labels = ["Single","Double Sharing","Triple Sharing","4 Sharing","5 Sharing","6 Sharing"];
  const rentFactor    = [1, 0.72, 0.56, 0.46, 0.4, 0.35];
  const depositFactor = [1, 0.78, 0.62, 0.52, 0.46, 0.4];
  return labels.map((type, i) => ({
    type,
    beds: i + 1,
    rent: Math.round((baseRent * rentFactor[i]) / 100) * 100,
    deposit: Math.round((baseDeposit * depositFactor[i]) / 100) * 100
  }));
}

const LISTINGS = [
  {
    id: "the-banyan-nest",
    name: "The Banyan Nest",
    location: "Koramangala, Bengaluru",
    city: "Bengaluru",
    address: "4th Block, Koramangala, Bengaluru, Karnataka 560034",
    gender: "coed",
    roomType: "Double Sharing",
    rent: 9500, deposit: 15000,
    status: "available",
    rating: 4.6, reviews: 182,
    amenities: ["wifi","ac","food","laundry","bath","parking"],
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "A quiet, tree-lined PG five minutes' walk from Koramangala's 5th Block cafes and tech offices. Rooms are cleaned twice a week, and the terrace doubles as a common hangout in the evenings.",
    highlights: ["5 min walk to Koramangala 5th Block", "Power backup for common areas", "Weekly housekeeping", "CCTV-monitored entrance"],
    roomOptions: buildRoomOptions(13500, 20000),
    reviewsList: [
      { name: "Ananya R.", rating: 5, date: "Jun 2026", comment: "Warden is responsive and the food is genuinely good. Wi-Fi never drops." },
      { name: "Kabir S.", rating: 4, date: "Apr 2026", comment: "Clean rooms, a bit far from the metro but autos are cheap and easy to find." }
    ]
  },
  {
    id: "sundar-pg-women",
    name: "Sundar PG for Women",
    location: "Baner, Pune",
    city: "Pune",
    address: "Baner Road, Pune, Maharashtra 411045",
    gender: "female",
    roomType: "Single",
    rent: 12000, deposit: 20000,
    status: "filling",
    rating: 4.8, reviews: 95,
    amenities: ["wifi","food","laundry","bath"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "A women-only PG with a live-in warden and biometric entry. Home-style meals are cooked fresh twice a day, and Baner's IT parks are a short bus ride away.",
    highlights: ["Women-only, biometric entry", "Live-in warden on site", "Home-style meals, twice daily", "10 min to Baner IT park"],
    roomOptions: buildRoomOptions(12000, 20000),
    reviewsList: [
      { name: "Priya M.", rating: 5, date: "Jul 2026", comment: "Feels safe and the warden actually checks in on everyone. Food is home-style, not canteen-style." },
      { name: "Shreya K.", rating: 5, date: "May 2026", comment: "Best PG I've stayed at in Pune. Worth the slightly higher rent." }
    ]
  },
  {
    id: "urban-roots-hostel",
    name: "Urban Roots Hostel",
    location: "Gachibowli, Hyderabad",
    city: "Hyderabad",
    address: "Nanakramguda Road, Gachibowli, Hyderabad, Telangana 500032",
    gender: "male",
    roomType: "Triple Sharing",
    rent: 6800, deposit: 10000,
    status: "available",
    rating: 4.3, reviews: 211,
    amenities: ["wifi","ac","food","parking"],
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Budget-friendly shared rooms aimed at freshers and interns working near Gachibowli's IT corridor. Common areas get a fresh coat of energy from the mixed crowd of students and young professionals.",
    highlights: ["Walking distance to Gachibowli IT corridor", "Common TV lounge and foosball table", "Bike & car parking on site"],
    roomOptions: buildRoomOptions(9500, 14000),
    reviewsList: [
      { name: "Rohit V.", rating: 4, date: "Aug 2026", comment: "Good value for the price. Rooms are basic but clean, and it's genuinely close to office." },
      { name: "Divya N.", rating: 4, date: "Mar 2026", comment: "Loud common areas on weekends, but manageable. Staff is helpful." }
    ]
  },
  {
    id: "casa-verde-living",
    name: "Casa Verde Living",
    location: "Velachery, Chennai",
    city: "Chennai",
    address: "100 Feet Road, Velachery, Chennai, Tamil Nadu 600042",
    gender: "coed",
    roomType: "Double Sharing",
    rent: 8200, deposit: 12000,
    status: "full",
    rating: 4.5, reviews: 140,
    amenities: ["wifi","ac","laundry","bath"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "A compact, well-kept PG close to Velachery's shopping and transit hub. Currently full — join the waitlist and we'll notify you the moment a bed opens up.",
    highlights: ["2 min walk to Velachery MRTS station", "AC rooms with attached bath", "Waitlist notifies you on vacancy"],
    roomOptions: buildRoomOptions(11000, 16000),
    reviewsList: [
      { name: "Arjun T.", rating: 5, date: "Feb 2026", comment: "Great location, wish I'd booked earlier — now it's always full." },
      { name: "Meena S.", rating: 4, date: "Jan 2026", comment: "Quiet, well-maintained. AC could be serviced more often." }
    ]
  },
  {
    id: "the-nook-coliving",
    name: "The Nook Coliving",
    location: "Sector 48, Gurugram",
    city: "Gurugram",
    address: "Sohna Road, Sector 48, Gurugram, Haryana 122018",
    gender: "coed",
    roomType: "Single",
    rent: 14500, deposit: 25000,
    status: "available",
    rating: 4.7, reviews: 76,
    amenities: ["wifi","ac","food","laundry","bath","parking"],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "A premium coliving space for young professionals, with private rooms, a shared kitchen, and a rooftop workspace. Rent covers all utilities, housekeeping and high-speed Wi-Fi.",
    highlights: ["All-inclusive rent (utilities + Wi-Fi)", "Rooftop coworking deck", "Daily housekeeping", "24/7 security with CCTV"],
    roomOptions: buildRoomOptions(14500, 25000),
    reviewsList: [
      { name: "Naveen J.", rating: 5, date: "Jul 2026", comment: "Feels more like a boutique hotel than a PG. The rooftop desk setup is a huge plus for WFH days." },
      { name: "Ishaan P.", rating: 4, date: "Jun 2026", comment: "Pricier than most, but everything just works — no chasing anyone for repairs." }
    ]
  },
  {
    id: "riverside-stay-pg",
    name: "Riverside Stay PG",
    location: "Kothrud, Pune",
    city: "Pune",
    address: "Paud Road, Kothrud, Pune, Maharashtra 411038",
    gender: "male",
    roomType: "Triple Sharing",
    rent: 6200, deposit: 9000,
    status: "filling",
    rating: 4.2, reviews: 98,
    amenities: ["wifi","food","bath"],
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "An easygoing, budget PG a short walk from the riverbank promenade in Kothrud. Popular with first-year students thanks to its low deposit and flexible move-in dates.",
    highlights: ["Low deposit, flexible move-in", "5 min walk to riverside promenade", "Common study room"],
    roomOptions: buildRoomOptions(8500, 12000),
    reviewsList: [
      { name: "Om D.", rating: 4, date: "May 2026", comment: "Simple, no-frills PG. Good for the price if you don't need AC." },
      { name: "Snehal K.", rating: 4, date: "Mar 2026", comment: "Warden is strict about curfew but the place is clean and safe." }
    ]
  }
];

window.LISTINGS = LISTINGS;
window.CITIES = CITIES;
