import { ObjectId } from "mongodb";
import { PostInputModel } from "../api/input/dto/postInputModel";
import { injectable } from "inversify";
import { PostsDocument, PostsModel, PostsType } from "./posts.model";

@injectable()
export class PostsRepository {

  async create(newPost: PostsType): Promise<string> {
    const insertResult = await PostsModel.insertOne(newPost)

    return insertResult.id
  }

  async update(id: string, post: PostInputModel): Promise<boolean> {
    const updatedResult = await PostsModel.updateOne(
      {_id: new ObjectId(id)},
      {$set: post}
    )

    return updatedResult.matchedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await PostsModel.deleteOne({
      _id: new ObjectId(id)
    })

    return deleteResult.deletedCount > 0;
  }
};
