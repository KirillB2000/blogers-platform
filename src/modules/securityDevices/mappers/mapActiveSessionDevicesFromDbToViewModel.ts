import { WithId } from "mongodb";
import { AuthSession } from "../../auth/domain/session";
import { DeviceViewModel } from "../api/output/sercurityDevicesViewModel";

export const mapActiveSessionDevicesFromDbToViewModel = (
    session: WithId<AuthSession>
): DeviceViewModel => {
    return {
        ip: session.ip,
        title: session.title,
        lastActiveDate: new Date(session.lastActiveDate).toISOString(),
        deviceId: session.deviceId
    }
}