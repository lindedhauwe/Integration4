// src/App.jsx
import { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const TheSpot = lazy(() => import('./pages/TheSpot'));
const Map = lazy(() => import('./pages/Map'));
const Account = lazy(() => import('./pages/Account'));
const OtherBar = lazy(() => import('./pages/OtherBar'));

function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>{' | '}
        <Link to="/recommendations">Recommendation</Link>{' | '}
        <Link to="/thespot">The Spot</Link>{' | '}
        <Link to="/map">Map</Link>{' | '}
        <Link to="/account">Account</Link>{' | '}
        <Link to="/otherbar">Other Bar</Link>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/thespot" element={<TheSpot />} />
            <Route path="/map" element={<Map />} />
            <Route path="/account" element={<Account />} />
            <Route path="/otherbar" element={<OtherBar />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
