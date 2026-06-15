'use client';

import { useState, useEffect } from 'react';
import { FaUserCheck, FaExclamationTriangle, FaCheckCircle, FaBookOpen } from 'react-icons/fa';

export default function StudentAttendance() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSem, setSelectedSem] = useState('Semester 1');
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
          if (parsed.semester) {
            const matched = semesters.find(
              key => key.toLowerCase() === parsed.semester.toLowerCase()
            );
            if (matched) {
              setSelectedSem(matched);
            }
          }

          // Fetch real attendance records for this student
          setLoading(true);
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/attendance/student/${parsed.id}`)
            .then(res => res.json())
            .then(data => {
              if (Array.isArray(data)) {
                setAttendanceSummary(data);
              }
            })
            .catch(err => console.error('Error fetching student attendance summary:', err))
            .finally(() => setLoading(false));
        } catch (e) {
          console.error(e);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Filter subjects for the selected semester
  const subjects = attendanceSummary.filter(
    sub => sub.semester?.toLowerCase() === selectedSem.toLowerCase()
  );

  // Calculations
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const totalConducted = subjects.reduce((sum, s) => sum + s.conducted, 0);
  const overallPercentage = totalConducted > 0 ? ((totalAttended / totalConducted) * 100).toFixed(1) : '0.0';

  // Styles based on criteria
  const isShortage = parseFloat(overallPercentage) < 75.0 && totalConducted > 0;

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#f3ede2] border-t-[#4a2c2a] animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Attendance Profile...</p>
      </div>
    );
  }


  return (
    <div className="bg-white text-slate-800 py-10 px-4 sm:px-6 lg:px-8 flex-grow">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ede6dc]/60 pb-5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#2d1b18] tracking-tight flex items-center space-x-2">
            <span className="w-2 h-5 bg-[#4a2c2a] rounded-full"></span>
            <span>My Attendance</span>
          </h1>


        </div>

        {/* Section Info Banner */}
        {currentUser && (
          <div className="bg-[#faf7f2] border border-[#ede6dc]/70 p-3.5 rounded-2xl flex items-center justify-between text-xs text-[#2d1b18]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#4a2c2a] animate-pulse"></span>
              <span>Logged in Section: <strong>{currentUser.semester} ({currentUser.group || 'Group B'})</strong></span>
            </div>
            <span className="text-slate-450 font-bold uppercase tracking-wider text-[9px]">Student Console</span>
          </div>
        )}

        {/* Attendance Scorecards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Circular Progress Ring Card */}
          <div className="bg-white border border-[#ede6dc]/70 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-3xs">
            <h4 className="text-[#2d1b18] font-bold text-xs uppercase tracking-wider">Overall Attendance</h4>
            
            <div className="relative flex items-center justify-center">
              {/* SVG Circular Ring */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="#ede6dc"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke={isShortage ? '#e11d48' : '#10b981'}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - parseFloat(overallPercentage) / 100)}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              {/* Percentage Text inside */}
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold text-[#2d1b18]">{overallPercentage}%</span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">Total</span>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              isShortage 
                ? 'bg-rose-50 border-rose-200 text-rose-800' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              {isShortage ? 'Shortage Alert' : 'Eligible for Exams'}
            </span>
          </div>

          {/* Quick Stats Column 1 */}
          <div className="bg-[#faf7f2]/50 border border-[#ede6dc]/60 p-6 rounded-2xl flex flex-col justify-between shadow-3xs">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Lectures Attended</span>
              <p className="text-3xl font-extrabold text-[#2d1b18]">{totalAttended}</p>
            </div>
            
            <div className="border-t border-[#ede6dc]/60 pt-4 mt-4 text-[11px] text-slate-550 leading-relaxed">
              You have attended <strong className="text-[#4a2c2a]">{totalAttended}</strong> classes out of <strong className="text-[#4a2c2a]">{totalConducted}</strong> total conducted modules this semester.
            </div>
          </div>

          {/* Quick Stats Column 2 */}
          <div className="bg-[#faf7f2]/50 border border-[#ede6dc]/60 p-6 rounded-2xl flex flex-col justify-between shadow-3xs">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Board Status</span>
              <p className={`text-xl font-bold flex items-center space-x-1.5 ${isShortage ? 'text-rose-700' : 'text-emerald-700'}`}>
                {isShortage ? <FaExclamationTriangle className="w-5 h-5" /> : <FaCheckCircle className="w-5 h-5" />}
                <span>{isShortage ? 'Admit Card Hold' : 'Fully Approved'}</span>
              </p>
            </div>

            <div className="border-t border-[#ede6dc]/60 pt-4 mt-4 text-[11px] text-slate-550 leading-relaxed">
              {isShortage 
                ? 'Your attendance is currently below the mandatory 75.0% Board Requirement. Please contact the HOD/Mentor immediately.'
                : 'Congratulations! Your attendance exceeds the 75.0% Board Requirement. You are cleared for the upcoming Board examinations.'
              }
            </div>
          </div>
        </div>

        {/* Subject wise Grid Breakdown */}
        <div className="space-y-4">
          <h3 className="text-[#2d1b18] font-bold text-sm flex items-center space-x-2">
            <FaBookOpen className="w-4 h-4 text-[#4a2c2a]" />
            <span>Subject-wise Breakdown</span>
          </h3>

          <div className="bg-white border border-[#ede6dc]/70 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-[#faf7f2]/50 text-slate-500 border-b border-[#ede6dc] text-xs font-bold tracking-wider uppercase">
                    <th className="p-4 pl-6 w-32 text-[#4a2c2a]">Subject Code</th>
                    <th className="p-4">Subject Title</th>
                    <th className="p-4 w-36 text-center">Classes Attended</th>
                    <th className="p-4 w-36 text-center">Classes Conducted</th>
                    <th className="p-4 w-32 text-center">Percentage</th>
                    <th className="p-4 w-32 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ede6dc]/60 text-xs">
                  {subjects.map((sub) => {
                    const pct = sub.conducted > 0 ? ((sub.attended / sub.conducted) * 100) : 0;
                    const isSubShortage = pct < 75.0;

                    return (
                      <tr key={sub.code} className="hover:bg-[#faf7f2]/20 transition-colors duration-205">
                        <td className="p-4 pl-6 font-bold text-[#4a2c2a]">{sub.code}</td>
                        <td className="p-4 text-slate-800 font-semibold">
                          <div>{sub.name}</div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{sub.type}</span>
                        </td>
                        <td className="p-4 text-center font-bold text-slate-700">{sub.attended}</td>
                        <td className="p-4 text-center font-bold text-slate-400">{sub.conducted}</td>
                        <td className={`p-4 text-center font-bold ${isSubShortage ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {pct.toFixed(1)}%
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            pct >= 90.0
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : pct >= 75.0
                              ? 'bg-slate-50 border-slate-200 text-slate-700'
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}>
                            {pct >= 90.0 ? 'Excellent' : pct >= 75.0 ? 'On Track' : 'Shortage'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
