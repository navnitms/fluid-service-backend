import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, DeepPartial, EntityManager, In } from 'typeorm';
import { User } from '../entity/user.entity';
import { comparePass, hash } from 'src/common/utils/password.util';
import { v4 } from 'uuid';
import { RoleService } from './role.service';
import { configuration } from 'src/common/config/app.config';
import {
  OperationType,
  Pagination,
  UserInput,
  UserRoles,
} from 'src/schema/graphql.schema';
import { RolePermissionService } from './role.permission.service';
import RolePermission from '../entity/role.permission.entity';
import { PermissionService } from './permission.service';
import Role from '../entity/role.entity';
import { PermissionNotFoundException } from 'src/auth/exception/auth.exception';

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(RoleService)
    private readonly roleService: RoleService,
    @Inject(PermissionService)
    private readonly permissionService: PermissionService,
    @Inject(RolePermissionService)
    private readonly rolePermissionService: RolePermissionService,
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

  async loginUser(email: string, password: string) {
    let user: User;
    try {
      const userRepository = this.dataSource.getRepository(User);
      user = await userRepository.findOneOrFail({
        where: { email },
      });
      if (!(await comparePass(password, user.password))) {
        throw new NotFoundException('Invalid Email Or Password');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('Invalid Email Or Password');
    }
  }

  async verifyAndFetchUserPermissions(
    id: string,
    permissionToVerify: string[],
    operation: OperationType = OperationType.AND,
  ): Promise<{ verified: boolean; userPermissions: string[] }> {
    const allPermissionsOfUser = await this.getAllUserpermissionIds(id);
    const verified = await this.verifyUserPermissions(
      id,
      permissionToVerify,
      operation,
      allPermissionsOfUser,
    );
    return {
      verified,
      userPermissions: [...allPermissionsOfUser],
    };
  }

  async verifyUserPermissions(
    id: string,
    permissionToVerify: string[],
    operation: OperationType = OperationType.AND,
    allPermissionsOfUser?: Set<string>,
  ): Promise<boolean> {
    // const permissionsRequired = (
    //   await Promise.all(
    //     permissionToVerify.map((p) =>
    //       this.permissionService.getPermissionByName(p),
    //     ),
    //   )
    // ).flat(1);

    // if (permissionsRequired.length !== permissionToVerify.length) {
    //   const validPermissions = new Set(permissionsRequired.map((p) => p.name));
    //   throw new PermissionNotFoundException(
    //     permissionToVerify.filter((p) => !validPermissions.has(p)).toString(),
    //   );
    // }
    // ToDo Change after implementing cache
    const permissionsRequired = permissionToVerify;
    allPermissionsOfUser = allPermissionsOfUser
      ? allPermissionsOfUser
      : await this.getAllUserpermissionIds(id);
    if (!allPermissionsOfUser) {
      allPermissionsOfUser = new Set();
    }
    const requiredPermissionsWithUser = permissionsRequired
      .map((x) => x)
      .filter((x) => (allPermissionsOfUser as Set<string>).has(x));
    switch (operation) {
      case OperationType.AND:
        return (
          permissionsRequired.length > 0 &&
          requiredPermissionsWithUser.length === permissionsRequired.length
        );
      case OperationType.OR:
        return requiredPermissionsWithUser.length > 0;
      default:
        return false;
    }
  }

  async getUserRoleByUserId(userId: string): Promise<Role> {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId }, relations: ['role'] });
    return user.role;
  }

  private async getAllUserpermissionIds(id: string): Promise<Set<string>> {
    const userRole = await this.getUserRoleByUserId(id);
    // To Do Use After implementing Cache

    // const groupPermissions: RolePermission[] = (
    //   await this.rolePermissionService.getPermissionByRoleId(userRole.id)
    // ).flat(1);
    // const permissionIds = groupPermissions.map((x) => x.permissionId);
    // return new Set(permissionIds);

    const permissions =
      await this.rolePermissionService.getRolePermissionFromEnum(userRole);

    return new Set(permissions);
  }
}
