import { Inject, Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Product } from 'src/schema/graphql.schema';
import { ProductService } from '../service/product.service';

@Injectable({ scope: Scope.REQUEST })
export default class ProductLoader {
  ProductLoader: DataLoader<string, Product>;

  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {
    this.ProductLoader = new DataLoader<string, Product>(
      this.getProductsByProductIds,
    );
  }

  getProductsByProductIds = async (productIds: readonly string[]) => {
    const products = await this.productService.getProuctByIds([...productIds]);

    const productIdToProductMap: {
      [key: string]: Product;
    } = {};
    products.forEach(
      (product) => (productIdToProductMap[product.id] = product),
    );

    const response = productIds.map(
      (productId) => productIdToProductMap[productId],
    );
    return response;
  };

  public getProductLoader(): DataLoader<string, Product> {
    return this.ProductLoader;
  }
}
