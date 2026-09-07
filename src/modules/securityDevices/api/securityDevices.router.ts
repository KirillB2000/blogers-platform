import { Router } from "express";
import { SEC_DEV_ROUTES } from "../constants/securityDevices.paths";
import { getSecurityDevicesListHandler } from "./handlers/getSecurityDevicesList.handler";

export const securityDeviceRouter = Router()

securityDeviceRouter
    .get(
        SEC_DEV_ROUTES.ROOT,
        getSecurityDevicesListHandler
    )