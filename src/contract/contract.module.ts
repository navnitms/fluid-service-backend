import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ContractService } from './service/contract.service';
import { ContractResolver } from './resolver/contract.resolver';
import { ProductService } from './service/product.service';
import { ProductResolver } from './resolver/product.resolver';
import { ContractProductService } from './service/contract.product.service';
import { ContractProductLoader } from './loader/contract.product.loader';
import { TenantModule } from 'src/tenant/tenant.module';
import { ProductSummaryresolver } from './resolver/product.summary.resolver';
import ProductLoader from './loader/product.loader';

@Module({
  imports: [CommonModule, TenantModule],
  providers: [
    ContractService,
    ContractResolver,
    ProductService,
    ProductResolver,
    ProductSummaryresolver,
    ContractProductLoader,
    ContractProductService,
    ContractProductLoader,
    ProductLoader,
  ],
  exports: [ContractProductService],
})
export class ContractModule {}
