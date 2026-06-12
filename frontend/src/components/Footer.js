import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2d1b18] border-t border-[#4a2c2a] text-[#ede6dc]/80 py-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Address Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#faf7f2] flex items-center justify-center font-bold text-[#4a2c2a] text-sm">
                CS
              </div>
              <span className="text-white font-bold tracking-tight text-md">Sandur Polytechnic</span>
            </div>
            <p className="text-sm text-[#ede6dc]/60 leading-relaxed">
              Empowering future tech professionals with high quality technical education and practical skills in Computer Science & Engineering.
            </p>
            <div className="text-xs text-[#ede6dc]/50 leading-relaxed">
              Sandur Polytechnic, Yeshwantnagar<br />
              Ballari District, Karnataka - 583124
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-[#ede6dc]/70 hover:text-white hover:underline transition-colors duration-200">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#ede6dc]/70 hover:text-white hover:underline transition-colors duration-200">
                  About Department
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="text-[#ede6dc]/70 hover:text-white hover:underline transition-colors duration-200">
                  Faculty Directory
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-[#ede6dc]/70 hover:text-white hover:underline transition-colors duration-200">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#ede6dc]/70 hover:text-white hover:underline transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Corner Column */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Student Corner</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/student/notes" className="text-[#ede6dc]/70 hover:text-white hover:underline transition-colors duration-200">
                  Study Notes (PDF)
                </Link>
              </li>
              <li>
                <Link href="/student/lab-manuals" className="text-[#ede6dc]/70 hover:text-white hover:underline transition-colors duration-200">
                  Lab Manuals
                </Link>
              </li>
              <li>
                <Link href="/student/timetable" className="text-[#ede6dc]/70 hover:text-white hover:underline transition-colors duration-200">
                  Class Timetables
                </Link>
              </li>
              <li>
                <Link href="/student/question-papers" className="text-[#ede6dc]/70 hover:text-white hover:underline transition-colors duration-200">
                  Previous Papers
                </Link>
              </li>
              <li>
                <Link href="/student/feed" className="text-[#ede6dc]/70 hover:text-white hover:underline transition-colors duration-200">
                  Interactive Student Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Social / Contact Column */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Stay Connected</h3>
            <div className="flex space-x-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61559930694840" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-lg bg-[#4a2c2a] border border-[#5d3a37] flex items-center justify-center text-[#ede6dc] hover:bg-[#5d3a37] hover:text-white transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
              <a 
                href="https://www.sanpoly.edu.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-lg bg-[#4a2c2a] border border-[#5d3a37] flex items-center justify-center text-[#ede6dc] hover:bg-[#5d3a37] hover:text-white transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            </div>
            <div className="pt-2 text-sm text-[#ede6dc]/60">
              Email: <span className="text-[#ede6dc]/85 font-semibold">principal@sanpoly.org</span><br />
              Tel: <span className="text-[#ede6dc]/85 font-semibold">+91-8395-278224</span>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-[#4a2c2a] flex flex-col md:flex-row items-center justify-between text-xs text-[#ede6dc]/50">
          <p>© {currentYear} Sandur Polytechnic. All Rights Reserved. Designed for CSE Department.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/disclosure" className="hover:underline hover:text-white transition-colors duration-200">AICTE Disclosure</Link>
            <Link href="/admin" className="hover:underline hover:text-white transition-colors duration-200">Faculty Logins</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
