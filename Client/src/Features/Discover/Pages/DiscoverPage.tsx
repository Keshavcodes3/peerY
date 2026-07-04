import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Compass, Folder, MessageSquare, Users, Bookmark, Settings, Plus,
  Search, Bell, ArrowRight,
  ChevronDown, X, Code2, Heart, Loader2, RefreshCw
} from 'lucide-react';
import { useDiscover } from '../hooks/useDiscover';

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'For You' | 'Top Match' | 'Most Active' | 'New Builders'>('For You');

  // Live recommendations from the API.
  const { profiles, isLoading, error, likingId, like, refetch } = useDiscover();
  const [banner, setBanner] = useState<string | null>(null);

  const handleLike = async (authId: string) => {
    const result = await like(authId);
    setBanner(
      result.ok
        ? result.mutual
          ? "🎉 It's a match! You can now connect."
          : 'Request sent!'
        : result.message
    );
    window.setTimeout(() => setBanner(null), 3500);
  };

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Filters State
  const [selectedRole, setSelectedRole] = useState<string>('All Roles');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [availabilities, setAvailabilities] = useState<{ [key: string]: boolean }>({
    'Full-time': true,
    'Part-time': true,
    'Open to Freelance': false,
    'Just Exploring': false,
  });
  const [experienceRange, setExperienceRange] = useState<number>(5);

  const resetFilters = () => {
    setSelectedRole('All Roles');
    setSelectedSkills(['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes']);
    setAvailabilities({
      'Full-time': true,
      'Part-time': true,
      'Open to Freelance': false,
      'Just Exploring': false,
    });
    setExperienceRange(5);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A] antialiased">

      {/* LEFT SIDEBAR - Fixed Navigation */}
      <aside className="w-64 border-r border-[#E5E7EB] bg-white flex flex-col shrink-0 sticky top-0 h-screen justify-between">
        <div className="flex flex-col">
          {/* Logo */}
          <div className="px-6 py-5 flex items-center gap-2 border-b border-[#E5E7EB]">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-[#0F172A]">peerY</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-[#2563EB]/10 text-[#2563EB] transition-colors">
              <Compass size={18} />
              <span>Discover</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors">
              <Folder size={18} />
              <span>Projects</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} />
                <span>Messages</span>
              </div>
              <span className="bg-[#2563EB] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">2</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors">
              <Users size={18} />
              <span>Network</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors">
              <Bookmark size={18} />
              <span>Bookmarks</span>
            </button>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#E5E7EB] space-y-4">
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4 text-center">
            <p className="text-xs text-[#64748B] leading-relaxed mb-3">
              Build something great<br />
              <span className="font-handwriting text-sm text-[#2563EB] italic">The right teammate can 10x your journey.</span>
            </p>
            <button className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2 px-3 rounded-lg text-xs font-semibold shadow-sm transition-colors">
              <Plus size={14} />
              <span>Create Project</span>
            </button>
          </div>

          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* CENTER & RIGHT CONTENT - Combined wrapper to manage top header */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Global Top Search/Header Row */}
        <header className="h-16 border-b border-[#E5E7EB] bg-white px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by skills, role, or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg pl-9 pr-12 py-2 text-xs font-medium focus:outline-none focus:border-[#2563EB] text-[#0F172A] placeholder-slate-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold border border-[#E5E7EB] px-1.5 py-0.5 rounded-md bg-white">⌘ K</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB]" />
            </button>
            <div className="flex items-center gap-2 border-l border-[#E5E7EB] pl-4 cursor-pointer">
              <img
                src="https://i.pravatar.cc/100?u=keshav"
                alt="Keshav"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xs font-semibold text-[#0F172A]">Keshav</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Main Workspace layout: Sidebar Filters + Hero Content + Right Sidebar */}
        <div className="flex-1 flex overflow-hidden">

          {/* Sidebar Filter Panel */}
          <aside className="w-60 border-r border-[#E5E7EB] bg-white flex flex-col shrink-0 p-6 overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Filters</span>
              <button onClick={resetFilters} className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]">Clear all</button>
            </div>

            {/* Role Filter */}
            <div className="mb-6">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-3">Role</span>
              <div className="space-y-1">
                {[
                  { label: 'All Roles', count: 342 },
                  { label: 'Backend Developer', count: 126 },
                  { label: 'Frontend Developer', count: 98 },
                  { label: 'Full Stack Developer', count: 76 },
                  { label: 'DevOps Engineer', count: 42 }
                ].map((role) => (
                  <button
                    key={role.label}
                    onClick={() => setSelectedRole(role.label)}
                    className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-lg font-semibold transition-colors ${selectedRole === role.label
                      ? 'bg-slate-100 text-[#0F172A]'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                      }`}
                  >
                    <span>{role.label}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{role.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Filter */}
            <div className="mb-6">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-3">Skills</span>
              <div className="relative mb-3">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSkillInput.trim()) {
                      if (!selectedSkills.includes(newSkillInput.trim())) {
                        setSelectedSkills([...selectedSkills, newSkillInput.trim()]);
                      }
                      setNewSkillInput('');
                    }
                  }}
                  className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#2563EB] text-[#0F172A]"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar">
                {selectedSkills.map(skill => (
                  <span key={skill} className="flex items-center gap-1 bg-slate-100 border border-[#E5E7EB] px-2 py-1 rounded-md text-[10px] font-semibold text-[#0F172A]">
                    {skill}
                    <button
                      onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  const skill = prompt('Enter a skill name:');
                  if (skill && !selectedSkills.includes(skill)) {
                    setSelectedSkills([...selectedSkills, skill]);
                  }
                }}
                className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] mt-2 block"
              >
                + Add skill
              </button>
            </div>

            {/* Availability Filter */}
            <div className="mb-6">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-3">Availability</span>
              <div className="space-y-2">
                {Object.keys(availabilities).map((key) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={availabilities[key]}
                      onChange={() => setAvailabilities({ ...availabilities, [key]: !availabilities[key] })}
                      className="w-4 h-4 text-[#2563EB] border-[#E5E7EB] rounded focus:ring-[#2563EB]"
                    />
                    <span className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A]">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="mb-6">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-2">Location</span>
              <select className="w-full bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-semibold focus:outline-none focus:border-[#2563EB]">
                <option>Anywhere</option>
                <option>Remote</option>
                <option>India</option>
                <option>United States</option>
              </select>
            </div>

            {/* Experience Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Experience</span>
                <span className="text-xs font-bold text-[#0F172A]">{experienceRange} yrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={experienceRange}
                onChange={(e) => setExperienceRange(Number(e.target.value))}
                className="w-full accent-[#2563EB]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 yrs</span>
                <span>10+ yrs</span>
              </div>
            </div>

            Apply Filters
            <button className="w-full py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-slate-50 text-[#0F172A] font-bold text-xs rounded-xl shadow-sm transition-colors mt-auto">
              Apply Filters
            </button>
          </aside>

          {/* Center Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-[#F8FAFC]">

            {/* Title / Header Heading Block */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-display font-extrabold text-[#0F172A] tracking-tight leading-tight">
                  Find builders.<br />
                  <span className="text-[#2563EB]">Build together.</span> Ship faster. 🚀
                </h1>
              </div>
              <div className="text-[11px] text-[#64748B] font-semibold flex items-center gap-1.5 italic bg-[#2563EB]/5 text-[#2563EB] px-3 py-1.5 rounded-lg border border-[#2563EB]/10">
                <span>Real builders. Real projects.</span>
                <span className="inline-block animate-bounce">👇</span>
              </div>
            </div>

            {/* Filter Tabs Row */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit border border-[#E5E7EB]">
              {(['For You', 'Top Match', 'Most Active', 'New Builders'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${activeTab === tab
                    ? 'bg-white text-[#0F172A] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Large dark blue match banner */}
            <div className="bg-[#0B1528] rounded-[20px] p-8 text-white relative overflow-hidden flex items-center justify-between">
              {/* Background abstract art */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900/10 to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-md space-y-2">
                <h2 className="text-2xl font-bold font-display tracking-tight leading-tight">
                  74% match with<br />your ideal teammate
                </h2>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  We analyzed your skills, interests and projects to find the best matches.
                </p>
                <button className="bg-white hover:bg-slate-100 text-[#0B1528] font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 mt-4">
                  <span>View Matches</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Decorative avatar visualization */}
              <div className="relative w-64 h-32 shrink-0 hidden md:block">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-blue-500/30 p-1 relative z-20">
                    <img src="https://i.pravatar.cc/150?u=james" alt="James" className="w-full h-full rounded-full object-cover ring-2 ring-[#2563EB]" />
                  </div>
                  <div className="absolute left-6 w-10 h-10 rounded-full border border-slate-500/30 opacity-60">
                    <img src="https://i.pravatar.cc/150?u=aryan" alt="Aryan" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="absolute right-6 w-10 h-10 rounded-full border border-slate-500/30 opacity-60">
                    <img src="https://i.pravatar.cc/150?u=neha" alt="Neha" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="absolute left-10 -bottom-2 w-8 h-8 rounded-full border border-slate-500/30 opacity-30">
                    <img src="https://i.pravatar.cc/150?u=yuki" alt="Yuki" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="absolute right-10 -top-2 w-8 h-8 rounded-full border border-slate-500/30 opacity-30">
                    <img src="https://i.pravatar.cc/150?u=elena" alt="Elena" className="w-full h-full rounded-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action banner (match / request sent / error) */}
            {banner && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#2563EB]/5 border border-[#2563EB]/20 text-[#2563EB] text-xs font-semibold px-4 py-3 rounded-xl"
              >
                {banner}
              </motion.div>
            )}

            {/* Top Matches Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#0F172A] tracking-wide uppercase">Top Matches for You</h3>
                <button
                  onClick={refetch}
                  className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center py-20 text-slate-400">
                  <Loader2 size={20} className="animate-spin mr-2" />
                  <span className="text-xs font-semibold">Finding your best matches…</span>
                </div>
              )}

              {/* Error state */}
              {!isLoading && error && (
                <div className="border border-red-100 bg-red-50 rounded-[20px] p-8 text-center">
                  <p className="text-sm font-bold text-red-600">{error}</p>
                  <button
                    onClick={refetch}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8]"
                  >
                    <RefreshCw size={13} /> Try again
                  </button>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !error && profiles.length === 0 && (
                <div className="border border-[#E5E7EB] bg-white rounded-[20px] p-10 text-center">
                  <p className="text-sm font-bold text-[#0F172A]">No matches yet</p>
                  <p className="text-xs text-slate-400 font-medium mt-1 max-w-sm mx-auto">
                    Add more skills and tech stack to your profile to unlock recommendations, or check back later.
                  </p>
                </div>
              )}

              {/* Live profile cards */}
              {!isLoading && !error && profiles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {profiles.map((profile) => {
                    const pills = (profile.techstack?.length ? profile.techstack : profile.skills) || [];
                    const avatar = profile.avatar || `https://i.pravatar.cc/150?u=${profile.authId}`;
                    return (
                      <motion.div
                        key={profile._id}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 flex flex-col items-center text-center shadow-sm relative"
                      >
                        {/* Match score badge */}
                        <span className="absolute top-4 left-4 bg-blue-50 text-[#2563EB] border border-blue-100 rounded-full px-2.5 py-1 text-[11px] font-bold">
                          {Math.round(profile.matchScore)} pts
                        </span>
                        {profile.Rank && (
                          <span className="absolute top-4 right-4 bg-slate-100 text-slate-600 border border-[#E5E7EB] rounded-full px-2 py-1 text-[10px] font-bold">
                            Rank {profile.Rank}
                          </span>
                        )}

                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full overflow-hidden mt-6 mb-4 relative bg-slate-50 border border-[#E5E7EB]">
                          <img src={avatar} alt={profile.name} className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>

                        {/* Basic Info */}
                        <h4 className="font-display font-bold text-[#0F172A] text-base capitalize">{profile.name}</h4>
                        <p className="text-xs text-[#64748B] font-semibold mt-0.5 capitalize">
                          {profile.experience || 'Builder'}
                        </p>

                        {profile.Bio && (
                          <p className="text-[11px] text-slate-400 mt-2 font-medium line-clamp-2">{profile.Bio}</p>
                        )}

                        {/* Divider */}
                        <div className="w-full h-px bg-slate-100 my-4" />

                        {/* Skill / tech pills */}
                        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                          {pills.slice(0, 4).map((tech) => (
                            <span key={tech} className="bg-slate-50 border border-[#E5E7EB] text-[#64748B] font-semibold text-[10px] px-2.5 py-1 rounded-md capitalize">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Buttons block */}
                        <div className="w-full flex gap-2 mt-auto">
                          <button
                            onClick={() => navigate(`/discover/${profile._id}`)}
                            className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition-colors"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => handleLike(profile.authId)}
                            disabled={likingId === profile.authId}
                            title="Connect"
                            className="w-10 h-10 border border-[#E5E7EB] hover:bg-rose-50 hover:border-rose-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-50"
                          >
                            {likingId === profile.authId
                              ? <Loader2 size={15} className="animate-spin" />
                              : <Heart size={15} />}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Explore by Skills section */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Explore by Skills</h3>
                <button className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1">
                  <span>View all skills</span>
                  <span>&rarr;</span>
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Backend', count: '1282 builders', color: 'bg-zinc-50 border-zinc-200' },
                  { name: 'Frontend', count: '982 builders', color: 'bg-blue-50/50 border-blue-100' },
                  { name: 'DevOps', count: '562 builders', color: 'bg-indigo-50/50 border-indigo-100' },
                  { name: 'Mobile', count: '312 builders', color: 'bg-violet-50/50 border-violet-100' },
                ].map((skillCategory) => (
                  <div key={skillCategory.name} className="border border-[#E5E7EB] bg-white rounded-xl p-4 flex items-center gap-3 hover:border-slate-300 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                      <Code2 size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">{skillCategory.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{skillCategory.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="w-80 border-l border-[#E5E7EB] bg-white flex flex-col shrink-0 p-6 overflow-y-auto no-scrollbar gap-6">

            {/* Builder DNA card */}
            <div className="border border-[#E5E7EB] bg-white rounded-xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <span>Your Builder DNA</span>
                    <span className="text-[9px] font-bold text-[#2563EB] bg-[#2563EB]/10 px-1.5 py-0.5 rounded uppercase">Beta</span>
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Radial progress visualization */}
                <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" className="text-slate-100" strokeWidth="6" fill="transparent" stroke="currentColor" />
                    <circle cx="32" cy="32" r="28" className="text-[#2563EB]" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset="26" strokeLinecap="round" stroke="currentColor" />
                  </svg>
                  <span className="absolute text-xs font-extrabold text-[#0F172A]">85%</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">Great match potential!</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-0.5">
                    Complete your profile to unlock even better matches.
                  </p>
                  <button className="text-[10px] font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 mt-1">
                    <span>Improve profile</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity card */}
            <div className="border border-[#E5E7EB] bg-white rounded-xl p-5 shadow-sm">
              <h4 className="text-xs font-bold text-[#0F172A] mb-4 uppercase tracking-wider">Recent Activity</h4>
              <div className="space-y-4">
                {[
                  { name: 'Rohit Verma', desc: 'liked your project AI Resume Analyzer', avatar: 'https://i.pravatar.cc/100?u=rohit' },
                  { name: 'Ananya Singh', desc: 'viewed your profile', avatar: 'https://i.pravatar.cc/100?u=ananya' },
                  { name: 'Zaid Khan', desc: 'sent you a connection request', avatar: 'https://i.pravatar.cc/100?u=zaid' },
                ].map((act, i) => (
                  <div key={i} className="flex gap-3">
                    <img src={act.avatar} alt={act.name} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-700 leading-snug">
                        <span className="font-bold text-[#0F172A]">{act.name}</span> {act.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full text-center text-[10px] font-bold text-[#2563EB] hover:text-[#1D4ED8] mt-4 block">
                View all activity &rarr;
              </button>
            </div>

            {/* Trending Projects card */}
            <div className="border border-[#E5E7EB] bg-white rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Trending Projects</h4>
                <button className="text-[10px] font-bold text-[#2563EB] hover:text-[#1D4ED8]">View all</button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'AuthCore', desc: 'Scalable auth service with JWT, 2FA, RBAC.', stars: '1.2k' },
                  { name: 'FileFlow', desc: 'Distributed file storage and sharing system.', stars: '892' },
                  { name: 'QueueX', desc: 'High performance job queue system.', stars: '743' },
                ].map((proj) => (
                  <div key={proj.name} className="flex justify-between items-start">
                    <div className="max-w-[75%]">
                      <p className="text-xs font-bold text-[#0F172A]">{proj.name}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{proj.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-zinc-200 px-2 py-0.5 rounded">
                      ★ {proj.stars}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Project CTA card */}
            <div className="border border-[#E5E7EB] bg-white rounded-xl p-5 shadow-sm bg-gradient-to-br from-slate-50 to-white">
              <h4 className="text-xs font-bold text-[#0F172A] mb-1">Can't find the right match?</h4>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-4">
                Create a project and let builders come to you.
              </p>
              <button className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2 px-3 rounded-lg text-xs font-bold shadow-sm transition-colors">
                <Plus size={14} />
                <span>Create Project</span>
              </button>
            </div>

          </aside>

        </div>

      </div >

    </div >
  );
}
