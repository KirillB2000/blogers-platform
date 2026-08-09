import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogsCollection, commentsCollection, postsCollection, usersCollection } from "../../../db/collections";

export const testingDeleteAllDataHandler = async (req: Request, res: Response) => {
  await postsCollection.deleteMany({})
  await blogsCollection.deleteMany({})
  await usersCollection.deleteMany({})
  await commentsCollection.deleteMany({})


  res.sendStatus(httpStatuses.NoContent)
};
