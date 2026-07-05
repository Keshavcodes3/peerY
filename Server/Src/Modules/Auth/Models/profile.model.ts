import mongoose, { Schema, model, type Document } from "mongoose";
import type { authProfile } from "../../../Types/Auth.Types.js";

export interface IauthProfile extends authProfile, Document {
  createdAt: Date,
  updatedAt: Date
}

const profileSchema = new Schema<IauthProfile>({
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  avatar: {
    type: String,
    default: ""
  },
  skills: {
    type: [String],
    lowercase: true,
    trim: true,
    default: [""]
  },
  socials: {
    type: [String],
    lowercase: true,
    trim: true,
    default: [""]
  },
  Bio: {
    type: String,
    default: "Let's cook",
    minLen: 5,
    maxLen: 300
  },
  college: {
    type: String,
    lowercase: true,
    default: ""
  },
  experience: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
    enum: ["beginner", "intermediate", "god"]
  },
  techstack: {
    type: [String],
    lowercase: true,
    trim: true,
    default: [""]
  },
  avaliabilty: {
    type: Boolean,
    default: true,
  },
  intent: {
    type: String,
    select: true,
    index: true
  },
  //?
  followerCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  totalContribution: {
    type: Number,
    default: 0
  },
  totalProject: {
    type: Number,
    default: 0
  },
  Achievements: {
    type: [String],
    default: ["Starter"]
  },
  Rank: {
    type: String,
    default: "B"
  }
}, {
  timestamps: true
})



profileSchema.index({ avatar: 1 })
profileSchema.index({ college: 1 })


const profileModel = model("profile", profileSchema)


export default profileModel