import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { animate } from 'animejs';
import { Wallet, Coffee, Heart, Zap, Gift, X } from 'lucide-react';

const donationOptions = [
  { icon: Coffee, label: 'Secangkir Kopi', amount: 'Ko-fi', href: 'https://ko-fi.com', color: '#22c55e' },
  { icon: Heart, label: 'Socialbuzz', amount: 'Mediashare', href: 'https://patreon.com', color: '#ef4444' },
  { icon: Zap, label: 'Saweria', amount: 'Mediashare', href: 'https://saweria.co/zeonzilt', color: '#eab308' },
  { icon: Gift, label: 'Paypal Support', amount: 'Paypal', href: 'paypal.me/zeonzil', color: '#ef4444' },
];

function DonationModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    if (!modal || !overlay) return;

    animate(overlay, {
      opacity: [0, 1],
      duration: 300,
      ease: 'outQuad',
    });

    animate(modal, {
      scale: [0.8, 1],
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 400,
      ease: 'outExpo',
    });

    const options = modal.querySelectorAll('.donation-option');
    options.forEach((option, index) => {
      animate(option as HTMLElement, {
        translateX: [-40, 0],
        opacity: [0, 1],
        duration: 350,
        delay: 100 + index * 80,
        ease: 'outExpo',
      });
    });

    // Lock scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    if (!modal || !overlay) { onClose(); return; }

    animate(modal, {
      scale: 0.85,
      opacity: 0,
      translateY: 10,
      duration: 250,
      ease: 'inExpo',
    });
    animate(overlay, {
      opacity: 0,
      duration: 300,
      ease: 'outQuad',
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        opacity: 0,
      }}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-sm"
        style={{ opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow halo */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.15) 0%, transparent 70%)',
            filter: 'blur(20px)',
            transform: 'scale(1.2)',
          }}
        />

        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            background: 'rgba(8, 8, 8, 0.97)',
            border: '1px solid rgba(239,68,68,0.3)',
            boxShadow: '0 0 60px rgba(239,68,68,0.15), 0 30px 60px rgba(0,0,0,0.7)',
          }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-red-500/60" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-red-500/60" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <Heart
                className="w-4 h-4 fill-current text-red-500"
                style={{ filter: 'drop-shadow(0 0 6px #ef4444)', animation: 'pulseHeart 1.5s ease-in-out infinite' }}
              />
              <span className="font-mono text-sm font-bold tracking-widest text-white uppercase">
                Support Creator
              </span>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 flex items-center justify-center rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-red-500 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Donation options */}
          <div className="p-4 space-y-2">
            {donationOptions.map((option) => (
              <a
                key={option.label}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className="donation-option group relative flex items-center justify-between px-4 py-3 rounded overflow-hidden transition-all"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  opacity: 0,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${option.color}60`;
                  el.style.background = `${option.color}10`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'rgba(255,255,255,0.06)';
                  el.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: `${option.color}15`, border: `1px solid ${option.color}30` }}
                  >
                    <option.icon
                      className="w-4 h-4"
                      style={{ color: option.color, filter: `drop-shadow(0 0 4px ${option.color})` }}
                    />
                  </div>
                  <span className="font-mono text-sm text-gray-200">{option.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs font-bold tracking-wider"
                    style={{ color: option.color, textShadow: `0 0 8px ${option.color}` }}
                  >
                    {option.amount}
                  </span>
                  <span className="text-zinc-600 font-mono text-xs group-hover:text-zinc-400 transition-colors">-&gt;</span>
                </div>
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-zinc-800/80">
            <p className="text-xs font-mono text-zinc-600 text-center">
              {'>'} Every support fuels more content_
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseHeart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}

export default function DonationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (buttonRef.current) {
      animate(buttonRef.current, {
        scale: [1, 0.94, 1],
        duration: 180,
        ease: 'easeInOutQuad',
        onComplete: () => setIsOpen(true),
      });
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="relative flex items-center gap-3 px-6 py-3 overflow-hidden transition-all"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(239,68,68,0.3)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#ef4444';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(239,68,68,0.2)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.3)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }}
      >
        <Wallet
          className="w-5 h-5"
          style={{ color: '#ef4444', filter: 'drop-shadow(0 0 5px #ef4444)' }}
        />
        <span className="font-mono text-sm tracking-wider uppercase text-white">
          Support Me
        </span>
        {/* Pulsing dot */}
        <div
          className="w-2 h-2 rounded-full ml-1"
          style={{
            background: '#ef4444',
            boxShadow: '0 0 8px #ef4444',
            animation: 'pulseHeart 2s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes pulseHeart {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.4); opacity: 0.6; }
          }
        `}</style>
      </button>

      {isOpen && createPortal(
        <DonationModal onClose={() => setIsOpen(false)} />,
        document.body
      )}
    </>
  );
}
