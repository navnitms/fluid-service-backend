import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ContractNotes, ContractNotesInput } from 'src/schema/graphql.schema';
import { Inject, ParseUUIDPipe } from '@nestjs/common';
import { ContractNotesService } from '../service/contract.notes.service';

@Resolver('ContractNotes')
export class ContractNotesResolver {
  constructor(
    @Inject(ContractNotesService)
    private readonly contractNotesService: ContractNotesService,
  ) {}
  @Mutation()
  createContractNotes(
    @Args('input') contractNotesInput: ContractNotesInput,
  ): Promise<ContractNotes> {
    return this.contractNotesService.createContractNotes(contractNotesInput);
  }

  @Query()
  getContractNotes(
    @Args('id', ParseUUIDPipe) contractId: string,
  ): Promise<ContractNotes[]> {
    return this.contractNotesService.getAllContractNotes(contractId);
  }

  @Mutation()
  async deleteContractNotes(
    @Args('input') contractNoteId: string,
  ): Promise<string> {
    await this.contractNotesService.deleteContractNotes(contractNoteId);
    return 'Success';
  }
}
