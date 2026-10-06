import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { setActiveSchool } from '../../features/auth/authSlice';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';
import {
  useGetSchoolsQuery,
  useCreateSchoolMutation,
  useUpdateSchoolStatusMutation,
  useUpdateSchoolMutation,
} from '../../features/api/apiSlice';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { Building, Plus, CheckCircle, ArrowRight, Pencil, Users } from 'lucide-react';
import { School } from '../../types';
import { toast } from 'react-hot-toast';

const EMPTY_FORM = {
  name: '',
  code: '',
  address: '',
  phone: '',
  email: '',
  adminName: '',
  adminEmail: '',
  adminPhone: '',
};

export const SchoolsPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [schoolForm, setSchoolForm] = useState({ ...EMPTY_FORM });

  const dispatch = useDispatch();
  const { activeSchoolId } = useSelector((state: RootState) => state.auth);
  const { can, isSuperAdmin } = usePermission();
  const { t } = useLanguage();

  const { data: schools, isLoading, refetch } = useGetSchoolsQuery();
  const [createSchool, { isLoading: isCreating }] = useCreateSchoolMutation();
  const [updateStatus] = useUpdateSchoolStatusMutation();
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setSchoolForm({ ...EMPTY_FORM });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSchool(null);
    setSchoolForm({ ...EMPTY_FORM });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSchool({
        ...schoolForm,
        isActive: true,
      }).unwrap();
      toast.success('Institution created successfully!');
      closeAddModal();
      refetch();
    } catch (err) {
      console.error('Failed to create school:', err);
      toast.error('Failed to create institution.');
    }
  };

  const handleToggleStatus = async (school: School, checked: boolean) => {
    try {
      await updateStatus({ id: school.id, isActive: checked }).unwrap();
      toast.success('Status updated successfully!');
      refetch();
    } catch (err) {
      console.error('Failed to update school status:', err);
      toast.error('Failed to update status.');
    }
  };

  const handleOpenEdit = (school: School) => {
    setEditingSchool(school);
    setSchoolForm({
      name: school.name || '',
      code: school.code || '',
      address: school.address || '',
      phone: school.phone || '',
      email: school.email || '',
      adminName: (school as any).adminName || '',
      adminEmail: (school as any).adminEmail || '',
      adminPhone: (school as any).adminPhone || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchool) return;
    try {
      // RTK mutation shape: { id, data: Partial<School> }
      await updateSchool({
        id: editingSchool.id,
        data: {
          name: schoolForm.name,
          address: schoolForm.address,
          phone: schoolForm.phone,
          email: schoolForm.email,
        },
      }).unwrap();
      toast.success('Institution updated successfully!');
      closeEditModal();
      refetch();
    } catch (err) {
      console.error('Failed to update school:', err);
      toast.error('Failed to update institution.');
    }
  };

  const handleSwitchSchool = (school: School) => {
    dispatch(setActiveSchool({ schoolId: school.id, school }));
  };

  const columns: Column<School>[] = [
    {
      key: 'code',
      header: 'Code',
      width: '100px',
      sortable: true,
      render: (s) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {s.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Institution Name',
      sortable: true,
      render: (s) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{s.name}</span>
          <span className="block text-[11px] text-slate-400">{s.address || 'Address: N/A'}</span>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (s) => (
        <div className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
          <div>{s.phone || '+880 1711-XXXXXX'}</div>
          <div className="text-[10px] text-slate-400">{s.email || 'info@school.edu'}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (s) => {
        const isActive = s.isActive;
        const canEdit = can('school:update') || isSuperAdmin;
        return (
          <div className="flex flex-col items-center gap-1.5">
            {/* <Badge variant={isActive ? 'success' : 'neutral'}>
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge> */}
            {canEdit && (
              <Switch
                size="md"
                checked={isActive}
                onChange={(checked) => handleToggleStatus(s, checked)}
                className="justify-center"
              />
            )}
          </div>
        );
      },
    },
    {
      key: 'active',
      header: 'Active Scope',
      align: 'center',
      render: (s) =>
        s.id === activeSchoolId ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            Current School
          </span>
        ) : isSuperAdmin ? (
          <Button
            size="sm"
            variant="ghost"
            rightIcon={<ArrowRight className="w-3 h-3" />}
            onClick={() => handleSwitchSchool(s)}
          >
            Switch
          </Button>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      width: '90px',
      render: (s) =>
        can('school:update') || isSuperAdmin ? (
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Pencil className="w-3.5 h-3.5" />}
            onClick={() => handleOpenEdit(s)}
          >
            Edit
          </Button>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
  ];

  const displaySchools: School[] = schools ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('nav.schools', 'Multi-School Institutions')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Super Administrator multi-tenant management: branch isolation, configuration, and tenant scoping
          </p>
        </div>

        {can('school:create') && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Institution
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={displaySchools}
        isLoading={isLoading}
        onRefresh={refetch}
        rowKey={(s) => s.id}
        searchPlaceholder="Search institutions..."
      />

      {/* Add School Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title="Add Educational Institution"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          {/* ── Institution Information ───────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
              <Building className="w-4 h-4 text-theme-primary" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Institution Information
              </h3>
            </div>

            <Input
              label="Institution Full Name"
              value={schoolForm.name}
              onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
              placeholder="e.g. Al Madina Model School"
              required
            />

            {/* <Input
              label="Institutional EIIN / Code"
              value={schoolForm.code}
              onChange={(e) => setSchoolForm({ ...schoolForm, code: e.target.value })}
              placeholder="e.g. AMS-1001"
              required
            /> */}

            <Input
              label="Campus Address"
              value={schoolForm.address}
              onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
              placeholder="City, District"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Phone"
                value={schoolForm.phone}
                onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                placeholder="+880 1711-XXXXXX"
              />
              <Input
                label="Official Email"
                type="email"
                value={schoolForm.email}
                onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                placeholder="info@school.edu"
              />
            </div>
          </div>

          {/* ── Administrator Information ─────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
              <Users className="w-4 h-4 text-theme-primary" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Administrator Information
              </h3>
            </div>

            <Input
              label="Admin Full Name"
              value={schoolForm.adminName}
              onChange={(e) => setSchoolForm({ ...schoolForm, adminName: e.target.value })}
              placeholder="e.g. Md. Rakib Hasan"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Admin Email"
                type="email"
                value={schoolForm.adminEmail}
                onChange={(e) => setSchoolForm({ ...schoolForm, adminEmail: e.target.value })}
                placeholder="admin@school.edu"
                required
              />
              <Input
                label="Admin Phone"
                value={schoolForm.adminPhone}
                onChange={(e) => setSchoolForm({ ...schoolForm, adminPhone: e.target.value })}
                placeholder="+880 1711-XXXXXX"
                required
              />
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────── */}
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-700">
            <Button variant="ghost" type="button" onClick={closeAddModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isCreating}>
              Create School
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit School Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Update Educational Institution"
        maxWidth="lg"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* ── Institution Information ───────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
              <Building className="w-4 h-4 text-theme-primary" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Institution Information
              </h3>
            </div>

            <Input
              label="Institution Full Name"
              value={schoolForm.name}
              onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
              placeholder="e.g. Al Madina Model School"
              required
            />

            <Input
              label="Institutional EIIN / Code"
              value={schoolForm.code}
              onChange={(e) => setSchoolForm({ ...schoolForm, code: e.target.value })}
              placeholder="e.g. AMS-1001"
              disabled
            />

            <Input
              label="Campus Address"
              value={schoolForm.address}
              onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
              placeholder="City, District"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Phone"
                value={schoolForm.phone}
                onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                placeholder="+880 1711-XXXXXX"
              />
              <Input
                label="Official Email"
                type="email"
                value={schoolForm.email}
                onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                placeholder="info@school.edu"
              />
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────── */}
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-700">
            <Button variant="ghost" type="button" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isUpdating}>
              Update School
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};