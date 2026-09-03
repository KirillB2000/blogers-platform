import { EmailConfirmationType } from "./emailConfirmationType";

export type IUserDB = {
    login: string;
    email: string;
    password: string;
    createdAt: Date;
    emailConfirmation: EmailConfirmationType
}