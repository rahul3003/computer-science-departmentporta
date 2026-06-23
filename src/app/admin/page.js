'use client';

import { useState } from 'react';

// ── Mock data ────────────────────────────────────────────────────────────────
const mockFacultyList = [
  { id: 'f1', name: 'Dr. Anil Kumar M.G.', designation: 'Hod', department: 'CSE', email: 'anilkumar@sanpoly.edu.in' },
  { id: 'f2', name: 'Mrs. Rekha Patil', designation: 'Lecturer', department: 'CSE', email: 'rekhapatil@sanpoly.edu.in' },
  { id: 'f3', name: 'Mr. Shivasharanappa K.', designation: 'Senior Lecturer', department: 'AI_DS', email: 'shiva.k@sanpoly.edu.in' },
  { id: 'f4', name: 'Miss. Deepika R.', designation: 'Asst Lecturer', department: 'AI_DS', email: 'deepikar@sanpoly.edu.in' },
  { id: 'f5', name: 'Mr. Nagaraj Gowda', designation: 'Senior Lecturer', department: 'CSE', email: 'nagarajg@sanpoly.edu.in' },
];

const mockResourcesList = [
  { id: 'r1', title: 'Data Structures and Algorithms', category: 'Notes', semester: 'Semester 3', code: 'CS-301', uploadedBy: 'Mrs. Rekha Patil' },
  { id: 'r2', title: 'Database Management Systems', category: 'Notes', semester: 'Semester 3', code: 'CS-302', uploadedBy: 'Dr. Anil Kumar M.G.' },
  { id: 'r3', title: 'PC Hardware & Troubleshooting Lab Manual', category: 'Lab Manual', semester: 'Semester 3', code: 'CSL-307', uploadedBy: 'Mr. Nagaraj Gowda' },
  { id: 'r4', title: 'Data Structures - 2024 Board Paper', category: 'Question Paper', semester: 'Semester 3', code: 'CS-301', uploadedBy: 'Dr. Anil Kumar M.G.' },
];

// ── Reusable form field components ───────────────────────────────────────────
function FieldLabel({ children }) {
  return <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{children}</label>;
}

