import { injectable } from "inversify"
import { AuthServiceHelpers } from "../../../auth/application/auth.serviceHelpers"
import { SessionsQwReposiroty } from "../../../auth/infrastructure/sessions.queryRepository"
import { DeviceViewModel } from "../../api/output/sercurityDevicesViewModel"
import { mapActiveSessionsDevicesListFromDbToViewModel } from "../../mappers/mapActiveSessionDevicesListFromDbToViewModel"


@injectable()
export class SecurityDevicesQwService {
    constructor (
        private sessionsQueryReposiroty: SessionsQwReposiroty,
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