
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum OperationType {
    AND = "AND",
    OR = "OR"
}

export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC"
}

export enum ContractStatus {
    SCHEDULED = "SCHEDULED",
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    COMPLETED = "COMPLETED",
    TERMINATED = "TERMINATED"
}

export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    VERY_HIGH = "VERY_HIGH"
}

export enum IncidentStatus {
    CREATED = "CREATED",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    REOPENED = "REOPENED",
    ASSIGNED = "ASSIGNED"
}

export enum IncidentOperation {
    INCIDENT_CREATED = "INCIDENT_CREATED",
    INCIDENT_UPDATED = "INCIDENT_UPDATED",
    INCIDENT_ESCALATED = "INCIDENT_ESCALATED",
    INCIDENT_ADMIN_ACKNOWLEDGED = "INCIDENT_ADMIN_ACKNOWLEDGED",
    INCIDENT_ACKNOWLEDGED = "INCIDENT_ACKNOWLEDGED",
    INCIDENT_RESOLVED = "INCIDENT_RESOLVED",
    INCIDENT_REOPENED = "INCIDENT_REOPENED",
    INCIDENT_ASSIGNED = "INCIDENT_ASSIGNED",
    INCIDENT_TITLE_UPDATED = "INCIDENT_TITLE_UPDATED",
    INCIDENT_DESCRIPTION_UPDATED = "INCIDENT_DESCRIPTION_UPDATED",
    INCIDENT_PRIORITY_UPDATED = "INCIDENT_PRIORITY_UPDATED"
}

export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export enum UploadType {
    INCIDENT = "INCIDENT"
}

export enum PermissionType {
    ViewAllIncidents = "ViewAllIncidents",
    AdminViewAllIncidents = "AdminViewAllIncidents",
    ViewIncident = "ViewIncident",
    AdminViewIncident = "AdminViewIncident"
}

export enum UserStatus {
    INITIATED = "INITIATED",
    INVITED = "INVITED",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    FAILED = "FAILED"
}

