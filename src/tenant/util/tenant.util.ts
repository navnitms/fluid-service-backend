import { getNamespace } from 'cls-hooked';
import { InternalServerErrorException } from '@nestjs/common';
import { TENANT_NAMESPACE } from 'src/common/constants/app.constants';

export function getCurrentTenantId() {
  const appNameSpace = getNamespace(TENANT_NAMESPACE);
  const tenantId = appNameSpace && appNameSpace.get('tenantId');
  if (!tenantId)
    throw new InternalServerErrorException(
      'Tenant Id not set in the request context',
    );

  return tenantId;
}

export function setTenantId(tenantId: string) {
  const appNameSpace = getNamespace(TENANT_NAMESPACE);
  appNameSpace && appNameSpace.set('tenantId', tenantId);
}
