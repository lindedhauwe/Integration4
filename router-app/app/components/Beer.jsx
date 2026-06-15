import { useEffect, useRef, useState, useCallback } from 'react';
import './Beer.css';
import drinkIcon from "../assets/beer/icons/drinkIcon.svg";

// ─── Geometry helpers ────────────────────────────────────────────────────────

function rotate(p, angle) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c };
}

function dot(a, b) { return a.x * b.x + a.y * b.y; }

function polygonArea(poly) {
  if (poly.length < 3) return 0;
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a) / 2;
}

function clipHalfPlane(poly, n, d) {
  if (!poly.length) return [];
  const out = [];
  const side = p => n.x * p.x + n.y * p.y - d;
  const lerp = (a, b, da, db) => {
    const t = da / (da - db);
    return { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
  };
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i], prev = poly[(i + poly.length - 1) % poly.length];
    const dC = side(cur), dP = side(prev);
    if (dC <= 0) { if (dP > 0) out.push(lerp(prev, cur, dP, dC)); out.push(cur); }
    else if (dP <= 0) out.push(lerp(prev, cur, dP, dC));
  }
  return out;
}

// ─── Liquid physics ──────────────────────────────────────────────────────────

function fieldCorners(w, h) {
  const x = w / 2, y = h / 2;
  return [{ x: -x, y }, { x, y }, { x, y: -y }, { x: -x, y: -y }];
}

function clipAt(corners, gdir, s) {
  return clipHalfPlane(corners, { x: -gdir.x, y: -gdir.y }, -s);
}

function areaDeep(corners, gdir, s) {
  return polygonArea(clipAt(corners, gdir, s));
}

function holdCapacity(corners, gdir) {
  const depths = corners.map(c => dot(c, gdir));
  const rimDepth = Math.max(depths[0], depths[1]);
  return areaDeep(corners, gdir, rimDepth);
}

