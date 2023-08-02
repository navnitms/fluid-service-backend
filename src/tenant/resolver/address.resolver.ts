import { Inject } from '@nestjs/common';
import { AddressService } from '../service/address.service';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Address } from 'src/schema/graphql.schema';

@Resolver('Address')
export class AddressResolver {
  constructor(
    @Inject(AddressService)
    private readonly addressService: AddressService,
  ) {}

  @ResolveField()
  async district(@Parent() address: Address) {
    console.log('enter');
    const settings = await this.addressService.getDistrictById(
      address.district.id,
    );
    return settings;
  }
}