function TextInput({ placeholder, value, onChange, type = 'text', required = false }) {
  return (
    <input
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-white border border-[#ede6dc] px-3.5 py-2.5 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a] transition-colors duration-200"
    />
  );
}

function SelectInput({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-white border border-[#ede6dc] px-3.5 py-2.5 rounded-xl text-xs text-[#2d1b18] focus:outline-none focus:border-[#4a2c2a] transition-colors duration-200"
    >
      {children}
    </select>
  );
}

function SubmitButton({ children }) {
  return (
    <button
      type="submit"
      className="w-full py-3 rounded-xl font-bold bg-[#4a2c2a] hover:bg-[#5d3a37] text-white text-xs transition-colors duration-200 shadow-md shadow-[#4a2c2a]/15 cursor-pointer"
    >
      {children}
    </button>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-[#ede6dc]/70 rounded-2xl p-5 flex items-center space-x-4">
      <div className="w-10 h-10 rounded-xl bg-[#f3ede2] border border-[#ede6dc] flex items-center justify-center text-[#4a2c2a] shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-extrabold text-[#2d1b18]">{value}</p>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Admin() {
  const [activeTab, setActiveTab] = useState('NOTES');
  const [notification, setNotification] = useState(null);

  // Form states
  const [notesForm, setNotesForm] = useState({ title: '', semester: 'Semester 3', courseCode: '', file: null });
  const [manualsForm, setManualsForm] = useState({ title: '', lab: 'PC Hardware & Networking Lab', courseCode: '', file: null });
  const [timetableForm, setTimetableForm] = useState({ semester: 'Semester 3', effectiveFrom: '', file: null });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', category: 'GENERAL', content: '', attachmentUrl: '' });
  const [facultyForm, setFacultyForm] = useState({ name: '', email: '', department: 'CSE', designation: 'Lecturer', qualification: '', experience: '', officeHours: '', publications: '' });
  const [resourcesList] = useState(mockResourcesList);
  const [facultyList] = useState(mockFacultyList);

  const triggerNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4500);
  };

  const handleNotesSubmit = (e) => {
    e.preventDefault();
    if (!notesForm.title) return;
    triggerNotification(`✓ Notes "${notesForm.title}" uploaded & cataloged for ${notesForm.semester}.`);
    setNotesForm({ title: '', semester: 'Semester 3', courseCode: '', file: null });
  };

  const handleManualsSubmit = (e) => {
    e.preventDefault();
    if (!manualsForm.title) return;
    triggerNotification(`✓ Lab Manual "${manualsForm.title}" uploaded & cataloged.`);
    setManualsForm({ title: '', lab: 'PC Hardware & Networking Lab', courseCode: '', file: null });
  };

  const handleTimetableSubmit = (e) => {
    e.preventDefault();
    if (!timetableForm.file) return;
    triggerNotification(`✓ Timetable for ${timetableForm.semester} published successfully.`);
    setTimetableForm({ semester: 'Semester 3', effectiveFrom: '', file: null });
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.content) return;
    triggerNotification(`✓ Announcement "${announcementForm.title}" published to Feed & Notice Board.`);
    setAnnouncementForm({ title: '', category: 'GENERAL', content: '', attachmentUrl: '' });
  };

  const handleFacultySubmit = (e) => {
    e.preventDefault();
    if (!facultyForm.name || !facultyForm.email) return;
    triggerNotification(`✓ Faculty profile for "${facultyForm.name}" created and added to directory.`);
    setFacultyForm({ name: '', email: '', department: 'CSE', designation: 'Lecturer', qualification: '', experience: '', officeHours: '', publications: '' });
  };

  const tabs = [
    { id: 'NOTES', label: 'Upload Notes', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    )},
    { id: 'MANUALS', label: 'Upload Manuals', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    )},
    { id: 'TIMETABLE', label: 'Upload Timetable', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { id: 'ANNOUNCEMENTS', label: 'Post Announcements', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
    )},
    { id: 'FACULTY', label: 'Add/Edit Faculty', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { id: 'RESOURCES', label: 'Manage Resources', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
    )},
  ];

  return (
    <div className="bg-white text-slate-800 flex-grow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">

        {/* ── Header Row ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ede6dc]/60 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#4a2c2a] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#4a2c2a]/20">
              AK
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2d1b18] tracking-tight">Admin Dashboard</h1>
              <p className="text-xs text-slate-400 font-semibold">Dr. Anil Kumar M.G. — HOD & Professor, CSE</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
            ● Full Access
          </span>
        </div>

        {/* ── Global Notification ────────────────────────────────────── */}
        {notification && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs animate-in slide-in-from-top-2 duration-300">
            <svg className="w-5 h-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{notification}</span>
          </div>
        )}

        {/* ── Stats Overview ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Faculty Members" value="5" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          } />
          <StatCard label="Resources Uploaded" value="24" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          } />
          <StatCard label="Announcements" value="11" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
          } />
          <StatCard label="Total Students" value="142" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
          } />
        </div>

        {/* ── Main Panel: Sidebar + Content ─────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Sidebar Nav */}
          <div className="w-full lg:w-56 shrink-0">
            <div className="bg-white border border-[#ede6dc]/70 rounded-2xl overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 text-xs font-bold text-left transition-all duration-200 cursor-pointer border-b border-[#ede6dc]/50 last:border-b-0 ${
                    activeTab === tab.id
                      ? 'bg-[#4a2c2a] text-white'
                      : 'text-slate-600 hover:bg-[#faf7f2] hover:text-[#2d1b18]'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-white/80' : 'text-[#4a2c2a]/60'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Panel */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-[#ede6dc]/70 rounded-2xl p-6 sm:p-8">

              {/* ── Tab: Upload Notes ──────────────────────────────── */}
              {activeTab === 'NOTES' && (
                <form onSubmit={handleNotesSubmit} className="space-y-5">
                  <h3 className="text-base font-extrabold text-[#2d1b18] flex items-center space-x-2">
                    <span className="w-1.5 h-5 bg-[#4a2c2a] rounded-full"></span>
                    <span>Upload Study Notes</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <FieldLabel>Document Title *</FieldLabel>
                      <TextInput required placeholder="e.g. Data Structures Unit-1 Notes" value={notesForm.title} onChange={(e) => setNotesForm({ ...notesForm, title: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Course Code</FieldLabel>
                      <TextInput placeholder="e.g. CS-301" value={notesForm.courseCode} onChange={(e) => setNotesForm({ ...notesForm, courseCode: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>Semester</FieldLabel>
                    <SelectInput value={notesForm.semester} onChange={(e) => setNotesForm({ ...notesForm, semester: e.target.value })}>
                      <option>Semester 3</option>
                      <option>Semester 4</option>
                      <option>Semester 5</option>
                      <option>Semester 6</option>
                    </SelectInput>
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>Upload PDF File *</FieldLabel>
                    <input
                      type="file"
                      accept=".pdf"
                      required
                      onChange={(e) => setNotesForm({ ...notesForm, file: e.target.files[0] })}
                      className="w-full bg-[#faf7f2] border border-[#ede6dc] px-3.5 py-2.5 rounded-xl text-xs text-[#2d1b18] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#4a2c2a] file:text-white cursor-pointer"
                    />
                  </div>
                  <SubmitButton>Upload Notes</SubmitButton>
                </form>
              )}

              {/* ── Tab: Upload Manuals ────────────────────────────── */}
              {activeTab === 'MANUALS' && (
                <form onSubmit={handleManualsSubmit} className="space-y-5">
                  <h3 className="text-base font-extrabold text-[#2d1b18] flex items-center space-x-2">
                    <span className="w-1.5 h-5 bg-[#4a2c2a] rounded-full"></span>
                    <span>Upload Lab Manual</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <FieldLabel>Manual Title *</FieldLabel>
                      <TextInput required placeholder="e.g. PC Hardware & Troubleshooting Manual" value={manualsForm.title} onChange={(e) => setManualsForm({ ...manualsForm, title: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Lab Code</FieldLabel>
                      <TextInput placeholder="e.g. CSL-307" value={manualsForm.courseCode} onChange={(e) => setManualsForm({ ...manualsForm, courseCode: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>Lab / Facility</FieldLabel>
                    <SelectInput value={manualsForm.lab} onChange={(e) => setManualsForm({ ...manualsForm, lab: e.target.value })}>
                      <option>PC Hardware & Networking Lab</option>
                      <option>Software Centre</option>
                      <option>IT Skills Lab</option>
                    </SelectInput>
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>Upload PDF File *</FieldLabel>
                    <input
                      type="file"
                      accept=".pdf"
                      required
                      onChange={(e) => setManualsForm({ ...manualsForm, file: e.target.files[0] })}
                      className="w-full bg-[#faf7f2] border border-[#ede6dc] px-3.5 py-2.5 rounded-xl text-xs text-[#2d1b18] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#4a2c2a] file:text-white cursor-pointer"
                    />
                  </div>
                  <SubmitButton>Upload Lab Manual</SubmitButton>
                </form>
              )}

              {/* ── Tab: Upload Timetable ──────────────────────────── */}
              {activeTab === 'TIMETABLE' && (
                <form onSubmit={handleTimetableSubmit} className="space-y-5">
                  <h3 className="text-base font-extrabold text-[#2d1b18] flex items-center space-x-2">
                    <span className="w-1.5 h-5 bg-[#4a2c2a] rounded-full"></span>
                    <span>Upload Timetable</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <FieldLabel>Semester *</FieldLabel>
                      <SelectInput value={timetableForm.semester} onChange={(e) => setTimetableForm({ ...timetableForm, semester: e.target.value })}>
                        <option>Semester 3</option>
                        <option>Semester 4</option>
                        <option>Semester 5</option>
                        <option>Semester 6</option>
                      </SelectInput>
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Effective From</FieldLabel>
                      <TextInput type="date" value={timetableForm.effectiveFrom} onChange={(e) => setTimetableForm({ ...timetableForm, effectiveFrom: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>Upload Timetable File (PDF/Image) *</FieldLabel>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      required
                      onChange={(e) => setTimetableForm({ ...timetableForm, file: e.target.files[0] })}
                      className="w-full bg-[#faf7f2] border border-[#ede6dc] px-3.5 py-2.5 rounded-xl text-xs text-[#2d1b18] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#4a2c2a] file:text-white cursor-pointer"
                    />
                  </div>
                  <div className="bg-[#faf7f2] border border-[#ede6dc] rounded-xl p-4 text-xs text-slate-500 flex items-start space-x-2">
                    <svg className="w-4 h-4 text-[#4a2c2a] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Uploading a new timetable will replace the existing one for the selected semester. Students will see the updated timetable immediately.</p>
                  </div>
                  <SubmitButton>Publish Timetable</SubmitButton>
                </form>
              )}

              {/* ── Tab: Post Announcements ────────────────────────── */}
              {activeTab === 'ANNOUNCEMENTS' && (
                <form onSubmit={handleAnnouncementSubmit} className="space-y-5">
                  <h3 className="text-base font-extrabold text-[#2d1b18] flex items-center space-x-2">
                    <span className="w-1.5 h-5 bg-[#4a2c2a] rounded-full"></span>
                    <span>Post Announcement</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 col-span-2">
                      <FieldLabel>Announcement Title *</FieldLabel>
                      <TextInput required placeholder="e.g. Infosys Campus Drive Registrations Open" value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Category</FieldLabel>
                      <SelectInput value={announcementForm.category} onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}>
                        <option value="GENERAL">General Notice</option>
                        <option value="EXAMS">Exams Board</option>
                        <option value="PLACEMENT">Placements</option>
                        <option value="SEMINAR">Expert Seminar</option>
                        <option value="HOLIDAY">Holiday / Event</option>
                      </SelectInput>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>Circular Details *</FieldLabel>
                    <textarea
                      required
                      rows={4}
                      placeholder="Detail the circular requirements, deadlines, and criteria..."
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                      className="w-full bg-white border border-[#ede6dc] p-4 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a] resize-none transition-colors duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel>Attachment PDF Link (Optional)</FieldLabel>
                    <TextInput type="url" placeholder="e.g. https://storage.example.com/notices/circular.pdf" value={announcementForm.attachmentUrl} onChange={(e) => setAnnouncementForm({ ...announcementForm, attachmentUrl: e.target.value })} />
                  </div>
                  <SubmitButton>Publish Announcement</SubmitButton>
                </form>
              )}

              {/* ── Tab: Add/Edit Faculty ──────────────────────────── */}
              {activeTab === 'FACULTY' && (
                <div className="space-y-8">
                  {/* Existing Faculty List */}
                  <div className="space-y-4">
                    <h3 className="text-base font-extrabold text-[#2d1b18] flex items-center space-x-2">
                      <span className="w-1.5 h-5 bg-[#4a2c2a] rounded-full"></span>
                      <span>Faculty Directory</span>
                    </h3>
                    <div className="space-y-2">
                      {facultyList.map((f) => (
                        <div key={f.id} className="flex items-center justify-between bg-[#faf7f2] border border-[#ede6dc]/70 px-4 py-3 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4a2c2a] to-[#8d6e63] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                              {f.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('').slice(0,2)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#2d1b18]">{f.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">{f.designation} · {f.department === 'AI_DS' ? 'AI & DS' : f.department}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-[10px] font-bold text-[#4a2c2a] bg-[#f3ede2] border border-[#ede6dc] px-3 py-1.5 rounded-lg hover:bg-[#ede6dc] transition-colors cursor-pointer">Edit</button>
                            <button className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Faculty Form */}
                  <form onSubmit={handleFacultySubmit} className="space-y-5 border-t border-[#ede6dc] pt-6">
                    <h3 className="text-sm font-extrabold text-[#2d1b18]">Add New Faculty Member</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <FieldLabel>Full Name *</FieldLabel>
                        <TextInput required placeholder="e.g. Dr. Anil Kumar M.G." value={facultyForm.name} onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <FieldLabel>Official Email *</FieldLabel>
                        <TextInput required type="email" placeholder="e.g. anilkumar@sanpoly.edu.in" value={facultyForm.email} onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <FieldLabel>Department</FieldLabel>
                        <SelectInput value={facultyForm.department} onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })}>
                          <option value="CSE">Computer Science (CSE)</option>
                          <option value="AI_DS">AI & Data Science</option>
                        </SelectInput>
                      </div>
                      <div className="space-y-1.5">
                        <FieldLabel>Designation</FieldLabel>
                        <SelectInput value={facultyForm.designation} onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}>
                          <option>Admin</option>
                          <option>Hod</option>
                          <option>Senior Lecturer</option>
                          <option>Lecturer</option>
                          <option>Asst Lecturer</option>
                          <option>System admin</option>
                          <option>Instructor</option>
                        </SelectInput>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <FieldLabel>Qualifications</FieldLabel>
                        <TextInput placeholder="e.g. M.Tech, Ph.D. in Computer Science" value={facultyForm.qualification} onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <FieldLabel>Experience</FieldLabel>
                        <TextInput placeholder="e.g. 18 Years of Academic Experience" value={facultyForm.experience} onChange={(e) => setFacultyForm({ ...facultyForm, experience: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Office Hours</FieldLabel>
                      <TextInput placeholder="e.g. Mon & Wed: 10:00 AM - 12:30 PM" value={facultyForm.officeHours} onChange={(e) => setFacultyForm({ ...facultyForm, officeHours: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Research Publications (separate with ';')</FieldLabel>
                      <textarea
                        rows={2}
                        placeholder="e.g. Cloud Migration Model, IJCS 2024; IoT Tracking, IEEE 2023"
                        value={facultyForm.publications}
                        onChange={(e) => setFacultyForm({ ...facultyForm, publications: e.target.value })}
                        className="w-full bg-white border border-[#ede6dc] p-4 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a] resize-none transition-colors duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Profile Photo (optional)</FieldLabel>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full bg-[#faf7f2] border border-[#ede6dc] px-3.5 py-2.5 rounded-xl text-xs text-[#2d1b18] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#4a2c2a] file:text-white cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Resume / Profile PDF (optional)</FieldLabel>
                      <input
                        type="file"
                        accept=".pdf"
                        className="w-full bg-[#faf7f2] border border-[#ede6dc] px-3.5 py-2.5 rounded-xl text-xs text-[#2d1b18] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#4a2c2a] file:text-white cursor-pointer"
                      />
                    </div>
                    <SubmitButton>Add Faculty Member</SubmitButton>
                  </form>
                </div>
              )}

              {/* ── Tab: Manage Resources ──────────────────────────── */}
              {activeTab === 'RESOURCES' && (
                <div className="space-y-5">
                  <h3 className="text-base font-extrabold text-[#2d1b18] flex items-center space-x-2">
                    <span className="w-1.5 h-5 bg-[#4a2c2a] rounded-full"></span>
                    <span>Manage Student Resources</span>
                  </h3>
                  <div className="space-y-3">
                    {resourcesList.map((res) => (
                      <div key={res.id} className="flex items-center justify-between bg-[#faf7f2] border border-[#ede6dc]/70 px-4 py-3.5 rounded-xl">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-bold text-[#4a2c2a] bg-[#f3ede2] border border-[#ede6dc] px-2 py-0.5 rounded">{res.code}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{res.category} · {res.semester}</span>
                          </div>
                          <p className="text-xs font-bold text-[#2d1b18]">{res.title}</p>
                          <p className="text-[10px] text-slate-400">Uploaded by {res.uploadedBy}</p>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 ml-4">
                          <button className="text-[10px] font-bold text-slate-500 bg-white border border-[#ede6dc] px-3 py-1.5 rounded-lg hover:bg-[#faf7f2] transition-colors cursor-pointer">View</button>
                          <button className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">Showing {resourcesList.length} of 24 resources · <span className="text-[#4a2c2a] font-bold cursor-pointer hover:underline">Load more</span></p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
