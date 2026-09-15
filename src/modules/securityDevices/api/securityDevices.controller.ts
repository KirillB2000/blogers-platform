import { Request, Response } from "express"
import { httpStatuses } from "../../../core/types/http-statuses"
import { SecurityDevicesService } from "../application/commands/securityDevices.services"
import { UUID } from "crypto"
import { UnauthorizedError } from "../../../core/exceptions/app-errors.exeption"
import { SecurityDevicesQueryService } from "../application/queries/securityDevices.queryServices"

export class SecurityDevicesController {
    constructor (
        private securityDevicesService: SecurityDevicesService,
        private securityDevicesQueryService: SecurityDevicesQueryService
    ) {}


    async deleteAllDeviceSessionsHandler (
        req: Request,
        res: Response
    ) {
        const { refreshToken } = req.cookies as AuthCookies

        if (!refreshToken) {
            return res.sendStatus(httpStatuses.Unauthorized)
        }

        await this.securityDevicesService.deleteAllSessions(refreshToken)

        res.sendStatus(httpStatuses.NoContent)
    }

    async deleteSpecificDeviceSessionHandler (
        req: Request<{ deviceId: UUID }>,
        res: Response
    ) {
        const { deviceId } = req.params
        const { refreshToken } = req.cookies as AuthCookies

        if (!refreshToken) {
            return res.sendStatus(httpStatuses.Unauthorized)
        }

        await this.securityDevicesService.deleteOneSession(deviceId, refreshToken)

        res.sendStatus(httpStatuses.NoContent)
    }

    async getSecurityDevicesListHandler (
        req: Request,
        res: Response
    ) {
        const { refreshToken } = req.cookies as AuthCookies

        if (!refreshToken) {
            throw new UnauthorizedError('Unauthorized')
        }

        const activeSessionDevicesList = await this.securityDevicesQueryService.listingActiveSessionDevices(refreshToken)

        res.status(httpStatuses.Ok).json(activeSessionDevicesList) 
    }
}