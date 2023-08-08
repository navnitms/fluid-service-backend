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

@Resolver('Contract')
export class ContractResolver {
  constructor(
    @Inject(ContractService)
    private readonly contractService: ContractService,
    @Inject(ContractProductLoader)
    private readonly contractProductLoader: ContractProductLoader,
  ) {}

  @Mutation()
  createContract(
    @Args('input') contractInput: CreateContractInput,
  ): Promise<ContractEntity> {
    return this.contractService.createContract(contractInput);
  }

  @Query()
  getAllContracts(
    @Args('tenantId') id: string,
    @Args('pagination') pagination: Pagination,
  ): Promise<ContractEntity[]> {
    return this.contractService.getContractByTenantId(
      '2fc6cb8f-0a91-4d51-864a-aac61b2bd25b',
      pagination.offset,
      pagination.limit,
    );
  }

  @ResolveField()
  async contractProducts(@Parent() contract: ContractEntity) {
    return this.contractProductLoader
      .getContractProductLoader()
      .load(contract.id);
  }
}
