// TEMPORARY DATA (backward-compat)
// This shim exposes `role` for legacy components but should be replaced by Clerk-based role usage.
export let role = "admin"; // fallback

// Attempt to read Clerk role on client safely (for components importing this module in the browser)
// Note: This is a soft shim; authoritative role resolution should use roleUtils with Clerk hooks/server.
if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem("coficab.role");
    if (raw) role = raw as typeof role;
  } catch {
    // ignore
  }
}

export const teachersData = [
  {
    id: 1,
    userId: "USR001",
    name: "John Doe",
    email: "john@doe.com",
    photo:
      "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "+216 23 456 789",
    posts: ["Responsable qualité", "Ingénieur production"],
    address: "Ariana, Tunisie",
  },
  {
    id: 2,
    userId: "USR002",
    name: "Jane Doe",
    email: "jane@doe.com",
    photo:
      "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "+216 29 876 543",
    posts: ["Technicienne de maintenance", "Superviseure de ligne"],
    address: "Sfax, Tunisie",
  },
  {
    id: 3,
    userId: "USR003",
    name: "Mike Geller",
    email: "mike@geller.com",
    photo:
      "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "+216 20 123 456",
    posts: ["Ingénieur qualité"],
    address: "Tunis, Tunisie",
  },
  {
    id: 4,
    userId: "USR004",
    name: "Jay French",
    email: "jay@gmail.com",
    photo:
      "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "+216 52 789 123",
    posts: ["Responsable logistique"],
    address: "Monastir, Tunisie",
  },
  {
    id: 5,
    userId: "USR005",
    name: "Jane Smith",
    email: "jane@gmail.com",
    photo:
      "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "+216 58 456 321",
    posts: ["Chef de projet", "Consultante industrie"],
    address: "Nabeul, Tunisie",
  },
  {
    id: 6,
    userId: "USR006",
    name: "Anna Santiago",
    email: "anna@gmail.com",
    photo:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "+216 27 654 987",
    posts: ["Ingénieure process"],
    address: "Sousse, Tunisie",
  },
];

// Minimal events dataset to satisfy imports without altering pages
export const eventsData: Array<{
  id: number;
  title: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
}> = [];
