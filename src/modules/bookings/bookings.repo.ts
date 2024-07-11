import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepo } from "src/common/repos/base.repo";
import { Between, FindOneOptions, Not, Repository } from "typeorm";
import { BookingEntity } from "./entities/booking.entity";

@Injectable()
export class BookingsRepo extends BaseRepo<BookingEntity> {
  constructor(
    @InjectRepository(BookingEntity)
    private repo: Repository<BookingEntity>
  ) {
    super(repo);
  }

  findOneByDateRange(
    startDate: Date,
    endDate: Date,
    opts?: { exceptId?: string }
  ): Promise<BookingEntity | null> {
    let findOneQueries: FindOneOptions<BookingEntity>["where"] = [
      { startDate: Between(startDate, endDate) },
      { endDate: Between(startDate, endDate) },
    ];

    if (opts?.exceptId) {
      findOneQueries = findOneQueries.map((findOneQuery) => ({
        ...findOneQuery,
        id: Not(opts.exceptId),
      }));
    }

    return this.findOne(findOneQueries);
  }
}
