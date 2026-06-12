'use client';

import { useState, useEffect } from 'react';
import { 
  FaRss, 
  FaBullhorn, 
  FaChartBar, 
  FaPlus, 
  FaTrash, 
  FaTimes, 
  FaHeart, 
  FaRegHeart, 
  FaComment,
  FaShareAlt,
  FaInfoCircle,
  FaCalendarAlt
} from 'react-icons/fa';

const initialPosts = [
  {
    id: 'p-1',
    authorName: 'Dr. Anil Kumar M.G.',
    authorRole: 'HOD, CSE Department',
    avatarInitials: 'AK',
    content: '🎉 Thrilled to announce that our students have completed the deployment setup of the new PC Hardware & Networking Lab. A big shoutout to the Semester 3 student team for their hands-on work in setting up the local network switches and troubleshooting connection nodes! Great work!',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    likesCount: 38,
    isLiked: false,
    comments: [
      { id: 'c-1', author: 'Rekha Patil', content: 'Fantastic effort! The lab is fully setup now.' },
      { id: 'c-2', author: 'Rahul Deshmukh', content: 'Proud to be part of this project!' }
    ],
    timestamp: '2 hours ago',
    pdfUrl: 'https://sandur-polytechnic.org/cse-circular-hardware.pdf',
    linkUrl: 'https://github.com/sandur-cse/pc-hardware-troubleshooting'
  },
  {
    id: 'p-poll-1',
    authorName: 'Shivasharanappa K.',
    authorRole: 'Professor, AI & DS Lead',
    avatarInitials: 'SK',
    content: '📊 IoT Lab Survey: Which programming language do you prefer for your Semester 5 microclimatic sensor node programming project?',
    likesCount: 22,
    isLiked: false,
    comments: [
      { id: 'c-10', author: 'Vikram Rao', content: 'Python with MicroPython makes hardware interactions incredibly easy to write!' }
    ],
    timestamp: '3 hours ago',
    poll: {
      question: 'Preferred language for IoT board prototyping?',
      options: [
        { text: 'Python (MicroPython)', votes: 34 },
        { text: 'C++ (Arduino IDE)', votes: 19 },
        { text: 'JavaScript (Node-RED / Johnny-Five)', votes: 8 }
      ],
      userVotedOptionIdx: null
    }
  },
  {
    id: 'p-2',
    authorName: 'Shivasharanappa K.',
    authorRole: 'Professor, AI & DS Lead',
    avatarInitials: 'SK',
    content: '💻 In today\'s AI & IoT practical lab, the students successfully programmed Raspberry Pi modules to collect microclimatic sensor data (temperature, pressure) and routed it to a local dashboard. Check out the python code logic and device setups!',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    likesCount: 29,
    isLiked: false,
    comments: [
      { id: 'c-3', author: 'Sneha G.', content: 'IoT lab experiments are really interesting.' }
    ],
    timestamp: '5 hours ago'
  },
  {
    id: 'p-3',
    authorName: 'Vikram Rao',
    authorRole: 'President, CSE Student Association',
    avatarInitials: 'VR',
    content: '🏆 Congratulations to the Sandur Polytechnic Code-Warriors who won 2nd place in the State-level Web Designing Hackathon today! They built a dynamic client portal within 24 hours using Next.js and Tailwind CSS!',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    likesCount: 56,
    isLiked: false,
    comments: [
      { id: 'c-4', author: 'Dr. Anil Kumar M.G.', content: 'Proud of our boys! Keep ascending.' },
      { id: 'c-5', author: 'Deepika R.', content: 'Outstanding work! Very proud.' }
    ],
    timestamp: '1 day ago'
  }
];

const mockUser = {
  name: 'Aarav Patel',
  role: 'Student, CSE Dept',
  initials: 'AP',
  email: 'aarav.patel@sandur.edu',
  enrollmentId: 'SP-2024-CSE-048',
  semester: 'Semester 5 (3rd Year)',
  group: 'CSE-Group B'
};