function solveDepth(areaFn, minD, maxD, target) {
  if (target <= 0) return maxD;
  let lo = minD, hi = maxD;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (areaFn(mid) > target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

function surfaceEdge(polygon, gdir, s) {
  const eps = 1e-3 * (Math.abs(s) + 1);
  const on = polygon.filter(p => Math.abs(dot(p, gdir) - s) <= eps);
  if (on.length < 2) return [];
  const tangent = { x: -gdir.y, y: gdir.x };
  on.sort((a, b) => dot(a, tangent) - dot(b, tangent));
  return [on[0], on[on.length - 1]];
}

function levelFor(corners, gdir, volume) {
  const fullArea = polygonArea(corners);
  const target = Math.max(0, Math.min(volume, fullArea));
  const depths = corners.map(c => dot(c, gdir));
  const s = solveDepth(
    x => areaDeep(corners, gdir, x),
    Math.min(...depths), Math.max(...depths), target
  );
  const polygon = clipAt(corners, gdir, s);
  return { polygon, surface: surfaceEdge(polygon, gdir, s), surfaceDepth: s };
}

// ─── Screen orientation ───────────────────────────────────────────────────────

function currentOrientationAngle() {
  if (screen.orientation?.angle != null) return screen.orientation.angle;
  return typeof window.orientation === 'number' ? window.orientation : 0;
}

async function lockPortrait() {
  try {
    if (document.documentElement.requestFullscreen)
      await document.documentElement.requestFullscreen().catch(() => {});
    if (screen.orientation?.lock)
      await screen.orientation.lock('portrait').catch(() => {});
  } catch {}
}

// ─── Tilt hook ────────────────────────────────────────────────────────────────

function useTilt() {
  const gdirRef = useRef({ x: 0, y: -1 });
  const filtRef = useRef({ x: 0, y: -1 });
  // iOS reports accelerationIncludingGravity with opposite sign from Android/W3C spec
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const invertRef = useRef({ x: isIOS, y: isIOS });
  const orientRef = useRef(0);
  const shakeCountRef = useRef(0);
  const shakeEnergyRef = useRef(0);
  const prevAccRef = useRef(null);
  const lastShakeRef = useRef(0);

  const [permission, setPermission] = useState('unknown');

  useEffect(() => {
    const update = () => {
      orientRef.current = (currentOrientationAngle() * Math.PI) / 180;
    };
    update();
    window.addEventListener('orientationchange', update);
    screen.orientation?.addEventListener?.('change', update);
    return () => {
      window.removeEventListener('orientationchange', update);
      screen.orientation?.removeEventListener?.('change', update);
    };
  }, []);

  const requestPermission = useCallback(async () => {
    const DM = window.DeviceMotionEvent;
    if (!DM) { setPermission('unsupported'); return; }
    if (typeof DM.requestPermission === 'function') {
      try {
        const res = await DM.requestPermission();
        setPermission(res === 'granted' ? 'granted' : 'denied');
      } catch { setPermission('denied'); }
    } else {
      setPermission('granted');
    }
  }, []);

  useEffect(() => {
    const onMotion = e => {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x == null) return;

      const inv = invertRef.current;
      const ax = (inv.x ? -1 : 1) * a.x;
      const ay = (inv.y ? -1 : 1) * a.y;
      const az = a.z ?? 0;

      // Shake detection
      const lin = e.acceleration;
      let shakeMag;
      if (lin?.x != null) {
        shakeMag = Math.hypot(lin.x || 0, lin.y || 0, lin.z || 0);
      } else {
        const p = prevAccRef.current;
        shakeMag = p ? Math.hypot(ax - p.x, ay - p.y, az - p.z) : 0;
      }
      prevAccRef.current = { x: ax, y: ay, z: az };
      shakeEnergyRef.current = shakeEnergyRef.current * 0.85 + shakeMag * 0.15;
      const now = performance.now();
      if (shakeEnergyRef.current > 13 && now - lastShakeRef.current > 700) {
        shakeCountRef.current++;
        lastShakeRef.current = now;
        shakeEnergyRef.current = 0;
      }

      // Gravity direction (low-pass filtered, orientation-compensated)
      let gx = -ax, gy = -ay;
      const mag = Math.hypot(gx, gy);
      if (mag < 1.2) return;
      gx /= mag; gy /= mag;

      const alpha = 0.18;
      const prev = filtRef.current;
      let nx = prev.x + alpha * (gx - prev.x);
      let ny = prev.y + alpha * (gy - prev.y);
      const m = Math.hypot(nx, ny) || 1;
      filtRef.current = { x: nx / m, y: ny / m };
      gdirRef.current = rotate(filtRef.current, orientRef.current);
    };

    window.addEventListener('devicemotion', onMotion);
    return () => window.removeEventListener('devicemotion', onMotion);
  }, []);

  return { gdirRef, shakeCountRef, permission, requestPermission };
}

// ─── Canvas constants ─────────────────────────────────────────────────────────

const FILL_FRAC = 1.0;
const DRINK_SPEED = 1.2;
const LIP = 0.046;
const SLOSH_FREQ = 15;
const SLOSH_DAMP = 0.25;
const GLUG_FREQ = 4.5;
const FOAM_MAX = 0.10;
const BUBBLE_RATE = 0.1;
const REFILL_STEP = 0.012;
const BUBBLE_COUNT = 6;

function makeBubble() {
  return {
    x: Math.random(),
    y: -(0.18 + Math.random() * 0.72),
    r: 1.4 + Math.random() * 3.6,
    speed: 0.002 + Math.random() * 0.0045,
    alpha: 0.18 + Math.random() * 0.42,
    wobble: Math.random() * Math.PI * 2,
  };
}

function respawnBubble(b) {
  b.x = Math.random();
  b.y = -(0.74 + Math.random() * 0.2);
  b.r = 1.4 + Math.random() * 3.6;
  b.speed = 0.002 + Math.random() * 0.0045;
  b.alpha = 0.18 + Math.random() * 0.42;
  b.wobble = Math.random() * Math.PI * 2;
}

function surfaceYAtX(surface, x) {
  if (surface.length !== 2) return null;
  const [a, b] = surface;
  const dx = b.x - a.x;
  if (Math.abs(dx) < 1e-6) return (a.y + b.y) / 2;
  return a.y + ((x - a.x) / dx) * (b.y - a.y);
}

function randInLiquid(halfW, halfH, gEff, s) {
  for (let i = 0; i < 8; i++) {
    const x = (Math.random() - 0.5) * 2 * halfW;
    const y = (Math.random() - 0.5) * 2 * halfH;
    if (x * gEff.x + y * gEff.y >= s + 3) return { x, y };
  }
  return null;
}

function drawPoly(ctx, poly) {
  ctx.beginPath();
  ctx.moveTo(poly[0].x, poly[0].y);
  for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i].x, poly[i].y);
  ctx.closePath();
}

// ─── Beer component ───────────────────────────────────────────────────────────

