import { blogInputModel } from "../dto/blogInputModel";
import { ObjectId, WithId } from "mongodb";
import { blogsCollection, postsCollection } from "../../db/collections";
import { Blog } from "../domain/blog";
import { assert } from "node:console";

export const blogsRepository = {
  async create(newBlog: Blog): Promise<ObjectId> {
    const createdBlog = await blogsCollection.insertOne(newBlog)

    return createdBlog.insertedId
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

  // For post creation and throwing bad request exeption
  async findById (id: string) : Promise<WithId<Blog> | null> { 
    const blog = await blogsCollection.findOne({_id: new ObjectId(id)})

    return blog
  }
};
