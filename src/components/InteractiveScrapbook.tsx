import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, User, Briefcase, GraduationCap, Cpu, Image as ImageIcon, QrCode } from 'lucide-react';

interface ScrapbookElement {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bounds: { top: number; left: number; width: number; height: number };
  accentColor: string;
  content: React.ReactNode;
}

const SCRAPBOOK_ELEMENTS: ScrapbookElement[] = [
  {
    id: 'id-card',
    title: 'Identity & Profile',
    subtitle: 'Miles T. - Multimedia Artist',
    icon: <User className="w-5 h-5" />,
    bounds: { top: 6, left: 5, width: 45, height: 21 },
    accentColor: '#3B82F6',
    content: (
      <div className="space-y-4">
        <p className="text-[#D8CBB7]">
          <strong>Role:</strong> Graphic Designer, Video Editor, VFX Artist
        </p>
        <p className="text-[#D8CBB7]">
          <strong>Location:</strong> Laguna, Philippines
        </p>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
          <p className="text-sm font-mono text-[#F4E7C8]">+63 931 000 0000</p>
          <p className="text-sm font-mono text-[#F4E7C8]">miles2026_1@gmail.com</p>
          <p className="text-sm font-mono text-[#3B82F6]">xdxdxd.myportfolio.com</p>
        </div>
      </div>
    ),
  },
  {
    id: 'qr-code',
    title: 'Portfolio Gateway',
    subtitle: 'Scan to View Works',
    icon: <QrCode className="w-5 h-5" />,
    bounds: { top: 5, left: 58, width: 33, height: 16 },
    accentColor: '#10B981',
    content: (
      <div className="space-y-4 text-center">
        <div className="inline-block p-4 bg-white rounded-2xl">
          <QrCode className="w-32 h-32 text-black" />
        </div>
        <p className="text-[#D8CBB7]">
          Direct link to my complete digital portfolio, featuring high-res motion graphics, VFX breakdowns, and 2D animations.
        </p>
      </div>
    ),
  },
  {
    id: 'about-watch',
    title: 'About Me',
    subtitle: 'Freelance Multimedia Artist',
    icon: <Sparkles className="w-5 h-5" />,
    bounds: { top: 26, left: 15, width: 32, height: 20 },
    accentColor: '#F59E0B',
    content: (
      <div className="space-y-4">
        <p className="text-[#D8CBB7] leading-relaxed">
          I am a <strong className="text-white">Freelance Multimedia Artist</strong> who has been working since 2019. Alongside freelance work, I have contributed as a <strong className="text-white">VFX Artist on 14 Feature Films</strong> produced under <strong className="text-white">Viva Films</strong>.
        </p>
        <p className="text-[#D8CBB7] leading-relaxed">
          My practice extends across <strong className="text-white">Motion Graphics, 2D Animation, and Photo Manipulation</strong> crafting impactful visuals that bring ideas and stories to life.
        </p>
      </div>
    ),
  },
  {
    id: 'experience-shop',
    title: 'The Experience Shop',
    subtitle: 'Professional Timeline',
    icon: <Briefcase className="w-5 h-5" />,
    bounds: { top: 22, left: 50, width: 45, height: 48 },
    accentColor: '#EF4444',
    content: (
      <div className="space-y-6">
        {[
          { role: 'Graphic Designer', type: 'Freelancing, Viva Films', date: '2019 - 2026' },
          { role: 'Video Editor', type: 'Freelancing, Viva Films', date: '2020 - 2026' },
          { role: 'Graphic FX', type: 'Freelancing, Viva Films', date: '2020 - 2026' },
          { role: 'VFX Artist', type: 'Viva Films', date: '2019 - 2025', highlight: true },
          { role: 'Motion Graphics Artist', type: 'Freelancing, Viva Films', date: '2019 - 2026' },
        ].map((job, idx) => (
          <div key={idx} className="flex justify-between items-start border-b border-white/10 pb-4 last:border-0">
            <div>
              <h4 className={`font-bold ${job.highlight ? 'text-[#EF4444]' : 'text-[#F4E7C8]'}`}>
                {job.role}
              </h4>
              <p className="text-xs text-[#D8CBB7]/70 italic mt-1">{job.type}</p>
            </div>
            <span className="font-mono text-sm text-[#D8CBB7]">{job.date}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'education',
    title: 'Education & Abilities',
    subtitle: 'Academic Background & Core Strengths',
    icon: <GraduationCap className="w-5 h-5" />,
    bounds: { top: 48, left: 7, width: 42, height: 32 },
    accentColor: '#8B5CF6',
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-bold text-[#F4E7C8] border-b border-white/10 pb-2 mb-3">Education</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between">
                <span className="font-bold text-white">Senior Highschool</span>
                <span className="font-mono text-sm text-[#D8CBB7]">2016 - 2018</span>
              </div>
              <p className="text-sm text-[#D8CBB7]/80">ICT - Animation (Mapua Malayan Colleges Laguna)</p>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="font-bold text-white">Highschool</span>
                <span className="font-mono text-sm text-[#D8CBB7]">2013 - 2016</span>
              </div>
              <p className="text-sm text-[#D8CBB7]/80">Cabuyao National Highschool</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#F4E7C8] border-b border-white/10 pb-2 mb-3">Abilities</h4>
          <div className="flex flex-wrap gap-2">
            {['Motion Graphics', 'Video Editing', 'Photo Manipulation', 'Graphic Designing', 'Digital Painting', 'Vector Illustration'].map((ability) => (
              <span key={ability} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-[#D8CBB7]">
                {ability}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'software',
    title: 'Software Proficiency',
    subtitle: 'Creative Suite Toolkit',
    icon: <Cpu className="w-5 h-5" />,
    bounds: { top: 71, left: 52, width: 42, height: 26 },
    accentColor: '#06B6D4',
    content: (
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: 'After Effects', color: 'bg-purple-900/50 border-purple-500/50 text-purple-200' },
          { name: 'Photoshop', color: 'bg-blue-900/50 border-blue-500/50 text-blue-200' },
          { name: 'Premiere Pro', color: 'bg-indigo-900/50 border-indigo-500/50 text-indigo-200' },
          { name: 'Illustrator', color: 'bg-orange-900/50 border-orange-500/50 text-orange-200' },
        ].map((app) => (
          <div key={app.name} className={`flex items-center justify-center p-6 rounded-xl border ${app.color} font-bold text-lg`}>
            {app.name}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'soft-skills',
    title: 'Soft Skills',
    subtitle: 'Professional Attributes',
    icon: <ImageIcon className="w-5 h-5" />,
    bounds: { top: 81, left: 7, width: 42, height: 17 },
    accentColor: '#EC4899',
    content: (
      <div className="flex flex-col gap-3">
        {['Adaptability', 'Communication', 'Collaboration', 'Problem-solving'].map((skill, idx) => (
          <div key={skill} className="flex items-center gap-4">
            <span className="text-2xl font-black text-white/20">0{idx + 1}</span>
            <span className="text-xl font-bold text-[#F4E7C8]">{skill}</span>
          </div>
        ))}
      </div>
    ),
  }
];

export function InteractiveScrapbook() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<ScrapbookElement | null>(null);

  return (
    <div className="relative w-full bg-black shadow-2xl py-12 overflow-hidden border-t border-[#F4E7C8]/10">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-[#F4E7C8]/15 text-xs font-semibold text-[#F4E7C8] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span className="tracking-widest uppercase font-mono">SEC_03 // MULTIMEDIA DOSSIER</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-[#F4E7C8]">
          Interactive Creative Portfolio
        </h2>
        <p className="text-[#D8CBB7] mt-3 max-w-2xl font-light text-sm sm:text-base mx-auto sm:mx-0">
          Hover and click on the scrapbook elements below to unseal details regarding experience, education, software stack, and creative abilities.
        </p>
      </div>

      {/* Main Interactive Canvas Wrapper */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        <div className="relative w-full aspect-[1200/1680] max-h-[85vh] sm:max-h-[1200px] mx-auto group select-none animate-float drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)]">
          
          {/* Base Image with Floating 3D and Transparency */}
          <img 
            src="/fl.jpg" 
            alt="Multimedia Portfolio Scrapbook" 
            className="w-full h-full object-cover rounded-xl sm:rounded-3xl"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 70%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse at center, black 70%, transparent 100%)'
            }}
          />

          {/* Interactive Hotspots Overlay */}
          <div className="absolute inset-0 z-10">
            {SCRAPBOOK_ELEMENTS.map((el) => {
              const isHovered = hoveredId === el.id;
              
              return (
                <div
                  key={el.id}
                  className="absolute cursor-pointer transition-all duration-300"
                  style={{
                    top: `${el.bounds.top}%`,
                    left: `${el.bounds.left}%`,
                    width: `${el.bounds.width}%`,
                    height: `${el.bounds.height}%`,
                  }}
                  onMouseEnter={() => setHoveredId(el.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedElement(el)}
                >
                  <div 
                    className={`w-full h-full rounded-2xl border-2 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] ${
                      isHovered ? 'opacity-100 scale-[1.02] shadow-2xl' : 'opacity-0 scale-100'
                    }`}
                    style={{
                      borderColor: el.accentColor,
                      backgroundColor: `${el.accentColor}20`, 
                    }}
                  >
                    {/* Hover Tooltip / Hint */}
                    <div 
                      className={`absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl border bg-black/90 backdrop-blur-md shadow-2xl flex items-center gap-2 whitespace-nowrap transition-all duration-300 pointer-events-none ${
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                      style={{ borderColor: `${el.accentColor}50` }}
                    >
                      <div className="text-white">{el.icon}</div>
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">{el.title}</div>
                        <div className="text-[10px] text-[#D8CBB7]">{el.subtitle}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Pop-up Modal Dialog */}
      <AnimatePresence>
        {selectedElement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedElement(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-black border shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden z-10"
              style={{ borderColor: `${selectedElement.accentColor}40` }}
            >
              {/* Modal Header */}
              <div 
                className="p-6 border-b"
                style={{ 
                  borderColor: `${selectedElement.accentColor}20`,
                  backgroundColor: `${selectedElement.accentColor}10` 
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: selectedElement.accentColor }}
                    >
                      {selectedElement.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-black text-white">
                        {selectedElement.title}
                      </h3>
                      <p className="text-sm font-mono" style={{ color: selectedElement.accentColor }}>
                        {selectedElement.subtitle}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedElement(null)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {selectedElement.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
