import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Contract as ContractEntity } from '../entity/contract.entity';
import { ContractService } from '../service/contract.service';
import { CreateContractInput, Pagination } from 'src/schema/graphql.schema';
import { ContractProductLoader } from '../loader/contract.product.loader';
import TenantLoader from 'src/tenant/loader/tenant.loader';

@Resolver('Contract')
export class ContractResolver {
  constructor(
    @Inject(ContractService)
    private readonly contractService: ContractService,
    @Inject(ContractProductLoader)
    private readonly contractProductLoader: ContractProductLoader,
    @Inject(TenantLoader)
    private readonly tenantLoader: TenantLoader,
  ) {}

  @Mutation()
  createContract(
    @Args('input') contractInput: CreateContractInput,
  ): Promise<ContractEntity> {
    return this.contractService.createContract(contractInput);
  }

  @Query()
  getAllContracts(
    @Args('tenantId') tenantId: string,
    @Args('pagination') pagination?: Pagination,
  ): Promise<ContractEntity[]> {
    return this.contractService.getContractByTenantId(
      tenantId,
      pagination?.offset,
      pagination?.limit,
    );
  }

  @ResolveField()
  async contractProducts(@Parent() contract: ContractEntity) {
    return this.contractProductLoader
      .getContractProductLoader()
      .load(contract.id);
  }

  @ResolveField()
  async tenant(@Parent() contract: ContractEntity) {
    if (contract.tenantId) {
      return this.tenantLoader.getTenantsLoader().load(contract.tenantId);
    }
  }
}
