import mongoose, { model } from "mongoose"
import { LikeStatus } from "../../../core/types/likeStatus"


export type PostLikesStatusType = {
    userId: string
    login: string
    postId: string
    myStatus: LikeStatus
    addedAt: Date
}

type PostLikesStatusModel = mongoose.Model<PostLikesStatusType>
export type PostLikesStatusDocument = mongoose.HydratedDocument<PostLikesStatusType>

const PostLikesStatusSchema = new mongoose.Schema<PostLikesStatusType>({
    userId: {type: String, required: true},
    login: { type: String, required: true },
    postId: { type: String, required: true },
    myStatus: {type: String, required: true, enum: Object.values(LikeStatus)},
    addedAt: { type: Date, required: true }
})

PostLikesStatusSchema.index({ userId: 1, postId: 1 }, { unique: true })

export const PostLikesStatusModel = model<PostLikesStatusType, PostLikesStatusModel>('post_likes_stasus', PostLikesStatusSchema) 