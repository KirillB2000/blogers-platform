import { Request, Response } from "express"
import { securityDevicesServices } from "../../application/commands/securityDevices.services"
import { UUID } from "crypto"
import { httpStatuses } from "../../../../core/types/http-statuses"

export const deleteSpecificDeviceSessionHandler = async (
    req: Request<{deviceId: UUID}>,
    res: Response
) => {
    const { deviceId } = req.params
    const { refreshToken } = req.cookies as AuthCookies

    if(!refreshToken) {
        return res.sendStatus(httpStatuses.Unauthorized)
    }

    await securityDevicesServices.deleteOneSession(deviceId, refreshToken)

    res.sendStatus(httpStatuses.NoContent)
}