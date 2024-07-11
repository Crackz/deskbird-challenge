import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from '../entities/base.entity';
import { DeepWritable } from '../types/writable';

export abstract class BaseRepo<T extends BaseEntity> {
  constructor(private readonly _repo: Repository<T>) {}

  async find(
    query?: FindManyOptions<T>['where'],
    opts = {} as { order?: FindManyOptions<T>['order'] },
  ): Promise<T[]> {
    return await this._repo.find({ where: query, ...opts });
  }

  async findOne(
    query?: FindOneOptions<T>['where'],
    opts = {} as { order?: FindManyOptions<T>['order'] },
  ): Promise<T | null> {
    return await this._repo.findOne({ where: query, ...opts });
  }

  async findByIdAndUpdate(
    id: string | number,
    updatedData: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return await this._repo.update(id, updatedData);
  }

  async insert(data: DeepWritable<T>[]): Promise<void> {
    await this._repo.insert(data);
  }
  async create(data: DeepWritable<T>): Promise<T> {
    return await this._repo.save(data as DeepPartial<T>);
  }

  async count(): Promise<number> {
    return await this._repo.count();
  }
}
