'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'ADMISSION',
    message: ''
  });
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }
    
    // Simulate successful API call
    setStatus('success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'ADMISSION',
      message: ''
    });
    
    // Clear status after 4 seconds
    setTimeout(() => {
      setStatus(null);
    }, 4000);
  };

  const handleInputChange = (field, val) => {
    setFormData({
      ...formData,
      [field]: val
    });
  };

  return (
    <div className="bg-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8 flex-grow">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <span className="text-xs font-bold text-[#4a2c2a] tracking-wider uppercase bg-[#f3ede2] border border-[#ede6dc] px-3 py-1 rounded-full">
            Get In Touch
          </span>
          <h1 className="text-4xl font-extrabold text-[#2d1b18] tracking-tight">
            Contact CSE Department
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 text-sm">
            Have questions about admissions, courses, placement statistics, or student activities? Reach out directly.
          </p>
        </div>

        {/* Form and Info Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
          
          {/* Info Card Column (5 cols) */}
          <div className="lg:col-span-5 bg-[#faf7f2] border border-[#ede6dc] rounded-3xl p-8 flex flex-col justify-between space-y-8 shadow-md">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#2d1b18]">Department Office</h3>
              
              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start space-x-3.5">
                  <span className="text-lg mt-0.5">📍</span>
                  <div>
                    <h4 className="font-bold text-[#2d1b18] mb-0.5">Address Location</h4>
                    <p className="leading-relaxed">
                      Sandur Polytechnic, Yeshwantnagar<br />
                      Sandur Taluk, Ballari District,<br />
                      Karnataka, India - 583124
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <span className="text-lg mt-0.5">📞</span>
                  <div>
                    <h4 className="font-bold text-[#2d1b18] mb-0.5">Telephone Numbers</h4>
                    <p className="leading-relaxed">
                      Principal Office: +91-8395-278224<br />
                      HOD Office: +91-8395-278225
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <span className="text-lg mt-0.5">✉️</span>
                  <div>
                    <h4 className="font-bold text-[#2d1b18] mb-0.5">Email Addresses</h4>
                    <p className="leading-relaxed text-[#4a2c2a] font-semibold">
                      principal@sanpoly.org<br />
                      hodcs@sanpoly.org
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Mock/Embed frame */}
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-[#ede6dc] bg-white relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#ede6dc_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              <div className="text-center z-10 p-4 space-y-1.5">
                <span className="text-[#4a2c2a] font-bold text-xs uppercase tracking-wide">Yeshwantnagar Map</span>
                <p className="text-slate-500 text-[10px]">Sandur Polytechnic Campus grounds, Ballari road.</p>
                <a 
                  href="https://www.sanpoly.edu.in/contact-us/how-to-reach-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-semibold text-[#4a2c2a] bg-[#faf7f2] border border-[#ede6dc] hover:bg-[#f3ede2] px-3 py-1.5 rounded-xl transition-colors duration-200"
                >
                  Get Directions
                </a>
              </div>
            </div>

          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-[#faf7f2]/60 border border-[#ede6dc] p-8 rounded-3xl space-y-6 shadow-md">
            <h3 className="text-xl font-bold text-[#2d1b18]">Send Admission Inquiry</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-white border border-[#ede6dc] px-4 py-2.5 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a]"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-white border border-[#ede6dc] px-4 py-2.5 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-white border border-[#ede6dc] px-4 py-2.5 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full bg-white border border-[#ede6dc] px-4 py-2.5 rounded-xl text-xs text-[#2d1b18] focus:outline-none focus:border-[#4a2c2a]"
                  >
                    <option value="ADMISSION">Admission Questions</option>
                    <option value="SYLLABUS">Course Curriculum</option>
                    <option value="FACULTY">Faculty Contacts</option>
                    <option value="FEEDBACK">Website Feedback</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Inquiry Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your inquiry details here..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full bg-white border border-[#ede6dc] p-4 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold bg-[#4a2c2a] hover:bg-[#5d3a37] text-white text-xs transition-colors duration-200 cursor-pointer shadow-md shadow-[#4a2c2a]/15"
              >
                Submit Inquiry Form
              </button>
            </form>

            {/* Notification alert states */}
            {status === 'success' && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center space-x-3 text-emerald-800 text-xs animate-in slide-in-from-bottom-2 duration-300">
                <svg className="w-5 h-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Thank you! Your inquiry was sent successfully. We will reach back soon.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center space-x-3 text-rose-800 text-xs animate-in slide-in-from-bottom-2 duration-300">
                <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Error: Please complete all mandatory form fields.</span>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
