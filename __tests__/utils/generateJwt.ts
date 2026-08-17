import { SETTINGS } from "../../src/settings/config";
import { UserViewModel } from "../../src/users/output/userViewModel";
import jwt from 'jsonwebtoken'

const JWT_SECRET = SETTINGS.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error("❌ Critical: JWT_SECRET is missing in environment variables!")
}

export const generateTestJwt = (user: UserViewModel) => {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {expiresIn: '10m'})
    return token
} 