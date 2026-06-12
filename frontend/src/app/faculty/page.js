'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const facultyData = [
  {
    id: 'f1',
    name: 'Dr. Anil Kumar M.G.',
    email: 'anilkumar@sanpoly.edu.in',
    department: 'CSE',
    designation: 'HOD & Professor',
    qualification: 'M.Tech, Ph.D. in Computer Science',
    experience: '18 Years of Academic Experience',
    photoUrl: '/api/placeholder/150/150', // placeholder or custom gradient
    researchPublications: [
      'An Efficient Cloud Migration Model using Meta-heuristic Algorithms, International Journal of Grid Computing, 2024.',
      'Analysis of Machine Learning Models for Early Intrusion Detection Systems in IoT Networks, IEEE Access, 2022.'
    ],
    resumeUrl: '#',
    officeHours: 'Mon & Wed: 10:00 AM - 12:30 PM'
  },
  {
    id: 'f2',
    name: 'Mrs. Rekha Patil',
    email: 'rekhapatil@sanpoly.edu.in',
    department: 'CSE',
    designation: 'Assistant Professor',
    qualification: 'M.Tech in Software Engineering',
    experience: '12 Years of Teaching Experience',
    photoUrl: '/api/placeholder/150/150',
    researchPublications: [
      'Comparative Study of NoSQL Databases for Large Scale Web Apps, National Web Conference, 2023.'
    ],
    resumeUrl: '#',
    officeHours: 'Tue & Thu: 2:00 PM - 4:00 PM'
  },
  {
    id: 'f3',
    name: 'Mr. Shivasharanappa K.',
    email: 'shiva.k@sanpoly.edu.in',
    department: 'AI_DS',
    designation: 'Associate Professor & Lead',
    qualification: 'M.Tech in Artificial Intelligence',
    experience: '15 Years of Academic Experience',
    photoUrl: '/api/placeholder/150/150',
    researchPublications: [
      'Deep Learning Models for High Resolution Agri-image Classification, AI Research Quarterly, 2025.',
      'Practical Implementation of IoT Nodes in Sandur Region Microclimate Tracking, IEEE Sensors, 2023.'
    ],
    resumeUrl: '#',
    officeHours: 'Mon & Fri: 11:00 AM - 1:00 PM'
  },
  {
    id: 'f4',
    name: 'Miss. Deepika R.',
    email: 'deepikar@sanpoly.edu.in',
    department: 'AI_DS',
    designation: 'Assistant Professor',
    qualification: 'M.Tech in Data Science & Big Data',
    experience: '6 Years in Academia & Research',
    photoUrl: '/api/placeholder/150/150',
    researchPublications: [
      'Real-time Student Engagement Metrics using Computer Vision Pipelines, TechEd Conference, 2024.'
    ],
    resumeUrl: '#',
    officeHours: 'Wed & Fri: 3:00 PM - 5:00 PM'
  },
  {
    id: 'f5',
    name: 'Mr. Nagaraj Gowda',
    email: 'nagarajg@sanpoly.edu.in',
    department: 'CSE',
    designation: 'Senior Lecturer',
    qualification: 'B.E., M.Tech in Cyber Security',
    experience: '10 Years of Practical & Lab Mentoring',
    photoUrl: '/api/placeholder/150/150',
    researchPublications: [
      'PC Assembly Manuals and Labs Best Practices, State Polytechnic Board Report, 2022.'
    ],
    resumeUrl: '#',
    officeHours: 'Daily: 9:30 AM - 10:30 AM'
  }
];

function FacultyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    const dept = searchParams.get('dept');
    if (dept === 'cse') {
      setSelectedDept('CSE');
    } else if (dept === 'aids') {
      setSelectedDept('AI_DS');
    } else {
      setSelectedDept('ALL');
    }
  }, [searchParams]);

  const handleDeptChange = (dept) => {
    if (dept === 'CSE') {
      router.push('/faculty?dept=cse');
    } else if (dept === 'AI_DS') {
      router.push('/faculty?dept=aids');
    } else {
      router.push('/faculty');
    }
  };

  const filteredFaculty = facultyData.filter((member) => {
    const matchesDept = selectedDept === 'ALL' || member.department === selectedDept;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="bg-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Title Header */}
        <div className="space-y-4 text-center">
          <span className="text-xs font-bold text-[#4a2c2a] tracking-wider uppercase bg-[#f3ede2] border border-[#ede6dc] px-3 py-1 rounded-full">
            Our Mentors
          </span>
          <h1 className="text-4xl font-extrabold text-[#2d1b18] tracking-tight">
            Faculty Directory
          </h1>
          <p className="max-w-xl mx-auto text-slate-655 text-sm">
            Meet the experienced educators and researchers guiding our Computer Science and Artificial Intelligence courses.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#faf7f2] border border-[#ede6dc] p-4 rounded-2xl max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex bg-[#f3ede2] p-1 rounded-xl border border-[#ede6dc] self-stretch sm:self-auto">
            {['ALL', 'CSE', 'AI_DS'].map((dept) => (
              <button
                key={dept}
                onClick={() => handleDeptChange(dept)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all duration-300 ${
                  selectedDept === dept
                    ? 'bg-[#4a2c2a] text-white shadow-md'
                    : 'text-[#4a2c2a]/70 hover:text-[#4a2c2a]'
                }`}
              >
                {dept === 'AI_DS' ? 'AI & DS' : dept}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4a2c2a]/60">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#ede6dc] pl-10 pr-4 py-2 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a] transition-colors duration-200"
            />
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {filteredFaculty.map((member) => (
            <div
              key={member.id}
              className="bg-[#faf7f2] border border-[#ede6dc] hover:border-[#4a2c2a]/20 rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Photo Placeholder/Avatar */}
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#f3ede2] to-[#faf7f2] border border-[#ede6dc] flex items-center justify-center font-bold text-[#4a2c2a] text-2xl shadow-inner">
                  {member.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('')}
                  <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2d1b18] leading-tight">{member.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-[#4a2c2a] font-semibold tracking-wide uppercase bg-[#f3ede2] px-2 py-0.5 rounded border border-[#ede6dc]/60">
                      {member.department === 'AI_DS' ? 'AI & DS' : member.department}
                    </span>
                    <span className="text-slate-500 text-xs">{member.designation}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 border-t border-[#ede6dc] pt-3">
                  <p>🎓 <span className="text-slate-700">{member.qualification}</span></p>
                  <p>💼 <span className="text-slate-700">{member.experience}</span></p>
                  <p>🕒 <span className="text-slate-700">{member.officeHours}</span></p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setSelectedFaculty(member)}
                  className="w-full py-2.5 rounded-xl font-bold bg-white hover:bg-[#4a2c2a] hover:text-white border border-[#ede6dc] text-[#4a2c2a] text-xs transition-all duration-300 cursor-pointer"
                >
                  View Details & Publications
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFaculty.length === 0 && (
          <div className="text-center py-12 text-slate-500 max-w-md mx-auto">
            <svg className="w-12 h-12 mx-auto text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No faculty members found matching your filters.</p>
          </div>
        )}

        {/* Modal Overlay */}
        {selectedFaculty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#faf7f2] border border-[#ede6dc] rounded-3xl p-6 sm:p-8 w-full max-w-xl relative shadow-2xl animate-in zoom-in-95 duration-200">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedFaculty(null)}
                className="absolute top-4 right-4 text-[#4a2c2a] hover:text-[#5d3a37] bg-[#f3ede2] p-2.5 rounded-xl border border-[#ede6dc] hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-6">
                
                {/* Header Profile */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-[#4a2c2a] to-[#8d6e63] flex items-center justify-center font-bold text-white text-xl shadow">
                    {selectedFaculty.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#2d1b18]">{selectedFaculty.name}</h2>
                    <p className="text-slate-500 text-xs">{selectedFaculty.designation} • {selectedFaculty.department === 'AI_DS' ? 'AI & DS' : selectedFaculty.department}</p>
                    <a href={`mailto:${selectedFaculty.email}`} className="text-xs text-[#4a2c2a] hover:underline font-semibold">{selectedFaculty.email}</a>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#ede6dc] text-xs leading-relaxed">
                  <p><span className="text-slate-500">Qualifications:</span> <strong className="text-[#2d1b18] font-semibold">{selectedFaculty.qualification}</strong></p>
                  <p><span className="text-slate-500">Experience:</span> <strong className="text-[#2d1b18] font-semibold">{selectedFaculty.experience}</strong></p>
                  <p><span className="text-slate-500">Office Hours:</span> <strong className="text-[#2d1b18] font-semibold">{selectedFaculty.officeHours}</strong></p>
                </div>

                {/* Research Publications */}
                <div className="space-y-3">
                  <h4 className="text-[#2d1b18] font-bold text-sm flex items-center space-x-2">
                    <span className="w-1 h-4 bg-[#4a2c2a] rounded-full"></span>
                    <span>Research Publications</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-655">
                    {selectedFaculty.researchPublications.map((pub, index) => (
                      <li key={index} className="pl-4 border-l-2 border-[#4a2c2a] py-0.5 leading-relaxed">
                        {pub}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-4 pt-4 border-t border-[#ede6dc]">
                  <a
                    href={selectedFaculty.resumeUrl}
                    className="flex-1 py-3 rounded-xl font-bold bg-[#4a2c2a] hover:bg-[#5d3a37] text-white text-xs text-center shadow-md shadow-[#4a2c2a]/15 transition-all duration-300"
                  >
                    Download Resume (PDF)
                  </a>
                  <button
                    onClick={() => setSelectedFaculty(null)}
                    className="px-6 py-3 rounded-xl font-bold bg-white hover:bg-slate-100 text-[#4a2c2a] border border-[#ede6dc] text-xs transition-colors duration-300 cursor-pointer"
                  >
                    Close
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function Faculty() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen flex items-center justify-center text-slate-500">
        Loading directory...
      </div>
    }>
      <FacultyContent />
    </Suspense>
  );
}
