import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import { playKeyClick, playLineOk, playWelcomeFanfare } from '../utils/sounds';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState<'typing' | 'loading' | 'complete'>('typing');
  const fanfarePlayed = useRef(false);

  const bootLines = [
    'SYSTEM://INITIALIZING...',
    'USER://HAKASE_SHIRO',
    'ACCESS://GRANTED',
  ];

  // Typing effect with keyboard sounds
  useEffect(() => {
    if (loadingPhase !== 'typing') return;
    const currentText = bootLines[currentLine];
    if (!currentText) { setLoadingPhase('loading'); return; }

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= currentText.length) {
        setTypedText(currentText.slice(0, charIndex));

        // Play click for each character revealed
        if (charIndex > 0 && charIndex <= currentText.length) {
          const ch = currentText[charIndex - 1];
          if (ch === ' ') {
            playKeyClick('space');
          } else {
            playKeyClick('normal');
          }
        }
        charIndex++;
      } else {
        clearInterval(typeInterval);
        // Enter / line-done sound
        playKeyClick('enter');
        setTimeout(() => playLineOk(), 80);

        setTimeout(() => {
          if (currentLine < bootLines.length - 1) {
            setCurrentLine(prev => prev + 1);
            setTypedText('');
          } else {
            setLoadingPhase('loading');
          }
        }, 250);
      }
    }, 45);

    return () => clearInterval(typeInterval);
  }, [currentLine, loadingPhase]);

  // Loading bar
  useEffect(() => {
    if (loadingPhase !== 'loading') return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setLoadingPhase('complete'); return 100; }
        return prev + 2;
      });
    }, 35);
    return () => clearInterval(interval);
  }, [loadingPhase]);

  // Welcome fanfare + exit animation
  useEffect(() => {
    if (loadingPhase !== 'complete') return;
    const container = containerRef.current;
    if (!container) return;

    // Play fanfare once
    if (!fanfarePlayed.current) {
      fanfarePlayed.current = true;
      playWelcomeFanfare();
    }

    // Hold welcome screen briefly, then fade out
    setTimeout(() => {
      animate(container, {
        opacity: 0,
        scale: 0.95,
        duration: 700,
        ease: 'inExpo',
        onComplete,
      });
    }, 1600);
  }, [loadingPhase, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
    >
      {/* === BACKGROUND SCENE === */}

      {/* 3D Perspective tunnel rings */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '600px' }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              border: `1px solid rgba(239,68,68,${0.35 - i * 0.025})`,
              borderRadius: '50%',
              transform: `translateZ(${-i * 80}px)`,
              animation: `tunnelPulse ${2 + i * 0.15}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Rotating hexagonal grid */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-30"
        style={{ animation: 'slowSpin 60s linear infinite' }}
      >
        <svg width="800" height="800" viewBox="0 0 800 800" style={{ position: 'absolute' }}>
          {Array.from({ length: 6 }).map((_, ring) =>
            Array.from({ length: 6 + ring * 6 }).map((_, i) => {
              const total = 6 + ring * 6;
              const angle = (i / total) * Math.PI * 2;
              const radius = 60 + ring * 80;
              const x = 400 + Math.cos(angle) * radius;
              const y = 400 + Math.sin(angle) * radius;
              const size = 20 - ring * 2;
              return (
                <polygon
                  key={`${ring}-${i}`}
                  points={`${x},${y - size} ${x + size * 0.866},${y - size * 0.5} ${x + size * 0.866},${y + size * 0.5} ${x},${y + size} ${x - size * 0.866},${y + size * 0.5} ${x - size * 0.866},${y - size * 0.5}`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="0.5"
                  opacity={0.6 - ring * 0.08}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* Orbiting particles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[120, 200, 290].map((radius, ri) => (
          <div
            key={ri}
            className="absolute"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              animation: `orbit${ri} ${8 + ri * 4}s linear infinite`,
            }}
          >
            {Array.from({ length: 3 + ri }).map((_, pi) => {
              const angle = (pi / (3 + ri)) * 360;
              return (
                <div
                  key={pi}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    background: pi % 2 === 0 ? '#ef4444' : '#fff',
                    boxShadow: `0 0 8px ${pi % 2 === 0 ? '#ef4444' : '#fff'}`,
                    top: `${radius - 3}px`,
                    left: `${radius - 3}px`,
                    transform: `rotate(${angle}deg) translateX(${radius}px)`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Center glow core */}
      <div
        className="absolute"
        style={{
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
          animation: 'glowPulse 2s ease-in-out infinite',
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.6) 2px, rgba(0,0,0,0.6) 4px)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* === TERMINAL UI === */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div
          className="bg-black/85 backdrop-blur rounded-lg overflow-hidden"
          style={{
            border: '1px solid rgba(239,68,68,0.25)',
            boxShadow: '0 0 40px rgba(239,68,68,0.12), 0 20px 60px rgba(0,0,0,0.8)',
          }}
        >
          {/* Terminal titlebar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/80" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs font-mono text-zinc-500 tracking-wider">terminal@creator:~</span>
          </div>

          {/* Terminal body */}
          <div className="p-5 font-mono text-sm space-y-2 min-h-[140px]">
            {bootLines.slice(0, currentLine + 1).map((line, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-red-500 select-none">$</span>
                <span className={idx < currentLine ? 'text-zinc-500' : 'text-white'}>
                  {idx === currentLine ? typedText : line}
                  {idx === currentLine && loadingPhase === 'typing' && (
                    <span
                      className="inline-block w-2 h-4 bg-red-500 ml-0.5 align-middle"
                      style={{ animation: 'blink 0.8s step-end infinite' }}
                    />
                  )}
                </span>
                {idx < currentLine && (
                  <span className="text-green-500 text-xs ml-auto">[OK]</span>
                )}
              </div>
            ))}

            {loadingPhase === 'loading' && (
              <div className="pt-2 space-y-2">
                <div className="text-zinc-500 text-xs">LOADING SYSTEM...</div>
                <div className="relative w-full h-1.5 rounded overflow-hidden" style={{ background: '#111' }}>
                  <div
                    className="h-full rounded transition-all duration-75"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #7f1d1d, #ef4444, #fca5a5)',
                      boxShadow: '0 0 12px #ef4444',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span className="text-red-500/60">{'>'}{'>'} BOOTING</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}

            {loadingPhase === 'complete' && (
              <div className="pt-2 space-y-1">
                <div className="text-green-400 flex items-center gap-2">
                  <span className="text-green-500">$</span>
                  <span
                    style={{
                      textShadow: '0 0 10px #22c55e',
                      animation: 'welcomeGlow 1s ease-in-out infinite alternate',
                    }}
                  >
                    WELCOME, HAKASE_SHIRO
                  </span>
                  <span
                    className="inline-block w-2 h-4 bg-green-500 ml-0.5 align-middle"
                    style={{ animation: 'blink 0.8s step-end infinite' }}
                  />
                </div>
                <div className="text-xs text-zinc-600 pl-4">{'>'} Session started. Loading profile...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Corner tags */}
      <div className="absolute top-4 left-4 text-xs font-mono text-red-500/25">v2.0.6</div>
      <div className="absolute top-4 right-4 text-xs font-mono text-red-500/25">SECURE</div>
      <div className="absolute bottom-4 left-4 text-xs font-mono text-red-500/25">NODE:ACTIVE</div>
      <div className="absolute bottom-4 right-4 text-xs font-mono text-red-500/25">ENC:AES256</div>

      <style>{`
        @keyframes tunnelPulse {
          from { opacity: 0.4; }
          to   { opacity: 0.9; }
        }
        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbit0 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbit1 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%       { transform: scale(1.4); opacity: 1; }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes welcomeGlow {
          from { text-shadow: 0 0 6px #22c55e; }
          to   { text-shadow: 0 0 20px #22c55e, 0 0 40px #22c55e; }
        }
      `}</style>
    </div>
  );
}
