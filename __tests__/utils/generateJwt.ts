import { SETTINGS } from "../../src/settings/config";
import { UserViewModel } from "../../src/users/output/userViewModel";
import jwt from 'jsonwebtoken'

export const generateTestJwt = (user: UserViewModel) => {
    const token = jwt.sign({userId: user.id}, SETTINGS.JWT_SECRET, {expiresIn: '10m'})
    return token
} 