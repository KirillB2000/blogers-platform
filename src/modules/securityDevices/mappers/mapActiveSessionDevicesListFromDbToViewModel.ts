import { DeviceViewModel } from "../api/output/sercurityDevicesViewModel";
import { mapActiveSessionDevicesFromDbToViewModel } from "./mapActiveSessionDevicesFromDbToViewModel";
import { AuthSessionsDocument } from "../../auth/infrastructure/sessions.model";

export const mapActiveSessionsDevicesListFromDbToViewModel = (
    activeSessionDevicesList: AuthSessionsDocument[]
): DeviceViewModel[] => {
    return activeSessionDevicesList.map(mapActiveSessionDevicesFromDbToViewModel)
}