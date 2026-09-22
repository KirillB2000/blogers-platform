import mongoose, { model } from "mongoose";

type EmailConfirmationType = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean
}

type PasswordRecoveryType = {
    recoveryCode: string | null,
    expirationDate: Date | null
}

export type UsersType = {
    login: string;
    email: string;
    password: string;
    createdAt: Date;
    emailConfirmation: EmailConfirmationType;
    passwordRecovery: PasswordRecoveryType;
}

type UsersModel = mongoose.Model<UsersType>
export type UsersDocument = mongoose.HydratedDocument<UsersType>

const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true }
}, {_id: false})

const PasswordRecoverySchema = new mongoose.Schema<PasswordRecoveryType>({
    recoveryCode: { type: String, default: null },
    expirationDate: { type: Date, default: null }
}, { _id: false })

const UsersSchema = new mongoose.Schema<UsersType>({
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, max: 100 },
    createdAt: { type: Date, required: true },
    emailConfirmation: { type: EmailConfirmationSchema, required: true },
    passwordRecovery: { type: PasswordRecoverySchema, required: true }
})

UsersSchema.index({ 'emailConfirmation.confirmationCode': 1 }, {unique: true})

export const UsersModel = model<UsersType, UsersModel>('users', UsersSchema)