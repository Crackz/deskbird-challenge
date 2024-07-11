import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, Min } from "class-validator";
import { IsTimestampInMillis } from "src/common/validators/is-timestamp.validator";

export class CreateBookingDto {
  @ApiProperty()
  @IsDefined()
  @IsInt()
  @IsTimestampInMillis()
  startDateInTimestampMillis: number;

  @ApiProperty()
  @IsDefined()
  @IsInt()
  @IsTimestampInMillis()
  endDateInTimestampMillis: number;
}
