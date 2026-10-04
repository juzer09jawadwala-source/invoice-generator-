import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Shield, Zap, Box, Lock, X } from 'lucide-react';

interface FeatureSection {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  icon: React.ReactNode;
  accentColor: string;
}

const FEATURES: FeatureSection[] = [
  {
    id: 'sec-01',
    number: '01',
    title: 'Architectural Blueprint Layouts',
    subtitle: 'Dynamic rendering engine for invoices',
    description: 'Transform mundane billing into striking editorial pieces. Our engine uses dynamic geometric grids and Noir-inspired aesthetics to instantly structure your line items into beautifully legible, high-contrast documents.',
    imageSrc: '/new-sec/1.jpg',
    icon: <Box className="w-5 h-5" />,
    accentColor: '#E85D3F', // Orange
  },
  {
    id: 'sec-02',
    number: '02',
    title: 'Cryptographic Settlement',
    subtitle: 'Secure payment routing & API pipelines',
    description: 'Bypass traditional gateways with direct cryptographic payment pipelines. Generate instant UPI QR codes mapped specifically to each invoice, resulting in zero-fee, instant bank-to-bank settlements.',
    imageSrc: '/new-sec/2.jpg',
    icon: <Lock className="w-5 h-5" />,
    accentColor: '#3B82F6', // Blue
  },
  {
    id: 'sec-03',
    number: '03',
    title: 'Real-time Drift Detection',
    subtitle: 'Variance & currency fluctuation monitoring',
    description: 'Stay ahead of international currency changes and tax variances. The system automatically recalculates cross-border rates and tax jurisdictions in real-time, displaying drift metrics on your dashboard.',
    imageSrc: '/new-sec/3.jpg',
    icon: <Zap className="w-5 h-5" />,
    accentColor: '#10B981', // Green
  },
  {
    id: 'sec-04',
    number: '04',
    title: 'Immutable Ledger Vault',
    subtitle: 'Offline backup & compliance preservation',
    description: 'Every generated docket is cryptographically sealed and archived in our immutable ledger. Access past invoices, track revisions, and maintain complete tax compliance with our robust archival system.',
    imageSrc: '/new-sec/4.jpg',
    icon: <Shield className="w-5 h-5" />,
    accentColor: '#F59E0B', // Amber
  },
];

export function FeatureShowcase() {
  const [selectedImage, setSelectedImage] = useState<FeatureSection | null>(null);

  return (
    <div className="w-full bg-[#050505] flex flex-col items-center">
      
      {/* Introduction Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-white/70 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#E85D3F]" />
          <span className="tracking-widest uppercase font-mono">SEC_04 // CORE ARCHITECTURE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-[#F4E7C8]">
          System <span className="text-[#E85D3F]">Capabilities</span>
        </h2>
      </div>

      {/* 4 Alternating Sections */}
      <div className="w-full flex flex-col">
        {FEATURES.map((feature, index) => {
          const isEven = index % 2 === 0;

          return (
            <section 
              key={feature.id}
              className={`w-full py-16 sm:py-24 border-t border-white/5 relative overflow-hidden ${
                isEven ? 'bg-[#0B0B0C]' : 'bg-[#080809]'
              }`}
            >
              {/* Background ambient glow based on accent color */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-10 pointer-events-none"
                style={{ backgroundColor: feature.accentColor }}
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className={`flex flex-col gap-12 lg:gap-20 items-center ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}>
                  
                  {/* Text Content */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex-1 space-y-6 z-10"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-5xl md:text-7xl font-heading font-black text-white/5">
                        {feature.number}
                      </span>
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-white/10"
                        style={{ backgroundColor: `${feature.accentColor}20`, color: feature.accentColor }}
                      >
                        {feature.icon}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-3xl md:text-4xl font-heading font-bold text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm font-mono tracking-wide uppercase" style={{ color: feature.accentColor }}>
                        {feature.subtitle}
                      </p>
                    </div>

                    <p className="text-[#D8CBB7]/80 text-lg leading-relaxed max-w-xl">
                      {feature.description}
                    </p>

                    <button 
                      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all font-medium mt-4"
                    >
                      <span>Explore Module</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: feature.accentColor }}/>
                    </button>
                  </motion.div>

                  {/* Image Content (Interactive) */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex-1 w-full max-w-2xl lg:max-w-none z-10"
                  >
                    <div 
                      className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-2xl border border-white/10"
                      onClick={() => setSelectedImage(feature)}
                    >
                      {/* Interactive Hover Glow */}
                      <div className="absolute inset-0 z-20 border-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: feature.accentColor }} />
                      
                      <img 
                        src={feature.imageSrc} 
                        alt={feature.title}
                        className="w-full h-full object-cover filter brightness-[0.85] contrast-125 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                      
                      {/* Click overlay hint */}
                      <div className="absolute inset-0 z-10 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-sm font-bold tracking-wider uppercase shadow-xl flex items-center gap-2">
                          <Sparkles className="w-4 h-4" style={{ color: feature.accentColor }} />
                          Enlarge Image
                        </div>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Pop-up Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-6xl max-h-[90vh] flex flex-col bg-[#050505] rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.5)] overflow-hidden z-10"
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-black text-white/20">{selectedImage.number}</div>
                  <h3 className="text-xl font-bold text-white tracking-wide">{selectedImage.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative flex-1 overflow-hidden bg-black/50 p-4 sm:p-8 flex items-center justify-center">
                <img 
                  src={selectedImage.imageSrc} 
                  alt={selectedImage.title}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
