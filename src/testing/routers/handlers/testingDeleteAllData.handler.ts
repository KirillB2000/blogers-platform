import { Request, Response } from "express";
import { db } from "../../../db/db";
import { httpStatuses } from "../../../core/types/http-statuses";

export const testingDeleteAllDataHandler = (req: Request, res: Response) => {
  db.blogs = [];
  db.posts = [];

  res.sendStatus(httpStatuses.NoContent);
};
