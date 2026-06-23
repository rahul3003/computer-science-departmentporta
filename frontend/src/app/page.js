'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaLock, 
  FaUser, 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaLaptopCode, 
  FaPercentage, 
  FaCheckCircle,
  FaCode,
  FaHtml5,
  FaNetworkWired,
  FaDatabase,
  FaShieldAlt,
  FaMicrochip,
  FaCloud,
  FaQuoteLeft,
  FaBullseye,
  FaLightbulb,
  FaEnvelope,
  FaClock,
  FaGraduationCap,
  FaBriefcase
} from 'react-icons/fa';

export default function Home() {
  const router = useRouter();

  // Carousel Slides
  const slides = [
    {
      url: '/landing_carousel_3.png',
      tag: 'Our Campus',
      title: 'Sandur Polytechnic Institute',
      desc: 'State-of-the-art department infrastructure and conducive academic environment.'
    },
    {
      url: '/landing_carousel_2.png',
      tag: 'Computing Lab',
      title: 'Modern Hands-on Infrastructure',
      desc: 'Equipped with professional workstations for logic building and system administration.'
    },
    {
      url: '/landing_carousel_4.png',
      tag: 'Innovation Hub',
      title: 'Interactive Learning & Projects',
      desc: 'Mentoring students on real-world projects, data structures, and advanced systems.'
    },
    {
      url: '/landing_carousel_1.png',
      tag: 'Student Life',
      title: 'Next-Gen Computer Scientists',
      desc: 'Fostering teamwork, competitive spirit, and software engineering expertise.'
    },
    {
      url: '/landing_carousel_5.png',
      tag: 'Alumni & Success',
      title: 'Bright Futures & Placements',
      desc: 'Securing campus selections at leading IT firms like Infosys, Wipro, and Cisco.'
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [faculty, setFaculty] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(true);

  useEffect(() => {
    const getFaculty = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/faculty`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setFaculty(data);
            setFacultyLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch faculty:", err);
      }
      
      // Fallback data if API fails or returns empty
      setFaculty([
        {
          id: '1',
          name: 'Mrs. Rekha Patil',
          designation: 'Head of Department / Selection Grade Lecturer',
          qualification: 'M.Tech in CSE',
          experience: '18 years',
          photoUrl: '',
          email: 'rekha.patil@sandur.edu',
          officeHours: '10:00 AM - 04:00 PM'
        },
        {
          id: '2',
          name: 'Mr. Sandeep Gowda',
          designation: 'Senior Lecturer',
          qualification: 'M.Tech in CSE',
          experience: '12 years',
          photoUrl: '',
          email: 'sandeep.gowda@sandur.edu',
          officeHours: '09:00 AM - 03:00 PM'
        },
        {
          id: '3',
          name: 'Mrs. Soumya L.',
          designation: 'Lecturer',
          qualification: 'B.E. in CSE',
          experience: '6 years',
          photoUrl: '',
          email: 'soumya.l@sandur.edu',
          officeHours: '11:00 AM - 02:00 PM'
        }
      ]);
      setFacultyLoading(false);
    };
    getFaculty();
  }, []);

  const [facultyIndex, setFacultyIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsToShow(3);
      else if (window.innerWidth >= 768) setItemsToShow(2);
      else setItemsToShow(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (faculty.length > 0 && facultyIndex > faculty.length - itemsToShow) {
      setFacultyIndex(Math.max(0, faculty.length - itemsToShow));
    }
  }, [itemsToShow, faculty.length, facultyIndex]);

  // Auto advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevFaculty = () => {
    setFacultyIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextFaculty = () => {
    setFacultyIndex((prev) => Math.min(faculty.length - itemsToShow, prev + 1));
  };

  // Helper to trigger open login modal event
  const handleOpenLogin = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-login-modal'));
    }
  };

  const stats = [
    { value: '300+', label: 'Active Students', icon: <FaUserGraduate className="w-5 h-5" /> },
    { value: '15+', label: 'Expert Faculty', icon: <FaChalkboardTeacher className="w-5 h-5" /> },
    { value: '3+', label: 'Specialized Labs', icon: <FaLaptopCode className="w-5 h-5" /> },
    { value: '94%', label: 'Placement Rate', icon: <FaPercentage className="w-5 h-5" /> },
  ];

  const missions = [
    {
      code: 'M1',
      title: 'Teaching & Learning',
      description: 'To impart knowledge with relevant theoretical and practical aspects of Computer Engineering through effective teaching learning process.'
    },
    {
      code: 'M2',
      title: 'Confidence & Leadership',
      description: 'To build confidence, technical skills and competitiveness by enhancing leadership qualities and teamwork.'
    },
    {
      code: 'M3',
      title: 'Conducive Environment & Values',
      description: 'To create a conducive environment to attain professionalism and pursue higher education with moral values and become useful to employer as well as to the society.'
    }
  ];

  const coreLabs = [
    {
      title: 'Software Development Centre',
      description: 'Equipped with industry-standard configurations and latest software packages to master web development, database management systems, mobile apps, and code compilation.',
      bg: 'bg-[#4a2c2a]',
      icon: <FaCodeIcon />,
      image: '/landing_carousel_2.png',
      specs: '60 high-end core-i7 computing workstations, GCC/G++ compilation tooling, Oracle DB nodes, and visual IDEs.'
    },
    {
      title: 'PC Hardware & Networking Lab',
      description: 'Imparts hands-on experience in computer troubleshooting, hardware diagnostics, network cables crimping, router setups, and switches installation.',
      bg: 'bg-[#5d3a37]',
      icon: <FaNetworkIcon />,
      image: '/landing_carousel_4.png',
      specs: 'D-Link routers, gigabit network switches, motherboard diagnostics cards, RJ-45 crimping kits, and Cisco Packet Tracer.'
    },
    {
      title: 'IT Skills Lab',
      description: 'Focuses on foundations of computer engineering, automation utilities, Python/Java compilers, and algorithm optimizations.',
      bg: 'bg-[#8d6e63]',
      icon: <FaLaptopIcon />,
      image: '/landing_carousel_1.png',
      specs: 'Office automation software suites, Python 3 environments, JDK 17 compilers, and database design interfaces.'
    }
  ];

  const testimonials = [
    {
      name: 'Abhishek Patil',
      role: 'Associate Software Engineer',
      company: 'Infosys',
      batch: 'CSE Batch of 2024',
      quote: 'The hands-on lab sessions at Sandur Polytechnic gave me a strong foundation in Java and Web Designing. It helped me clear the Infosys campus selection round on my very first attempt.',
      initials: 'AP'
    },
    {
      name: 'Sneha Hegde',
      role: 'Network Security Engineer',
      company: 'Cisco Systems',
      batch: 'CSE Batch of 2023',
      quote: 'The PC Hardware & Networking labs here are equipped with real networking routers and patch configurations. Practical troubleshooting in my 5th sem directly helped me secure Cisco role.',
      initials: 'SH'
    },
    {
      name: 'Ramesh Deshmukh',
      role: 'Cloud Operations Analyst',
      company: 'Wipro Cloud Services',
      batch: 'CSE Batch of 2022',
      quote: 'Building IoT weather nodes and hosting database clusters on AWS cloud servers gave me actual industrial knowledge that matches exactly with the tasks in my corporate projects today.',
      initials: 'RD'
    }
  ];

  const subjects = [
    { name: 'C, C++, Java, SQL, ASP & .NET, Python', icon: <FaCode className="w-8 h-8" /> },
    { name: 'Web Designing', icon: <FaHtml5 className="w-8 h-8" /> },
    { name: 'PC Hardware & Networking', icon: <FaNetworkWired className="w-8 h-8" /> },
    { name: 'Database Designing', icon: <FaDatabase className="w-8 h-8" /> },
    { name: 'Internetworking & Security', icon: <FaShieldAlt className="w-8 h-8" /> },
    { name: 'AI & Internet of Things (IoT)', icon: <FaMicrochip className="w-8 h-8" /> },
    { name: 'Cloud Computing', icon: <FaCloud className="w-8 h-8" /> }
  ];

  return (
    <div className="flex flex-col bg-white text-slate-800 transition-colors duration-300">

      {/* Hero Full-Width Carousel Section */}
      <section className="w-full relative border-b border-slate-100 bg-[#faf7f2]">
        <div className="w-full h-[550px] relative overflow-hidden group">
          {/* Floating Particle Canvas */}
          <HeroParticles />

          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img 
                src={slide.url} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              
              {/* Caption Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/20 flex items-end p-8 sm:p-12">
                <div className="max-w-7xl mx-auto w-full text-left text-white space-y-4 relative z-20">
                  {/* Customized Welcome Tag */}
                  <div className="animate-slide-fade inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-sm text-[10px] font-bold text-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Welcome to Computer Science & Engineering Department</span>
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block text-[10px] font-extrabold text-indigo-400 bg-indigo-950/85 border border-indigo-900/40 px-3 py-1 rounded">
                      {slide.tag}
                    </span>
                    <h2 className="text-white font-extrabold text-2xl sm:text-4xl tracking-tight leading-tight max-w-2xl drop-shadow-md">
                      {slide.title}
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed drop-shadow-sm">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Left/Right Slide Arrows with React Icons */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Previous image"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Next image"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        </section>

      {/* Quick Statistics Banner */}
      <section className="relative -mt-16 z-30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white border border-[#ede6dc] p-6 rounded-3xl shadow-xl backdrop-blur-md">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl flex items-center space-x-4 transition-all duration-300 hover:bg-[#faf7f2]/50 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f3ede2] flex items-center justify-center text-[#4a2c2a] group-hover:scale-105 transition-transform duration-300 shrink-0">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <span className="text-2xl font-extrabold text-[#2d1b18] block leading-none">
                    {stat.value}
                  </span>
                  <span className="text-slate-500 text-3xs font-semibold uppercase tracking-wider mt-1 block">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#ede6dc_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-60 pointer-events-none z-0"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#f3ede2]/40 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#ede6dc]/40 blur-[100px] pointer-events-none z-0"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Centered Header */}
          <div className="text-center space-y-4 mb-12">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-[#4a2c2a] bg-[#f3ede2] border border-[#ede6dc] px-3.5 py-1.5 rounded-full inline-block">
              Our Foundation
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2d1b18] tracking-tight">
              Vision & Mission of the Department
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Aligning academic training with industrial needs and ethical values to nurture next-generation computer science graduates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Vision Card (Left) */}
            <div className="bg-[#faf7f2]/40 border border-[#ede6dc] p-8 sm:p-10 rounded-3xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden group flex flex-col justify-between min-h-[460px]">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-brown to-accent-brown"></div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#f3ede2] flex items-center justify-center text-[#4a2c2a] shadow-sm">
                    <FaLightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-3xs font-extrabold uppercase tracking-widest text-[#4a2c2a] block">Core Philosophy</span>
                    <h3 className="text-lg font-extrabold text-[#2d1b18]">Department Vision</h3>
                  </div>
                </div>
                
                <div className="relative pt-4">
                  <FaQuoteLeft className="text-5xl text-[#4a2c2a]/10 absolute -top-1 -left-2" />
                  <p className="text-[#2d1b18] text-base font-medium italic leading-relaxed pl-8 relative z-10">
                    To offer quality technical education embedded with leadership qualities and social responsibilities to enable students to develop into globally competitive professionals with enhanced skills in the field of information technology.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#ede6dc]/60 mt-6 pl-8">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  — Department Program Vision
                </span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                  Sandur Polytechnic CSE Department
                </span>
              </div>
            </div>

            {/* Mission Card (Right) */}
            <div className="bg-[#faf7f2]/40 border border-[#ede6dc] p-8 sm:p-10 rounded-3xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden group flex flex-col justify-between min-h-[460px]">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent-brown to-primary-brown"></div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#f3ede2] flex items-center justify-center text-[#4a2c2a] shadow-sm">
                    <FaBullseye className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-3xs font-extrabold uppercase tracking-widest text-[#4a2c2a] block">Key Milestones</span>
                    <h3 className="text-lg font-extrabold text-[#2d1b18]">Program Mission Objectives</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {missions.map((mission, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-[#ede6dc]/60 rounded-2xl p-4 transition-all duration-300 hover:shadow-sm hover:border-[#4a2c2a]/20 flex items-start space-x-4 group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#f3ede2] text-[#4a2c2a] group-hover/item:bg-[#4a2c2a] group-hover/item:text-white flex items-center justify-center font-bold text-xs shrink-0 transition-colors duration-200">
                        {mission.code}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[#2d1b18] font-bold text-xs leading-none group-hover/item:text-[#4a2c2a] transition-colors duration-200">
                          {mission.title}
                        </h4>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {mission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Course Concepts (Academic Curriculum Highlights) */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-[#faf7f2]/40 border-b border-slate-100">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#ede6dc_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-50 pointer-events-none z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 rounded-full bg-gradient-to-tr from-[#f3ede2]/50 to-[#ede6dc]/50 blur-[120px] pointer-events-none z-0"></div>

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-[#2d1b18]">Academic Curriculum Highlights</h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              The program covers various learning outcomes in the field of Computer science and Information technology. The curriculum contains several courses like Basic Engg skills, Core IT skills, Programming skills, Project Management skills etc.
            </p>
          </div>

          <div className="w-full overflow-hidden relative py-6">
            {/* Fade overlays */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#faf7f2]/85 via-[#faf7f2]/30 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#faf7f2]/85 via-[#faf7f2]/30 to-transparent z-10 pointer-events-none"></div>

            <div className="flex space-x-6 animate-marquee whitespace-nowrap">
              {[...subjects, ...subjects, ...subjects, ...subjects].map((sub, idx) => (
                <div 
                  key={idx}
                  className="inline-flex flex-col items-center justify-center bg-white border border-[#ede6dc] hover:border-[#4a2c2a]/40 p-6 rounded-2xl w-36 h-36 transition-all duration-300 hover:scale-105 shrink-0 shadow-sm group relative cursor-pointer"
                  title={sub.name}
                >
                  <div className="text-[#4a2c2a] text-4xl transition-transform duration-300 group-hover:scale-110">
                    {sub.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-3 text-center max-w-[120px] whitespace-normal leading-tight group-hover:text-[#4a2c2a] transition-colors duration-250">
                    {sub.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Labs Showcase Console */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#ede6dc_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-60 pointer-events-none z-0"></div>
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#f3ede2]/40 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#ede6dc]/40 blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          
          <div className="text-center space-y-3">
            <span className="text-3xs font-extrabold uppercase tracking-widest text-[#4a2c2a] bg-[#f3ede2] border border-[#ede6dc] px-3.5 py-1.5 rounded-full inline-block">
              Interactive Showcase
            </span>
            <h2 className="text-3xl font-bold text-[#2d1b18] tracking-tight">
              Our Specialized Computer Laboratories
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Equipped with state-of-the-art configurations, specialized tools, and learning materials to ensure industrial competency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {coreLabs.map((lab, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-[#ede6dc] rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Lab Image Block */}
                <div className="relative overflow-hidden aspect-video select-none shrink-0 border-b border-[#ede6dc]/60">
                  <img 
                    src={lab.image} 
                    alt={lab.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#2d1b18]/80 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-lg">
                    Lab {idx + 1}
                  </div>
                </div>

                {/* Lab Info Block */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        Authorized Facility
                      </p>
                      <div className="w-8 h-8 rounded-lg bg-[#4a2c2a] flex items-center justify-center shadow-sm">
                        {lab.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-base font-extrabold text-[#2d1b18] tracking-tight leading-snug group-hover:text-[#4a2c2a] transition-colors duration-250">
                      {lab.title}
                    </h3>
                    
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {lab.description}
                    </p>
                  </div>

                  <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ede6dc] space-y-1.5 mt-auto">
                    <h4 className="text-[#2d1b18] font-bold text-[10px] uppercase tracking-wider flex items-center space-x-1.5">
                      <span className="w-1.5 h-3.5 bg-[#4a2c2a] rounded"></span>
                      <span>Specifications & Tools</span>
                    </h4>
                    <p className="text-slate-600 text-[11px] leading-relaxed font-mono bg-white/60 p-2.5 rounded border border-[#ede6dc]/30">
                      {lab.specs}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Faculty Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-[#faf7f2]/40 border-b border-slate-100">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#ede6dc_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-50 pointer-events-none z-0"></div>
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 w-80 h-80 rounded-full bg-[#f3ede2]/50 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#ede6dc]/50 blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3 text-left">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-[#4a2c2a] bg-[#f3ede2] border border-[#ede6dc] px-3.5 py-1.5 rounded-full inline-block">
                Department Mentors
              </span>
              <h2 className="text-3xl font-bold text-[#2d1b18] tracking-tight">
                Meet Our Expert Faculty
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-xl leading-relaxed">
                Dedicated academic lecturers providing professional training, industrial logic, and career mentorship.
              </p>
            </div>
            
            {/* Carousel navigation arrows */}
            {!facultyLoading && faculty.length > itemsToShow && (
              <div className="flex space-x-2 shrink-0">
                <button 
                  onClick={handlePrevFaculty}
                  disabled={facultyIndex === 0}
                  className="w-10 h-10 rounded-xl bg-white border border-[#ede6dc] hover:border-[#4a2c2a] text-[#4a2c2a] disabled:opacity-30 disabled:hover:border-[#ede6dc] disabled:pointer-events-none flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
                  title="Previous faculty"
                >
                  <FaChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={handleNextFaculty}
                  disabled={facultyIndex >= faculty.length - itemsToShow}
                  className="w-10 h-10 rounded-xl bg-white border border-[#ede6dc] hover:border-[#4a2c2a] text-[#4a2c2a] disabled:opacity-30 disabled:hover:border-[#ede6dc] disabled:pointer-events-none flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
                  title="Next faculty"
                >
                  <FaChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {facultyLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-4 border-[#4a2c2a]/20 border-t-[#4a2c2a] animate-spin"></div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Loading department faculty...</p>
            </div>
          ) : (
            <div className="relative overflow-hidden w-full px-1 py-2">
              <div 
                className="flex transition-transform duration-500 ease-in-out -mx-4"
                style={{ transform: `translateX(-${facultyIndex * (100 / itemsToShow)}%)` }}
              >
                {faculty.map((member) => (
                  <div 
                    key={member.id} 
                    className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-4 flex"
                  >
                    <div className="bg-white border border-[#ede6dc] rounded-[32px] p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 flex flex-col justify-between group w-full">
                      <div className="space-y-4">
                        {/* Big Photo Container */}
                        <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#f3ede2] to-[#faf7f2] border border-[#ede6dc] flex items-center justify-center font-extrabold text-3xl text-[#4a2c2a] shadow-inner shrink-0">
                          {member.photoUrl && !member.photoUrl.includes('/placeholder/') ? (
                            <img 
                              src={member.photoUrl} 
                              alt={member.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement.innerText = member.name ? member.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('').slice(0, 2).toUpperCase() : '';
                              }}
                            />
                          ) : (
                            member.name ? member.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('').slice(0, 2).toUpperCase() : ''
                          )}
                        </div>

                        {/* Name and Designation */}
                        <div className="space-y-1">
                          <h3 className="text-base font-extrabold text-[#2d1b18] tracking-tight leading-snug group-hover:text-primary-brown transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-[#8d6e63] text-xs font-bold uppercase tracking-wider">
                            {member.designation}
                          </p>
                        </div>

                        {/* Badges block */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#faf7f2] border border-[#ede6dc] rounded-lg text-[10px] font-bold text-slate-600">
                            <FaGraduationCap className="w-3.5 h-3.5 text-[#4a2c2a]" />
                            <span>{member.qualification}</span>
                          </span>
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#faf7f2] border border-[#ede6dc] rounded-lg text-[10px] font-bold text-slate-600">
                            <FaBriefcase className="w-3.5 h-3.5 text-[#4a2c2a]" />
                            <span>{member.experience}</span>
                          </span>
                        </div>
                      </div>

                      {/* Contact & Hours block */}
                      <div className="pt-4 border-t border-[#ede6dc]/60 space-y-2 mt-4">
                        <a 
                          href={`mailto:${member.email}`} 
                          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#4a2c2a] transition-colors"
                        >
                          <FaEnvelope className="w-3.5 h-3.5 text-[#8d6e63]" />
                          <span className="truncate">{member.email}</span>
                        </a>
                        {member.officeHours && (
                          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
                            <FaClock className="w-3.5 h-3.5 text-[#8d6e63]" />
                            <span>Office: {member.officeHours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Testimonials section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#ede6dc_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-60 pointer-events-none z-0"></div>
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[300px] rounded-full bg-[#f3ede2]/30 blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Card: Placements Summary */}
            <div className="lg:col-span-5 bg-gradient-to-br from-primary-brown to-primary-brown-hover text-white p-8 sm:p-10 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden group min-h-[400px]">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="space-y-6">
                <span className="text-3xs font-extrabold uppercase tracking-widest text-amber-200 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full inline-block">
                  Alumni Success
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                  Placements & Career Achievements
                </h2>
                <p className="text-white/85 text-sm leading-relaxed">
                  Our Computer Science graduates go on to build brilliant careers at top multinational companies. From software engineering to cloud administration, their practical lab experience at Sandur Polytechnic translates into industry excellence.
                </p>
              </div>

              <div className="pt-8 border-t border-white/10 mt-8 space-y-4">
                <p className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">Top Recruiters & Partners</p>
                <div className="flex flex-wrap gap-4 items-center opacity-90">
                  <span className="text-sm font-extrabold tracking-widest text-white/95">INFOSYS</span>
                  <span className="text-xs font-bold text-white/30">&bull;</span>
                  <span className="text-sm font-extrabold tracking-widest text-white/95">CISCO</span>
                  <span className="text-xs font-bold text-white/30">&bull;</span>
                  <span className="text-sm font-extrabold tracking-widest text-white/95">WIPRO</span>
                </div>
              </div>
            </div>

            {/* Right Card: Asymmetric testimonials stack */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              {testimonials.map((t, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#faf7f2]/40 border border-[#ede6dc] hover:border-primary-brown/20 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative group"
                >
                  <div className="space-y-3">
                    <FaQuoteLeft className="text-3xl text-[#4a2c2a]/10 absolute top-4 left-4" />
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic pl-6 relative z-10">
                      {t.quote}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#ede6dc]/60 mt-4 pl-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f3ede2] border border-[#ede6dc] flex items-center justify-center font-bold text-[#4a2c2a] text-xs shrink-0">
                        {t.initials}
                      </div>
                      <div>
                        <h4 className="text-[#2d1b18] font-bold text-xs leading-none">{t.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-none">
                          {t.role} &bull; <span className="font-semibold text-[#4a2c2a]">{t.company}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold bg-[#faf7f2] border border-[#ede6dc]/50 px-2.5 py-0.5 rounded-full">
                      {t.batch}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


    </div>
  );
}

// Inline Icon Helper components to keep things clean and functional
function FaCodeIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function FaNetworkIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function FaLaptopIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

// Particle canvas animation helper for the hero carousel overlay
function HeroParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    let width = canvas.width = canvas.offsetWidth || window.innerWidth;
    let height = canvas.height = canvas.offsetHeight || 550;

    const particles = [];
    const particleCount = 45;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = -Math.random() * 0.5 - 0.15; // slow vertical drift
        this.opacity = Math.random() * 0.4 + 0.15;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }
        if (this.x < 0 || this.x > width) {
          this.speedX = -this.speedX;
        }
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 550;
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-12 opacity-80" />;
}
