import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AUTHENTICATED_USER_ATTRIBUTE_NAME } from "src/common/constants";
import { Principal } from "src/common/models/principal.model";

export const CurrentPrincipal = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Principal => {
    const request = ctx.switchToHttp().getRequest();
    return new Principal(request[AUTHENTICATED_USER_ATTRIBUTE_NAME]);
  }
);
