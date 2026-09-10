import { WithId } from "mongodb";
import { AuthSession } from "../../auth/domain/session";
import { DeviceViewModel } from "../api/output/sercurityDevicesViewModel";
import { mapActiveSessionDevicesFromDbToViewModel } from "./mapActiveSessionDevicesFromDbToViewModel";

export const mapActiveSessionsDevicesListFromDbToViewModel = (
    activeSessionDevicesList: WithId<AuthSession>[]
): DeviceViewModel[] => {
    return activeSessionDevicesList.map(mapActiveSessionDevicesFromDbToViewModel)
}