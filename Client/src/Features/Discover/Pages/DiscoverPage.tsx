import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, X, Code2, Heart, Loader2,
  RefreshCw, Plus, Award, ShieldAlert, Sparkles, TrendingUp,
  User, CheckCircle2, ChevronRight, Bell
} from 'lucide-react';
import { useDiscover } from '../hooks/useDiscover';
import { api } from '../../../App/api';
import { useAuth } from '../../Auth/Hooks/useAuth';

// ─── Types ─────────────────────────────────────────────────────────────────

interface ProjectFull {
  _id: string;
  title: string;
  description: string;
  bookMarksCount: number;
  membersCount: number;
  views: number;
}

// ─── Avatar Gradients ────────────────────────────────────────────────────────

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-600",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
];

function getGradient(name: string) {
  const idx = (name.charCodeAt(0) || 0) % gradients.length;
  return gradients[idx];
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const navigate = useNavigate();
  useAuth();

  // Tabs: For You (matchScore desc), High Match (score > 3), Most Active (exp tiered), New Builders (unmatched)
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [activeTab, setActiveTab] = useState<'For You' | 'Top Match' | 'Most Active' | 'New Builders' | 'All Users'>('For You');
  const { profiles, isLoading, error, likingId, like, refetch } = useDiscover(debouncedSearch, activeTab);
  const [banner, setBanner] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Selected Filters State
  const [selectedRole, setSelectedRole] = useState<string>('All Roles');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [availabilities, setAvailabilities] = useState<{ [key: string]: boolean }>({
    'Full-time': true,
    'Part-time': true,
    'Just Exploring': false,
  });
  const [selectedExperience, setSelectedExperience] = useState<string>('All Experience');

  // Async data states for sidebar widgets
  const [myProfile, setMyProfile] = useState<any>(null);
  const [trendingProjects, setTrendingProjects] = useState<ProjectFull[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);

  // Fetch loggein user's profile and projects
  useEffect(() => {
    // 1. Fetch own profile for Completion DNA
    api.get('/api/v1/profile/me')
      .then((res) => setMyProfile(res.data?.profile))
      .catch(() => console.log('[Discover] Current user profile not initialized yet.'));

    // 2. Fetch public projects for trending sidebar
    api.get<{ success: boolean; data: { project: ProjectFull[] } }>('/api/v1/project')
      .then((res) => {
        const list = res.data?.data?.project ?? [];
        // Sort by views + bookmarks desc to find trending
        const sorted = [...list].sort((a, b) =>
          ((b.views || 0) + (b.bookMarksCount || 0) * 3) - ((a.views || 0) + (a.bookMarksCount || 0) * 3)
        );
        setTrendingProjects(sorted.slice(0, 3));
      })
      .catch(() => console.log('[Discover] Failed to fetch trending projects.'))
      .finally(() => setIsTrendingLoading(false));
  }, []);

  const handleLike = async (authId: string) => {
    const result = await like(authId);
    setBanner({
      msg: result.ok
        ? result.mutual
          ? "🎉 It's a mutual match! Start messaging now."
          : 'Connection request sent successfully!'
        : result.message,
      type: result.ok ? "success" : "error"
    });
    window.setTimeout(() => setBanner(null), 3800);
  };

  const resetFilters = () => {
    setSelectedRole('All Roles');
    setSelectedSkills([]);
    setAvailabilities({
      'Full-time': true,
      'Part-time': true,
      'Just Exploring': false,
    });
    setSelectedExperience('All Experience');
  };

  // ─── Filter & Sorting Logic ──────────────────────────────────────────────

  const filteredAndSortedProfiles = profiles
    .filter((profile) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = profile.name?.toLowerCase().includes(q);
        const bioMatch = profile.Bio?.toLowerCase().includes(q);
        const skillMatch = [...(profile.techstack || []), ...(profile.skills || [])]
          .some((s) => s.toLowerCase().includes(q));
        if (!nameMatch && !bioMatch && !skillMatch) return false;
      }

      // 2. Role filter
      if (selectedRole !== 'All Roles') {
        const normalizedRole = selectedRole.toLowerCase();
        const expStr = profile.experience?.toLowerCase() || '';
        if (normalizedRole.includes('backend') && expStr === 'beginner') return false;
        if (normalizedRole.includes('frontend') && expStr === 'god') return false;
        if (normalizedRole.includes('devops') && expStr === 'beginner') return false;
      }

      // 3. Skills filter
      if (selectedSkills.length > 0) {
        const profileSkills = [...(profile.techstack || []), ...(profile.skills || [])].map((s) => s.toLowerCase());
        const matches = selectedSkills.some((skill) =>
          profileSkills.some((ps) => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps))
        );
        if (!matches) return false;
      }

      // 4. Availability filter
      const isAvail = profile.avaliabilty !== false;
      const wantAvail = availabilities['Full-time'] || availabilities['Part-time'];
      const wantNotAvail = availabilities['Just Exploring'];
      if (wantAvail && !wantNotAvail && !isAvail) return false;
      if (!wantAvail && wantNotAvail && isAvail) return false;

      // 5. Experience Filter
      if (selectedExperience !== 'All Experience') {
        const expStr = profile.experience?.toLowerCase() || '';
        if (expStr !== selectedExperience.toLowerCase()) return false;
      }

      return true;
    })
    .filter((profile) => {
      // 6. Tab filtering
      if (activeTab === 'Top Match') {
        return profile.matchScore > 2; // only high affinity matches
      }
      return true;
    })
    .sort((a, b) => {
      // 7. Tab sorting overrides
      if (activeTab === 'Most Active') {
        const expWeight = (exp: string) => exp === 'god' ? 3 : exp === 'intermediate' ? 2 : 1;
        return expWeight(b.experience ?? '') - expWeight(a.experience ?? '');
      }
      if (activeTab === 'New Builders') {
        // Tie-breaker: lowest scores or random distribution to discover fresh faces
        return a.matchScore - b.matchScore;
      }
      return b.matchScore - a.matchScore; // default to For You
    });

  // ─── DNA Progress calculation ─────────────────────────────────────────────

  let filledCount = 2; // base fields
  if (myProfile?.avatar) filledCount++;
  if (myProfile?.Bio && myProfile.Bio !== "Let's cook") filledCount++;
  if (myProfile?.college) filledCount++;
  if (myProfile?.skills?.some((s: string) => s !== '')) filledCount++;
  if (myProfile?.techstack?.some((t: string) => t !== '')) filledCount++;
  if (myProfile?.socials?.some((s: string) => s !== '')) filledCount++;
  const completionPercentage = Math.round((filledCount / 8) * 100);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full bg-zinc-50/50 flex font-sans text-zinc-900 antialiased overflow-hidden h-screen">

      {/* FILTER PANEL */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col shrink-0 p-6 overflow-y-auto no-scrollbar justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-950 uppercase tracking-widest">Filters</span>
            <button onClick={resetFilters} className="text-xs font-bold text-blue-600 hover:underline">
              Reset
            </button>
          </div>

          {/* Role Filter */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Primary Role</span>
            <div className="space-y-1">
              {[
                { label: 'All Roles' },
                { label: 'Backend Developer' },
                { label: 'Frontend Developer' },
                { label: 'Full Stack Developer' },
                { label: 'DevOps Engineer' }
              ].map((role) => (
                <button
                  key={role.label}
                  onClick={() => setSelectedRole(role.label)}
                  className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl font-bold transition-all ${
                    selectedRole === role.label
                      ? 'bg-blue-50 text-blue-700 border border-blue-100/50'
                      : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 border border-transparent'
                  }`}
                >
                  <span>{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skills Filter */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Target Skills</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" size={13} />
              <input
                type="text"
                placeholder="Type and press Enter..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newSkillInput.trim()) {
                    if (!selectedSkills.includes(newSkillInput.trim().toLowerCase())) {
                      setSelectedSkills([...selectedSkills, newSkillInput.trim().toLowerCase()]);
                    }
                    setNewSkillInput('');
                  }
                }}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-zinc-900"
              />
            </div>

            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1.5">
                {selectedSkills.map((skill) => (
                  <span key={skill} className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-lg text-[10px] font-bold text-zinc-700">
                    {skill}
                    <button
                      onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== skill))}
                      className="text-zinc-400 hover:text-zinc-600"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Availability Filter */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Availability</span>
            <div className="space-y-2">
              {Object.keys(availabilities).map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={availabilities[key]}
                    onChange={() => setAvailabilities({ ...availabilities, [key]: !availabilities[key] })}
                    className="w-4 h-4 text-blue-600 border-zinc-200 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-zinc-500 hover:text-zinc-800">{key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Filter */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Experience Level</span>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 font-semibold focus:outline-none focus:border-blue-500"
            >
              <option>All Experience</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>God</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100 mt-6">
          <p className="text-[9px] text-zinc-400 font-medium leading-relaxed text-center">
            Matching engine intersects profile values with multi-weighted score multipliers.
          </p>
        </div>
      </aside>

      {/* MIDDLE CONTENT BLOCK */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Search header */}
        <header className="h-16 border-b border-zinc-100 bg-white px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search builders by role, skills, or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-12 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 text-zinc-900 placeholder-zinc-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-bold border border-zinc-200 px-1.5 py-0.5 rounded-lg bg-white shadow-sm font-mono">⌘ K</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/network')}
              className="p-2 border border-zinc-200 hover:border-zinc-300 rounded-xl text-zinc-500 hover:text-zinc-800 bg-white transition-all shadow-sm flex items-center justify-center relative cursor-pointer"
              title="View network notifications"
            >
              <Bell size={14} />
            </button>
            <button
              onClick={refetch}
              className="p-2 border border-zinc-200 hover:border-zinc-300 rounded-xl text-zinc-500 hover:text-zinc-800 bg-white transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Refresh recommendations"
            >
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              Sync feed
            </button>
          </div>
        </header>

        {/* Feed section */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">

          {/* Heading */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-950 font-display">
                Find builders. Build together.
              </h1>
              <p className="text-zinc-500 text-sm mt-0.5 font-medium">Recommended developers based on your builder DNA</p>
            </div>
            <div className="text-[10px] text-blue-600 bg-blue-50/50 border border-blue-100 font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <Sparkles size={11} className="text-blue-500 animate-pulse" />
              Dynamic Scoring Active
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-zinc-100 p-1 rounded-xl w-fit border border-zinc-200/60">
            {(['For You', 'Top Match', 'Most Active', 'New Builders', 'All Users'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/10'
                    : 'text-zinc-500 hover:text-zinc-950'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Match affinity showcase */}
          {profiles.length > 0 && (
            <div className="bg-[#0B132B] rounded-3xl p-6 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.18),transparent)] pointer-events-none" />

              <div className="relative z-10 space-y-2 max-w-sm">
                <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full uppercase tracking-wider">
                  Top Teammate Potential
                </span>
                <h2 className="text-xl font-black font-display tracking-tight leading-tight pt-1">
                  Matched with {profiles[0].name || "compatible builder"}
                </h2>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  We analyzed your overlapping stack. {profiles[0].name} has a score of {Math.round(profiles[0].matchScore)} points with your skills.
                </p>
                <button
                  onClick={() => navigate(`/discover/${profiles[0]._id}`)}
                  className="bg-white hover:bg-slate-50 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1 mt-3.5 shadow-sm cursor-pointer"
                >
                  View Profile <ArrowRight size={12} />
                </button>
              </div>

              {/* Decorative visuals */}
              <div className="relative w-48 h-24 shrink-0 hidden md:block mt-4 md:mt-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border border-blue-500/30 p-1 relative z-20 shadow-xl bg-[#0B132B]">
                    <img
                      src={profiles[0].avatar || `https://i.pravatar.cc/100?u=${profiles[0].authId}`}
                      alt="peer"
                      className="w-full h-full rounded-full object-cover ring-2 ring-blue-500"
                    />
                  </div>
                  {profiles.length > 1 && (
                    <div className="absolute left-6 w-9 h-9 rounded-full opacity-40">
                      <img
                        src={profiles[1].avatar || `https://i.pravatar.cc/100?u=${profiles[1].authId}`}
                        alt="peer-2"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  )}
                  {profiles.length > 2 && (
                    <div className="absolute right-6 w-9 h-9 rounded-full opacity-40">
                      <img
                        src={profiles[2].avatar || `https://i.pravatar.cc/100?u=${profiles[2].authId}`}
                        alt="peer-3"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Toast notifications */}
          <AnimatePresence>
            {banner && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`border p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm ${
                  banner.type === "error"
                    ? "bg-red-50 border-red-100 text-red-600"
                    : "bg-blue-50/50 border-blue-100 text-blue-600"
                }`}
              >
                {banner.type === "error" ? <ShieldAlert size={14} /> : <CheckCircle2 size={14} />}
                {banner.msg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feed Grid */}
          <div className="space-y-4">

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
                <Loader2 size={24} className="animate-spin text-blue-600" />
                <span className="text-xs font-semibold">Running matching algorithms…</span>
              </div>
            )}

            {!isLoading && error && (
              <div className="border border-red-100 bg-red-50 rounded-2xl p-8 text-center space-y-3">
                <ShieldAlert size={26} className="text-red-500 mx-auto" />
                <p className="text-xs font-bold text-red-600">{error}</p>
                <button
                  onClick={refetch}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                >
                  <RefreshCw size={12} /> Retry
                </button>
              </div>
            )}

            {!isLoading && !error && profiles.length === 0 && (
              <div className="border border-zinc-200/80 bg-white rounded-3xl p-12 text-center space-y-3">
                <User size={32} className="text-zinc-300 mx-auto" />
                <h3 className="text-base font-bold text-zinc-950">No matches available</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Complete your profile and add more skills so the scoring engine can recommend relevant teammates.
                </p>
              </div>
            )}

            {!isLoading && !error && profiles.length > 0 && filteredAndSortedProfiles.length === 0 && (
              <div className="border border-zinc-200/80 bg-white rounded-3xl p-12 text-center space-y-3">
                <X size={32} className="text-zinc-300 mx-auto" />
                <h3 className="text-base font-bold text-zinc-950">No matches found</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try clearing or adjusting filters to show more builders.
                </p>
                <button
                  onClick={resetFilters}
                  className="h-8 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!isLoading && !error && filteredAndSortedProfiles.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedProfiles.map((profile) => {
                  const pills = (profile.techstack?.length ? profile.techstack : profile.skills) || [];
                  const avatar = profile.avatar || `https://i.pravatar.cc/100?u=${profile.authId}`;
                  const score = Math.round(profile.matchScore);
                  return (
                    <motion.div
                      key={profile._id}
                      layout
                      whileHover={{ y: -3 }}
                      className="bg-white border border-zinc-200/80 rounded-2xl p-5 hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col justify-between relative"
                    >
                      <div>
                        {/* Tags */}
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            score > 5
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : score > 2
                              ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                              : "bg-zinc-50 text-zinc-500 border-zinc-150"
                          }`}>
                            {score > 5 ? "High affinity" : score > 2 ? "Compatible" : "Base match"} ({score} pts)
                          </span>
                          {profile.Rank && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-500 rounded font-mono uppercase">
                              Rank {profile.Rank}
                            </span>
                          )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex items-center gap-3.5 mb-4">
                          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getGradient(profile.name ?? "U")} flex items-center justify-center text-white text-xs font-bold uppercase shrink-0 relative shadow-sm`}>
                            {profile.name?.[0] ?? "U"}
                            {profile.avatar && (
                              <img src={avatar} alt="avatar" className="absolute inset-0 w-full h-full rounded-full object-cover" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-zinc-950 truncate capitalize leading-tight">{profile.name}</h4>
                            <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider capitalize mt-0.5">{profile.experience || 'Builder'}</p>
                          </div>
                        </div>

                        {profile.Bio && (
                          <p className="text-[11px] text-zinc-500 leading-relaxed font-light line-clamp-2 mb-4">
                            {profile.Bio}
                          </p>
                        )}

                        {/* Tech Stack */}
                        {pills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-6">
                            {pills.slice(0, 3).map((p) => (
                              <span key={p} className="text-[9px] font-bold px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-400 rounded-md capitalize">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Connect controls */}
                      <div className="flex gap-2 pt-3 border-t border-zinc-50">
                        <button
                          onClick={() => navigate(`/discover/${profile._id}`)}
                          className="flex-1 h-8 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold transition-all border border-zinc-200 flex items-center justify-center cursor-pointer"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleLike(profile.authId)}
                          disabled={likingId === profile.authId}
                          className="w-8 h-8 border border-zinc-200 hover:border-red-200 hover:text-red-500 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-red-50/50 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                        >
                          {likingId === profile.authId ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Heart size={12} />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Explore categories */}
          <div className="space-y-3 pt-6 border-t border-zinc-100">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Explore Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Backend Developer', count: 'Skills-weighted matching' },
                { name: 'Frontend Developer', count: 'UI/UX integration' },
                { name: 'Full Stack Developer', count: 'E2E systems' },
                { name: 'DevOps Engineer', count: 'CI/CD pipeline shipping' },
              ].map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => setSelectedRole(cat.name)}
                  className={`border rounded-xl p-4 flex items-center gap-3 transition-colors cursor-pointer ${
                    selectedRole === cat.name
                      ? "border-blue-200 bg-blue-50/30"
                      : "border-zinc-200/80 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedRole === cat.name ? "bg-blue-100 text-blue-600" : "bg-zinc-50 text-zinc-500"
                  }`}>
                    <Code2 size={15} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-zinc-950 truncate leading-tight">{cat.name.split(" ")[0]}</h4>
                    <p className="text-[9px] text-zinc-400 truncate mt-0.5">{cat.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDEBAR PANEL */}
      <aside className="w-72 border-l border-zinc-200 bg-white flex flex-col shrink-0 p-6 overflow-y-auto no-scrollbar gap-6">

        {/* Builder DNA profile completion */}
        <div className="border border-zinc-200/80 bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-widest flex items-center gap-1">
            <span>Your DNA Profile</span>
            <span className="text-[8px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-1 py-0.5 rounded font-mono">DNA</span>
          </h4>

          <div className="flex items-center gap-4 pt-1">
            {/* Circular Ring Progress */}
            <div className="w-14 h-14 shrink-0 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" className="text-zinc-100" strokeWidth="4.5" fill="transparent" stroke="currentColor" />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="text-blue-600 transition-all duration-500"
                  strokeWidth="4.5"
                  fill="transparent"
                  strokeDasharray="150"
                  strokeDashoffset={150 - (150 * completionPercentage) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                />
              </svg>
              <span className="absolute text-[10px] font-black text-zinc-950">{completionPercentage}%</span>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-zinc-950 leading-tight">Match Quality</p>
              <p className="text-[10px] text-zinc-400 leading-snug mt-1">
                {completionPercentage < 60
                  ? "Improve details to unlock accurate scoring."
                  : "Excellent. Scoring engine has strong data."}
              </p>
              <button
                onClick={() => navigate("/profile")}
                className="text-[9px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 mt-1 cursor-pointer"
              >
                Refine DNA <ChevronRight size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Trending Projects in peerY */}
        <div className="border border-zinc-200/80 bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-widest flex items-center gap-1">
              <TrendingUp size={12} className="text-zinc-400" /> Trending Teams
            </h4>
            <Link to="/projects" className="text-[10px] font-bold text-blue-600 hover:underline">All</Link>
          </div>

          {isTrendingLoading ? (
            <div className="flex justify-center py-4 text-zinc-400">
              <Loader2 size={16} className="animate-spin" />
            </div>
          ) : trendingProjects.length === 0 ? (
            <p className="text-[10px] text-zinc-400 text-center">No projects launched yet.</p>
          ) : (
            <div className="space-y-3.5">
              {trendingProjects.map((proj) => (
                <div
                  key={proj._id}
                  onClick={() => navigate(`/project/${proj._id}/workspace`)}
                  className="group cursor-pointer select-none space-y-0.5"
                >
                  <div className="flex justify-between items-start gap-1">
                    <p className="text-xs font-bold text-zinc-950 group-hover:text-blue-600 transition-colors truncate">
                      {proj.title}
                    </p>
                    <span className="text-[9px] font-bold text-zinc-400 shrink-0 font-mono">
                      ★ {proj.bookMarksCount || 0}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-1 leading-normal font-light">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swipe Instruction Banner */}
        <div className="border border-zinc-200/80 bg-zinc-50 rounded-2xl p-5 text-center space-y-3">
          <Award size={20} className="text-blue-500 mx-auto animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-zinc-950">Indie Hacker?</h4>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-light mt-1">
              Connect with fellow co-founders or contribute to active workspaces.
            </p>
          </div>
          <button
            onClick={() => navigate("/projects")}
            className="w-full h-8 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <Plus size={12} />
            <span>Launch Team</span>
          </button>
        </div>

      </aside>

    </div>
  );
}

// ─── Extra Link Stub to satisfy imports ────────────────────────────────────

function Link({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}
