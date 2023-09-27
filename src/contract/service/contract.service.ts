import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager } from 'typeorm';
import { Contract } from '../entity/contract.entity';
import { ContractStatus, CreateContractInput } from 'src/schema/graphql.schema';
import { v4 } from 'uuid';
import { ContractProduct } from '../entity/contract.product.entity';
import { TenantSettingService } from 'src/tenant/service/tenant.setting.service';

@Injectable()
export class ContractService {
  private logger: Logger = new Logger(ContractService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(TenantSettingService)
    private readonly tenantSettingService: TenantSettingService,
  ) {}

  async createContract(contractInput: CreateContractInput): Promise<Contract> {
    const { contractProducts, ...contractInputDetails } = contractInput;
    const shortId = await this.getShortContractId(contractInput.tenantId);

    const contract: DeepPartial<Contract> = {
      id: v4(),
      shortId,
      ...contractInputDetails,
    };
    if (contractInputDetails.startDate > contractInputDetails.endDate) {
      throw new BadRequestException('End date cannot be before start date');
    }
    if (contractInputDetails.startDate <= new Date()) {
      contract.status = ContractStatus.ACTIVE;
    }
    const contractProductData = contractInput.contractProducts?.map(
      (contractProductInput) => {
        const contractProduct: DeepPartial<ContractProduct> = {
          contractId: contract.id,
          productId: contractProductInput.productId,
          count: contractProductInput.count,
          productAmount: contractProductInput.productAmount,
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
    tenantId?: string,
    offset?: number,
    limit?: number,
  ): Promise<Contract[]> {
    const contractRepo = this.dataSource.getRepository(Contract);
    const query = contractRepo.createQueryBuilder('contract');
    if (tenantId) {
      query.where('contract.tenantId = :tenantId', { tenantId });
    }
    query.orderBy('contract.endDate', 'DESC');
    if (offset) {
      query.offset(offset);
    }
    if (limit) {
      query.limit(limit);
    }
    const test = await query.getMany();
    return test;
  }

  private async getShortContractId(tenantId: string): Promise<string> {
    const tenantSettings =
      await this.tenantSettingService.getTenantSettingsByTenantId(tenantId);

    const lastContract = await this.dataSource
      .getRepository(Contract)
      .findOne({ where: { tenantId }, order: { createdAt: 'DESC' } });

    const nextNumber = lastContract
      ? parseInt(lastContract.shortId.split('-')[1]) + 1
      : 1;

    return `${tenantSettings.shortCode}-${nextNumber}`;
  }
}
