import type { BookmarkInterface } from "../Types/Bookmark.Types.js";
import { Document, Schema, model } from "mongoose";

export interface IBookmark extends BookmarkInterface, Document {
    createdAt: Date;
    updatedAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        index: true
    }
}, {
    timestamps: true
});

// Prevent duplicate bookmarks — one user can bookmark a project only once
bookmarkSchema.index({ user: 1, project: 1 }, { unique: true });

const BookmarkModel = model<IBookmark>("Bookmark", bookmarkSchema);

export default BookmarkModel;
