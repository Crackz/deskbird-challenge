import { INestApplication } from "@nestjs/common";
import {
  ApiResponseOptions,
  DocumentBuilder,
  SwaggerModule,
} from "@nestjs/swagger";
import {
  ErrorMessage,
  ErrorMessages,
  ErrorResponse,
} from "../interfaces/api-errors.interface";
import { API_KEY_TOKEN } from "../constants";

export class OpenApi {
  static setup(servePath: string, app: INestApplication): void {
    const options = new DocumentBuilder()
      .setTitle("Deskbird Challenge")
      .setVersion("1.0")
      .addApiKey(
        { name: "x-api-key", type: "apiKey", in: "header" },
        API_KEY_TOKEN
      )
      .addServer("/v1")
      .build();

    const document = SwaggerModule.createDocument(app, options, {
      ignoreGlobalPrefix: true,
    });

    SwaggerModule.setup(servePath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  static getApiErrorOpts(
    opts?: ErrorMessage | ErrorMessage[]
  ): ApiResponseOptions {
    const errorResponse: ErrorResponse = {
      error: {
        errors: Array.isArray(opts) ? opts : [opts],
      },
    };
    return {
      schema: {
        example: errorResponse,
      },
    };
  }

  static getApiUnprocessableEntityErrorOpts(): ApiResponseOptions {
    return {
      ...OpenApi.getApiErrorOpts({
        message: "Details about the field and why it's invalid",
        param: "fieldName",
      }),
      description:
        "this status is used to indicate that there are some invalid fields",
    };
  }

  static getApiNoContentResponseErrorOpts(): ApiResponseOptions {
    return {
      description:
        "Your request is processed successfully but there is no content to return",
    };
  }
  static getApiAcceptedResponseErrorOpts(): ApiResponseOptions {
    return {
      description:
        "Your request is accepted and will be processed shortly after",
    };
  }

  static getApiUnauthorizedResponseErrorOpts(): ApiResponseOptions {
    return {
      ...OpenApi.getApiErrorOpts({
        message: ErrorMessages.UNAUTHORIZED,
      }),
      description:
        "Unauthorized access. You are not allowed to access this resource",
    };
  }
}