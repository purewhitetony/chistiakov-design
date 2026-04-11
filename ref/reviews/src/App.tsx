/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Testimonial {
  id: number;
  type: 'video' | 'text';
  title: string;
  content: string;
  author: string;
  role: string;
  thumbnail?: string;
  videoUrl?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    type: 'text',
    title: 'TRANSFORMATIVE DESIGN.',
    content: '"Working with the studio was a game-changer. Their creative direction completely revitalized our brand identity."',
    author: 'John D.',
    role: 'CEO at Horizon',
  },
  {
    id: 2,
    type: 'text',
    title: 'EXCEPTIONAL DEVELOPMENT.',
    content: '"The team\'s technical expertise is unmatched. They delivered a complex platform on time and exceeded our expectations."',
    author: 'Sarah L.',
    role: 'Founder of TechNova',
  },
  {
    id: 3,
    type: 'video',
    title: "ALEXANDRA'S EXPERIENCE",
    content: 'Lead Designer, Flora',
    author: 'Alexandra M.',
    role: 'Lead Designer',
    thumbnail: 'https://picsum.photos/seed/alexandra/800/1200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-tablet-41290-large.mp4',
  },
  {
    id: 4,
    type: 'video',
    title: "MAX'S PROJECT",
    content: 'Creative Director, ArtHouse',
    author: 'Max R.',
    role: 'Creative Director',
    thumbnail: 'https://picsum.photos/seed/max/800/1200',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-explaining-something-on-a-whiteboard-41289-large.mp4',
  },
  {
    id: 5,
    type: 'text',
    title: 'INNOVATIVE STRATEGY.',
    content: '"Their strategic approach to user experience resulted in a significant increase in user engagement."',
    author: 'David K.',
    role: 'Product Lead at Elevate',
  },
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(2); // Start with the center one (Alexandra)
  const containerRef = useRef<HTMLDivElement>(null);

  const next = () => setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    let lastScrollTime = 0;
    const cooldown = 500; // ms

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < cooldown) return;

      if (Math.abs(e.deltaY) > 20) {
        if (e.deltaY > 0) {
          next();
        } else {
          prev();
        }
        lastScrollTime = now;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-8 md:p-12 flex justify-between items-start z-50">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-display font-black tracking-tighter uppercase"
        >
          Studio Testimonials
        </motion.h1>
        
        <div className="flex gap-4">
          <button 
            onClick={prev}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={next}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Slider Area */}
      <main className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent pointer-events-none" />
        
        <div className="w-full max-w-[1400px] px-4">
          <div className="relative flex items-center justify-center h-[600px]">
            <motion.div 
              className="flex items-center gap-6 md:gap-12"
              animate={{ x: `calc(50% - ${(activeIndex * 320) + (activeIndex * 48) + 160}px)` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {TESTIMONIALS.map((item, index) => (
                <TestimonialCard 
                  key={item.id} 
                  item={item} 
                  isActive={index === activeIndex} 
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer / Progress */}
      <footer className="fixed bottom-0 left-0 w-full p-8 md:p-12 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="h-[2px] w-full bg-white/10 relative overflow-hidden rounded-full">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-white"
              initial={false}
              animate={{ 
                width: `${((activeIndex + 1) / TESTIMONIALS.length) * 100}%` 
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
          <div className="mt-4 flex justify-between text-[10px] uppercase tracking-[0.2em] font-medium text-white/40">
            <span>01 / {TESTIMONIALS.length.toString().padStart(2, '0')}</span>
            <span>Scroll to explore</span>
            <span>{TESTIMONIALS.length.toString().padStart(2, '0')} / {TESTIMONIALS.length.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface TestimonialCardProps {
  item: Testimonial;
  isActive: boolean;
  onClick: () => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ item, isActive, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      initial={false}
      animate={{ 
        height: isActive ? 560 : 400,
        opacity: isActive ? 1 : 0.4,
        scale: isActive ? 1 : 0.95
      }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`relative w-[320px] rounded-3xl overflow-hidden cursor-pointer group shrink-0 ${
        item.type === 'text' ? 'glass-overlay p-8 flex flex-col justify-between' : ''
      }`}
    >
      {item.type === 'video' ? (
        <>
          <div className="absolute inset-0">
            <video
              src={item.videoUrl}
              poster={item.thumbnail}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Play className="w-6 h-6 fill-white" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8">
            <div className="glass-overlay p-6 rounded-2xl backdrop-blur-xl">
              <h3 className="text-xl font-display font-black uppercase tracking-tighter leading-none mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-white/60 uppercase tracking-widest font-medium">
                {item.content}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="text-2xl font-display font-black uppercase tracking-tighter leading-tight mb-6">
              {item.title}
            </h3>
            <p className="text-lg text-white/80 leading-relaxed font-medium italic">
              {item.content}
            </p>
          </div>
          <div className="mt-auto">
            <p className="text-sm font-bold text-white uppercase tracking-wider">
              - {item.author}, <span className="font-normal text-white/60">{item.role}</span>
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}
