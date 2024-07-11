import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import {
  API_KEY_HEADER_NAME,
  AUTHENTICATED_USER_ATTRIBUTE_NAME,
} from "src/common/constants";
import { ApiErrors } from "src/common/utils";
import { UsersService } from "../../users/users.service";

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers[API_KEY_HEADER_NAME];
    if (!token) {
      throw ApiErrors.Unauthorized();
    }

    // To save time, I fetch the user here and attached it to the request object
    // In a real world application, I would attach only the user id to the request and
    // fetch the user from the database when needed
    const user = await this.usersService.findByToken(token);
    if (!user) {
      throw ApiErrors.Unauthorized();
    }

    request[AUTHENTICATED_USER_ATTRIBUTE_NAME] = user;
    return true;
  }
}
