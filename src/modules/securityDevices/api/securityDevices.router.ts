import { Router } from "express";
import { SEC_DEV_ROUTES } from "../constants/securityDevices.paths";
import { getSecurityDevicesListHandler } from "./handlers/getSecurityDevicesList.handler";
import { catchAsync } from "../../../core/helpers/catchAsync.helper";
import { PARAMS_IDS } from "../../../core/types/paramsIds";
import { uuidParamsValidation } from "../../../core/middlewares/validation/params-uuid.validation.middleware";
import { deleteSpecificDeviceSessionHandler } from "./handlers/deleteSpecificDeviceSession.handler";
import { deleteAllDeviceSessionsHandler } from "./handlers/deleteAllDeviceSessions.handler";

export const securityDeviceRouter = Router()

securityDeviceRouter
    .get(
        SEC_DEV_ROUTES.ROOT,
        catchAsync(getSecurityDevicesListHandler)
    )

    .delete(
        SEC_DEV_ROUTES.ROOT,
        catchAsync(deleteAllDeviceSessionsHandler)
    )

    .delete(
        `${SEC_DEV_ROUTES.ROOT}${SEC_DEV_ROUTES.BY_DEVICE_ID}`,
        uuidParamsValidation(PARAMS_IDS.DEVICE_ID),
        catchAsync(deleteSpecificDeviceSessionHandler)
    )