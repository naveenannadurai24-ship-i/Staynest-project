/* ===========================================================
   app.js — StayNest single-page app
   Everything (home grid + details view + drawer + payment)
   lives in one page; navigation happens via location.hash,
   no full page reloads.
=========================================================== */

const app = document.getElementById("app");
const toast = document.getElementById("toast");

/* ---------------------------------------------------------
   Global state
--------------------------------------------------------- */
const state = {
  filters: { gender: "any", maxPrice: 20000, city: null, area: "", query: "" },
  paymentInProgress: false
};

const MAX_PRICE_CAP = 20000;
const MIN_PRICE_FLOOR = 4000;

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

/* ---------------------------------------------------------
   Local review storage (per-browser only — swap for the
   backend's POST /api/listings/:id/reviews to persist for
   everyone instead of just this browser)
--------------------------------------------------------- */
function loadExtraReviews(id){
  try{
    const raw = localStorage.getItem(`staynest_reviews_${id}`);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function saveExtraReview(id, review){
  try{
    const list = loadExtraReviews(id);
    list.unshift(review);
    localStorage.setItem(`staynest_reviews_${id}`, JSON.stringify(list));
  }catch(e){ /* storage unavailable — review still shows for this session via re-render */ }
}

/* ---------------------------------------------------------
   Router
--------------------------------------------------------- */
function parseRoute(){
  const hash = window.location.hash.replace(/^#\/?/, "");
  if(hash.startsWith("details/")){
    return { name: "details", id: hash.split("/")[1] };
  }
  return { name: "home" };
}

function navigate(hash){
  if(state.paymentInProgress){
    showToast("Finish or cancel your payment first");
    return;
  }
  window.location.hash = hash;
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  renderDrawerCities();
  wireDrawer();
  wirePaymentModal();
  render();
});

function render(){
  const route = parseRoute();
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  if(route.name === "details"){
    renderDetails(route.id);
  }else{
    renderHome();
  }
}

/* ---------------------------------------------------------
   HOME VIEW
--------------------------------------------------------- */
function filterListings(){
  const f = state.filters;
  return window.LISTINGS.filter(h => {
    if(f.gender !== "any" && h.gender !== f.gender) return false;
    if(h.rent > f.maxPrice) return false;
    if(f.city && h.city !== f.city) return false;
    if(f.area && !h.location.toLowerCase().includes(f.area.toLowerCase())) return false;
    if(f.query && !h.location.toLowerCase().includes(f.query.toLowerCase())) return false;
    return true;
  });
}

function createHostelCard(h){
  const card = document.createElement("article");
  card.className = "hostel-card";

  const status = STATUS_META[h.status];
  const amenitiesHTML = h.amenities.map(key => `<span class="amenity">${ICONS[key]}${AMENITY_LABELS[key]}</span>`).join("");
  const soldOut = h.status === "full";

  card.innerHTML = `
    <div class="hostel-card__media">
      <img src="${h.image}" alt="${h.name}" loading="lazy">
      <span class="hostel-card__status ${status.cls}">${status.label}</span>
      <span class="hostel-card__rating">${ICONS.star}${h.rating.toFixed(1)} <span class="count">(${h.reviews})</span></span>
    </div>
    <div class="hostel-card__body">
      <div class="hostel-card__title-row">
        <h3>${h.name}</h3>
        <div class="hostel-card__location">${ICONS.pin}${h.location}</div>
      </div>
      <div class="hostel-card__meta"><span class="room-pill">${h.roomType}</span></div>
      <div class="hostel-card__amenities">${amenitiesHTML}</div>
      <hr class="hostel-card__divider">
      <div class="hostel-card__pricing">
        <div class="price-block">
          <div class="rent">₹${h.rent.toLocaleString("en-IN")}<small> /month</small></div>
          <div class="deposit">Deposit: <b>₹${h.deposit.toLocaleString("en-IN")}</b></div>
        </div>
      </div>
      <div class="hostel-card__actions">
        <button class="btn btn--ghost" type="button" data-view="${h.id}">View Details</button>
        <button class="btn btn--solid" type="button" data-book="${h.id}" ${soldOut ? "disabled" : ""}>${soldOut ? "Sold Out" : "Book Now"}</button>
      </div>
    </div>
  `;

  // Whole card navigates to details, except its own buttons (handled separately)
  card.addEventListener("click", (e) => {
    if(e.target.closest("button")) return;
    navigate(`#/details/${h.id}`);
  });

  return card;
}

function renderHome(){
  app.innerHTML = `
    <div class="page">
      <div class="search-bar">
        <span class="search-bar__icon">${ICONS.pin}</span>
        <input type="text" id="locationSearch" placeholder="Search by city or area — e.g. Koramangala, Bengaluru">
        <button type="button" id="searchClear" class="search-bar__clear" hidden aria-label="Clear search">&times;</button>
      </div>
      <p class="search-status" id="searchStatus"></p>
      <section class="grid" id="cardGrid"></section>
    </div>
  `;

  const grid = document.getElementById("cardGrid");
  const searchInput = document.getElementById("locationSearch");
  const searchClear = document.getElementById("searchClear");
  const searchStatus = document.getElementById("searchStatus");
  searchInput.value = state.filters.query;

  function draw(){
    const results = filterListings();
    grid.innerHTML = "";
    if(results.length === 0){
      grid.innerHTML = `<div class="no-results">No hostels or PGs match your filters yet. Try widening your search.</div>`;
    }else{
      results.forEach(h => grid.appendChild(createHostelCard(h)));
    }
    const q = state.filters.query.trim();
    searchClear.hidden = q.length === 0;
    searchStatus.textContent = q
      ? `${results.length} stay${results.length === 1 ? "" : "s"} found for "${q}"`
      : `Showing ${results.length} of ${window.LISTINGS.length} stays`;
  }

  searchInput.addEventListener("input", () => { state.filters.query = searchInput.value; draw(); });
  searchClear.addEventListener("click", () => { state.filters.query = ""; searchInput.value = ""; draw(); searchInput.focus(); });

  grid.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("[data-view]");
    if(viewBtn){ navigate(`#/details/${viewBtn.dataset.view}`); return; }
    const bookBtn = e.target.closest("[data-book]");
    if(bookBtn && !bookBtn.disabled){ navigate(`#/details/${bookBtn.dataset.book}#book`); return; }
  });

  draw();
}

