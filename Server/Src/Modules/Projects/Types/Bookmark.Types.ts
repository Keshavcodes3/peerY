import { Types } from "mongoose";

export interface BookmarkInterface {
    _id: Types.ObjectId,
    user: Types.ObjectId,
    project: Types.ObjectId
}