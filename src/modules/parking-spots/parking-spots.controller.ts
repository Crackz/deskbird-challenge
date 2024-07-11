import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AccessGuard, Actions, UseAbility } from "nest-casl";
import { API_KEY_TOKEN } from "src/common/constants";
import { OpenApi } from "src/common/utils";
import { TokenAuthGuard } from "../auth/guards/auth.guard";
import { ParkingSpotDto } from "./dtos/parking-spot.dto";
import { ParkingSpotEntity } from "./entities/parking-spot.entity";
import { ParkingSpotsService } from "./parking-spots.service";

@ApiTags("Parking Spots")
@ApiSecurity(API_KEY_TOKEN)
@Controller("parking-spots")
export class ParkingSpotsController {
  constructor(private readonly parkingSportsService: ParkingSpotsService) {}

  @ApiUnauthorizedResponse(OpenApi.getApiUnauthorizedResponseErrorOpts())
  @UseGuards(TokenAuthGuard, AccessGuard)
  @UseAbility(Actions.read, ParkingSpotEntity)
  @Get("/")
  async getAll(): Promise<ParkingSpotDto[]> {
    return await this.parkingSportsService.getAll();
  }
}
