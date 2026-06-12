import { useRef, useEffect } from 'react';
import { animate } from 'animejs';
import { LucideIcon } from 'lucide-react';

interface SocialLinkProps {
  icon: LucideIcon;
  label: string;
  href: string;
  delay?: number;
}

export default function SocialLink({ icon: Icon, label, href, delay = 0 }: SocialLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;

    // Entrance animation
    animate(link, {
      translateX: [-100, 0],
      opacity: [0, 1],
      duration: 800,
      delay: delay,
      ease: 'outExpo',
    });

    // Mouse enter animation
    const handleMouseEnter = () => {
      if (bgRef.current) {
        animate(bgRef.current, {
          width: '100%',
          duration: 300,
          ease: 'outExpo',
        });
      }
      animate(link, {
        scale: 1.02,
        duration: 200,
        ease: 'outExpo',
      });
    };

    // Mouse leave animation
    const handleMouseLeave = () => {
      if (bgRef.current) {
        animate(bgRef.current, {
          width: '0%',
          duration: 300,
          ease: 'outExpo',
        });
      }
      animate(link, {
        scale: 1,
        duration: 200,
        ease: 'outExpo',
      });
    };

    link.addEventListener('mouseenter', handleMouseEnter);
    link.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      link.removeEventListener('mouseenter', handleMouseEnter);
      link.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delay]);

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block overflow-hidden border border-zinc-800 hover:border-red-500 transition-colors duration-300"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        opacity: 0,
      }}
    >
      {/* Animated background */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-0"
        style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.2), transparent)',
        }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Icon
            className="w-6 h-6"
            style={{
              color: '#ef4444',
              filter: 'drop-shadow(0 0 5px #ef4444)',
            }}
          />
          <span
            className="font-mono text-sm tracking-wider uppercase"
            style={{ color: '#fff' }}
          >
            {label}
          </span>
        </div>

        {/* Arrow indicator */}
        <div
          className="text-red-500 font-mono text-xs opacity-50 group-hover:opacity-100 transition-opacity"
          style={{ textShadow: '0 0 5px #ef4444' }}
        >
          {'->'}
        </div>
      </div>

      {/* Glitch line */}
      <div
        className="absolute bottom-0 left-0 h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
          opacity: 0.5,
        }}
      />
    </a>
  );
}
