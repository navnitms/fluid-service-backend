import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductInput, Pagination } from 'src/schema/graphql.schema';
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

  @Mutation()
  updateProduct(
    @Args('id') id: string,
    @Args('amount') amount: number,
  ): Promise<string> {
    return this.productService.updateProduct(id, amount);
  }

  @Query()
  getProducts(
    @Args('searchTerm') searchTerm: string,
    @Args('pagination') pagination: Pagination,
  ): Promise<ProductEntity[]> {
    return this.productService.getAllProducts(searchTerm, pagination);
  }
}
