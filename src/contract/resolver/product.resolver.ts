import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from 'src/schema/graphql.schema';
import { ProductService } from '../service/product.service';
import { Product as ProductEntity } from '../entity/product.entity';

@Resolver('Product')
export class ProductResolver {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  @Mutation()
  createProduct(
    @Args('input') productInput: CreateProductInput,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(productInput);
  }
}
