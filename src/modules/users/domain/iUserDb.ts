import { EmailConfirmationType } from "./emailConfirmationType";
import { PasswordRecoveryType } from "./passwordRecoveryType";

export type IUserDB = {
    login: string;
    email: string;
    password: string;
    createdAt: Date;
    emailConfirmation: EmailConfirmationType,
    passwordRecovery: PasswordRecoveryType
}