/* ===========================================================
   icons.js — shared icon set, amenity labels, and status
   labels used by both script.js (grid) and details.js (page)
=========================================================== */

const ICONS = {
  wifi:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 8.5a16 16 0 0 1 20 0"/><path d="M5.5 12a11 11 0 0 1 13 0"/><path d="M9 15.5a6 6 0 0 1 6 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>',
  ac:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20"/><path d="M12 2 9 5"/><path d="M12 2l3 3"/><path d="M5 8l14 8"/><path d="M5 16l14-8"/></svg>',
  food:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2v8"/><path d="M10 2v8"/><path d="M7 6h3"/><path d="M8.5 10v12"/><path d="M17 2c-1.5 2-1.5 6 0 8s1.5 6 0 12"/></svg>',
  laundry:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4.2"/><circle cx="7.2" cy="6" r="0.6" fill="currentColor" stroke="none"/></svg>',
  bath:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h16"/><path d="M6 12V6a2 2 0 0 1 2-2c1 0 1.6.6 2 1.4"/><path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/><path d="M9 20v1"/><path d="M15 20v1"/></svg>',
  parking:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9"/></svg>',
  pin:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg>',
  star:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17.6l-5.9 3-1.3-6.6-4.9-4.6 6.6-.7z"/></svg>',
  starOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17.6l-5.9 3-1.3-6.6-4.9-4.6 6.6-.7z"/></svg>',
  menu:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>',
  close:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>',
  map:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>',
  upi:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>',
  card:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>',
  bank:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-6 9 6"/><path d="M4 10v9"/><path d="M20 10v9"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/><path d="M3 21h18"/></svg>',
  check:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
};

const AMENITY_LABELS = {
  wifi: "Wi-Fi", ac: "AC", food: "Food", laundry: "Laundry",
  bath: "Attached Bath", parking: "Parking"
};

const STATUS_META = {
  available: { cls: "status--available", label: "Available" },
  filling:   { cls: "status--filling",   label: "Filling Fast" },
  full:      { cls: "status--full",      label: "Sold Out" }
};
