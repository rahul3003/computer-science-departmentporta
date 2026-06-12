'use client';

import { useState } from 'react';

const galleryItems = [
  {
    id: 'g1',
    title: 'Software Development Centre',
    category: 'LABS',
    description: 'Students working on dynamic web application designs and databases.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g2',
    title: 'PC Hardware & Networking Lab',
    category: 'LABS',
    description: 'Hands-on training session on routers, patch panels, and assembly boards.',
    imageUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g3',
    title: 'State Level Web Hackathon winners',
    category: 'EVENTS',
    description: 'Celebrating 2nd place achievement in front-end design competitions.',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g4',
    title: 'IoT Raspberry Pi Hardware Setup',
    category: 'LABS',
    description: 'Connecting temperature telemetry nodes in IT Skills Lab.',
    imageUrl: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g5',
    title: 'Guest Lecture on AWS Infrastructure',
    category: 'SEMINARS',
    description: 'Detailed webinar presentation on cloud deployments and RDS security.',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g6',
    title: 'Annual Project Exhibition 2025',
    category: 'EVENTS',
    description: 'Showcasing functional student systems to college board directors.',
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80'
  }
];

export default function Gallery() {
  const [filter, setFilter] = useState('ALL');

  const categories = ['ALL', 'LABS', 'EVENTS', 'SEMINARS'];

  const filteredItems = galleryItems.filter((item) => {
    return filter === 'ALL' || item.category === filter;
  });

  return (
    <div className="bg-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8 flex-grow">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="text-xs font-bold text-[#4a2c2a] tracking-wider uppercase bg-[#f3ede2] border border-[#ede6dc] px-3 py-1 rounded-full">
            Campus Life
          </span>
          <h1 className="text-4xl font-extrabold text-[#2d1b18] tracking-tight">
            Photo Gallery
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 text-sm">
            Browse highlights of our computer science labs, expert seminars, and student technical achievements.
          </p>
        </div>

        {/* Categories Tab selector */}
        <div className="flex bg-[#faf7f2] border border-[#ede6dc] p-1 rounded-2xl max-w-md mx-auto items-center justify-between">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="flex-1 py-2 rounded-xl text-xs font-bold text-center cursor-pointer transition-all duration-300 data-[active=true]:bg-[#4a2c2a] data-[active=true]:text-white text-[#4a2c2a]/70 hover:text-[#4a2c2a]"
              data-active={filter === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group bg-[#faf7f2] border border-[#ede6dc] hover:border-[#4a2c2a]/20 rounded-3xl overflow-hidden shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image box */}
              <div className="relative overflow-hidden aspect-video">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/95 border border-[#ede6dc] text-[#4a2c2a]">
                  {item.category}
                </span>
              </div>

              {/* Text Description */}
              <div className="p-5 flex-grow space-y-1.5">
                <h3 className="text-[#2d1b18] font-bold text-base">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No images found in this filter category.</p>
          </div>
        )}

      </div>
    </div>
  );
}
