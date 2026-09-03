import { blogInputModel } from "../api/input/dto/blogInputModel";
import { ObjectId, WithId } from "mongodb";
import { Blog } from "../domain/blog";
import { blogsCollection, postsCollection } from "../../../db/collections";


export const blogsRepository = {
  async create(newBlog: Blog): Promise<string> {
    const createdBlog = await blogsCollection.insertOne(newBlog)

    return createdBlog.insertedId.toString()
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
