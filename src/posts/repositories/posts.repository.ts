import { ObjectId, WithId } from "mongodb";
import { postInputModel } from "../dto/postInputModel";
import { Post } from "../domain/post";
import { postsCollection } from "../../db/collections";
import { PostQueryInput } from "../routes/input/post-query.input";

export const postsRepository = {
  async findAll(
    queryDto: PostQueryInput
  ): Promise<{items: WithId<Post>[], totalCount: number}> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto

    const skip = (pageNumber - 1) * pageSize

    const items = await postsCollection
      .find()
      .sort({[sortBy]: sortDirection})
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const totalCount = await postsCollection.countDocuments()

    return {items, totalCount}
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return postsCollection.findOne({_id: new ObjectId(id)})
  },

  async create(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postsCollection.insertOne(newPost)

    return {...newPost, _id: insertResult.insertedId}
  },

  async update(id: string, post: postInputModel): Promise<boolean> {
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
