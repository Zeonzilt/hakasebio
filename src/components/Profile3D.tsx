import { useRef, useEffect, useState } from 'react';
import { animate } from 'animejs';

interface Profile3DProps {
  imageUrl: string;
  name: string;
  status?: string;
}

export default function Profile3D({ imageUrl, name, status = 'ONLINE' }: Profile3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [glitching, setGlitching] = useState(false);

  // Mouse tilt parallax
  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!wrap || !card || !glare) return;

    let raf = 0;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);
      card.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg) translateZ(0)`;
      // Glare follows mouse
      const gx = 50 + currentX * 2;
      const gy = 50 - currentY * 2;
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      targetX = x * 18;
      targetY = -y * 18;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Periodic glitch burst
  useEffect(() => {
    const id = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 180);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);

  // Float bob animation on the whole wrapper
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    animate(wrap, {
      translateY: [-6, 6],
      duration: 3000,
      direction: 'alternate',
      loop: true,
      ease: 'inOutSine',
    });
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center justify-center select-none"
      style={{ width: '180px', height: '200px', perspective: '800px' }}
    >
      {/* === Spinning decorative rings === */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Ring 1: slow clockwise */}
        <svg
          width="200" height="200"
          viewBox="0 0 200 200"
          className="absolute"
          style={{ animation: 'spinCW 12s linear infinite' }}
        >
          <circle cx="100" cy="100" r="88" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 14" opacity="0.5" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="#ef4444" strokeWidth="2"
            strokeDasharray="40 200" strokeLinecap="round" opacity="0.8"
            style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }}
          />
        </svg>

        {/* Ring 2: faster counter-clockwise */}
        <svg
          width="170" height="170"
          viewBox="0 0 170 170"
          className="absolute"
          style={{ animation: 'spinCCW 7s linear infinite' }}
        >
          <circle cx="85" cy="85" r="74" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="3 20" opacity="0.2" />
          <circle cx="85" cy="85" r="74" fill="none" stroke="#ef4444" strokeWidth="1.5"
            strokeDasharray="20 200" strokeLinecap="round" opacity="0.6"
            style={{ filter: 'drop-shadow(0 0 3px #ef4444)' }}
          />
        </svg>

        {/* Ring 3: outermost slowest */}
        <svg
          width="220" height="220"
          viewBox="0 0 220 220"
          className="absolute"
          style={{ animation: 'spinCW 20s linear infinite' }}
        >
          <polygon
            points="110,5 213,57.5 213,162.5 110,215 7,162.5 7,57.5"
            fill="none" stroke="#ef4444" strokeWidth="1"
            strokeDasharray="8 20" opacity="0.25"
          />
          {/* Corner dots on hexagon vertices */}
          {[0,1,2,3,4,5].map(i => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const r = 103;
            return (
              <circle key={i}
                cx={110 + Math.cos(a) * r}
                cy={110 + Math.sin(a) * r}
                r="3" fill="#ef4444" opacity="0.7"
                style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }}
              />
            );
          })}
        </svg>
      </div>

      {/* === 3D card (tilts with mouse) === */}
      <div
        ref={cardRef}
        className="relative"
        style={{
          width: '140px',
          height: '140px',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Hex image frame */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: 'polygon(50% 2%, 97% 26%, 97% 74%, 50% 98%, 3% 74%, 3% 26%)',
          }}
        >
          {/* Image */}
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            style={{
              filter: glitching ? 'hue-rotate(180deg) saturate(3) brightness(1.5)' : 'none',
              transition: glitching ? 'none' : 'filter 0.15s',
            }}
          />

          {/* Red tint overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, transparent 60%)' }}
          />

          {/* Glare layer */}
          <div ref={glareRef} className="absolute inset-0" />

          {/* Scanline sweep */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 4px)',
            }}
          />

          {/* Glitch slice (visible only during glitch) */}
          {glitching && (
            <>
              <div
                className="absolute left-0 right-0"
                style={{
                  top: `${30 + Math.random() * 30}%`,
                  height: '4px',
                  background: '#ef4444',
                  opacity: 0.8,
                  transform: `translateX(${Math.random() * 20 - 10}px)`,
                  mixBlendMode: 'screen',
                }}
              />
              <div
                className="absolute left-0 right-0"
                style={{
                  top: `${55 + Math.random() * 20}%`,
                  height: '2px',
                  background: '#fff',
                  opacity: 0.6,
                  transform: `translateX(${Math.random() * 16 - 8}px)`,
                  mixBlendMode: 'screen',
                }}
              />
            </>
          )}
        </div>

        {/* Hex border glow */}
        <svg
          viewBox="0 0 140 140"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          <polygon
            points="70,3 136,36 136,104 70,137 4,104 4,36"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 6px #ef4444)', opacity: 0.9 }}
          />
          <polygon
            points="70,9 130,40 130,100 70,131 10,100 10,40"
            fill="none"
            stroke="#ef4444"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* === Labels === */}
      <div
        className="absolute -bottom-6 left-0 right-0 text-center"
      >
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono"
          style={{
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(239,68,68,0.3)',
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
              animation: 'blinkDot 1.8s ease-in-out infinite',
            }}
          />
          <span className="text-zinc-300">{name}</span>
          <span className="text-green-500 text-xs ml-1">// {status}</span>
        </div>
      </div>

      {/* Ambient glow underneath */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-6 opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, #ef4444 0%, transparent 70%)',
          filter: 'blur(8px)',
          transform: 'translateX(-50%) translateY(10px)',
        }}
      />

      <style>{`
        @keyframes spinCW  { from { transform: rotate(0deg); }    to { transform: rotate(360deg); } }
        @keyframes spinCCW { from { transform: rotate(0deg); }    to { transform: rotate(-360deg); } }
        @keyframes blinkDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
