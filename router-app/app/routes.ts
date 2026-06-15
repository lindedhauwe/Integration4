import { route } from "@react-router/dev/routes";

export default [
  // HOME
  route("/", "./routes/home.jsx"),

  // RECOMMENDATIONS
  route("/recommendations", "./routes/recommendations.jsx"),

  // API ROUTE (server-side)
  route("/api/recommendations", "./routes/api.recommendations.ts"),

  // THE SPOT
  route("/thespot", "./routes/thespot.jsx"),

  // MAP
  route("/map", "./routes/map.jsx"),

  // ACCOUNT
  route("/account", "./routes/account.jsx"),

  // EDIT ACCOUNT
  route("/account/edit", "./routes/editaccount.jsx"),

  // CREATE PROFILE
  route("/create-profile", "./routes/createprofile.jsx"),

  // LOGIN
  route("/login", "./routes/login.jsx"),

  // OTHER BAR
  route("/otherbar", "./routes/otherbar.jsx"),

  // BEER LOADING
  route("/beerloading", "./routes/beerloading.jsx"),

  // STORYTELLING
  route("/storytelling", "./routes/storytelling.jsx"),

  // LOADING RECOMMENDATION
  route("/loadingrecommendation", "./routes/loadingrecommendation.jsx"),

  // TEST OVERLAY (development only)
  route("/test-overlay", "./routes/test-overlay.jsx"),
];
