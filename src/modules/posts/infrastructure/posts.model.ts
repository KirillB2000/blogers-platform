import mongoose, { model } from "mongoose"

export type PostsType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
}

type PostsModel = mongoose.Model<PostsType>
export type PostsDocument = mongoose.HydratedDocument<PostsType>

const postsSсhema = new mongoose.Schema<PostsType>({
    title: {type: String, required: true, max: 100},
    shortDescription: { type: String, required: true, max: 300 },
    content: { type: String, required: true, max: 100 },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true, max: 100 },
    createdAt: { type: Date, required: true }
})

export const PostsModel = model<PostsType, PostsModel>('posts', postsSсhema)