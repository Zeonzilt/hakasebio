import { useEffect, useRef } from 'react';
import { animate, utils } from 'animejs';

const assemblySnippets = [
  'MOV EAX, 0x01',
  'PUSH EBX',
  'CALL INIT',
  'XOR ECX, ECX',
  'JMP MAIN',
  'CMP AL, 0xFF',
  'RET',
  'POP ESI',
  'LEA EDI, [EBP+8]',
  'LOOP START',
  'INT 0x21',
  'NOP',
  'MOVZX EAX, AL',
  'ADD ESP, 4',
  'SUB ECX, 1',
  'TEST AL, AL',
  'SHL EAX, 2',
  'AND EDX, 0x0F',
];

const binaryStrings = [
  '01100101',
  '10101010',
  '11001100',
  '01010101',
  '11110000',
  '00001111',
  '10110101',
  '01011010',
];

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('.code-column') as NodeListOf<HTMLElement>;

    elements.forEach((el, index) => {
      animate(el, {
        translateY: ['0%', '-100%'],
        duration: 15000 + Math.random() * 15000,
        loop: true,
        ease: 'linear',
        delay: index * 500,
      });
    });

    // Glitch effect on random elements
    const glitchElements = container.querySelectorAll('.glitch-text') as NodeListOf<HTMLElement>;
    glitchElements.forEach((el) => {
      const glitch = () => {
        animate(el, {
          translateX: [Math.random() * 6 - 3, 0],
          skewX: [Math.random() * 10 - 5, 0],
          duration: 100,
          ease: 'linear',
        });
      };

      const interval = setInterval(glitch, 2000 + Math.random() * 3000);
      return () => clearInterval(interval);
    });
  }, []);

  const generateColumn = (type: 'binary' | 'asm', count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      if (type === 'binary') {
        return binaryStrings[Math.floor(Math.random() * binaryStrings.length)];
      }
      return assemblySnippets[Math.floor(Math.random() * assemblySnippets.length)];
    });
  };

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, #000 70%)',
        }}
      />

      {/* Matrix-style columns */}
      <div className="absolute inset-0 flex justify-between px-4 opacity-20">
        {Array.from({ length: 12 }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="code-column flex flex-col gap-4 text-xs font-mono"
            style={{
              color: colIndex % 2 === 0 ? '#ef4444' : '#fff',
              textShadow: `0 0 5px ${colIndex % 2 === 0 ? '#ef4444' : '#fff'}`,
            }}
          >
            {generateColumn(colIndex % 3 === 0 ? 'asm' : 'binary', 30).map((text, i) => (
              <div key={i} className="glitch-text whitespace-nowrap">
                {text}
              </div>
            ))}
            <div style={{ height: '50vh' }} />
            {generateColumn(colIndex % 3 === 0 ? 'asm' : 'binary', 30).map((text, i) => (
              <div key={i} className="glitch-text whitespace-nowrap">
                {text}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? '#ef4444' : '#fff',
              boxShadow: `0 0 ${Math.random() * 10 + 5}px ${i % 2 === 0 ? '#ef4444' : '#fff'}`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.8) 100%)',
        }}
      />
    </div>
  );
}
