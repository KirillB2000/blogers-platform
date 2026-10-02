import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { BlogsDocument, BlogsModel, BlogsType } from "./blogs.model";
import { PostsModel } from "../../posts/infrastructure/posts.model";


@injectable()
export class BlogsRepository {

  async save (blog: BlogsDocument) {
    await blog.save()
  }

  async delete(id: string): Promise<boolean> {

    await PostsModel.deleteMany({blogId: id})

    const deleteResult = await BlogsModel.deleteOne(
      {_id: new ObjectId(id)}
    )

    return deleteResult.deletedCount > 0
  }

  // For post creation and throwing bad request exeption
  async findById (id: string) : Promise<BlogsDocument | null> { 
    const blog = await BlogsModel.findOne({_id: new ObjectId(id)})

    return blog
  }
};
