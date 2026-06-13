const VISITED = [
  {
    id: "a9c42ff4-621c-4f5d-a90d-9e9caa77f62c",
    name: "Paters Vaetje",
    adress: "Vlasmarkt 1, Antwerpen",
    lat: 51.2207,
    lng: 4.4005,
  },
  {
    id: "90e8d132-3d9d-46de-b026-d909edd41ba2",
    name: "Billie's Bier Kafetaria",
    adress: "Kammenstraat 13, Antwerpen",
    lat: 51.2184,
    lng: 4.4002,
  },
  {
    id: "f99f44b4-ec2c-4a66-97e9-97d43811ec75",
    name: "'t Chauffeurke",
    adress: "Stadswaag 15, Antwerpen",
    lat: 51.2074,
    lng: 4.3989,
  },
];

// Current café: De Muze — jazz-bruine kroeg in het centrum
const CURRENT = {
  id: "3f289c21-0c4d-44b5-bfd0-189652e14a52",
  name: "De Muze",
  adress: "Melkmarkt 15, 2000 Antwerp",
  lat: 51.2166,
  lng: 4.4009,
};

const LIKED = [
  {
    cafe_id: "a9c42ff4-621c-4f5d-a90d-9e9caa77f62c",
    name: "Paters Vaetje",
    adress: "Vlasmarkt 1, Antwerpen",
    lat: 51.2207,
    lng: 4.4005,
  },
  {
    cafe_id: "90e8d132-3d9d-46de-b026-d909edd41ba2",
    name: "Billie's Bier Kafetaria",
    adress: "Kammenstraat 13, Antwerpen",
    lat: 51.2184,
    lng: 4.4002,
  },
];

// Aanbeveling (grijze pin): Bar Paniek
const REC_CAFE = {
  id: "06e5c9a6-81c4-4d83-a144-596446e3c3ab",
  name: "Bar Paniek",
  adress: "Kattendijkdok-Oostkaai 21B, 2000 Antwerp",
  lat: 51.2342,
  lng: 4.4083,
};

const HOME_REC = {
  name: "Lena",
  age: "26",
  description:
    "One of those places you only find if someone takes you there. Rough edges, great crowd and the kind of beer list that keeps you busy all night. Don't miss it.",
  photo_url: null,
  cafe_name: "Bar Paniek",
};

export function seedDevData() {
  if (localStorage.getItem("__dev_seeded_v2__")) return;

  localStorage.setItem("current_cafe", JSON.stringify(CURRENT));
  localStorage.setItem("visited_cafes", JSON.stringify(VISITED));
  localStorage.setItem("liked_cafes", JSON.stringify(LIKED));
  sessionStorage.setItem("rec_cafe", JSON.stringify(REC_CAFE));
  sessionStorage.setItem("home_rec", JSON.stringify(HOME_REC));

  localStorage.setItem("__dev_seeded_v2__", "1");
}

export function clearDevData() {
  ["current_cafe", "visited_cafes", "liked_cafes", "__dev_seeded_v2__"].forEach(
    (k) => localStorage.removeItem(k)
  );
  ["rec_cafe", "home_rec"].forEach((k) => sessionStorage.removeItem(k));
}
