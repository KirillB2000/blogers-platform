import { ObjectId } from "mongodb";
import { PostInputModel } from "../input/dto/postInputModel";
import { Post } from "../input/post";
import { postsCollection } from "../../db/collections";

export const postsRepository = {

  async create(newPost: Post): Promise<ObjectId> {
    const insertResult = await postsCollection.insertOne(newPost)

    return insertResult.insertedId
  },

  async update(id: string, post: PostInputModel): Promise<boolean> {
    const updatedResult = await postsCollection.updateOne(
      {_id: new ObjectId(id)},
      {$set: post}
    )

    return updatedResult.matchedCount > 0;
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id)
    })

    return deleteResult.deletedCount > 0;
  },
};
