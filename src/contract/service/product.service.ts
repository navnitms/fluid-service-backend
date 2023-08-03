import { Injectable, Logger } from '@nestjs/common';
import { CreateProductInput } from 'src/schema/graphql.schema';
import { DataSource, DeepPartial } from 'typeorm';
import { Product } from '../entity/product.entity';
import { v4 } from 'uuid';

@Injectable()
export class ProductService {
  private logger: Logger = new Logger(ProductService.name);

  constructor(private readonly dataSource: DataSource) {}

  async createProduct(
    createProductInput: CreateProductInput,
  ): Promise<Product> {
    const { name } = createProductInput;
    const product: DeepPartial<Product> = {
      id: v4(),
      name,
    };
    const savedProduct = this.dataSource.getRepository(Product).save(product);
    return savedProduct;
  }

  async getActiveProducts(offset: number, limit: number): Promise<Product[]> {
    return this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where(`product.is_visible = true`)
      .offset(offset)
      .limit(limit)
      .getMany();
  }

  async getAllProducts(offset: number, limit: number): Promise<Product[]> {
    return this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .offset(offset)
      .limit(limit)
      .getMany();
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .softDelete()
      .from(Product)
      .where('id = :productId', { productId })
      .execute();
  }
}