export enum UserRoles {
    SUPER_ADMIN = "SUPER_ADMIN",
    ENGINEER = "ENGINEER",
    SUPPORT = "SUPPORT",
    OWNER = "OWNER",
    TENANT_ADMIN = "TENANT_ADMIN",
    EMPLOYEE = "EMPLOYEE",
    TEAMLEAD = "TEAMLEAD"
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface Pagination {
    offset?: Nullable<number>;
    limit?: Nullable<number>;
}

export interface CreateContractInput {
    tenantId: string;
    startDate: DateTime;
    endDate: DateTime;
    remark?: Nullable<string>;
    amount?: Nullable<number>;
    paymentDate: DateTime;
    contractProducts?: Nullable<Nullable<ContractProductInput>[]>;
}

export interface ContractNotesInput {
    contractId: string;
    remark: string;
}

export interface ContractProductInput {
    productId: string;
    remark?: Nullable<string>;
    count?: Nullable<number>;
    productAmount?: Nullable<number>;
}

export interface CreateProductInput {
    name: string;
}

export interface CreateCommentInput {
    incidentId: string;
    text: string;
}

export interface CreateIncidentInput {
    title: string;
    description: string;
    priority: Priority;
    categoryId: string;
}

export interface GetIncidentFilter {
    searchTerm?: Nullable<string>;
    categoryId?: Nullable<string>;
    tenantId?: Nullable<string>;
    status?: Nullable<IncidentStatus>;
    priority?: Nullable<Priority>;
}

export interface AddressInput {
    value: string;
    pincode?: Nullable<number>;
    districtId: string;
}

export interface UpdateAddressInput {
    value?: Nullable<string>;
    pincode?: Nullable<number>;
    districtId?: Nullable<string>;
}

export interface DistrictInput {
    id?: Nullable<string>;
}

export interface StateInput {
    id?: Nullable<string>;
}

export interface TenantInput {
    name: string;
    categoryId: string;
    replyToEmail: string;
    autoEscalation?: Nullable<boolean>;
    phone?: Nullable<string>;
    address: AddressInput;
    shortCode: string;
}

export interface UpdateTenantInput {
    name?: Nullable<string>;
    categoryId?: Nullable<string>;
    replyToEmail?: Nullable<string>;
    autoEscalation?: Nullable<boolean>;
    phone?: Nullable<string>;
    status?: Nullable<Status>;
    address?: Nullable<UpdateAddressInput>;
}

export interface UpdateTenantSettingsInput {
    replyToEmail?: Nullable<string>;
    phone?: Nullable<string>;
    autoEscalation?: Nullable<boolean>;
}

export interface TenantFilter {
    searchTerm?: Nullable<string>;
    categoryId?: Nullable<string>;
}

export interface TenantNotesInput {
    tenantId: string;
    remark: string;
}

export interface PreSignedUrlInput {
    name: string;
    incidentId: string;
}

export interface UserInput {
    name: string;
    email: string;
    password: string;
    tenantId: string;
    roleId: string;
}

export interface Login {
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export interface Token {
    accessToken?: Nullable<string>;
    refreshToken?: Nullable<string>;
}

export interface Authentication {
    user: User;
    token: Token;
    permissions?: Nullable<Nullable<PermissionType>[]>;
}

export interface IMutation {
    login(input: LoginInput): Nullable<Authentication> | Promise<Nullable<Authentication>>;
    createContract(input: CreateContractInput): Nullable<Contract> | Promise<Nullable<Contract>>;
    createContractNotes(input: ContractNotesInput): ContractNotes | Promise<ContractNotes>;
    deleteContractNotes(contractNotesId: string): string | Promise<string>;
    createProduct(input: CreateProductInput): Nullable<Product> | Promise<Nullable<Product>>;
    createComment(input: CreateCommentInput): Comment | Promise<Comment>;
    createIncident(input: CreateIncidentInput): Nullable<Incident> | Promise<Nullable<Incident>>;
    createTenant(input: TenantInput): Tenant | Promise<Tenant>;
    updateTenant(tenantId: string, input: UpdateTenantInput): Tenant | Promise<Tenant>;
    createTenantNotes(input: TenantNotesInput): Nullable<TenantNotes> | Promise<Nullable<TenantNotes>>;
    deleteTenantNotes(tenantNotesId: string): string | Promise<string>;
    getPresignedUploadUrl(input?: Nullable<PreSignedUrlInput>): Upload | Promise<Upload>;
    createRole(name: UserRoles): Role | Promise<Role>;
    createUser(input: UserInput): Nullable<User> | Promise<Nullable<User>>;
    deleteUser(id: string): Nullable<string> | Promise<Nullable<string>>;
}

export interface Contract {
    id: string;
    shortId: string;
    tenant: Tenant;
    startDate: DateTime;
    endDate: DateTime;
    status: ContractStatus;
    paymentDate?: Nullable<DateTime>;
    remark?: Nullable<string>;
    amount?: Nullable<number>;
    contractProducts?: Nullable<Nullable<ContractProduct>[]>;
}

export interface IQuery {
    getAllContracts(tenantId: string, pagination?: Nullable<Pagination>): Nullable<Nullable<Contract>[]> | Promise<Nullable<Nullable<Contract>[]>>;
    getContractNotes(id: string): Nullable<Nullable<ContractNotes>[]> | Promise<Nullable<Nullable<ContractNotes>[]>>;
    getCommentsForIncident(incidentId: string, pagination?: Nullable<Pagination>): Nullable<Comment>[] | Promise<Nullable<Comment>[]>;
    getAllIncidents(pagination?: Nullable<Pagination>, filter?: Nullable<GetIncidentFilter>): Nullable<Nullable<Incident>[]> | Promise<Nullable<Nullable<Incident>[]>>;
    getIncidentById(incidentId: string, tenantId?: Nullable<string>): Incident | Promise<Incident>;
    getTenantDetails(id: string): Nullable<Tenant> | Promise<Nullable<Tenant>>;
    getAllTenants(input?: Nullable<TenantFilter>, pagination?: Nullable<Pagination>): Nullable<Nullable<Tenant>[]> | Promise<Nullable<Nullable<Tenant>[]>>;
    getTenantSummary(): TenantSummary | Promise<TenantSummary>;
    getTenantNotes(id: string): Nullable<Nullable<TenantNotes>[]> | Promise<Nullable<Nullable<TenantNotes>[]>>;
    getAllRoles(): Nullable<Role>[] | Promise<Nullable<Role>[]>;
    getAllUsers(tenantId: string, pagination?: Nullable<Pagination>): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    getUserById(id: string): User | Promise<User>;
}

export interface ContractNotes {
    id: string;
    remark: string;
    createdAt?: Nullable<DateTime>;
}

export interface ContractProduct {
    contract?: Nullable<Contract>;
    product?: Nullable<Product>;
    remark?: Nullable<string>;
    count?: Nullable<number>;
    productAmount?: Nullable<number>;
}

export interface Product {
    id: string;
    name: string;
    isVisible: boolean;
}

export interface Category {
    id: string;
    name: string;
    isVisible: boolean;
}

export interface Comment {
    id: string;
    text: string;
    user: User;
}

export interface Incident {
    id: string;
    shortId: string;
    title: string;
    description: string;
    priority: Priority;
    status: IncidentStatus;
    category: Category;
    tenant: Tenant;
    createdBy: User;
    assignee?: Nullable<User>;
    acknowlegedBy?: Nullable<User>;
    comments?: Nullable<Nullable<Comment>[]>;
    createdAt?: Nullable<DateTime>;
    deletedAt?: Nullable<DateTime>;
    logs?: Nullable<Nullable<IncidentLog>[]>;
}

export interface IncidentLog {
    id: string;
    user: User;
    operation: IncidentOperation;
}

export interface Address {
    id?: Nullable<string>;
    value?: Nullable<string>;
    pincode?: Nullable<number>;
    district?: Nullable<District>;
}

export interface District {
    id: string;
    name?: Nullable<string>;
    stateId?: Nullable<string>;
    state?: Nullable<State>;
}

export interface State {
    id: string;
    name?: Nullable<string>;
    isDisabled?: Nullable<boolean>;
}

export interface TenantCategory {
    id: string;
    name: string;
}

export interface TenantSettings {
    id: string;
    replyToEmail: string;
    autoEscalation?: Nullable<boolean>;
}

export interface Tenant {
    id: string;
    name: string;
    category: TenantCategory;
    address?: Nullable<Address>;
    settings?: Nullable<TenantSettings>;
    notes?: Nullable<Nullable<TenantNotes>[]>;
}

export interface TenantSummary {
    TOTAL_COUNT?: Nullable<number>;
    ACTIVE?: Nullable<number>;
    INACTIVE?: Nullable<number>;
}

export interface TenantNotes {
    id: string;
    remark: string;
    createdAt?: Nullable<DateTime>;
}

export interface Upload {
    id: string;
    url: string;
}

export interface Role {
    id?: Nullable<string>;
    name?: Nullable<string>;
    active?: Nullable<boolean>;
}

export interface UserWithToken {
    id: string;
    name: string;
    email: string;
    status: UserStatus;
    refreshToken?: Nullable<string>;
    inviteToken?: Nullable<string>;
}

export interface User {
    id: string;
    name: string;
    email: string;
    status: UserStatus;
    role?: Nullable<Role>;
}

export type DateTime = Date;
type Nullable<T> = T | null;