/* ---------------------------------------------------------
   DETAILS VIEW
--------------------------------------------------------- */
function starRow(n){
  let out = "";
  for(let i = 1; i <= 5; i++) out += (i <= Math.round(n) ? ICONS.star : ICONS.starOutline);
  return out;
}

function renderDetails(id){
  const listing = window.LISTINGS.find(h => h.id === id) || window.LISTINGS[0];
  const allReviews = [...loadExtraReviews(listing.id), ...listing.reviewsList];
  const avgRating = allReviews.length
    ? (allReviews.reduce((s,r) => s + r.rating, 0) / allReviews.length)
    : listing.rating;
  const status = STATUS_META[listing.status];
  const soldOut = listing.status === "full";
  let selected = listing.roomOptions.find(r => r.type === listing.roomType) || listing.roomOptions[0];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`;

  app.innerHTML = `
    <div class="detail-hero">
      <div class="detail-gallery" id="gallery">
        ${listing.gallery.slice(0,4).map((src,i) => `
          <a class="${i===0 ? "g-main" : ""}" href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${listing.name} photo ${i+1}" loading="lazy"></a>
        `).join("")}
      </div>
    </div>
    <div class="detail-layout">
      <main class="detail-main">
        <div class="detail-heading">
          <div class="detail-heading__row">
            <span class="hostel-card__status ${status.cls}" style="position:static; backdrop-filter:none;">${status.label}</span>
            <span class="hostel-card__rating" style="position:static; backdrop-filter:none;">${ICONS.star}${avgRating.toFixed(1)} <span class="count">(${allReviews.length} reviews)</span></span>
          </div>
          <h1>${listing.name}</h1>
          <div class="hostel-card__location">${ICONS.pin}${listing.address}</div>
          <a class="map-btn" href="${mapsUrl}" target="_blank" rel="noopener">${ICONS.map} View on Google Maps</a>
        </div>

        <div class="section">
          <h2>About this place</h2>
          <p class="body-text">${listing.description}</p>
        </div>

        <div class="section">
          <h2>Highlights</h2>
          <ul class="highlight-list">${listing.highlights.map(h => `<li>${ICONS.check}${h}</li>`).join("")}</ul>
        </div>

        <div class="section">
          <h2>Amenities</h2>
          <div class="amenity-grid">${listing.amenities.map(key => `<span class="amenity">${ICONS[key]}${AMENITY_LABELS[key]}</span>`).join("")}</div>
        </div>

        <div class="section">
          <h2>Room options — 1 to 6 sharing</h2>
          <div class="room-options" id="roomOptions">
            ${listing.roomOptions.map(r => `
              <div class="room-option ${r.type===selected.type ? "is-selected":""}" data-type="${r.type}">
                <div class="ro-left">
                  <span class="ro-type">${r.type}</span>
                  <span class="ro-deposit">Deposit ₹${r.deposit.toLocaleString("en-IN")}</span>
                </div>
                <span class="ro-rent">₹${r.rent.toLocaleString("en-IN")}<small style="font-family: var(--font-body); font-weight:500; font-size:12px; color:var(--muted);"> /mo per bed</small></span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="section" id="reviews">
          <h2>Reviews</h2>
          <div class="review-summary">
            <div class="score">${avgRating.toFixed(1)}</div>
            <div><div class="stars">${starRow(avgRating)}</div><div class="sub">${allReviews.length} reviews</div></div>
          </div>
          <div id="reviewList">
            ${allReviews.map(r => `
              <div class="review-card">
                <div class="review-card__head"><span class="review-card__name">${r.name}</span><span class="review-card__date">${r.date}</span></div>
                <div class="review-card__stars">${starRow(r.rating)}</div>
                <p>${r.comment}</p>
              </div>
            `).join("")}
          </div>

          <form class="review-form" id="reviewForm">
            <h3>Write a review</h3>
            <div class="star-input" id="starInput">
              ${[1,2,3,4,5].map(n => `<button type="button" data-star="${n}">${ICONS.star}</button>`).join("")}
            </div>
            <input type="text" id="reviewName" placeholder="Your name" required>
            <textarea id="reviewComment" rows="3" placeholder="Share your experience staying here..." required></textarea>
            <button type="submit" class="btn btn--solid" style="align-self:flex-start; padding:11px 22px;">Submit Review</button>
          </form>
        </div>
      </main>

      <aside class="booking-card" id="book">
        <div id="sidebar"></div>
      </aside>
    </div>
  `;

  // Jump straight to reviews if the URL had #book / a caller wants it, plus wire a smooth-scroll for in-page nav
  document.getElementById("gallery"); // (kept for clarity / future hooks)

  function renderSidebar(){
    document.getElementById("sidebar").innerHTML = `
      <div class="price-block">
        <div class="rent">₹${selected.rent.toLocaleString("en-IN")}<small> /month</small></div>
        <div class="deposit">Deposit: <b>₹${selected.deposit.toLocaleString("en-IN")}</b></div>
      </div>
      <select id="roomSelect">
        ${listing.roomOptions.map(r => `<option value="${r.type}" ${r.type===selected.type ? "selected":""}>${r.type} — ₹${r.rent.toLocaleString("en-IN")}/mo</option>`).join("")}
      </select>
      <button class="btn btn--solid" type="button" id="bookBtn" ${soldOut ? "disabled":""}>${soldOut ? "Currently Full — Join Waitlist" : "Book Now"}</button>
      <a class="btn btn--ghost" href="#reviews" id="reviewsLink" style="text-align:center; text-decoration:none;">See Reviews</a>
      <p class="booking-note">Free cancellation up to 48 hours before move-in.</p>
    `;
    document.getElementById("roomSelect").addEventListener("change", (e) => {
      selected = listing.roomOptions.find(r => r.type === e.target.value);
      renderSidebar();
    });
    document.getElementById("bookBtn").addEventListener("click", () => openPaymentModal(listing, selected));
    document.getElementById("reviewsLink").addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("reviews").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  renderSidebar();

  document.getElementById("roomOptions").addEventListener("click", (e) => {
    const el = e.target.closest(".room-option");
    if(!el) return;
    selected = listing.roomOptions.find(r => r.type === el.dataset.type);
    renderSidebar();
    document.querySelectorAll(".room-option").forEach(o => o.classList.toggle("is-selected", o.dataset.type === selected.type));
  });

  // Review form
  let starValue = 5;
  const starInput = document.getElementById("starInput");
  function paintStars(){
    starInput.querySelectorAll("button").forEach(b => b.classList.toggle("active", Number(b.dataset.star) <= starValue));
  }
  paintStars();
  starInput.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if(!btn) return;
    starValue = Number(btn.dataset.star);
    paintStars();
  });

  document.getElementById("reviewForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("reviewName").value.trim() || "Anonymous";
    const comment = document.getElementById("reviewComment").value.trim();
    if(!comment) return;
    const review = { name, rating: starValue, date: "Just now", comment };
    saveExtraReview(listing.id, review);
    showToast("Thanks — your review was posted!");
    renderDetails(id); // re-render to show it immediately
  });

  // If we arrived via a "#/details/xyz#book" style link, jump to the sidebar
  if(window.location.hash.endsWith("#book")){
    document.getElementById("book").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ---------------------------------------------------------
   FILTER DRAWER
--------------------------------------------------------- */
function renderDrawerCities(){
  const grid = document.getElementById("cityGrid");
  grid.innerHTML = window.CITIES.map(c => `
    <button type="button" class="city-btn" data-city="${c.name}">
      <img src="${c.image}" alt="${c.name}" loading="lazy">
      <span>${c.name}</span>
    </button>
  `).join("");
}

function wireDrawer(){
  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("drawerOverlay");
  const closeBtn = document.getElementById("drawerClose");
  const genderGroup = document.getElementById("genderGroup");
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const cityGrid = document.getElementById("cityGrid");
  const areaInput = document.getElementById("areaInput");
  const applyBtn = document.getElementById("applyFilters");
  const resetBtn = document.getElementById("resetFilters");

  let draftGender = "any";
  let draftCity = null;

  function openDrawer(){ drawer.classList.add("is-open"); overlay.classList.add("is-open"); }
  function closeDrawer(){ drawer.classList.remove("is-open"); overlay.classList.remove("is-open"); }

  menuBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  genderGroup.addEventListener("click", (e) => {
    const pill = e.target.closest(".pill");
    if(!pill) return;
    draftGender = pill.dataset.value;
    genderGroup.querySelectorAll(".pill").forEach(p => p.classList.toggle("active", p === pill));
  });

  function updatePriceFill(){
    const pct = ((priceRange.value - MIN_PRICE_FLOOR) / (MAX_PRICE_CAP - MIN_PRICE_FLOOR)) * 100;
    priceRange.style.setProperty("--fill", pct + "%");
    priceValue.textContent = `₹${Number(priceRange.value).toLocaleString("en-IN")}`;
  }
  priceRange.addEventListener("input", updatePriceFill);
  updatePriceFill();

  cityGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".city-btn");
    if(!btn) return;
    draftCity = (draftCity === btn.dataset.city) ? null : btn.dataset.city;
    cityGrid.querySelectorAll(".city-btn").forEach(b => b.classList.toggle("active", b.dataset.city === draftCity));
  });

  applyBtn.addEventListener("click", () => {
    state.filters.gender = draftGender;
    state.filters.maxPrice = Number(priceRange.value);
    state.filters.city = draftCity;
    state.filters.area = areaInput.value.trim();
    closeDrawer();
    if(parseRoute().name === "home") renderHome();
    else navigate("#/");
    showToast("Filters applied");
  });

  resetBtn.addEventListener("click", () => {
    draftGender = "any"; draftCity = null;
    genderGroup.querySelectorAll(".pill").forEach(p => p.classList.toggle("active", p.dataset.value === "any"));
    cityGrid.querySelectorAll(".city-btn").forEach(b => b.classList.remove("active"));
    priceRange.value = MAX_PRICE_CAP; updatePriceFill();
    areaInput.value = "";
    state.filters = { gender: "any", maxPrice: MAX_PRICE_CAP, city: null, area: "", query: state.filters.query };
    if(parseRoute().name === "home") renderHome();
  });
}

