import { DeviceViewModel } from "../api/output/sercurityDevicesViewModel";
import { AuthSessionsDocument } from "../../auth/infrastructure/sessions.model";

export const mapActiveSessionDevicesFromDbToViewModel = (
    session: AuthSessionsDocument
): DeviceViewModel => {
    return {
        ip: session.ip,
        title: session.title,
        lastActiveDate: new Date(session.lastActiveDate).toISOString(),
        deviceId: session.deviceId
    }
}