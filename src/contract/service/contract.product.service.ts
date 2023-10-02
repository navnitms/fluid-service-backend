import { Injectable, Logger } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { ContractProduct } from '../entity/contract.product.entity';
import { ContractStatus } from 'src/schema/graphql.schema';
import { ProductSummaryModel } from '../types/summary.type';

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

  async getProductSummary(): Promise<ProductSummaryModel[]> {
    const contractProductRepository =
      this.dataSource.getRepository(ContractProduct);

    const result = await contractProductRepository
      .createQueryBuilder('contractProduct')
      .innerJoin('contractProduct.contract', 'contract')
      .where('contract.status in (:...status)', {
        status: [ContractStatus.SCHEDULED, ContractStatus.ACTIVE],
      })
      .select([
        'contractProduct.productId as productId',
        'SUM(contractProduct.count) as totalCount',
      ])
      .groupBy('contractProduct.productId')
      .getRawMany();

    return result.map((entry) => {
      return {
        productId: entry.productid,
        count: entry.totalcount,
      };
    });
  }
}