/* ---------------------------------------------------------
   PAYMENT MODAL
--------------------------------------------------------- */
let currentPayTab = "upi";

function paymentFormHTML(listing, room){
  const total = room.rent + room.deposit;
  const summary = `
    <div class="pay-summary">
      <span>${listing.name} · ${room.type}</span>
      <span>₹${total.toLocaleString("en-IN")}</span>
    </div>
  `;
  if(currentPayTab === "upi"){
    return summary + `
      <div class="pay-form">
        <input type="text" placeholder="Enter UPI ID — e.g. yourname@okhdfcbank" id="upiId" required>
      </div>
    `;
  }
  if(currentPayTab === "card"){
    return summary + `
      <div class="pay-form">
        <input type="text" placeholder="Card number" maxlength="19" id="cardNumber" required>
        <div class="row-2">
          <input type="text" placeholder="MM/YY" maxlength="5" id="cardExpiry" required>
          <input type="text" placeholder="CVV" maxlength="3" id="cardCvv" required>
        </div>
        <input type="text" placeholder="Name on card" id="cardName" required>
      </div>
    `;
  }
  return summary + `
    <div class="pay-form">
      <select id="bankSelect">
        <option>State Bank of India</option>
        <option>HDFC Bank</option>
        <option>ICICI Bank</option>
        <option>Axis Bank</option>
        <option>Punjab National Bank</option>
      </select>
    </div>
  `;
}

