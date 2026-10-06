import { useSelector } from 'react-redux';

import { RootState } from '../../app/store';

export const usePermission = () => {
  const {
    permissions,
    isSuperAdmin,
    role,
    roleId,
    user,
  } = useSelector(
    (state: RootState) => state.auth,
  );

  // ========================================================
  // DEBUG
  // ========================================================

  // console.log(
  //   '[usePermission] Role:',
  //   user,
  // );

  // console.log(
  //   '[usePermission] Role:',
  //   role,
  // );

  // console.log(
  //   '[usePermission] Role ID:',
  //   roleId,
  // );

  // console.log(
  //   '[usePermission] Permissions:',
  //   permissions,
  // );

  // ========================================================
  // CAN
  // ========================================================

  const can = (
    permission: string,
  ): boolean => {
    // SUPER ADMIN
    if (
      isSuperAdmin ||
      role === 'SUPER_ADMIN' ||
      roleId === 1
    ) {
      return true;
    }

    // No permissions
    if (
      !permissions ||
      permissions.length === 0
    ) {
      return false;
    }

    // Exact permission
    return (
      permissions.includes(permission) ||
      permissions.includes('*')
    );
  };

  // ========================================================
  // HAS ANY
  // ========================================================

  const hasAny = (
    permissionList: string[],
  ): boolean => {
    if (
      isSuperAdmin ||
      role === 'SUPER_ADMIN' ||
      roleId === 1
    ) {
      return true;
    }

    return permissionList.some(
      (permission) =>
        can(permission),
    );
  };

  // ========================================================
  // HAS ALL
  // ========================================================

  const hasAll = (
    permissionList: string[],
  ): boolean => {
    if (
      isSuperAdmin ||
      role === 'SUPER_ADMIN' ||
      roleId === 1
    ) {
      return true;
    }

    return permissionList.every(
      (permission) =>
        can(permission),
    );
  };

  return {
    can,
    hasAny,
    hasAll,

    isSuperAdmin,

    role,

    roleId,

    permissions,

    user,
  };
};