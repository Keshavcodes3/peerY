import { Schema, model, Types, Document } from "mongoose"; // Added Document
import type { Match } from "../Types/match.types.js";

export interface IMatch extends Match, Document {
    createdAt: Date;
    updatedAt: Date;
}

const matchSchema = new Schema<IMatch>({
    userOne: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    userTwo: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    matchedAt: {
        type: Date,
        default: null
    },
    accepted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED", "ARCHIVE", "UNMATCHED"],
        default: "ACTIVE"
    }
}, {
    timestamps: true
});

matchSchema.index({
    userOne: 1,
    userTwo: 1
}, {
    unique: true
});

const matchModel = model<IMatch>("match", matchSchema);

export default matchModel;