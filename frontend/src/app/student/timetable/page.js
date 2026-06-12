'use client';

import { useState, useEffect } from 'react';

export default function Timetable() {
  const [selectedSem, setSelectedSem] = useState('Semester 1');
  const [currentUser, setCurrentUser] = useState(null);
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [timetableResource, setTimetableResource] = useState(null);

  const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];

  useEffect(() => {
    let userSemester = 'Semester 1';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
          if (parsed.semester) {
            userSemester = parsed.semester;
            const matched = semesters.find(
              s => s.toLowerCase() === parsed.semester.toLowerCase()
            );
            if (matched) {
              setSelectedSem(matched);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Fetch dynamic timetable slots from backend, filtered by student's own semester
    fetch(`http://localhost:5000/api/admin/timetable?semester=${encodeURIComponent(userSemester)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTimetableSlots(data);
        }
      })
      .catch(err => console.error('Error loading timetable:', err));
  }, []);

  // Fetch dynamic timetable resource for the selected semester
  useEffect(() => {
    fetch(`http://localhost:5000/api/resources?category=TIMETABLE&semester=${encodeURIComponent(selectedSem)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTimetableResource(data[0]);
        } else {
          setTimetableResource(null);
        }
      })
      .catch(err => console.error('Error loading timetable resource:', err));
  }, [selectedSem]);

  // Filter and format slots for active semester
  const semesterSlots = timetableSlots.filter(
    s => s.semester?.toLowerCase() === selectedSem.toLowerCase()
  );

  const activeTimetable = {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    slots: semesterSlots.map(slot => ({
      time: slot.timeSlot,
      Monday: slot.monday || '-',
      Tuesday: slot.tuesday || '-',
      Wednesday: slot.wednesday || '-',
      Thursday: slot.thursday || '-',
      Friday: slot.friday || '-'
    }))
  };

  return (
    <div className="bg-white text-slate-800 py-10 px-4 sm:px-6 lg:px-8 flex-grow">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Header & Tabs Selector Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ede6dc]/60 pb-5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#2d1b18] tracking-tight flex items-center space-x-2">
            <span className="w-2 h-5 bg-[#4a2c2a] rounded-full"></span>
            <span>Timetable</span>
          </h1>


        </div>

        {/* Section Info Banner */}
        {currentUser && (
          <div className="bg-[#faf7f2] border border-[#ede6dc]/70 p-3.5 rounded-2xl flex items-center justify-between text-xs text-[#2d1b18]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#4a2c2a] animate-pulse"></span>
              <span>Showing resources for your class: <strong>{currentUser.semester} ({currentUser.group || 'Group B'})</strong></span>
            </div>
            <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Auto-Filtered</span>
          </div>
        )}

        {/* Timetable Table Grid */}
        <div className="bg-white border border-[#ede6dc]/70 rounded-2xl overflow-hidden shadow-xs max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#faf7f2]/50 text-slate-500 border-b border-[#ede6dc] text-xs font-bold tracking-wider uppercase">
                  <th className="p-4 pl-6 w-52 text-[#4a2c2a]">Time Slot</th>
                  {activeTimetable.days.map((day) => (
                    <th key={day} className="p-4">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ede6dc]/60 text-xs">
                {activeTimetable.slots.map((slot, index) => (
                  <tr key={index} className="hover:bg-[#faf7f2]/20 transition-colors duration-200">
                    <td className="p-4 pl-6 font-bold text-[#4a2c2a] bg-[#faf7f2]/20 border-r border-[#ede6dc]/30">
                      {slot.time}
                    </td>
                    <td className="p-4 text-slate-700">
                      <div className="font-semibold">{slot.Monday}</div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <div className="font-semibold">{slot.Tuesday}</div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <div className="font-semibold">{slot.Wednesday}</div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <div className="font-semibold">{slot.Thursday}</div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <div className="font-semibold">{slot.Friday}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Note */}
        <div className="max-w-5xl mx-auto bg-white border border-[#ede6dc]/75 p-4 rounded-xl flex items-center space-x-3 text-slate-500 text-xs">
          <svg className="w-5 h-5 text-[#4a2c2a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            Lab periods are held in designated computer hubs: PC Hardware Lab (Room 102), Software Centre (Room 404), and IT Skills Lab (Room 405). Classroom listings are subject to scheduling shifts by HOD.
          </p>
        </div>

        <div className="text-center pt-2">
          {timetableResource ? (
            <a
              href={timetableResource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary-brown-light hover:bg-card-border text-primary-brown border border-card-border transition-all duration-300 cursor-pointer shadow-3xs"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-bold text-xs">View Timetable Document (PDF/Image)</span>
            </a>
          ) : (
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#faf7f2]/50 text-slate-400 border border-dashed border-[#ede6dc] text-xs font-semibold">
              Timetable Document not uploaded yet for this semester
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
