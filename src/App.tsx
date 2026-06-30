import { useState, useEffect, useRef } from 'react';
import { animate } from 'animejs';
import {
  Youtube,
  Twitter,
  Instagram,
  Twitch,
  Music,
  MessageCircle,
  Music2,
} from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import AnimatedBackground from './components/AnimatedBackground';
import SocialLink from './components/SocialLink';
import Profile3D from './components/Profile3D';
import DonationMenu from './components/DonationMenu';
import hakaseImg from './img/Hakase.png';

const socialLinks = [
  { icon: Music2, label: 'TikTok', href: 'https://www.tiktok.com/@haskaseshiro0' },
  { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@ShironoHakase' },
  { icon: Twitch, label: 'Twitch', href: 'https://www.twitch.tv/hakaseshiro7' },
  { icon: Twitter, label: 'Twitter / X', href: 'https://x.com/HakaseShiro' },
  { icon: Instagram, label: 'Instagram (BELUM ADA)', href: 'https://instagram.com' },
  { icon: Music, label: 'Spotify', href: 'https://open.spotify.com/user/31wkz7xsm7ku4phsag67k5ynioje' },
  { icon: MessageCircle, label: 'Discord', href: 'https://discord.gg' },
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;

    // Persona-style menu stagger animation
    const menuSections = document.querySelectorAll('.menu-section');
    menuSections.forEach((section, index) => {
      animate(section as HTMLElement, {
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        delay: 300 + index * 100,
        ease: 'outExpo',
      });
    });
  }, [loading]);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-black text-white overflow-hidden"
    >
      {/* Animated background */}
      <AnimatedBackground />

      {/* Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
        }}
      />

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 py-12 md:py-20">
        {/* 3D Profile section */}
        <div className="menu-section mb-12" style={{ opacity: 0 }}>
          <Profile3D
            imageUrl={hakaseImg}
            name="Hakase"
          />
        </div>

        {/* Title section */}
        <div className="menu-section text-center mb-6" style={{ opacity: 0 }}>
          <h1
            className="text-2xl md:text-4xl font-bold font-mono tracking-wider mb-2"
            style={{
              color: '#fff',
              textShadow: '0 0 20px #ef4444, 0 0 40px rgba(239, 68, 68, 0.5)',
            }}
          >
            HAKASE SHIRO
          </h1>
          <p className="text-sm md:text-base font-mono text-gray-400 max-w-sm">
            Digital creator / Streamer / Tech Enthusiast / Horror Fanatic 
          </p>
        </div>

        {/* Donation Menu */}
        <div className="menu-section mb-6" style={{ opacity: 0 }}>
          <DonationMenu />
        </div>

        {/* Social links container */}
        <div className="menu-section w-full max-w-md space-y-3 px-4" style={{ opacity: 0 }}>
          {socialLinks.map((link, index) => (
            <SocialLink
              key={link.label}
              icon={link.icon}
              label={link.label}
              href={link.href}
              delay={800 + index * 100}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="menu-section mt-12 text-center" style={{ opacity: 0 }}>
          <div className="text-xs font-mono text-gray-600 mb-4">
            {'>//'} CLICK TO CONNECT {'<'}
          </div>
          <div
            className="flex items-center justify-center gap-4 text-xs font-mono text-gray-700"
          >
            <span>Hakase.VER_2.0</span>
            <span className="text-red-500">|</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </main>

      {/* Corner decorations */}
      <div className="fixed top-4 left-4 z-20 text-xs font-mono text-red-500 opacity-30 hidden md:block">
        <div>SYS.STATUS: ACTIVE</div>
        <div className="mt-1">{'>'} 00101100</div>
      </div>
      <div className="fixed top-4 right-4 z-20 text-xs font-mono text-red-500 opacity-30 hidden md:block">
        <div>{'<'}/NODE{'>'}</div>
        <div className="mt-1 text-right">READY</div>
      </div>
      <div className="fixed bottom-4 left-4 z-20 text-xs font-mono text-red-500 opacity-30 hidden md:block">
        <div>BIO.LOADED</div>
      </div>
      <div className="fixed bottom-4 right-4 z-20 text-xs font-mono text-red-500 opacity-30 hidden md:block">
        <div className="text-right">CONNECT://_</div>
      </div>
    </div>
  );
}