export default function Beer({ onEmpty }) {
  const tilt = useTilt();
  const canvasRef = useRef(null);
  const pointerHeldRef = useRef(false);
  const onEmptyRef = useRef(onEmpty);
  useEffect(() => { onEmptyRef.current = onEmpty; });

  // Simulation state (all refs to avoid re-renders in the animation loop)
  const fracRef = useRef(0);
  const refillTargetRef = useRef(FILL_FRAC);
  const refillingRef = useRef(true);
  const bubblesRef = useRef(Array.from({ length: BUBBLE_COUNT }, makeBubble));
  const thetaEffRef = useRef(NaN);
  const omegaEffRef = useRef(0);
  const spillingRef = useRef(false);
  const glugPhaseRef = useRef(0);
  const lastBeatRef = useRef(0);
  const foamRef = useRef(0.12);
  const lastSipRef = useRef(false);
  const prevSurfRef = useRef(0);
  const dropsRef = useRef([]);
  const lastShakeRef = useRef(0);
  const drainPhaseRef = useRef(0);
  const drainBeatRef = useRef(0);
  const emptyFiredRef = useRef(false);

  const [needsPermission, setNeedsPermission] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // On iOS DeviceMotionEvent.requestPermission must be called from a user gesture;
  // on Android/desktop there's no such method so we auto-grant.
  useEffect(() => {
    const DM = window.DeviceMotionEvent;
    if (DM && typeof DM.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      tilt.requestPermission();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Show drink hint after the fill animation (~1.5 s at 60 fps)
  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Canvas render loop — uses only stable refs so deps array is empty
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { gdirRef, shakeCountRef } = tilt;
    let raf = 0, last = 0;

    const buzz = p => { if ('vibrate' in navigator) navigator.vibrate(p); };

    const render = ts => {
      const dt = last ? Math.min((ts - last) / 1000, 0.05) : 0;
      last = ts;

      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
      }

      const fieldW = cssW, fieldH = cssH;
      const halfW = fieldW / 2, halfH = fieldH / 2;
      const corners = fieldCorners(fieldW, fieldH);
      const area = fieldW * fieldH;

      // Pour animation
      if (refillingRef.current) {
        fracRef.current = Math.min(refillTargetRef.current, fracRef.current + REFILL_STEP);
        if (fracRef.current >= refillTargetRef.current - 1e-4) refillingRef.current = false;
      }

      const gdir = gdirRef.current;

      // Shake to refill
      if (shakeCountRef.current !== lastShakeRef.current) {
        lastShakeRef.current = shakeCountRef.current;
        fracRef.current = FILL_FRAC;
        foamRef.current = 1;
        lastSipRef.current = false;
        emptyFiredRef.current = false;
        buzz(25);
      }

      // Slosh: surface follows gravity via a damped spring
      const thetaTarget = Math.atan2(gdir.y, gdir.x);
      if (Number.isNaN(thetaEffRef.current)) {
        thetaEffRef.current = thetaTarget;
        omegaEffRef.current = 0;
      }
      if (dt > 0) {
        const k = SLOSH_FREQ * SLOSH_FREQ;
        const damp = 2 * SLOSH_DAMP * SLOSH_FREQ;
        let d = thetaTarget - thetaEffRef.current;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        omegaEffRef.current += (k * d - damp * omegaEffRef.current) * dt;
        thetaEffRef.current += omegaEffRef.current * dt;
      } else {
        thetaEffRef.current = thetaTarget;
        omegaEffRef.current = 0;
      }
      const gEff = { x: Math.cos(thetaEffRef.current), y: Math.sin(thetaEffRef.current) };

      // Fallback: hold finger → drain directly
      const isDraining = pointerHeldRef.current;
      if (isDraining && fracRef.current > 0 && dt > 0) {
        drainPhaseRef.current += GLUG_FREQ * 2 * Math.PI * dt;
        const drainGlug = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(drainPhaseRef.current));
        fracRef.current = Math.max(0, fracRef.current - DRINK_SPEED * 0.22 * drainGlug * dt);
        const beat = Math.floor(drainPhaseRef.current / (2 * Math.PI));
        if (beat !== drainBeatRef.current) { drainBeatRef.current = beat; buzz(10); }
      }

      // Gyroscope: flow-limited spilling over the rim
      const cap = holdCapacity(corners, gEff);
      let volume = fracRef.current * area;
      const lipMargin = LIP * area;
      if (!spillingRef.current && volume > cap + lipMargin) spillingRef.current = true;
      let spilling = false;
      if (spillingRef.current) {
        if (volume <= cap + 1e-6) {
          spillingRef.current = false;
        } else {
          spilling = true;
          const overflow = volume - cap;
          glugPhaseRef.current += GLUG_FREQ * 2 * Math.PI * dt;
          const glug = 0.12 + 0.88 * (0.5 + 0.5 * Math.sin(glugPhaseRef.current));
          volume -= Math.min(overflow, (DRINK_SPEED * overflow + 0.03 * area) * glug * dt);
          fracRef.current = volume / area;
          const beat = Math.floor(glugPhaseRef.current / (2 * Math.PI));
          if (beat !== lastBeatRef.current) { lastBeatRef.current = beat; buzz(10); }
        }
      }

      // Last-sip haptic cue
      if ((spilling || isDraining) && fracRef.current < 0.08 && !lastSipRef.current) {
        lastSipRef.current = true;
        buzz([15, 30, 15, 30, 45]);
      }
      if (fracRef.current > 0.15) lastSipRef.current = false;

      // Fire onEmpty once when the glass is empty
      if (fracRef.current <= 0 && !emptyFiredRef.current) {
        emptyFiredRef.current = true;
        if (onEmptyRef.current) onEmptyRef.current();
      }

      const lvl = levelFor(corners, gEff, volume);
      const s = lvl.surfaceDepth;
      const frac = fracRef.current;

      // Foam
      let foam = foamRef.current;
      foam += (0.12 - foam) * Math.min(1, 0.15 * dt);
      if (spilling || isDraining) foam = Math.min(1, foam + 0.7 * dt);
      foam = Math.min(1, foam + Math.min(Math.abs(omegaEffRef.current) * 0.03, 0.4) * dt);
      foamRef.current = foam;

      // Bubbles
      const bubbles = bubblesRef.current;
      if (frac > 0.02) {
        const targetCount = Math.min(BUBBLE_COUNT, Math.round(BUBBLE_RATE * frac * 60));
        let tries = 0;
        while (bubbles.length < targetCount && tries < 12) {
          tries++;
          const p = randInLiquid(halfW, halfH, gEff, s);
          if (p) bubbles.push({ ...p, r: 1.4 + Math.random() * 3.6, speed: 0.002 + Math.random() * 0.0045, alpha: 0.18 + Math.random() * 0.42, wobble: Math.random() * Math.PI * 2 });
        }
      }
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.wobble += 0.03;
        b.x += -gdir.x * b.speed + Math.sin(b.wobble) * 0.0005;
        b.y += -gdir.y * b.speed * 0.8;
        if (b.x < -0.08 || b.x > 1.08 || b.y < -1.08 || b.y > 0.1) respawnBubble(b);
      }

      // Residue drops
      const drops = dropsRef.current;
      const dropping = s > prevSurfRef.current + 0.6;
      prevSurfRef.current = s;
      if (spilling && dropping && lvl.surface.length === 2) {
        for (const e of lvl.surface) {
          if (Math.random() < 0.5 && drops.length < 50)
            drops.push({ x: e.x - gEff.x * 1.5, y: e.y - gEff.y * 1.5, r: 1.2 + Math.random() * 1.8, life: 1.5 + Math.random() * 1.8, max: 3.3 });
        }
      }
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        const slide = 10 + (1 - d.life / d.max) * 14;
        d.x += gEff.x * slide * dt;
        d.y += gEff.y * slide * dt;
        d.life -= dt;
        if (d.life <= 0 || Math.abs(d.x) > halfW || Math.abs(d.y) > halfH || dot(d, gEff) > s) drops.splice(i, 1);
      }

      // ── Draw ─────────────────────────────────────────────────────────────────
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = '#0b0b0d';
      ctx.fillRect(0, 0, cssW, cssH);

      ctx.save();
      ctx.translate(cssW / 2, cssH / 2);
      ctx.scale(1, -1); // math coords: y up

      // Glass background
      drawPoly(ctx, corners);
      ctx.fillStyle = '#141418';
      ctx.fill();

      // Beer liquid
      if (lvl.polygon.length >= 3) {
        drawPoly(ctx, lvl.polygon);
        ctx.fillStyle = '#f4b400';
        ctx.fill();
      }

      // Carbonation bubbles (clipped to liquid polygon)
      if (bubbles.length && lvl.polygon.length >= 3) {
        ctx.save();
        drawPoly(ctx, lvl.polygon);
        ctx.clip();
        for (const b of bubbles) {
          const bx = (b.x - 0.5) * fieldW;
          const sy = surfaceYAtX(lvl.surface, bx);
          if (sy === null) continue;
          const depth = sy + fieldH / 2;
          const by = sy + b.y * depth;
          if (by >= sy - b.r * 1.2) { respawnBubble(b); continue; }

          const g = ctx.createRadialGradient(bx - b.r * 0.35, by + b.r * 0.35, 0, bx, by, b.r * 1.4);
          g.addColorStop(0, `rgba(255,255,245,${b.alpha * 0.96})`);
          g.addColorStop(0.45, `rgba(255,224,130,${b.alpha * 0.38})`);
          g.addColorStop(1, 'rgba(255,200,90,0)');
          ctx.beginPath();
          ctx.arc(bx, by, b.r * dpr, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
          ctx.strokeStyle = `rgba(255,245,210,${b.alpha * 0.72})`;
          ctx.lineWidth = Math.max(0.6, b.r * 0.12) * dpr;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Surface shimmer line
      if (lvl.surface.length === 2) {
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(lvl.surface[0].x, lvl.surface[0].y);
        ctx.lineTo(lvl.surface[1].x, lvl.surface[1].y);
        ctx.stroke();
      }

      // Pour stream animation while filling
      if (refillingRef.current && lvl.surface.length === 2) {
        const sx = 0;
        const sy = surfaceYAtX(lvl.surface, sx) ?? 0;
        const sw = 8 * dpr;
        const streamTop = fieldH / 2;
        const streamBottom = Math.max(sy + 6 * dpr, -fieldH / 2);
        const sg = ctx.createLinearGradient(sx - sw, 0, sx + sw, 0);
        sg.addColorStop(0, 'rgba(160,88,4,0)');
        sg.addColorStop(0.2, 'rgba(210,135,18,0.72)');
        sg.addColorStop(0.5, 'rgba(240,170,30,0.92)');
        sg.addColorStop(0.8, 'rgba(210,135,18,0.72)');
        sg.addColorStop(1, 'rgba(160,88,4,0)');
        ctx.fillStyle = sg;
        ctx.fillRect(sx - sw, streamBottom, sw * 2, streamTop - streamBottom);
        const splash = ctx.createRadialGradient(sx, sy, 0, sx, sy, 10 * dpr);
        splash.addColorStop(0, 'rgba(255,220,100,0.55)');
        splash.addColorStop(1, 'rgba(255,200,60,0)');
        ctx.beginPath();
        ctx.arc(sx, sy, 10 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = splash;
        ctx.fill();
      }

      // Foam collar
      if (frac > 0.001) {
        const fade = Math.min(1, frac / 0.12);
        const thick = FOAM_MAX * foam * fieldH * fade;
        if (thick > 0.5) {
          let band = clipHalfPlane(corners, { x: -gEff.x, y: -gEff.y }, -(s - thick));
          band = clipHalfPlane(band, { x: gEff.x, y: gEff.y }, s);
          if (band.length >= 3) {
            drawPoly(ctx, band);
            ctx.fillStyle = `rgba(245,240,225,${0.88 * Math.min(1, fade * 2)})`;
            ctx.fill();
          }
        }
      }

      // Residue drops
      for (const d of drops) {
        ctx.fillStyle = `rgba(244,180,0,${0.55 * d.life / d.max})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top rim — yellow when spilling (gyroscope), cyan otherwise
      ctx.strokeStyle = spilling ? '#ffd24a' : '#5ad1ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      ctx.lineTo(corners[1].x, corners[1].y);
      ctx.stroke();

      // Bottom rim — yellow when draining via finger hold
      if (isDraining && frac > 0) {
        ctx.strokeStyle = '#ffd24a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(corners[3].x, corners[3].y);
        ctx.lineTo(corners[2].x, corners[2].y);
        ctx.stroke();
      }

      ctx.restore();
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="beer-root">
      <canvas
        ref={canvasRef}
        className="beer-canvas"
        onPointerDown={() => { pointerHeldRef.current = true; }}
        onPointerUp={() => { pointerHeldRef.current = false; }}
        onPointerCancel={() => { pointerHeldRef.current = false; }}
      />

      {needsPermission && (
        <div className="beer-overlay">
          <div className="beer-overlay__header">
            <p className="beer-overlay__title">Antwerp on tap</p>
            <p className="beer-overlay__text">
              Enable motion controls via gyroscope.
            </p>
          </div>
          <button
            className="beer-btn"
            onClick={async () => {
              await tilt.requestPermission();
              await lockPortrait();
              setNeedsPermission(false);
            }}
          >
            Enable
          </button>
          <button
            className="beer-overlay__sub"
            onClick={() => setNeedsPermission(false)}
          >
            Or hold your finger down as an alternative.
          </button>
        </div>
      )}

      {!needsPermission && showHint && (
        <div className="beer-hint">
          <span className="beer-hint__main"> <img src={drinkIcon} alt="Drinken" /></span>
          <span className="beer-hint__or">or</span>
          <span className="beer-hint__sub"><span className='beer-hint__sub-Hold'>Hold</span>To Drink</span>
        </div>
      )}
    </div>
  );
}
