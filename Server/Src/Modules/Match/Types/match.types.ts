import { Types } from "mongoose";


export interface Match {
    userOne: Types.ObjectId,
    userTwo: Types.ObjectId,
    matchedAt?: Date,
    status: "ACTIVE" | "BLOCKED" | "ARCHIVE" | "UNMATCHED",
    accepted: boolean
}