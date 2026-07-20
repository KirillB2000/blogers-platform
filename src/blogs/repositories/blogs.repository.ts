import { blogViewModel } from "../types/blogViewModel";
import { blogInputModel } from "../dto/blogInputModel";
import { ObjectId, WithId } from "mongodb";
import { blogsCollection, postsCollection } from "../../db/collections";
import { Blog } from "../types/blog";

export const blogsRepository = {
  async findAll(): Promise<WithId<Blog>[]> {
    return blogsCollection.find().toArray()
  },

  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogsCollection.findOne({_id: new ObjectId(id)})
  },

  async create(newBlog: Blog): Promise<WithId<Blog>> {
    const createdBlog = await blogsCollection.insertOne(newBlog)

    return {...newBlog, _id: createdBlog.insertedId}
  },

  async update(id: string, blog: blogInputModel): Promise<boolean> {
    const updateResult = await blogsCollection.updateOne(
      {_id: new ObjectId(id)},
      {$set: blog}
    )

    return updateResult.matchedCount > 0
  },

  async delete(id: string): Promise<boolean> {

    await postsCollection.deleteMany({blogId: id})

    const deleteResult = await blogsCollection.deleteOne(
      {_id: new ObjectId(id)}
    )

    return deleteResult.deletedCount > 0
  },
};
