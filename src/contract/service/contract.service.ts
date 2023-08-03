import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { Contract } from '../entity/contract.entity';
import { ContractStatus, CreateContractInput } from 'src/schema/graphql.schema';
import { v4 } from 'uuid';
import { ContractProduct } from '../entity/contract.product.entity';

@Injectable()
export class ContractService {
  private logger: Logger = new Logger(ContractService.name);

  constructor(private readonly dataSource: DataSource) {}

  async createContract(contractInput: CreateContractInput): Promise<Contract> {
    const { contractProductIds, ...contractInputDetails } = contractInput;

    const contract: DeepPartial<Contract> = {
      id: v4(),
      ...contractInputDetails,
    };
    if (contractInputDetails.startDate > contractInputDetails.endDate) {
      throw new BadRequestException('End date cannot be before start date');
    }
    if (contractInputDetails.startDate <= new Date()) {
      contract.status = ContractStatus.ACTIVE;
    }
    const contractProductData = contractInput.contractProductIds?.map(
      (productId) => {
        const contractProduct: DeepPartial<ContractProduct> = {
          contractId: contract.id,
          productId,
        };
        return contractProduct;
      },
    );

    const savedContract = await this.dataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const contractRepository =
          transactionalEntityManager.getRepository(Contract);
        const contractProductRepository =
          transactionalEntityManager.getRepository(ContractProduct);
        const newcontract = contractRepository.create(contract);
        await contractRepository.save(contract);
        if (contractProductData) {
          await contractProductRepository.save(contractProductData);
        }
        return newcontract;
      },
    );

    return savedContract;
  }

  async getContractById(contractId: string): Promise<Contract> {
    const contractRepo = this.dataSource.getRepository(Contract);
    return contractRepo.findOneOrFail({ where: { id: contractId } });
  }

  async getContractByTenantId(
    tenantId: string,
    offset?: number,
    limit?: number,
  ): Promise<Contract[]> {
    const contractRepo = this.dataSource.getRepository(Contract);
    return contractRepo
      .createQueryBuilder('contract')
      .where({ tenantId })
      .orderBy('contract.endDate', 'DESC')
      .offset(offset)
      .limit(limit)
      .getMany();
  }
}
