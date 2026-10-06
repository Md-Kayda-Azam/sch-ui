import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserStatusMutation,
  useGetSchoolsQuery,
} from '../../features/api/apiSlice';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Shield, Plus, UserCheck, UserX, Key } from 'lucide-react';
import { User } from '../../types';

export const UsersPage: React.FC = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    roleId: 2,
    schoolId: 1,
  });

  const { can } = usePermission();
  const { t } = useLanguage();

  const { data: users, isLoading: loadingUsers, refetch: refetchUsers } = useGetUsersQuery();
  const { data: schools } = useGetSchoolsQuery();

  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        ...userForm,
        status: 'ACTIVE',
      }).unwrap();
      setIsAddUserOpen(false);
      refetchUsers();
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateUserStatus({ id: user.id, status: nextStatus }).unwrap();
      refetchUsers();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Full Name',
      sortable: true,
      render: (u) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</span>
          <span className="block text-[11px] text-slate-400">{u.phone || 'Phone: N/A'}</span>
        </div>
      ),
    },
    { key: 'email', header: 'Email Address', sortable: true },
    {
      key: 'role',
      header: 'Assigned Role',
      align: 'center',
      render: (u) => (
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-blue-700 dark:text-blue-300">
          {u.role?.name || (u.roleId === 1 ? 'SUPER_ADMIN' : 'SCHOOL_ADMIN')}
        </span>
      ),
    },
    {
      key: 'school',
      header: 'Institution',
      render: (u) => u.school?.name || 'Al Madina School',
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (u) => (
        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {u.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1.5">
          {can('user:update') && (
            <button
              onClick={() => handleToggleStatus(u)}
              title={u.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {u.status === 'ACTIVE' ? (
                <UserX className="w-4 h-4 text-rose-500" />
              ) : (
                <UserCheck className="w-4 h-4 text-emerald-500" />
              )}
            </button>
          )}
        </div>
      ),
    },
  ];

  const displayUsers: User[] = users || [
    { id: 1, name: 'Dr. Tariqul Islam', email: 'superadmin@schoolcore.edu', roleId: 1, role: { id: 1, name: 'SUPER_ADMIN' }, status: 'ACTIVE' },
    { id: 2, name: 'Abdul Karim', email: 'admin@almadinaschool.edu.bd', roleId: 2, role: { id: 2, name: 'SCHOOL_ADMIN' }, schoolId: 1, school: { id: 1, name: 'Al Madina Model School', code: 'AMS' } as any, status: 'ACTIVE' },
    { id: 3, name: 'Mohammad Farooq', email: 'teacher@almadinaschool.edu.bd', roleId: 3, role: { id: 3, name: 'TEACHER' }, schoolId: 1, status: 'ACTIVE' },
    { id: 4, name: 'Kazi Mahbub', email: 'accountant@almadinaschool.edu.bd', roleId: 4, role: { id: 4, name: 'ACCOUNTANT' }, schoolId: 1, status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('nav.users', 'User Administration & Security')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage system access accounts, administrative roles, and permission assignments
          </p>
        </div>

        {can('user:create') && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddUserOpen(true)}
          >
            Create User Account
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={displayUsers}
        isLoading={loadingUsers}
        onRefresh={refetchUsers}
        rowKey={(u) => u.id}
        searchPlaceholder="Search users by name, email..."
      />

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Create Administrative User"
        maxWidth="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Full Name"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            placeholder="e.g. Kazi Mahbub"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            placeholder="user@school.edu"
            required
          />

          <Input
            label="Initial Password"
            type="password"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            required
          />

          <Input
            label="Phone Number"
            value={userForm.phone}
            onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
            placeholder="+880 1711-XXXXXX"
          />

          <Select
            label="Assigned System Role"
            value={userForm.roleId}
            onChange={(e) => setUserForm({ ...userForm, roleId: Number(e.target.value) })}
            options={[
              { value: 1, label: 'SUPER_ADMIN (Global Authority)' },
              { value: 2, label: 'SCHOOL_ADMIN (Institutional Admin)' },
              { value: 3, label: 'TEACHER (Academics & Attendance)' },
              { value: 4, label: 'ACCOUNTANT (Fee Collection & Ledgers)' },
            ]}
            required
          />

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isCreatingUser}>
              Save User Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