export default function StudentFeed() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationTab, setCreationTab] = useState('ANNOUNCEMENT'); // 'ANNOUNCEMENT' or 'POLL'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPostId, setCopiedPostId] = useState(null);
  
  // Post/Announcement Form State
  const [newContent, setNewContent] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [newPdfFile, setNewPdfFile] = useState(null);
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Poll Form State
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']); // min 2 options

  // Comment input state dictionary (key = postId)
  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Fetch dynamic feed posts from backend
    fetch('http://localhost:5000/api/feed')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formatted = data.map(post => {
            let parsedPoll = null;
            if (post.poll) {
              try {
                parsedPoll = typeof post.poll === 'string' ? JSON.parse(post.poll) : post.poll;
              } catch (e) {
                console.error(e);
              }
            }
            return {
              id: post.id,
              authorName: post.authorName,
              authorRole: post.authorRole,
              avatarInitials: post.authorName.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('').slice(0, 2).toUpperCase(),
              content: post.content,
              imageUrl: post.imageUrl,
              pdfUrl: post.pdfUrl,
              linkUrl: post.linkUrl,
              likesCount: post.likesCount || 0,
              isLiked: false,
              comments: Array.isArray(post.comments) ? post.comments.map(c => ({
                id: c.id,
                author: c.authorName,
                content: c.content
              })) : [],
              timestamp: new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              poll: parsedPoll
            };
          });
          setPosts(formatted);
        }
      })
      .catch(err => console.error('Error fetching feed posts:', err));
  }, []);

  const activeUser = {
    name: currentUser?.name || 'Aarav Patel',
    role: currentUser ? `Student, ${currentUser.semester || 'CSE Dept'}` : 'Student, CSE Dept',
    initials: currentUser?.name ? currentUser.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AP',
    email: currentUser?.email || 'student@sandur.edu',
    enrollmentId: currentUser?.enrollmentId || 'SP-2024-CSE-048',
    semester: currentUser?.semester || 'Semester 5',
    group: currentUser?.group || 'Group B'
  };

  const handleLike = (postId) => {
    fetch(`http://localhost:5000/api/feed/${postId}/like`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(updatedPost => {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likesCount: updatedPost.likesCount,
              isLiked: !post.isLiked
            };
          }
          return post;
        }));
      })
      .catch(e => console.error(e));
  };

  const handleVote = (postId, optionIdx) => {
    fetch(`http://localhost:5000/api/feed/${postId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionIdx })
    })
      .then(res => res.json())
      .then(updatedPost => {
        let parsedPoll = null;
        if (updatedPost.poll) {
          try {
            parsedPoll = typeof updatedPost.poll === 'string' ? JSON.parse(updatedPost.poll) : updatedPost.poll;
          } catch (e) {
            console.error(e);
          }
        }
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              poll: parsedPoll
            };
          }
          return post;
        }));
      })
      .catch(e => console.error(e));
  };

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    fetch(`http://localhost:5000/api/feed/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authorName: activeUser.name,
        content: commentText
      })
    })
      .then(res => res.json())
      .then(newComment => {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: newComment.id,
                  author: newComment.authorName,
                  content: newComment.content
                }
              ]
            };
          }
          return post;
        }));

        setCommentInputs({
          ...commentInputs,
          [postId]: ''
        });
      })
      .catch(e => console.error(e));
  };

  const handleCommentInputChange = (postId, text) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: text
    });
  };

  const handleShare = (postId) => {
    const shareLink = `${window.location.origin}/student/feed#${postId}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    }).catch(() => {
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    });
  };

  // Poll dynamic fields handlers
  const handleAddPollOptionField = () => {
    setPollOptions([...pollOptions, '']);
  };

  const handleRemovePollOptionField = (idx) => {
    if (pollOptions.length <= 2) return;
    setPollOptions(pollOptions.filter((_, i) => i !== idx));
  };

  const handlePollOptionChange = (idx, text) => {
    const updated = [...pollOptions];
    updated[idx] = text;
    setPollOptions(updated);
  };

  const handleCreateAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    // In a real S3 setup, we would upload files first.
    // For now we pass the form field parameters to create the feed post.
    const body = {
      content: newContent.trim(),
      authorName: activeUser.name,
      authorRole: activeUser.role,
      imageUrl: newImageFile ? `/uploads/${newImageFile.name}` : null,
      pdfUrl: newPdfFile ? `/uploads/${newPdfFile.name}` : null,
      linkUrl: newLinkUrl.trim() || null
    };

    fetch('http://localhost:5000/api/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(() => {
        setNewContent('');
        setNewImageFile(null);
        setNewPdfFile(null);
        setNewLinkUrl('');
        setIsModalOpen(false);
        // Reload to show new post
        window.location.reload();
      })
      .catch(e => console.error(e));
  };

  const handleCreatePollSubmit = (e) => {
    e.preventDefault();
    const activeOptions = pollOptions.filter(opt => opt.trim() !== '');
    if (!pollQuestion.trim() || activeOptions.length < 2) return;

    const body = {
      content: `📊 POLL: ${pollQuestion.trim()}`,
      authorName: activeUser.name,
      authorRole: activeUser.role,
      poll: {
        question: pollQuestion.trim(),
        options: activeOptions.map(opt => ({ text: opt.trim(), votes: 0 })),
        userVotedOptionIdx: null
      }
    };

    fetch('http://localhost:5000/api/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(() => {
        setPollQuestion('');
        setPollOptions(['', '']);
        setIsModalOpen(false);
        // Reload to show new poll
        window.location.reload();
      })
      .catch(e => console.error(e));
  };

  // Filtered posts based on search query
  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.authorRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white text-slate-800 min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Rotating Watermark Logo */}
      <div className="fixed -right-24 top-40 w-[450px] h-[450px] opacity-[0.03] pointer-events-none select-none animate-[spin_180s_linear_infinite] z-0">
        <img 
          src="/sandur_logo.png" 
          alt="Watermark Logo" 
          className="w-full h-full object-contain"
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-305 relative z-10">
        
        {/* Header & Search Bar Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ede6dc]/60 pb-5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#2d1b18] tracking-tight flex items-center space-x-2">
            <span className="w-2 h-5 bg-[#4a2c2a] rounded-full"></span>
            <span>Feed</span>
          </h1>

          {/* Search Bar beside title */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4a2c2a]/60">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search feed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf7f2] border border-[#ede6dc] pl-9 pr-3 py-2 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a] shadow-sm transition-colors duration-200"
            />
          </div>
        </div>

        {/* Dynamic Double-column Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Feed Column (Right on Desktop) */}
          <div className="lg:col-span-8 max-w-xl w-full space-y-5 lg:order-last">
            
            {/* Trigger Box for Creation Modal */}
            <div 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#faf7f2] border border-[#ede6dc] hover:border-[#4a2c2a]/20 p-3.5 rounded-xl flex items-center space-x-4 cursor-pointer transition-all duration-300 hover:shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4a2c2a] to-[#8d6e63] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
                {activeUser.initials}
              </div>
              <div className="flex-grow bg-white border border-[#ede6dc]/80 px-4 py-2 rounded-xl text-xs text-slate-400 text-left select-none">
                Share a new announcement, project update, or run a student poll...
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-5">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  id={post.id}
                  className="bg-white border border-[#ede6dc]/70 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#4a2c2a]/20 origin-left hover:-rotate-[1deg] hover:scale-[1.005] hover:translate-x-[-1px] transition-all duration-300"
                >
                  {/* Post Header */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between border-b border-[#ede6dc]/50 bg-[#faf7f2]/30">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4a2c2a] to-[#8d6e63] flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0">
                        {post.avatarInitials}
                      </div>
                      <div>
                        <h4 className="text-[#2d1b18] font-bold text-sm leading-tight">{post.authorName}</h4>
                        <span className="inline-block mt-1 bg-[#f3ede2] text-[#4a2c2a] border border-[#ede6dc]/80 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          {post.authorRole}
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs font-semibold">{post.timestamp}</span>
                  </div>

                  {/* Post Content */}
                  <div className="p-3.5 sm:p-4 space-y-3.5">
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    
                    {post.imageUrl && (
                      <div className="relative rounded-xl overflow-hidden border border-[#ede6dc]/60 aspect-video select-none group">
                        <img 
                          src={post.imageUrl} 
                          alt="Post attachment" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                        />
                      </div>
                    )}

                    {/* Attachment Action Pills (PDF / Web Reference) */}
                    {(post.pdfUrl || post.linkUrl) && (
                      <div className="flex flex-wrap gap-2.5 pt-1.5">
                        {post.pdfUrl && (
                          <a 
                            href={post.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-rose-50 hover:bg-rose-105 border border-rose-200 text-rose-800 px-3.5 py-2 rounded-xl text-[10px] font-bold transition-all duration-200 cursor-pointer shadow-3xs"
                          >
                            <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Download PDF circular</span>
                          </a>
                        )}
                        {post.linkUrl && (
                          <a 
                            href={post.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-[#f3ede2] hover:bg-[#ede6dc] border border-[#ede6dc] text-[#4a2c2a] px-3.5 py-2 rounded-xl text-[10px] font-bold transition-all duration-200 cursor-pointer shadow-3xs"
                          >
                            <svg className="w-3.5 h-3.5 text-[#4a2c2a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <span>Open Reference Link</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Poll Display */}
                    {post.poll && (
                      <div className="bg-[#faf7f2] border border-[#ede6dc] rounded-xl p-3.5 space-y-3 mt-3.5">
                        <h5 className="text-[#2d1b18] font-bold text-xs sm:text-sm border-b border-[#ede6dc]/50 pb-2">{post.poll.question}</h5>
                        <div className="space-y-2.5">
                          {post.poll.options.map((option, idx) => {
                            const totalVotes = post.poll.options.reduce((sum, o) => sum + o.votes, 0);
                            const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                            const hasVoted = post.poll.userVotedOptionIdx !== null;
                            const isUserVote = post.poll.userVotedOptionIdx === idx;

                            return (
                              <button
                                key={idx}
                                disabled={hasVoted}
                                onClick={() => handleVote(post.id, idx)}
                                className={`w-full text-left relative overflow-hidden rounded-xl border p-3 text-xs font-semibold transition-all duration-200 ${
                                  hasVoted
                                    ? isUserVote
                                      ? 'border-[#4a2c2a] text-[#2d1b18] bg-[#4a2c2a]/5'
                                      : 'border-[#ede6dc]/80 text-slate-500 bg-white'
                                    : 'border-[#ede6dc] hover:border-[#4a2c2a]/40 hover:bg-[#4a2c2a]/5 text-[#4a2c2a] bg-white cursor-pointer'
                                }`}
                              >
                                {/* Animated progress background */}
                                {hasVoted && (
                                  <div 
                                    className="absolute left-0 top-0 bottom-0 bg-[#4a2c2a]/10 transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                  />
                                )}
                                <div className="relative flex justify-between items-center z-10">
                                  <span>{option.text}</span>
                                  {hasVoted && (
                                    <span className="font-bold text-[#4a2c2a] ml-2">{pct}% ({option.votes})</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {post.poll.userVotedOptionIdx !== null && (
                          <p className="text-[10px] text-slate-400 font-semibold text-right pt-1">
                            Total votes: {post.poll.options.reduce((sum, o) => sum + o.votes, 0)} • Thank you for voting!
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Post Footer Controls */}
                  <div className="px-3.5 py-3 bg-[#f3ede2]/10 border-t border-[#ede6dc]/50 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      {/* Like Button */}
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-1.5 text-xs font-bold cursor-pointer transition-colors duration-200 ${
                          post.isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-[#4a2c2a]'
                        }`}
                      >
                        {post.isLiked ? (
                          <FaHeart className="w-4 h-4 text-rose-600 scale-110 transition-transform" />
                        ) : (
                          <FaRegHeart className="w-4 h-4" />
                        )}
                        <span>{post.likesCount} Likes</span>
                      </button>

                      {/* Comment Button */}
                      <button 
                        onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                        className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-[#4a2c2a] cursor-pointer"
                      >
                        <FaComment className="w-4 h-4" />
                        <span>{post.comments.length} Comments</span>
                      </button>

                      {/* Share Button with Toast */}
                      <div className="relative">
                        <button 
                          onClick={() => handleShare(post.id)}
                          className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-[#4a2c2a] cursor-pointer"
                        >
                          <FaShareAlt className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                        {copiedPostId === post.id && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#4a2c2a] text-white text-[10px] px-2.5 py-1.5 rounded-xl shadow-md animate-in fade-in slide-in-from-bottom-1 duration-150 whitespace-nowrap z-20 font-bold">
                            Link Copied!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Post Comments */}
                  {activeCommentsPostId === post.id && (
                    <div className="bg-[#f3ede2]/20 border-t border-[#ede6dc]/50 p-4 space-y-4">
                      {post.comments.length > 0 ? (
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="text-xs bg-white/60 p-2.5 border border-[#ede6dc]/40 rounded-xl">
                              <span className="font-bold text-[#2d1b18] mr-2">{comment.author}</span>
                              <span className="text-slate-600 leading-normal">{comment.content}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400">No comments yet. Be the first to comment!</p>
                      )}

                      {/* Add Comment Form */}
                      <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex space-x-2 pt-2 border-t border-[#ede6dc]/40">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                          className="flex-grow bg-white border border-[#ede6dc] px-3.5 py-2.5 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#4a2c2a] hover:bg-[#5d3a37] text-white font-bold text-xs transition-colors duration-205 cursor-pointer"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-16 bg-[#faf7f2] border border-[#ede6dc] rounded-2xl text-slate-500">
                <svg className="w-12 h-12 mx-auto text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">No feed updates match your search.</p>
              </div>
            )}

          </div>

          {/* Widgets Sidebar Column (Left on Desktop) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col space-y-6 lg:order-first">
            
            {/* User Profile Info Widget */}
            <div className="bg-[#faf7f2] border border-[#ede6dc] p-5 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center space-x-2 text-[#4a2c2a] border-b border-[#ede6dc]/60 pb-3">
                <FaInfoCircle className="w-4 h-4" />
                <h4 className="font-bold text-xs uppercase tracking-wider">My Student Profile</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#4a2c2a] to-[#8d6e63] flex items-center justify-center font-bold text-white shadow-sm">
                    {activeUser.initials}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#2d1b18]">{activeUser.name}</h5>
                    <p className="text-[10px] text-slate-500 font-semibold">{activeUser.role}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-3 border border-[#ede6dc]/65 space-y-2 text-[10px] leading-relaxed">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400 font-medium">Enrollment ID:</span>
                    <span className="text-[#2d1b18] font-bold">{activeUser.enrollmentId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400 font-medium">Semester:</span>
                    <span className="text-[#2d1b18] font-bold">{activeUser.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Lab Group:</span>
                    <span className="text-[#2d1b18] font-bold">{activeUser.group}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active Session Connected</span>
                </div>
              </div>
            </div>

            {/* circular Alerts Widget */}
            <div className="bg-[#faf7f2] border border-[#ede6dc] p-5 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center space-x-2 text-[#4a2c2a] border-b border-[#ede6dc]/60 pb-3">
                <FaCalendarAlt className="w-3.5 h-3.5" />
                <h4 className="font-bold text-xs uppercase tracking-wider">circular Alerts</h4>
              </div>
              <div className="space-y-3">
                {[
                  { text: 'Infosys campus placements registration close in 2 days.', date: 'June 7' },
                  { text: 'State-level Hackathon project synopsis submission deadline.', date: 'June 10' },
                  { text: 'PC Hardware & Troubleshooting manuals updated.', date: 'Updated' }
                ].map((notice, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-[#ede6dc]/65 space-y-1.5">
                    <p className="text-[10px] text-slate-700 leading-snug font-medium">{notice.text}</p>
                    <div className="flex justify-between items-center text-[9px] font-bold text-[#4a2c2a]/80 uppercase">
                      <span>CSE Circular</span>
                      <span className="bg-[#f3ede2] px-1.5 py-0.5 rounded border border-[#ede6dc]">{notice.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Creation Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#faf7f2] border border-[#ede6dc] p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 bg-[#f3ede2]/60 hover:bg-[#f3ede2] p-2.5 rounded-xl border border-[#ede6dc] hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col items-center text-center pb-4 mb-4 border-b border-[#ede6dc]/60">
              <h3 className="text-[#2d1b18] font-extrabold text-lg flex items-center space-x-2">
                <span>Create New Post</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                Posting as {activeUser.name} ({activeUser.role})
              </p>
            </div>

            {/* Tab selection */}
            <div className="flex bg-[#f3ede2] p-1 rounded-xl border border-[#ede6dc] mb-4">
              <button
                type="button"
                onClick={() => setCreationTab('ANNOUNCEMENT')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer ${
                  creationTab === 'ANNOUNCEMENT' 
                    ? 'bg-[#4a2c2a] text-white shadow-md' 
                    : 'text-[#4a2c2a]/80 hover:text-[#4a2c2a]'
                }`}
              >
                <FaBullhorn className="w-3.5 h-3.5" />
                <span>Announcement</span>
              </button>
              <button
                type="button"
                onClick={() => setCreationTab('POLL')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer ${
                  creationTab === 'POLL' 
                    ? 'bg-[#4a2c2a] text-white shadow-md' 
                    : 'text-[#4a2c2a]/80 hover:text-[#4a2c2a]'
                }`}
              >
                <FaChartBar className="w-3.5 h-3.5" />
                <span>Create Poll</span>
              </button>
            </div>

            {/* Tab 1: Announcement Form */}
            {creationTab === 'ANNOUNCEMENT' && (
              <form onSubmit={handleCreateAnnouncementSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Post Message</label>
                  <textarea
                    placeholder="Describe your lab config success, tech stack, code solution achievements, or announcements..."
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-white border border-[#ede6dc] p-4 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Upload Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImageFile(e.target.files[0])}
                    className="w-full bg-white border border-[#ede6dc] px-4 py-2 rounded-xl text-xs text-[#2d1b18] focus:outline-none focus:border-[#4a2c2a] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#f3ede2] file:text-[#4a2c2a] hover:file:bg-[#ede6dc] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Upload PDF Circular (Optional)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setNewPdfFile(e.target.files[0])}
                      className="w-full bg-white border border-[#ede6dc] px-4 py-2 rounded-xl text-xs text-[#2d1b18] focus:outline-none focus:border-[#4a2c2a] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#f3ede2] file:text-[#4a2c2a] hover:file:bg-[#ede6dc] cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Web Reference Link (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://example.com/resource"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="w-full bg-white border border-[#ede6dc] px-4 py-2.5 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold bg-white text-slate-500 hover:text-slate-800 border border-[#ede6dc] text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#4a2c2a] hover:bg-[#5d3a37] text-white text-xs transition-colors duration-250 cursor-pointer shadow-md shadow-[#4a2c2a]/15"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Poll Form */}
            {creationTab === 'POLL' && (
              <form onSubmit={handleCreatePollSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Poll Question</label>
                  <input
                    type="text"
                    required
                    placeholder="Ask something... e.g. Preferred framework for Semester 5 project?"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="w-full bg-white border border-[#ede6dc] px-4 py-3 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a]"
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Choices / Options</label>
                    <button
                      type="button"
                      onClick={handleAddPollOptionField}
                      className="text-[10px] font-bold text-[#4a2c2a] hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <FaPlus className="w-2.5 h-2.5" />
                      <span>Add Option</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {pollOptions.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          required
                          placeholder={`Option ${idx + 1}`}
                          value={option}
                          onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                          className="flex-grow bg-white border border-[#ede6dc] px-4 py-2.5 rounded-xl text-xs text-[#2d1b18] placeholder-slate-400 focus:outline-none focus:border-[#4a2c2a]"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePollOptionField(idx)}
                            className="text-slate-400 hover:text-rose-600 p-2 rounded-lg border border-[#ede6dc]/60 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold bg-white text-slate-500 hover:text-slate-800 border border-[#ede6dc] text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#4a2c2a] hover:bg-[#5d3a37] text-white text-xs transition-colors duration-250 cursor-pointer shadow-md shadow-[#4a2c2a]/15"
                  >
                    Create Poll
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
