import mongoose, { model } from "mongoose"

export type CommentatorInfoType = {
    userId: string
    userLogin: string
}

export type LikesInfoDbCommentType = {
    likesCount: number
    dislikesCount: number
}

export type CommentsType = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: Date
    likesInfo: LikesInfoDbCommentType
}

type CommentsModel = mongoose.Model<CommentsType>
export type CommentsDocument = mongoose.HydratedDocument<CommentsType>


const CommentatorInfoSchema = new mongoose.Schema<CommentatorInfoType>({ 
    userId: { type: String, required: true },
    userLogin: { type: String, required: true }
}, {_id: false})

const LikesInfoSchema = new mongoose.Schema<LikesInfoDbCommentType>({
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true}
}, {_id: false})


const CommentsSchema = new mongoose.Schema<CommentsType>({ 
    postId: { type: String, required: true },
    content: { type: String, required: true, max: 1000 },
    commentatorInfo: { type: CommentatorInfoSchema, required: true },
    createdAt: { type: Date, required: true },
    likesInfo: { type: LikesInfoSchema, required: true }
})

CommentsSchema.index({ postId: 1 })
CommentsSchema.index({ 'commentatorInfo.userId': 1 })

export const CommentsModel = model<CommentsType, CommentsModel>('comments', CommentsSchema)
