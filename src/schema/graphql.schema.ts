/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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
    ESCALATED = "ESCALATED",
    IN_PROGRESS = "IN_PROGRESS",
    ADMIN_IN_PROGRESS = "ADMIN_IN_PROGRESS",
    RESOLVED = "RESOLVED",
    REOPENED = "REOPENED"
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
    contractProductIds?: Nullable<Nullable<string>[]>;
}

export interface CreateProductInput {
    name: string;
}

export interface CreateIncidentInput {
    title: string;
    description: string;
    priority?: Nullable<Priority>;
    categoryId: string;
}

export interface AddressInput {
    value: string;
    pincode?: Nullable<number>;
    districtId: string;
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
    address: AddressInput;
}

export interface TenantFilter {
    searchTerm?: Nullable<string>;
    categoryId?: Nullable<string>;
}

export interface TenantNotesInput {
    tenantId: string;
    remark: string;
}

export interface UserInput {
    name: string;
    email: string;
    password: string;
    tenantId: string;
    roleId: string;
}

export interface Contract {
    id: string;
    tenant: Tenant;
    startDate: DateTime;
    endDate: DateTime;
    status: ContractStatus;
    paymentDate?: Nullable<DateTime>;
    remark?: Nullable<string>;
    amount?: Nullable<number>;
    contractProducts?: Nullable<Nullable<ContractProduct>[]>;
}

export interface IMutation {
    createContract(input: CreateContractInput): Nullable<Contract> | Promise<Nullable<Contract>>;
    createProduct(input: CreateProductInput): Nullable<Product> | Promise<Nullable<Product>>;
    createIncident(input: CreateIncidentInput): Nullable<Incident> | Promise<Nullable<Incident>>;
    createTenant(input: TenantInput): Nullable<Tenant> | Promise<Nullable<Tenant>>;
    createTenantNotes(input: TenantNotesInput): Nullable<TenantNotes> | Promise<Nullable<TenantNotes>>;
    createUser(input: UserInput): Nullable<User> | Promise<Nullable<User>>;
}

export interface IQuery {
    getAllContracts(tenantId: string, pagination?: Nullable<Pagination>): Nullable<Nullable<Contract>[]> | Promise<Nullable<Nullable<Contract>[]>>;
    getAllIncidents(tenantId: string, pagination?: Nullable<Pagination>): Nullable<Nullable<Incident>[]> | Promise<Nullable<Nullable<Incident>[]>>;
    getTenantDetails(id: string): Nullable<Tenant> | Promise<Nullable<Tenant>>;
    getAllTenants(input?: Nullable<TenantFilter>, pagination?: Nullable<Pagination>): Nullable<Nullable<Tenant>[]> | Promise<Nullable<Nullable<Tenant>[]>>;
    getTenantNotes(id: string): Nullable<Nullable<TenantNotes>[]> | Promise<Nullable<Nullable<TenantNotes>[]>>;
    getAllRoles(): Nullable<Role>[] | Promise<Nullable<Role>[]>;
    getAllUsers(tenantId: string, pagination?: Nullable<Pagination>): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
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

export interface Test {
    current: string;
    previous: string;
}

export interface TenantNotes {
    id: string;
    remark: string;
    createdAt?: Nullable<DateTime>;
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