function renderPaymentBody(listing, room){
  const body = document.getElementById("paymentBody");
  body.innerHTML = `
    <h2>Confirm &amp; Pay</h2>
    <p class="modal-sub">Choose how you'd like to pay for your booking.</p>
    <div class="pay-tabs">
      <button type="button" class="pay-tab ${currentPayTab==="upi"?"active":""}" data-tab="upi">${ICONS.upi}UPI</button>
      <button type="button" class="pay-tab ${currentPayTab==="card"?"active":""}" data-tab="card">${ICONS.card}Card</button>
      <button type="button" class="pay-tab ${currentPayTab==="bank"?"active":""}" data-tab="bank">${ICONS.bank}Net Banking</button>
    </div>
    <div id="payFormWrap">${paymentFormHTML(listing, room)}</div>
    <button class="btn btn--solid" type="button" id="payConfirmBtn" style="width:100%; margin-top:16px; padding:13px;">Pay ₹${(room.rent + room.deposit).toLocaleString("en-IN")}</button>
    <p class="booking-note" style="margin-top:10px;">Demo checkout only — connect a licensed payment gateway (Razorpay, Stripe, PayU, etc.) via your backend for real transactions.</p>
  `;
  body.querySelectorAll(".pay-tab").forEach(tab => {
    tab.addEventListener("click", () => { currentPayTab = tab.dataset.tab; renderPaymentBody(listing, room); });
  });
  document.getElementById("payConfirmBtn").addEventListener("click", () => showPaymentSuccess(listing, room));
}

