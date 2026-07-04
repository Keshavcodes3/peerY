import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Users, Folder, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../../Auth/Hooks/useAuth";

const quickLinks = [
    {
        to: "/discover",
        title: "Discover Builders",
        description: "Swipe through developers that match your stack.",
        icon: Compass,
        accent: "text-blue-400",
    },
    {
        to: "/discover",
        title: "Find a Team",
        description: "Match, connect and start building together.",
        icon: Users,
        accent: "text-emerald-400",
    },
    {
        to: "/discover",
        title: "Your Projects",
        description: "Create projects and manage applications.",
        icon: Folder,
        accent: "text-violet-400",
    },
];

const Dashboard = () => {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Top bar */}
            <header className="border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
                            <Sparkles className="h-4 w-4" />
                        </span>
                        peerY
                    </Link>
                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white disabled:opacity-50"
                    >
                        <LogOut className="h-4 w-4" />
                        {isLoading ? "Logging out…" : "Logout"}
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <p className="text-sm text-zinc-400">Welcome back,</p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                        {user?.username ?? "builder"} 👋
                    </h1>
                    <p className="mt-2 text-zinc-400">
                        {user?.email}
                        {user && !user.emailVerified && (
                            <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                                email not verified
                            </span>
                        )}
                    </p>
                </motion.div>

                {/* Quick links */}
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {quickLinks.map((link, i) => (
                        <motion.div
                            key={link.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.05 * i }}
                        >
                            <Link
                                to={link.to}
                                className="group block h-full rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-700 hover:bg-zinc-900"
                            >
                                <link.icon className={`h-6 w-6 ${link.accent}`} />
                                <h3 className="mt-4 font-medium text-white">{link.title}</h3>
                                <p className="mt-1 text-sm text-zinc-400">{link.description}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <p className="mt-10 text-sm text-zinc-500">
                    More coming soon — workspaces, real-time chat, and your builder reputation.
                </p>
            </main>
        </div>
    );
};

export default Dashboard;
