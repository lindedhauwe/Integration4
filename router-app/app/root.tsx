import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./styles/index.css";
import "./routes/_index.css";
import Nav from "~/components/Nav";

export function meta() {
  return [
    { title: "Antwerp on Tap" },
    { name: "description", content: "Discover the best bars in Antwerp with personal recommendations tailored just for you." },
    { property: "og:title", content: "Antwerp on Tap" },
    { property: "og:description", content: "Discover the best bars in Antwerp with personal recommendations tailored just for you." },
    { property: "og:image", content: "/og-image.png" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Antwerp on Tap" },
    { name: "twitter:description", content: "Discover the best bars in Antwerp with personal recommendations tailored just for you." },
    { name: "twitter:image", content: "/og-image.png" },
  ];
}
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import beerImg from "./assets/images/beer-animation.png";
import coasterImg from "./assets/images/coaster-animation.png";

export const links: Route.LinksFunction = () => [
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "stylesheet", href: "https://use.typekit.net/bcf1ohy.css" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const [overlayPhase, setOverlayPhase] = useState(0);

useEffect(() => {
    if (location.pathname !== "/") return;
    const skip = sessionStorage.getItem("skip_home_animation");
    const alreadyVisited = sessionStorage.getItem("home_visited");
    sessionStorage.removeItem("skip_home_animation");
    sessionStorage.setItem("home_visited", "1");
    if (skip || alreadyVisited) return;
    setOverlayPhase(1);
    const t1 = setTimeout(() => setOverlayPhase(2), 900);
    const t2 = setTimeout(() => setOverlayPhase(4), 1800);
    const t3 = setTimeout(() => setOverlayPhase(0), 2700);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [location.pathname]);

  const hiddenNavRoutes = [
    "/storytelling",
    "/beerloading",
    "/loadingrecommendation"
  ];

  return (
    <>
      {overlayPhase > 0 && (
        <div className="added-overlay" aria-hidden="true">
          {overlayPhase <= 2 && (
            <img
              src={beerImg}
              alt=""
              className={`added-overlay__beer${overlayPhase === 2 ? " added-overlay__beer--exit" : " added-overlay__beer--enter"}`}
            />
          )}
          <div
            className={
              "added-overlay__coaster-group" +
              (overlayPhase === 1 ? " added-overlay__coaster-group--enter" : "") +
              (overlayPhase === 4 ? " added-overlay__coaster-group--exit" : "")
            }
          >
            <img src={coasterImg} alt="" className="added-overlay__coaster-img" />
          </div>
        </div>
      )}
      {!hiddenNavRoutes.includes(location.pathname) && <Nav />}
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