function showPaymentSuccess(listing, room){
  const bookingId = "SN" + Math.random().toString(36).slice(2, 9).toUpperCase();
  document.getElementById("paymentBody").innerHTML = `
    <div class="pay-success">
      <div class="check-circle">${ICONS.check}</div>
      <h2>Booking Confirmed!</h2>
      <p class="booking-note booking-id">Booking ID: <b>${bookingId}</b> · ${listing.name} · ${room.type}</p>
      <button class="btn btn--solid" type="button" id="payContinueBtn" style="width:100%; padding:13px;">Continue</button>
    </div>
  `;
  document.getElementById("payContinueBtn").addEventListener("click", closePaymentModal);
}

function openPaymentModal(listing, room){
  currentPayTab = "upi";
  state.paymentInProgress = true;
  document.getElementById("paymentOverlay").classList.add("is-open");
  renderPaymentBody(listing, room);
}

function closePaymentModal(){
  state.paymentInProgress = false;
  document.getElementById("paymentOverlay").classList.remove("is-open");
}

function wirePaymentModal(){
  document.getElementById("paymentClose").addEventListener("click", closePaymentModal);
  document.getElementById("paymentOverlay").addEventListener("click", (e) => {
    if(e.target.id === "paymentOverlay") closePaymentModal();
  });
}

/* ---------------------------------------------------------
   Logo → home (blocked mid-payment)
--------------------------------------------------------- */
document.getElementById("brandLink").addEventListener("click", (e) => {
  e.preventDefault();
  navigate("#/");
});
