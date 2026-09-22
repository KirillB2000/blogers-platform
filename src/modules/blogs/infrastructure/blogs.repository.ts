import { blogInputModel } from "../api/input/dto/blogInputModel";
import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { BlogsDocument, BlogsModel, BlogsType } from "./blogs.model";
import { PostsModel } from "../../posts/infrastructure/posts.model";


@injectable()
export class BlogsRepository {
  async create(newBlog: BlogsType): Promise<string> {
    const createdBlog = await BlogsModel.insertOne(newBlog)

    return createdBlog.id
  }

  async update(id: string, blog: blogInputModel): Promise<boolean> {
    const updateResult = await BlogsModel.updateOne(
      {_id: new ObjectId(id)},
      {$set: blog}
    )

    return updateResult.matchedCount > 0
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
