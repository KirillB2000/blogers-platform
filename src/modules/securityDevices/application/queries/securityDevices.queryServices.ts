import { AuthServiceHelpers } from "../../../auth/application/auth.serviceHelpers"
import { SessionsQueryReposiroty } from "../../../auth/infrastructure/sessions.queryRepository"
import { DeviceViewModel } from "../../api/output/sercurityDevicesViewModel"
import { mapActiveSessionsDevicesListFromDbToViewModel } from "../../mappers/mapActiveSessionDevicesListFromDbToViewModel"


export class SecurityDevicesQueryService {
    constructor (
        private sessionsQueryReposiroty: SessionsQueryReposiroty,
        private authServiceHelpers: AuthServiceHelpers
    ) {}

    
    async listingActiveSessionDevices(
        refreshToken: string
    ): Promise<DeviceViewModel[]> {
        const { userId } = await this.authServiceHelpers.refreshTokenValidation(refreshToken)

        const listActiveSessionDevicesDb = await this.sessionsQueryReposiroty.getAcviveSessionDevicesList(userId)

        const listActiveSessionDevicesViewModel = mapActiveSessionsDevicesListFromDbToViewModel(listActiveSessionDevicesDb)

        return listActiveSessionDevicesViewModel
    }
}