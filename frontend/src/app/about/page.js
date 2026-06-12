import Link from 'next/link';

export default function About() {
  const scopeItems = [
    { title: 'Information Technology', desc: 'Software development, testing, database administration, and application engineering.' },
    { title: 'Industrial Automation', desc: 'Process control systems, embedded devices, and robotics scripting.' },
    { title: 'E-Commerce & Portals', desc: 'Building enterprise web stores, payment integrations, and content engines.' },
    { title: 'Network Infrastructure', desc: 'Network design, server admin, PC diagnostics, and system auditing.' },
    { title: 'Artificial Intelligence & Data Science', desc: 'Statistical reporting, machine learning training, and web crawlers.' }
  ];

  const outcomes = [
    'Apply core computer science techniques to engineer solutions for real-world business requirements.',
    'Work collaboratively in cross-functional technical engineering and development teams.',
    'Communicate complex technological designs clearly to stakeholders and managers.',
    'Commit to lifelong learning to master new cloud technologies, security standards, and languages.',
    'Uphold high moral values, legal compliance, and ethical standard practices in system designs.'
  ];

  return (
    <div className="bg-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <span className="text-xs font-bold text-[#4a2c2a] tracking-wider uppercase bg-[#f3ede2] border border-[#ede6dc] px-3 py-1 rounded-full">
            Department Overview
          </span>
          <h1 className="text-4xl font-extrabold text-[#2d1b18] tracking-tight sm:text-5xl">
            About Computer Science & Engineering
          </h1>
          <p className="max-w-2xl mx-auto text-slate-655 text-lg leading-relaxed">
            Sandur Polytechnic offers a comprehensive diploma course in Computer Science & Engineering, equipping students with high-demand hardware, software, and networking capabilities.
          </p>
        </div>

        {/* Vision & Mission Detail */}
        <div className="bg-[#faf7f2] border border-[#ede6dc] rounded-3xl p-8 space-y-8 hover:border-[#4a2c2a]/20 transition-all duration-300">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#2d1b18] flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-[#4a2c2a] rounded-full"></span>
              <span>Vision of the Program</span>
            </h2>
            <p className="text-slate-655 leading-relaxed pl-3.5">
              To offer quality technical education embedded with leadership qualities and social responsibilities to enable students to develop into globally competitive professionals with enhanced skills in the field of information technology.
            </p>
          </div>

          <div className="pt-6 border-t border-[#ede6dc] space-y-6">
            <h2 className="text-2xl font-bold text-[#2d1b18] flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-[#8d6e63] rounded-full"></span>
              <span>Mission of the Program</span>
            </h2>
            <div className="space-y-4 pl-3.5">
              <div className="flex items-start space-x-3">
                <span className="font-bold text-[#4a2c2a] bg-[#f3ede2] px-2 py-0.5 rounded text-sm mt-0.5 border border-[#ede6dc]">M1</span>
                <p className="text-slate-655 text-sm">To impart knowledge with relevant theoretical and practical aspects of Computer Engineering through effective teaching learning process.</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="font-bold text-[#4a2c2a] bg-[#f3ede2] px-2 py-0.5 rounded text-sm mt-0.5 border border-[#ede6dc]">M2</span>
                <p className="text-slate-655 text-sm">To build confidence, technical skills and competitiveness by enhancing leadership qualities and teamwork.</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="font-bold text-[#4a2c2a] bg-[#f3ede2] px-2 py-0.5 rounded text-sm mt-0.5 border border-[#ede6dc]">M3</span>
                <p className="text-slate-655 text-sm">To create a conducive environment to attain professionalism and pursue higher education with moral values and become useful to employer as well as to the society.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scope of Program */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#2d1b18]">Career Pathways & Scope</h2>
            <p className="text-slate-555 text-sm">Graduates from Sandur Polytechnic have a vast range of placements and career opportunities waiting for them.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scopeItems.map((item, idx) => (
              <div key={idx} className="bg-[#faf7f2]/60 border border-[#ede6dc] p-6 rounded-2xl hover:border-[#4a2c2a]/20 transition-all duration-300">
                <h3 className="text-[#2d1b18] font-bold text-md">{item.title}</h3>
                <p className="text-slate-655 text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Program Learning Outcomes */}
        <div className="bg-[#faf7f2]/40 border border-[#ede6dc] p-8 rounded-3xl space-y-6">
          <h2 className="text-2xl font-bold text-[#2d1b18]">Program Outcomes (POs)</h2>
          <ul className="space-y-4">
            {outcomes.map((outcome, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-[#4a2c2a] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="leading-relaxed">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Link */}
        <div className="text-center pt-4">
          <Link href="/faculty" className="inline-flex items-center space-x-1.5 px-6 py-3 rounded-xl bg-[#4a2c2a] text-white font-bold hover:bg-[#5d3a37] shadow-lg shadow-[#4a2c2a]/15 transition-all duration-300">
            <span>Meet Our Faculty</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}
