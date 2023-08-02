import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  ILike,
  In,
} from 'typeorm';
import { Address } from '../entity/address.entity';
import { District } from '../entity/district.entity';
import { State } from '../entity/state.entity';
import { AddressInput } from 'src/schema/graphql.schema';

@Injectable()
export class AddressService {
  private logger: Logger = new Logger(AddressService.name);

  constructor(private readonly dataSource: DataSource) {}

  async createAddress(
    tenantId: string,
    addressInput: AddressInput,
    entityManager?: EntityManager,
  ): Promise<Address> {
    const districtEntity = await this.getDistrictById(addressInput.districtId);
    const addressRepository = entityManager
      ? entityManager.getRepository(Address)
      : this.dataSource.getRepository(Address);
    const address = addressRepository.create({
      tenantId,
      value: addressInput.value,
      pincode: addressInput.pincode,
      districtId: districtEntity.id,
      district: districtEntity,
    });
    return addressRepository.save(address);
  }

  async updateAddress(
    addressId: string,
    addressInput: AddressInput,
    entityManager?: EntityManager,
  ): Promise<Address> {
    const districtEntity = await this.getDistrictById(addressInput.districtId, [
      'state',
    ]);

    const addressRepository = entityManager
      ? entityManager.getRepository(Address)
      : this.dataSource.getRepository(Address);
    const address = addressRepository.create({
      id: addressId,
      value: addressInput.value,
      district: districtEntity,
    });
    return addressRepository.save(address);
  }

  async getAddressesByIds(ids: string[]): Promise<Address[]> {
    return this.dataSource.getRepository(Address).find({
      where: { id: In(ids) },
      relations: ['district'],
      select: ['id'],
    });
  }

  async getAddressesBytenantId(tenantId: string): Promise<Address> {
    return this.dataSource.getRepository(Address).findOne({
      where: { tenantId },
      relations: ['district'],
    });
  }

  async getFullAddress(addressInput: AddressInput): Promise<Address> {
    const district = await this.getDistrictById(addressInput.districtId);
    if (district) {
      const address = new Address();
      address.value = addressInput.value;
      address.district = district;
      return address;
    }

    throw new NotFoundException();
  }

  async getDistrictByCriteria(
    criteria: FindOptionsWhere<District> | FindOptionsWhere<District>[],
    relations?: string[],
  ): Promise<District> {
    return this.dataSource
      .getRepository(District)
      .findOne({ where: criteria, relations });
  }

  async getDistrictById(
    id: string,
    relations?: string[],
  ): Promise<District | undefined> {
    return this.getDistrictByCriteria({ id }, relations);
  }

  async getDistricts(
    stateId?: string,
    searchTerm?: string,
    displayDisabled?: boolean,
  ): Promise<District[]> {
    const districtRepo = this.dataSource.getRepository(District);
    const query = districtRepo.createQueryBuilder('district');
    query.leftJoinAndSelect('district.state', 'state');
    if (stateId) {
      query.andWhere('district.stateId = :stateId', { stateId });
    }
    if (searchTerm) {
      query.andWhere('district.name ILIKE :searchTerm', {
        searchTerm: `${searchTerm}%`,
      });
    }
    if (!displayDisabled) {
      query.andWhere('state.isDisabled = false');
    }
    return query.getMany();
  }

  async getDistrictByIds(ids: string[]): Promise<District[]> {
    const districtRepo = this.dataSource.getRepository(District);
    return districtRepo.find({
      where: { id: In(ids) },
      relations: ['state'],
      select: ['id'],
    });
  }

  async getStateById(stateId: string): Promise<State> {
    return this.dataSource.getRepository(State).findOne({
      where: { id: stateId },
    });
  }

  async getStates(searchTerm?: string): Promise<State[]> {
    const stateRepo = this.dataSource.getRepository(State);
    if (searchTerm) {
      return stateRepo.find({
        where: {
          name: ILike(`${searchTerm}%`),
          isDisabled: false,
        },
      });
    }
    return stateRepo.find();
  }
}
