import { Router } from "express";
import { SEC_DEV_ROUTES } from "../constants/securityDevices.paths";
import { catchAsync } from "../../../core/helpers/catchAsync.helper";
import { PARAMS_IDS } from "../../../core/types/paramsIds";
import { uuidParamsValidation } from "../../../core/middlewares/validation/params-uuid.validation.middleware";
import { SecurityDevicesController } from "./securityDevices.controller";
import { container } from "../../../compostion-root";

export const securityDeviceRouter = Router()

const securityDevicesController = container.get(SecurityDevicesController)

securityDeviceRouter
    .get(
        SEC_DEV_ROUTES.ROOT,
        catchAsync(securityDevicesController.getSecurityDevicesListHandler.bind(securityDevicesController))
    )

    .delete(
        SEC_DEV_ROUTES.ROOT,
        catchAsync(securityDevicesController.deleteAllDeviceSessionsHandler.bind(securityDevicesController))
    )

    .delete(
        `${SEC_DEV_ROUTES.ROOT}${SEC_DEV_ROUTES.BY_DEVICE_ID}`,
        uuidParamsValidation(PARAMS_IDS.DEVICE_ID),
        catchAsync(securityDevicesController.deleteSpecificDeviceSessionHandler.bind(securityDevicesController))
    )