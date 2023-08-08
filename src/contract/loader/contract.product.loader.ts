import { Inject, Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ContractProductService } from '../service/contract.product.service';
import { ContractProduct } from '../entity/contract.product.entity';

@Injectable({ scope: Scope.REQUEST })
export class ContractProductLoader {
  contractProductLoader: DataLoader<string, ContractProduct[]>;
  constructor(
    @Inject(ContractProductService)
    private readonly contractProductService: ContractProductService,
  ) {
    this.contractProductLoader = new DataLoader<string, ContractProduct[]>(
      this.getContractProductByContractIds,
    );
  }

  getContractProductByContractIds = async (contractIds: readonly string[]) => {
    const contractProducts =
      await this.contractProductService.getContractProducts([...contractIds]);

    const contractProductsMap: { [key: string]: ContractProduct[] } = {};

    contractProducts.forEach((contractProduct) => {
      if (!contractProductsMap[contractProduct.contractId]) {
        contractProductsMap[contractProduct.contractId] = [];
      }
      contractProductsMap[contractProduct.contractId].push(contractProduct);
    });
    console.log(contractProducts);
    const response: ContractProduct[][] = contractIds.map(
      (contractId) => contractProductsMap[contractId],
    );
    return response;
  };
  public getContractProductLoader(): DataLoader<string, ContractProduct[]> {
    return this.contractProductLoader;
  }
}
