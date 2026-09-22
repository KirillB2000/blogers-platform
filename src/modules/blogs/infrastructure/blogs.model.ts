import mongoose, { model } from "mongoose";

export type BlogsType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: Date
    isMembership: boolean
};

type BlogsModel = mongoose.Model<BlogsType>

export type BlogsDocument = mongoose.HydratedDocument<BlogsType>


const blogsSсhema = new mongoose.Schema<BlogsType>({
    name: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 500 },
    websiteUrl: { type: String, required: true, max: 100 },
    createdAt: { type: Date, required: true },
    isMembership: { type: Boolean, required: true },
})

export const BlogsModel = model<BlogsType, BlogsModel>('blogs', blogsSсhema)