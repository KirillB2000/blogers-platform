import { UserInputModel } from "../../users/dto/userInputModel";
import { IdType } from "./id";

declare global {
    namespace Express {
        export interface Request {
            user: IdType | null
        }
    }
}