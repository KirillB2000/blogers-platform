declare module "swagger-ui-express" {
  import { RequestHandler } from "express";

  interface SwaggerUiOptions {
    swaggerOptions?: {
      url?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  export const serve: RequestHandler[];
  export function setup(
    spec?: any,
    options?: SwaggerUiOptions,
  ): RequestHandler;
}