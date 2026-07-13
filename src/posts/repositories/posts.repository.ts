import { ObjectId, WithId } from "mongodb";
import { postInputModel } from "../dto/postInputModel";
import { Post } from "../types/post";
import { postsCollection } from "../../db/collections";

export const postsRepository = {
  async findAll(): Promise<WithId<Post>[]> {
    return postsCollection.find().toArray()
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return postsCollection.findOne({_id: new ObjectId(id)})
  },

  async create(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postsCollection.insertOne(newPost)

    return {...newPost, _id: insertResult.insertedId}
  },

  async update(id: string, post: postInputModel): Promise<Boolean> {
    const updatedResult = await postsCollection.updateOne(
      {_id: new ObjectId(id)},
      {$set: post}
    )

    return updatedResult.matchedCount > 0;
  },

  async delete(id: string): Promise<Boolean> {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id)
    })

    return deleteResult.deletedCount > 0;
  },
};
