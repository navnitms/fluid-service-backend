import { Injectable, Logger } from '@nestjs/common';
import { CreateProductInput, Pagination } from 'src/schema/graphql.schema';
import { DataSource, DeepPartial, In } from 'typeorm';
import { Product } from '../entity/product.entity';
import { v4 } from 'uuid';

@Injectable()
export class ProductService {
  private logger: Logger = new Logger(ProductService.name);

  constructor(private readonly dataSource: DataSource) {}

  async createProduct(
    createProductInput: CreateProductInput,
  ): Promise<Product> {
    const { name, amount } = createProductInput;
    const product: DeepPartial<Product> = {
      id: v4(),
      name,
      amount,
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

  async getAllProducts(
    searchTerm?: string,
    pagination?: Pagination,
  ): Promise<Product[]> {
    const query = this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product');
    if (searchTerm) {
      query.where('product.name Ilike :searchTerm', { searchTerm });
    }
    if (pagination?.offset) {
      query.offset(pagination.offset);
    }
    if (pagination?.limit) {
      query.limit(pagination.limit);
    }
    return query.getMany();
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .softDelete()
      .from(Product)
      .where('id = :productId', { productId })
      .execute();
  }

  async updateProduct(id: string, amount: number) {
    await this.dataSource.getRepository(Product).update(id, { amount });
    return 'Success';
  }

  async getProuctByIds(ids: string[], withDeleted = true): Promise<Product[]> {
    return this.dataSource.getRepository(Product).find({
      where: { id: In(ids) },
      withDeleted,
    });
  }
}
