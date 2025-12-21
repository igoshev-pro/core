export const TENANT_CONNECTION = Symbol('TENANT_CONNECTION');

export const TENANT_PROJECT_ID = 'tenantProjectId';

export function getTenantModelToken(modelName: string) {
  return `TENANT_MODEL_${modelName}`;
}
