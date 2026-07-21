import { blogInputModel } from "../dto/blogInputModel";
import { ObjectId, WithId } from "mongodb";
import { blogsCollection, postsCollection } from "../../db/collections";
import { Blog } from "../domain/blog";
import { BlogQueryInput } from "../routes/input/blog-query.input";

export const blogsRepository = {
  async findMany(
    queryDto: BlogQueryInput
  ): Promise<{ items: WithId<Blog>[], totalCount: number}> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchBlogNameTerm
    } = queryDto

    const skip = (pageNumber -1 ) * pageSize
    const filter: any = {}

    if (searchBlogNameTerm) {
      filter.name = { $regex: searchBlogNameTerm, $options: 'i' }
    }

    const items = await blogsCollection
      .find(filter)
      .sort({[sortBy]: sortDirection})
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const totalCount = await blogsCollection.countDocuments(filter)

    return { items, totalCount }
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
