import { authServiceHelpers } from "../../../auth/application/auth.serviceHelpers"
import { sessionsQueryReposiroty } from "../../../auth/infrastructure/sessions.queryRepository"
import { DeviceViewModel } from "../../api/output/sercurityDevicesViewModel"
import { mapActiveSessionsDevicesListFromDbToViewModel } from "../../mappers/mapActiveSessionDevicesListFromDbToViewModel"


export const securityDevicesQueryService = {
    async listingActiveSessionDevices(
        refreshToken: string
    ): Promise<DeviceViewModel[]> {
        const { issuedAt, deviceId, userId } = await authServiceHelpers.refreshTokenValidation(refreshToken)

        const listActiveSessionDevicesDb = await sessionsQueryReposiroty.getAcviveSessionDevicesList(issuedAt, deviceId, userId)

        const listActiveSessionDevicesViewModel = mapActiveSessionsDevicesListFromDbToViewModel(listActiveSessionDevicesDb)

        return listActiveSessionDevicesViewModel
    }
}