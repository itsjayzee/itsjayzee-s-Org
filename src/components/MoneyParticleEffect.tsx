import React, { useEffect, useState } from 'react';

export type ParticleAnimationType = 'they_owe' | 'i_owe' | 'settle' | 'loan';

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  animClass: string;
}

interface MoneyParticleEffectProps {
  triggerKey: number;
  type?: ParticleAnimationType;
}

const HAPPY_MONEY_EMOJIS = ['💵', '💰', '🪙', '✨', '💸', '🟢', '🤑'];
const SETTLE_EMOJIS = ['🎉', '✨', '🪙', '✅', '💚', '🌟', '🏆'];
const SAD_OWE_EMOJIS = ['💸', '🥀', '💧', '💔', '📉', '😢', '🌧️', '🪙', '💳'];

export const MoneyParticleEffect: React.FC<MoneyParticleEffectProps> = ({
  triggerKey,
  type = 'they_owe',
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!triggerKey) return;

    const isSad = type === 'i_owe';
    const isSettle = type === 'settle';
    const emojis = isSettle ? SETTLE_EMOJIS : isSad ? SAD_OWE_EMOJIS : HAPPY_MONEY_EMOJIS;
    const count = isSad ? 16 : 18;
    const startX = window.innerWidth / 2;
    // Sad particles start higher up and drop downward like raindrops/tears and lost cash
    const startY = isSad ? window.innerHeight * 0.35 : window.innerHeight * 0.7;

    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.max(20, Math.min(window.innerWidth - 60, startX + (Math.random() - 0.5) * 360)),
      y: startY + (Math.random() - 0.5) * 90,
      scale: isSad ? Math.random() * 0.5 + 0.85 : Math.random() * 0.6 + 0.8,
      rotation: (Math.random() - 0.5) * 50,
      animClass: isSad ? 'animate-sad-drop' : 'animate-float-fade',
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 2200);

    return () => clearTimeout(timer);
  }, [triggerKey, type]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`absolute select-none text-2xl filter drop-shadow-md ${p.animClass}`}
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `scale(${p.scale}) rotate(${p.rotation}deg)`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};
