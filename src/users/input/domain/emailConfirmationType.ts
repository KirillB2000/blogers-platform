import { UUID } from "node:crypto"

export type EmailConfirmationType = {
    confirmationCode: UUID,
    expirationDate: Date,
    isConfirmed: boolean
}