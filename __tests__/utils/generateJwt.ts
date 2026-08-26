import { SETTINGS } from "../../src/settings/config";
import { UserViewModel } from "../../src/users/output/userViewModel";
import jwt from 'jsonwebtoken'

const JWT_ACCESS_SECRET = SETTINGS.JWT_ACCESS_SECRET

if (!JWT_ACCESS_SECRET) {
    throw new Error("❌ Critical: JWT_SECRET is missing in environment variables!")
}

export const generateTestAccessJwt = (user: UserViewModel) => {
    const token = jwt.sign({ userId: user.id }, JWT_ACCESS_SECRET, {expiresIn: '10m'})
    return token
} 