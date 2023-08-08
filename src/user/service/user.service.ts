import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager, In } from 'typeorm';
import { User } from '../entity/user.entity';
import { hash } from 'src/common/utils/password.util';
import { v4 } from 'uuid';
import { RoleService } from './role.service';
import { configuration } from 'src/common/config/app.config';
import { Pagination, UserInput, UserRoles } from 'src/schema/graphql.schema';

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(RoleService)
    private readonly roleService: RoleService,
  ) {}

  async create(tenantId: string, userInput: UserInput) {
    this.logger.log(`Creating ${userInput.email} user for tenant: ${tenantId}`);

    const { name, email, password, roleId } = userInput;
    const hashPassword = await hash(password);

    const roleEntity = roleId
      ? await this.roleService.getById(roleId)
      : undefined;

    const user: DeepPartial<User> = {
      tenantId,
      name,
      email,
      id: v4(),
      password: hashPassword,
      role: roleEntity,
    };

    const roleDetails = await this.roleService.getById(roleId);
    await this.createUserSupportedRoleCheck(
      UserRoles[roleDetails.name],
      tenantId,
    );

    const saveduser = await this.dataSource.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const userRepository = transactionalEntityManager.getRepository(User);

        const newUser = userRepository.create(user);
        await userRepository.save(user);
        return newUser;
      },
    );
    return saveduser;
  }

  async deleteUser(id: string) {
    await this.dataSource.getRepository(User).softDelete({
      id,
    });

    return 'Success';
  }

  async getUserIds(ids?: string[], relations?: string[]): Promise<User[]> {
    let where;
    ids && (where = { id: In(ids) });
    return this.dataSource.getRepository(User).find({
      where,
      relations,
      select: ['id'],
    });
  }

  async getUserByUserIdsWithDeleted(
    ids: string[],
    withDeleted = true,
  ): Promise<User[]> {
    return this.dataSource.getRepository(User).find({
      where: { id: In(ids) },
      withDeleted,
    });
  }

  async getUserById(id: string): Promise<User> {
    return this.dataSource.getRepository(User).findOneByOrFail({
      id,
    });
  }

  async getUsersByTenantId(
    tenantId: string,
    pagination: Pagination,
  ): Promise<User[]> {
    const query = this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.tenantId = :tenantId', {
        tenantId,
      });
    if (pagination) {
      query.offset(pagination.offset);
      query.limit(pagination.limit);
    }
    return query.getMany();
  }

  async getById(tenantId: string, userId: string): Promise<User> {
    const userDetails = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.tenantId = :tenantId AND user.id = :userId', {
        tenantId,
        userId,
      })
      .getOne();
    if (!userDetails) {
      throw new NotFoundException('User not found');
    }
    return userDetails;
  }

  private async createUserSupportedRoleCheck(
    userRole: UserRoles,
    tenantId: string,
  ) {
    if (tenantId !== configuration.defaultTenantId) {
      if (
        [UserRoles.ENGINEER, UserRoles.SUPER_ADMIN, UserRoles.SUPPORT].includes(
          userRole,
        )
      ) {
        throw new BadRequestException('Invalid Request');
      }
    } else if (
      [
        UserRoles.EMPLOYEE,
        UserRoles.TENANT_ADMIN,
        UserRoles.TEAMLEAD,
        UserRoles.OWNER,
      ].includes(userRole)
    ) {
      throw new BadRequestException('Invalid Request');
    }
  }
}
