import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, ArrowLeft, Loader2, Save, ShieldAlert, Globe, Award
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { api, ENDPOINT } from "../../../App/api";
import { useAuth } from "../Hooks/useAuth";

interface Profile {
    name: string;
    avatar?: string;
    skills?: string[];
    socials?: string[];
    Bio?: string;
    college?: string;
    experience?: "Beginner" | "Intermediate" | "Expert" | "God";
    techstack?: string[];
    avaliabilty?: boolean;
    intent?: string;
}

export default function ProfileSettingsPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [hasProfile, setHasProfile] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [bio, setBio] = useState("");
    const [college, setCollege] = useState("");
    const [experience, setExperience] = useState<"Beginner" | "Intermediate" | "Expert" | "God">("Beginner");
    const [techStackInput, setTechStackInput] = useState("");
    const [skillsInput, setSkillsInput] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [availability, setAvailability] = useState(true);
    const [intent, setIntent] = useState("");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const res = await api.get<{ success: boolean; profile: Profile }>("/api/v1/profile/me");
            if (res.data?.profile) {
                const prof = res.data.profile;
                setHasProfile(true);
                setName(prof.name || "");
                setAvatar(prof.avatar || "");
                setBio(prof.Bio || "");
                setCollege(prof.college || "");
                setExperience(prof.experience || "Beginner");
                setTechStackInput(prof.techstack?.join(", ") || "");
                setSkillsInput(prof.skills?.join(", ") || "");
                setAvailability(prof.avaliabilty !== false);
                setIntent(prof.intent || "");
                
                // Parse socials
                if (prof.socials) {
                    const gh = prof.socials.find(s => s.includes("github.com")) || "";
                    const web = prof.socials.find(s => !s.includes("github.com")) || "";
                    setGithubUrl(gh);
                    setWebsiteUrl(web);
                }
            } else {
                setHasProfile(false);
            }
        } catch (err: any) {
            if (err?.response?.status === 404) {
                setHasProfile(false);
            } else {
                showToast("Failed to load profile details.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            showToast("Name is required.");
            return;
        }

        setActionLoading(true);
        try {
            const socialsList = [githubUrl.trim(), websiteUrl.trim()].filter(Boolean);
            const payload = {
                name: name.trim(),
                avatar: avatar.trim() || undefined,
                Bio: bio.trim() || undefined,
                college: college.trim() || undefined,
                experience,
                techstack: techStackInput.split(",").map(t => t.trim()).filter(Boolean),
                skills: skillsInput.split(",").map(s => s.trim()).filter(Boolean),
                avaliabilty: availability,
                intent: intent.trim() || undefined,
                socials: socialsList
            };

            let res;
            if (hasProfile) {
                res = await api.put("/api/v1/profile", payload);
            } else {
                res = await api.post("/api/v1/profile", payload);
            }

            if (res.data.success) {
                showToast("🎉 Profile saved successfully!");
                setHasProfile(true);
                fetchProfile();
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to save profile.");
        } finally {
            setActionLoading(false);
        }
    };

    // Danger zone actions
    const handleDeleteProfile = async () => {
        if (!window.confirm("Are you sure you want to delete your profile details? This will not delete your account credentials.")) return;

        setActionLoading(true);
        try {
            const res = await api.delete("/api/v1/profile");
            if (res.data.success) {
                showToast("Profile details deleted.");
                setHasProfile(false);
                setName("");
                setAvatar("");
                setBio("");
                setCollege("");
                setExperience("Beginner");
                setTechStackInput("");
                setSkillsInput("");
                setGithubUrl("");
                setWebsiteUrl("");
                setIntent("");
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to delete profile.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("WARNING: This will permanently delete your user account and all workspace memberships. This cannot be undone!")) return;

        setActionLoading(true);
        try {
            const res = await api.delete(ENDPOINT.auth.delete);
            if (res.data.success) {
                showToast("Account deleted successfully.");
                await logout();
                navigate("/login");
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to delete account.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDisableAccount = async () => {
        if (!window.confirm("Disable your account? You will be logged out and cannot log back in until reactivated by admin.")) return;

        setActionLoading(true);
        try {
            const res = await api.post(ENDPOINT.auth.disable);
            if (res.data.success) {
                showToast("Account disabled.");
                await logout();
                navigate("/login");
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to disable account.");
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
                <Loader2 size={36} className="animate-spin text-blue-600 mb-4" />
                <p className="text-zinc-500 text-sm font-semibold">Opening settings...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6 relative">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -16, x: "-50%" }}
                        className="fixed top-6 left-1/2 z-50 bg-zinc-950 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate("/dashboard")} className="p-1.5 rounded-full hover:bg-zinc-150 text-zinc-400 hover:text-zinc-700 cursor-pointer">
                    <ArrowLeft size={16} />
                </button>
                <div>
                    <h1 className="text-xl font-black text-zinc-950 font-display">Profile & Settings</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Customize your reputation card and builder parameters</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs font-semibold">
                
                {/* Personal Card */}
                <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        <User size={14} className="text-blue-500" />
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-zinc-500">Display Name *</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. Satoshi Nakamoto"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-zinc-500">Avatar URL (Optional)</label>
                            <input
                                type="url"
                                value={avatar}
                                onChange={e => setAvatar(e.target.value)}
                                placeholder="https://myphoto.com/image.png"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-zinc-500">Bio / Description</label>
                        <textarea
                            rows={3}
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            placeholder="Tell the community about what you love to build..."
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none resize-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-zinc-500">College / Institution</label>
                        <input
                            type="text"
                            value={college}
                            onChange={e => setCollege(e.target.value)}
                            placeholder="e.g. Stanford University"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Developer Profile Card */}
                <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Award size={14} className="text-blue-500" />
                        Developer Profile
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-zinc-500">Experience Level</label>
                            <select
                                value={experience}
                                onChange={e => setExperience(e.target.value as any)}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none font-semibold"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Expert">Expert</option>
                                <option value="God">God Mode / Lead</option>
                            </select>
                        </div>

                        <div className="space-y-1 flex flex-col justify-end pb-1.5">
                            <label className="flex items-center gap-2 text-zinc-500 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={availability}
                                    onChange={e => setAvailability(e.target.checked)}
                                    className="w-4 h-4 rounded text-blue-600 border-zinc-300 focus:ring-blue-500"
                                />
                                <span>Available for project workspaces</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-zinc-500">Tech Stack (Comma separated)</label>
                        <input
                            type="text"
                            value={techStackInput}
                            onChange={e => setTechStackInput(e.target.value)}
                            placeholder="React, Node.js, Express, Go, Docker"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-zinc-500">Interests / Skills (Comma separated)</label>
                        <input
                            type="text"
                            value={skillsInput}
                            onChange={e => setSkillsInput(e.target.value)}
                            placeholder="UI/UX, System Design, Smart Contracts"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-zinc-500">Intent / Target Goals</label>
                        <input
                            type="text"
                            value={intent}
                            onChange={e => setIntent(e.target.value)}
                            placeholder="e.g. Collaborating to build a SaaS startup"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Socials Card */}
                <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Globe size={14} className="text-blue-500" />
                        Online Links
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-zinc-500 flex items-center gap-1">
                                <FaGithub size={12} /> GitHub Profile URL
                            </label>
                            <input
                                type="url"
                                value={githubUrl}
                                onChange={e => setGithubUrl(e.target.value)}
                                placeholder="https://github.com/myusername"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-zinc-500 flex items-center gap-1">
                                <Globe size={12} /> Personal Website
                            </label>
                            <input
                                type="url"
                                value={websiteUrl}
                                onChange={e => setWebsiteUrl(e.target.value)}
                                placeholder="https://mywebsite.com"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-2xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                    {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {hasProfile ? "Save Profile Settings" : "Create Profile Rep Ledger"}
                </button>
            </form>

            {/* Danger Zone */}
            {hasProfile && (
                <div className="bg-red-50/20 border border-red-200/80 rounded-3xl p-6 space-y-4">
                    <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldAlert size={14} />
                        Danger Zone
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-light leading-relaxed">
                        These operations alter your state permanently. Make sure you want to perform these actions before launching them.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleDeleteProfile}
                            disabled={actionLoading}
                            className="bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                        >
                            Delete Profile Data
                        </button>
                        <button
                            onClick={handleDisableAccount}
                            disabled={actionLoading}
                            className="bg-white border border-amber-200 hover:bg-amber-50 text-amber-600 font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                        >
                            Disable Account
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={actionLoading}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                        >
                            Delete Account Credentials
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
