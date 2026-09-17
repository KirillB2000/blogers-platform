import { UUID } from "crypto"

export type PasswordRecoveryType = {
    recoveryCode: UUID | null,
    expirationDate: Date | null
}