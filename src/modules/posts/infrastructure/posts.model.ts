import mongoose, { model } from "mongoose"
import { ExtendedLikesInfoViewModel } from "../api/output/postExtededLikesInfoViewModel"

export type ExtendedLikesInfoDb = Pick<ExtendedLikesInfoViewModel, 'likesCount' | 'dislikesCount'>

export type PostsType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    extendedLikesInfo: ExtendedLikesInfoDb
}

type PostsModel = mongoose.Model<PostsType>
export type PostsDocument = mongoose.HydratedDocument<PostsType>

const ExtendedLikesInfoDbSchema = new mongoose.Schema<ExtendedLikesInfoDb>({
    dislikesCount: {type: Number, required: true},
    likesCount: { type: Number, required: true }
})

const PostsSchema = new mongoose.Schema<PostsType>({
    title: {type: String, required: true, max: 100},
    shortDescription: { type: String, required: true, max: 300 },
    content: { type: String, required: true, max: 100 },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true, max: 100 },
    createdAt: { type: Date, required: true },
    extendedLikesInfo: { type: ExtendedLikesInfoDbSchema, required: true}
})

export const PostsModel = model<PostsType, PostsModel>('posts', PostsSchema)