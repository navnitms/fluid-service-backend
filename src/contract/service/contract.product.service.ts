import { Injectable, Logger } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { ContractProduct } from '../entity/contract.product.entity';

@Injectable()
export class ContractProductService {
  private logger: Logger = new Logger(ContractProductService.name);

  constructor(private readonly dataSource: DataSource) {}

  async getContractProductsByContractId(
    ids: string[],
  ): Promise<ContractProduct[]> {
    return this.dataSource.getRepository(ContractProduct).find({
      where: { contractId: In(ids) },
    });
  }

  async getContractProducts(ids: string[]): Promise<ContractProduct[]> {
    const test = await this.dataSource.getRepository(ContractProduct).find({
      where: { contractId: In(ids) },
      relations: ['product'],
    });
    return test;
  }
}
