import { Inject } from '@nestjs/common';
import { AddressService } from '../service/address.service';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { District } from 'src/schema/graphql.schema';

@Resolver('District')
export class DistrictResolver {
  constructor(
    @Inject(AddressService)
    private readonly addressService: AddressService,
  ) {}

  @ResolveField()
  async state(@Parent() district: District) {
    const settings = await this.addressService.getStateById(district.stateId);
    return settings;
  }
}
