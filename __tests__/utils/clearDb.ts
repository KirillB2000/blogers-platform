import { Express } from "express"
import request from 'supertest'
import { TESTING_PATH, TESTING_ROUTES } from "../../src/testing/constants/testing.paths"
import { httpStatuses } from "../../src/core/types/http-statuses"

export const clearDb = async (app: Express) => {
    await request(app)
        .delete(`${TESTING_PATH}${TESTING_ROUTES.ALL_DATA}`)
        .expect(httpStatuses.NoContent)
}