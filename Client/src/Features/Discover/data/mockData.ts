export interface BuilderProfile {
    id: string;
    name: string;
    role: string;
    location: string;
    availability: string;
    stack: string[];
    bio: string;
    building: string;
    lookingFor: string;
    matchPercentage: number;
    avatarUrl: string;
    sharedInterests?: string[];
    bannerGradient: string;
    githubUrl?: string;
    website?: string;
    followers?: number;
    openRoles?: string[];
    tags?: string[];
    experience?: string;
    projects?: ProjectCard[];
}

export interface ProjectCard {
    id: string;
    name: string;
    description: string;
    stack: string[];
    stars: number;
    contributors: number;
    stage: 'idea' | 'mvp' | 'beta' | 'live';
    openRoles?: string[];
}

export const mockBuilders: BuilderProfile[] = [
    {
        id: "1",
        name: "Aarav Sharma",
        role: "Full Stack Developer",
        location: "Remote, India",
        availability: "Part-time · 15h/week",
        stack: ["React", "Next.js", "Node.js", "PostgreSQL", "Prisma"],
        bio: "Previously built scaling infrastructure at a YC startup. Obsessed with clean code, high-performance apps, and shipping at speed. Looking for a creative partner to turn ideas into products people love.",
        building: "An AI-powered technical interview platform.",
        lookingFor: "Frontend Developer or UX Designer to partner with.",
        matchPercentage: 92,
        avatarUrl: "https://i.pravatar.cc/300?u=aarav",
        sharedInterests: ["SaaS Products", "AI Tools", "React Ecosystem"],
        bannerGradient: "from-blue-600 via-indigo-500 to-violet-600",
        githubUrl: "https://github.com",
        website: "https://aarav.dev",
        followers: 842,
        experience: "4 years",
        openRoles: ["UX Designer", "Frontend Developer"],
        tags: ["YC Alumni", "Open Source", "Indie Hacker"],
        projects: [
            {
                id: "p1",
                name: "InterviewAI",
                description: "AI-powered technical interview simulator with real-time feedback and adaptive difficulty.",
                stack: ["Next.js", "OpenAI", "PostgreSQL"],
                stars: 312,
                contributors: 4,
                stage: "beta",
                openRoles: ["Frontend Developer", "UX Designer"]
            },
            {
                id: "p2",
                name: "CodeSprint",
                description: "Collaborative code editor with live preview, git integration and AI pair programmer.",
                stack: ["React", "Node.js", "WebSockets"],
                stars: 189,
                contributors: 2,
                stage: "mvp"
            }
        ]
    },
    {
        id: "2",
        name: "Elena Rodriguez",
        role: "Product Designer",
        location: "Berlin, Germany",
        availability: "Full-time",
        stack: ["Figma", "Framer", "CSS", "SwiftUI", "Protopie"],
        bio: "Focusing on micro-interactions and motion design. I love bridging the gap between design and engineering. Previously led design at two Series A startups in the fintech space.",
        building: "A new minimalist note-taking app.",
        lookingFor: "iOS Developer to bring the Swift prototype to life.",
        matchPercentage: 88,
        avatarUrl: "https://i.pravatar.cc/300?u=elena",
        sharedInterests: ["Design Systems", "Productivity", "Mobile Apps"],
        bannerGradient: "from-rose-500 via-pink-500 to-orange-400",
        githubUrl: "https://github.com",
        website: "https://elenarodriguez.design",
        followers: 1240,
        experience: "6 years",
        openRoles: ["iOS Developer"],
        tags: ["Motion Design", "Design Systems", "Fintech"],
        projects: [
            {
                id: "p3",
                name: "NoteFlow",
                description: "Minimalist note-taking with spatial canvas, AI summarization and beautiful typography.",
                stack: ["SwiftUI", "Core Data", "CloudKit"],
                stars: 76,
                contributors: 1,
                stage: "mvp",
                openRoles: ["iOS Developer"]
            }
        ]
    },
    {
        id: "3",
        name: "James Chen",
        role: "Backend Engineer",
        location: "San Francisco, CA",
        availability: "Weekends",
        stack: ["Go", "Rust", "Docker", "Kubernetes", "Kafka"],
        bio: "Distributed systems enthusiast. Writing fast, memory-safe services is my jam. 5x open-source maintainer, ex-Google engineer. Looking to build something meaningful on the side.",
        building: "Open-source distributed message queue in Rust.",
        lookingFor: "Technical co-founder with strong product sense.",
        matchPercentage: 74,
        avatarUrl: "https://i.pravatar.cc/300?u=james",
        sharedInterests: ["Open Source", "Infrastructure", "Systems Programming"],
        bannerGradient: "from-zinc-700 via-zinc-600 to-slate-500",
        githubUrl: "https://github.com",
        followers: 3200,
        experience: "8 years",
        openRoles: ["Product Co-founder"],
        tags: ["Ex-Google", "Open Source", "Systems"],
        projects: [
            {
                id: "p4",
                name: "FluxMQ",
                description: "Blazing fast distributed message queue written in Rust. Zero-copy transfers, 10M msgs/sec.",
                stack: ["Rust", "Tokio", "gRPC"],
                stars: 2100,
                contributors: 12,
                stage: "beta"
            }
        ]
    },
    {
        id: "4",
        name: "Sarah Jenkins",
        role: "Frontend Developer",
        location: "London, UK",
        availability: "Evenings · 10h/week",
        stack: ["Vue", "Nuxt", "TailwindCSS", "TypeScript", "Vitest", "Zustand"],
        bio: "Building accessible and beautiful user interfaces. Always learning something new. Passionate about animation, creative coding, and making the web more delightful.",
        building: "A habit tracker with a nostalgic 8-bit aesthetic.",
        lookingFor: "Backend developer for data syncing and auth.",
        matchPercentage: 81,
        avatarUrl: "https://i.pravatar.cc/300?u=sarah",
        sharedInterests: ["Frontend Architecture", "Gamification", "TypeScript"],
        bannerGradient: "from-emerald-500 via-teal-500 to-cyan-500",
        githubUrl: "https://github.com",
        website: "https://sarahjenkins.io",
        followers: 560,
        experience: "3 years",
        openRoles: ["Backend Developer"],
        tags: ["Creative Coding", "a11y", "Games"],
        projects: [
            {
                id: "p5",
                name: "PixelHabit",
                description: "8-bit inspired habit tracker with pixel art animations and streak mechanics.",
                stack: ["Nuxt", "Supabase", "TypeScript"],
                stars: 428,
                contributors: 3,
                stage: "live",
                openRoles: ["Backend Developer"]
            }
        ]
    },
    {
        id: "5",
        name: "Neha Gupta",
        role: "AI/ML Engineer",
        location: "Bangalore, India",
        availability: "Full-time",
        stack: ["Python", "PyTorch", "FastAPI", "LangChain", "React"],
        bio: "Building at the frontier of applied AI. Former researcher at IISc. I love turning cutting-edge research into products people can actually use. Currently exploring multimodal AI applications.",
        building: "An AI-powered design critique tool for Figma.",
        lookingFor: "Product Designer and React developer.",
        matchPercentage: 95,
        avatarUrl: "https://i.pravatar.cc/300?u=neha",
        sharedInterests: ["AI Products", "Design Tools", "Python"],
        bannerGradient: "from-violet-600 via-purple-500 to-fuchsia-500",
        githubUrl: "https://github.com",
        followers: 1800,
        experience: "5 years",
        openRoles: ["Product Designer", "Frontend Developer"],
        tags: ["ML Research", "AI Products", "Figma Plugin"],
        projects: [
            {
                id: "p6",
                name: "DesignCritic",
                description: "AI-powered design feedback tool that analyzes Figma files for UX issues and accessibility.",
                stack: ["Python", "OpenAI Vision", "Figma API"],
                stars: 542,
                contributors: 2,
                stage: "beta",
                openRoles: ["Product Designer", "React Developer"]
            }
        ]
    },
    {
        id: "6",
        name: "Marcus Webb",
        role: "Indie Founder",
        location: "Austin, TX",
        availability: "Full-time",
        stack: ["React Native", "Expo", "Supabase", "TypeScript", "Stripe"],
        bio: "3x indie hacker. Built and sold two micro-SaaS products. Currently going all-in on mobile. I move fast, ship often, and care deeply about product-market fit.",
        building: "A freelance time-tracking app for creative professionals.",
        lookingFor: "Designer to elevate the product's visual identity.",
        matchPercentage: 87,
        avatarUrl: "https://i.pravatar.cc/300?u=marcus",
        sharedInterests: ["Indie Hacking", "Mobile Apps", "Monetization"],
        bannerGradient: "from-amber-500 via-orange-500 to-red-500",
        githubUrl: "https://github.com",
        website: "https://marcuswebb.io",
        followers: 2100,
        experience: "7 years",
        openRoles: ["Product Designer"],
        tags: ["3x Founder", "Bootstrapped", "Mobile"],
        projects: [
            {
                id: "p7",
                name: "TimeCanvas",
                description: "Beautiful time-tracking app for freelancers. Auto-categorizes work, generates invoices.",
                stack: ["React Native", "Expo", "Supabase"],
                stars: 890,
                contributors: 1,
                stage: "live",
                openRoles: ["Designer"]
            }
        ]
    },
    {
        id: "7",
        name: "Yuki Tanaka",
        role: "DevRel Engineer",
        location: "Tokyo, Japan",
        availability: "Part-time · 20h/week",
        stack: ["TypeScript", "React", "GraphQL", "Astro", "MDX"],
        bio: "Developer advocate by day, open source contributor by night. I build tools that make other developers more productive. Love writing, teaching, and creating beautiful documentation.",
        building: "An open-source component documentation platform.",
        lookingFor: "Backend engineer and technical writer.",
        matchPercentage: 79,
        avatarUrl: "https://i.pravatar.cc/300?u=yuki",
        sharedInterests: ["Developer Tools", "Open Source", "Documentation"],
        bannerGradient: "from-sky-500 via-blue-500 to-indigo-600",
        githubUrl: "https://github.com",
        website: "https://yukitanaka.dev",
        followers: 4500,
        experience: "5 years",
        openRoles: ["Backend Engineer", "Technical Writer"],
        tags: ["DevRel", "Open Source", "Educator"],
        projects: [
            {
                id: "p8",
                name: "DocuForge",
                description: "Open-source component documentation with live playgrounds, search, and theming.",
                stack: ["Astro", "TypeScript", "MDX"],
                stars: 1340,
                contributors: 8,
                stage: "live",
                openRoles: ["Backend Engineer"]
            }
        ]
    },
    {
        id: "8",
        name: "Aria Patel",
        role: "Blockchain Developer",
        location: "Dubai, UAE",
        availability: "Full-time",
        stack: ["Solidity", "Rust", "React", "ethers.js", "Hardhat"],
        bio: "Building the decentralized future, one smart contract at a time. Previously at Coinbase. I believe in practical web3 — products that solve real problems without the hype.",
        building: "A DeFi protocol for creator monetization.",
        lookingFor: "Frontend developer and product designer.",
        matchPercentage: 70,
        avatarUrl: "https://i.pravatar.cc/300?u=aria",
        sharedInterests: ["Web3", "Creator Economy", "DeFi"],
        bannerGradient: "from-teal-500 via-emerald-500 to-green-500",
        githubUrl: "https://github.com",
        followers: 980,
        experience: "4 years",
        openRoles: ["Frontend Developer", "Product Designer"],
        tags: ["Ex-Coinbase", "Web3", "DeFi"],
        projects: [
            {
                id: "p9",
                name: "CreatorFlow",
                description: "DeFi protocol enabling creators to monetize via token-gated content and fan investments.",
                stack: ["Solidity", "React", "ethers.js"],
                stars: 230,
                contributors: 3,
                stage: "beta",
                openRoles: ["Frontend Developer", "Designer"]
            }
        ]
    }
];
