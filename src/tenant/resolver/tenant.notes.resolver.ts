import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { TenantNotes, TenantNotesInput } from 'src/schema/graphql.schema';
import { TenantNotesService } from '../service/tenant.note.service';
import { Inject, ParseUUIDPipe } from '@nestjs/common';

@Resolver('TenantNotes')
export class TenantNotesResolver {
  constructor(
    @Inject(TenantNotesService)
    private readonly tenantNotesService: TenantNotesService,
  ) {}
  @Mutation()
  createTenantNotes(
    @Args('input') tenantNotesInput: TenantNotesInput,
  ): Promise<TenantNotes> {
    return this.tenantNotesService.createTenantNotes(tenantNotesInput);
  }

  @Mutation()
  async deleteTenantNotes(
    @Args('input') tenantNoteId: string,
  ): Promise<string> {
    await this.tenantNotesService.deleteTenantNotes(tenantNoteId);
    return 'Success';
  }

  @Query()
  getTenantNotes(
    @Args('id', ParseUUIDPipe) tenantId: string,
  ): Promise<TenantNotes[]> {
    return this.tenantNotesService.getAllTenantNotes(tenantId);
  }
}
