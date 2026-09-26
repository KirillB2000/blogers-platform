import mongoose, { model } from "mongoose"

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export type LikesInfoType = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}

export type LikesStatusType = {
    commentId: string,
    userId: string ,
    myStatus: LikeStatus
}

type LikesStatusModel = mongoose.Model<LikesStatusType>
export type LikesStatusDocument = mongoose.HydratedDocument<LikesStatusType>

export const LikesStatusSchema = new mongoose.Schema<LikesStatusType>({
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    myStatus: { type: String, required: true, enum: Object.values(LikeStatus) }
})

LikesStatusSchema.index({ userId: 1, commentId: 1 }, { unique: true }) // Likes dublicate guard

export const LikesStatusModel = model<LikesStatusType, LikesStatusModel>('likes_status', LikesStatusSchema)