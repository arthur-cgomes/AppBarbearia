import { ApiProperty } from "@nestjs/swagger";
import { Scheduling } from "../entity/scheduling.entity";
import { SchedulingDto } from "./scheduling.dto";

export class GetAllSchedulingResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  @ApiProperty({ type: SchedulingDto, isArray: true })
  schedulings: Scheduling[];
}