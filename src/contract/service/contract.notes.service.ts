import { Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial } from 'typeorm';
import { v4 } from 'uuid';
import { ContractNotes } from '../entity/contract.notes.entity';
import { ContractNotesInput } from 'src/schema/graphql.schema';

@Injectable()
export class ContractNotesService {
  private logger: Logger = new Logger(ContractNotesService.name);

  constructor(private readonly dataSource: DataSource) {}

  async createContractNotes(
    contractNotesInput: ContractNotesInput,
  ): Promise<ContractNotes> {
    const contractNotesRepository =
      this.dataSource.getRepository(ContractNotes);
    const contractNotes: DeepPartial<ContractNotes> = {
      id: v4(),
      contractId: contractNotesInput.contractId,
      remark: contractNotesInput.remark,
    };
    return contractNotesRepository.save(contractNotes);
  }

  async deleteContractNotes(contractNotesId: string) {
    return this.dataSource
      .getRepository(ContractNotes)
      .softDelete(contractNotesId);
  }

  async getAllContractNotes(contractId: string) {
    return this.dataSource
      .getRepository(ContractNotes)
      .createQueryBuilder('contractNotes')
      .where('contractNotes.contractId = :contractId', { contractId })
      .orderBy('contractNotes.createdAt', 'DESC')
      .getMany();
  }
}
