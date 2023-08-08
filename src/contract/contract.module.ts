import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ContractService } from './service/contract.service';
import { ContractResolver } from './resolver/contract.resolver';
import { ProductService } from './service/product.service';
import { ProductResolver } from './resolver/product.resolver';
import { ContractProductService } from './service/contract.product.service';
import { ContractProductLoader } from './loader/contract.product.loader';

@Module({
  imports: [CommonModule],
  providers: [
    ContractService,
    ContractResolver,
    ProductService,
    ProductResolver,
    ContractProductLoader,
    ContractProductService,
    ContractProductLoader,
  ],
  exports: [],
})
export class ContractModule {}
