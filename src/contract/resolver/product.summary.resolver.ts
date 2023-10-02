import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ProductSummaryModel } from '../types/summary.type';
import ProductLoader from '../loader/product.loader';

@Resolver('ProductSummary')
export class ProductSummaryresolver {
  constructor(private readonly productLoader: ProductLoader) {}

  @ResolveField()
  async product(@Parent() summary: ProductSummaryModel) {
    return this.productLoader.getProductLoader().load(summary.productId);
  }
}
