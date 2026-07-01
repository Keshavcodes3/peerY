import type { Types } from "mongoose"

export interface AuthRegister {
  username: string,
  email: string,
  password: string,
  emailVerified: Boolean,
  provider?: "local" | "github" | "google"
}


export interface authProfile {
  authId: Types.ObjectId,
  name: string,
  avatar: string,
  skills: [string],
  socials: [string],
  Bio: string,
  college: string,
  experience: "Beginner" | "Intermediate" | "God",
  techstack: [string],
  avaliabilty: Boolean,
  intent: string,
  followerCount: Number,
  followingCount: Number,
  totalContribution: Number,
  totalProject: Number,
  activeStreak: Number,
  Achievements: [string],
  Rank: 'A' | 'E' | 'S' | 'B'
}

