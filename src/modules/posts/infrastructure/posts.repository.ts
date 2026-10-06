import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { PostsDocument, PostsModel } from "./posts.model";

@injectable()
export class PostsRepository {

  async save (post: PostsDocument) {
    await post.save()
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await PostsModel.deleteOne({
      _id: new ObjectId(id)
    })

    return deleteResult.deletedCount > 0;
  }

  async findPostById (
    id: string
  ): Promise<PostsDocument | null> {
    const postDoc = await PostsModel.findById(id)

    return postDoc
  }
};
