import React from 'react';
import { usePermission } from '../../features/auth/usePermission';

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { can, hasAny, hasAll } = usePermission();

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll ? hasAll(permissions) : hasAny(permissions);
  } else {
    hasAccess = true;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
