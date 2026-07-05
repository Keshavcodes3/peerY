import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
    matchId: Types.ObjectId;
    sender: Types.ObjectId;
    text: string;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        matchId: {
            type: Schema.Types.ObjectId,
            ref: "Match",
            required: true,
            index: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Compound index for retrieving chat history quickly
messageSchema.index({ matchId: 1, createdAt: 1 });

const MessageModel = model<IMessage>("Message", messageSchema);

export default MessageModel;
