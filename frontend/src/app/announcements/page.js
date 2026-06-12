'use client';

import { useState } from 'react';

const mockAnnouncements = [
  {
    id: 'a1',
    title: 'Semester End Board Examinations Timetable',
    content: 'The State Board of Technical Examinations has released the timetables for Semesters 3, 4, 5, and 6. Exams are scheduled to begin on June 15, 2026. Hall tickets will be issued starting June 10 from the department office after clearance of dues.',
    category: 'EXAMS',
    date: 'June 4, 2026',
    attachment: 'Exams_Timetable_June_2026.pdf'
  },
  {
    id: 'a2',
    title: 'On-Campus Placement Drive: Infosys Technologies',
    content: 'Infosys will hold a campus recruitment drive at Sandur Polytechnic for final year CS and Electronics students. The selection process will feature a written aptitude test followed by technical interviews. Eligible candidates must register by June 8.',
    category: 'PLACEMENT',
    date: 'June 3, 2026',
    attachment: 'Infosys_Recruitment_Circular.pdf'
  },
  {
    id: 'a3',
    title: 'Expert Lecture on AWS Cloud Setup & Orchestration',
    content: 'An expert webinar on "Orchestrating Microservices with Docker and AWS RDS" will be delivered by our distinguished alumnus, Mr. R. Deshmukh, Cloud Consultant. Attendance is mandatory for all final year (Sem 6) students.',
    category: 'SEMINAR',
    date: 'June 1, 2026',
    attachment: 'Webinar_Flyer.pdf'
  },
  {
    id: 'a4',
    title: 'State Level Technical Hackathon Registrations Open',
    content: 'Registrations are open for the annual State Level Technical Hackathon to be held at Ballari. Interested teams of 3 to 4 students must submit their project synopsis to the HOD for internal screening.',
    category: 'GENERAL',
    date: 'May 28, 2026',
    attachment: 'State_Hackathon_Guidelines.pdf'
  }
];

export default function Announcements() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  const categories = ['ALL', 'EXAMS', 'PLACEMENT', 'SEMINAR', 'GENERAL'];

  const filteredAnnouncements = mockAnnouncements.filter((item) => {
    return selectedCategory === 'ALL' || item.category === selectedCategory;
  });

  return (
    <div className="bg-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8 flex-grow">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <span className="text-xs font-bold text-[#4a2c2a] tracking-wider uppercase bg-[#f3ede2] border border-[#ede6dc] px-3 py-1 rounded-full">
            Notice Board
          </span>
          <h1 className="text-4xl font-extrabold text-[#2d1b18] tracking-tight">
            Official Announcements
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 text-sm">
            Stay updated with the latest institutional notices, exam circulars, placement activities, and academic seminars.
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="flex bg-[#faf7f2] border border-[#ede6dc] p-1 rounded-2xl max-w-2xl mx-auto overflow-x-auto whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-center cursor-pointer transition-all duration-300 data-[active=true]:bg-[#4a2c2a] data-[active=true]:text-white text-[#4a2c2a]/70 hover:text-[#4a2c2a]"
              data-active={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List of circulars */}
        <div className="space-y-6">
          {filteredAnnouncements.map((item) => (
            <div 
              key={item.id}
              className="bg-[#faf7f2] border border-[#ede6dc] hover:border-[#4a2c2a]/20 rounded-3xl p-6 md:p-8 space-y-4 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ede6dc] pb-4">
                <div className="flex items-center space-x-2.5">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    item.category === 'EXAMS'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : item.category === 'PLACEMENT'
                      ? 'bg-pink-50 border-pink-200 text-pink-800'
                      : item.category === 'SEMINAR'
                      ? 'bg-[#f3ede2] border-[#ede6dc] text-[#4a2c2a]'
                      : 'bg-slate-50 border-slate-200 text-slate-705'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-slate-500 text-xs">{item.date}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[#2d1b18] font-bold text-lg md:text-xl leading-tight">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{item.content}</p>
              </div>

              {item.attachment && (
                <div className="pt-2 flex">
                  <a
                    href="#"
                    className="inline-flex items-center space-x-1.5 text-xs text-[#4a2c2a] hover:text-[#5d3a37] font-semibold hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download: {item.attachment}</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No circulars found in this category.</p>
          </div>
        )}

      </div>
    </div>
  );
}
