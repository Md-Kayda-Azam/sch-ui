import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';
import {
  useGetFeeGroupsQuery,
  useCreateFeeGroupMutation,
  useUpdateFeeGroupMutation,
  useUpdateFeeGroupStatusMutation,
  useGetFeesQuery,
  useCreateFeeMutation,
  useUpdateFeeMutation,
  useUpdateFeeStatusMutation,
} from '../../features/api/apiSlice';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Switch } from '../../components/ui/Switch';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { RadioGroup } from '../../components/ui/Radio';
import {
  Plus,
  Receipt,
  Layers,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { FeeGroup, Fee } from '../../types';
import { toast } from 'react-hot-toast';

/* ------------------------------------------------------------------ */
/* Fee Group Type Enum (mirrors backend FeeGroupType)                 */
/* ------------------------------------------------------------------ */

export enum FeeGroupType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  QUARTERLY = 'QUARTERLY',
  HALF_YEARLY = 'HALF_YEARLY',
  ADMISSION = 'ADMISSION',
  REGISTRATION = 'REGISTRATION',
  TUITION = 'TUITION',
  EXAM = 'EXAM',
  TEST = 'TEST',
  TRANSPORT = 'TRANSPORT',
  HOSTEL = 'HOSTEL',
  LIBRARY = 'LIBRARY',
  LABORATORY = 'LABORATORY',
  SPORTS = 'SPORTS',
  CULTURAL = 'CULTURAL',
  DEVELOPMENT = 'DEVELOPMENT',
  MAINTENANCE = 'MAINTENANCE',
  CERTIFICATE = 'CERTIFICATE',
  GRADUATION = 'GRADUATION',
  OTHER = 'OTHER',
}

const FEE_GROUP_TYPE_OPTIONS = [
  { value: FeeGroupType.MONTHLY, label: 'Monthly' },
  { value: FeeGroupType.YEARLY, label: 'Yearly' },
  { value: FeeGroupType.QUARTERLY, label: 'Quarterly' },
  { value: FeeGroupType.HALF_YEARLY, label: 'Half Yearly' },
  { value: FeeGroupType.ADMISSION, label: 'Admission' },
  { value: FeeGroupType.REGISTRATION, label: 'Registration' },
  { value: FeeGroupType.TUITION, label: 'Tuition' },
  { value: FeeGroupType.EXAM, label: 'Exam' },
  { value: FeeGroupType.TEST, label: 'Test' },
  { value: FeeGroupType.TRANSPORT, label: 'Transport' },
  { value: FeeGroupType.HOSTEL, label: 'Hostel' },
  { value: FeeGroupType.LIBRARY, label: 'Library' },
  { value: FeeGroupType.LABORATORY, label: 'Laboratory' },
  { value: FeeGroupType.SPORTS, label: 'Sports' },
  { value: FeeGroupType.CULTURAL, label: 'Cultural' },
  { value: FeeGroupType.DEVELOPMENT, label: 'Development' },
  { value: FeeGroupType.MAINTENANCE, label: 'Maintenance' },
  { value: FeeGroupType.CERTIFICATE, label: 'Certificate' },
  { value: FeeGroupType.GRADUATION, label: 'Graduation' },
  { value: FeeGroupType.OTHER, label: 'Other' },
];

const FEE_FREQUENCY_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'ONE_TIME', label: 'One-Time' },
];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export const FeeStructurePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fee');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingItem, setDeletingItem] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Fee item form state
  const [feeForm, setFeeForm] = useState({
    code: '',
    name: '',
    feeGroupId: '',
    amount: 1500,
    frequency: 'MONTHLY',
    isOptional: false,
  });

  // Fee group form state
  const [groupForm, setGroupForm] = useState({
    code: '',
    name: '',
    type: FeeGroupType.MONTHLY,
    description: '',
  });

  const { can } = usePermission();
  const { t } = useLanguage();

  /* -------------------- Queries -------------------- */

  const {
    data: feeGroups,
    isLoading: loadingGroups,
    refetch: refetchGroups,
  } = useGetFeeGroupsQuery();

  const {
    data: fees,
    isLoading: loadingFees,
    refetch: refetchFees,
  } = useGetFeesQuery();

  /* -------------------- Mutations -------------------- */

  const [createFeeGroup, { isLoading: creatingGroup }] =
    useCreateFeeGroupMutation();
  const [updateFeeGroup, { isLoading: updatingGroup }] =
    useUpdateFeeGroupMutation();

  const [updateFeeGroupStatus] = useUpdateFeeGroupStatusMutation();

  const [createFee, { isLoading: creatingFee }] = useCreateFeeMutation();
  const [updateFee, { isLoading: updatingFee }] = useUpdateFeeMutation();
  const [updateFeeStatus] = useUpdateFeeStatusMutation();

  /* -------------------- Helpers -------------------- */

  const resetForms = () => {
    setFeeForm({
      code: '',
      name: '',
      feeGroupId: '',
      amount: 1500,
      frequency: 'MONTHLY',
      isOptional: false,
    });
    setGroupForm({
      code: '',
      name: '',
      type: FeeGroupType.MONTHLY,
      description: '',
    });
    setEditingId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForms();
  };

  const handleOpenCreate = () => {
    resetForms();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    if (activeTab === 'fee') {
      setFeeForm({
        code: item.code || '',
        name: item.name || '',
        feeGroupId: item.feeGroupId ? String(item.feeGroupId) : '',
        amount: item.amount ? Number(item.amount) : 0,
        frequency: item.frequency || 'MONTHLY',
        isOptional: !!item.isOptional,
      });
    } else if (activeTab === 'fee_group') {
      setGroupForm({
        code: item.code || '',
        name: item.name || '',
        type: item.type || FeeGroupType.MONTHLY,
        description: item.description || '',
      });
    }
    setIsModalOpen(true);
  };

  const refetchCurrent = () => {
    if (activeTab === 'fee') refetchFees();
    else if (activeTab === 'fee_group') refetchGroups();
  };

  /* -------------------- Submit (Create / Update) -------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'fee') {
        // `code` is NOT sent — backend auto-generates on create and keeps it on update
        const payload: any = {
          name: feeForm.name.trim(),
          feeGroupId: Number(feeForm.feeGroupId),
          amount: Number(feeForm.amount),
          frequency: feeForm.frequency,
          isOptional: feeForm.isOptional,
        };

        if (editingId) {
          await updateFee({ id: editingId, data: payload } as any).unwrap();
          toast.success('Fee item updated successfully!');
        } else {
          await createFee(payload).unwrap();
          toast.success('Fee item created successfully!');
        }
      } else if (activeTab === 'fee_group') {
        // `code` is NOT sent — backend auto-generates on create and keeps it on update
        const payload: any = {
          name: groupForm.name,
          type: groupForm.type,
          description: groupForm.description,
        };

        if (editingId) {
          await updateFeeGroup({ id: editingId, data: payload } as any).unwrap();
          toast.success('Fee group updated successfully!');
        } else {
          await createFeeGroup(payload).unwrap();
          toast.success('Fee group created successfully!');
        }
      }

      closeModal();
      refetchCurrent();
    } catch (err) {
      console.error('Failed to save record:', err);
      toast.error(
        editingId ? 'Failed to update record.' : 'Failed to create record.',
      );
    }
  };

  /* -------------------- Status Toggle -------------------- */

  const handleToggleStatus = async (item: any, checked: boolean) => {
    const isActive = checked;
    try {
      if (activeTab === 'fee') {
        await updateFeeStatus({ id: item.id, isActive } as any).unwrap();
      } else if (activeTab === 'fee_group') {
        await updateFeeGroupStatus({ id: item.id, isActive } as any).unwrap();
      }
      toast.success('Status updated successfully!');
      refetchCurrent();
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update status.');
    }
  };

  /* -------------------- Delete -------------------- */

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      toast.success('Deleted successfully!');
      setDeletingItem(null);
      refetchCurrent();
    } catch (err) {
      console.error('Failed to delete:', err);
      toast.error('Failed to delete record.');
    }
  };

  /* -------------------- Reusable Action Cell -------------------- */

  const renderActions = (item: any) => {
    const canUpdate = can(`${activeTab}:update`);
    const canDelete = can(`${activeTab}:delete`);
    return (
      <div className="flex items-center justify-center gap-1">
        {canUpdate && (
          <Button
            size="sm"
            variant="ghost"
            title="Edit"
            onClick={() => handleOpenEdit(item)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
        )}
        {/* {canDelete && (
          <Button
            size="sm"
            variant="ghost"
            title="Delete"
            onClick={() =>
              setDeletingItem({ id: item.id, name: item.name })
            }
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          </Button>
        )} */}
        {!canUpdate && !canDelete && (
          <span className="text-slate-400 text-xs">—</span>
        )}
      </div>
    );
  };

  /* -------------------- Reusable Status Cell -------------------- */

  const renderStatus = (item: any) => {
    const isActive = item.isActive === true || item.status === 'ACTIVE';
    const canUpdate = can(`${activeTab}:update`);
    return (
      <div className="flex flex-col items-center gap-1.5">
        <Switch
          size="md"
          checked={isActive}
          onChange={(checked) => handleToggleStatus(item, checked)}
          className="justify-center"
          disabled={!canUpdate}
        />
      </div>
    );
  };

  /* -------------------- Columns -------------------- */

  const feeColumns: Column<Fee>[] = [
    { key: 'name', header: 'Fee Particulars', sortable: true },
    {
      key: 'code' as any,
      header: 'Code',
      align: 'center',
      render: (f: any) => (
        <span className="font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
          {f.code || '—'}
        </span>
      ),
    },
    {
      key: 'feeGroup',
      header: 'Fee Group',
      render: (f) => f.feeGroup?.name || 'General Tuition',
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      render: (f) => (
        <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100">
          ৳{Number(f.amount).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'frequency',
      header: 'Frequency',
      align: 'center',
      render: (f) => (
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
          {f.frequency}
        </span>
      ),
    },
    {
      key: 'isOptional',
      header: 'Type',
      align: 'center',
      render: (f) => (
        <Badge variant={f.isOptional ? 'warning' : 'info'}>
          {f.isOptional ? 'Optional' : 'Mandatory'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: renderStatus,
    },
    {
      key: 'actions' as any,
      header: 'Actions',
      align: 'center',
      width: '110px',
      render: renderActions,
    },
  ];

  const groupColumns: Column<FeeGroup>[] = [
    { key: 'name', header: 'Fee Group Name', sortable: true },
    {
      key: 'code' as any,
      header: 'Code',
      align: 'center',
      render: (g: any) => (
        <span className="font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
          {g.code || '—'}
        </span>
      ),
    },
    {
      key: 'type' as any,
      header: 'Type',
      align: 'center',
      render: (g: any) => (
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
          {g.type || '—'}
        </span>
      ),
    },
    { key: 'description', header: 'Description' },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: renderStatus,
    },
    {
      key: 'actions' as any,
      header: 'Actions',
      align: 'center',
      width: '110px',
      render: renderActions,
    },
  ];

  const tabs = [
    {
      id: 'fee',
      label: 'Fee Structure Items',
      icon: <Receipt className="w-4 h-4" />,
    },
    {
      id: 'fee_group',
      label: 'Fee Groups',
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  const displayFees: Fee[] = fees || [];
  const displayGroups: FeeGroup[] = feeGroups || [];

  const isSaving =
    creatingFee ||
    updatingFee ||
    creatingGroup ||
    updatingGroup;

  const currentTabLabel = activeTab === 'fee' ? 'Fee Item' : 'Fee Group';

  /* -------------------- Render -------------------- */

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('nav.allFees', 'Fee Structure & Groups')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Define tuition charges, frequencies, admission fees, and fee group
            categories
          </p>
        </div>

        {can(`${activeTab}:create`) && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreate}
          >
            Create {currentTabLabel}
          </Button>
        )}
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'fee' && (
        <DataTable
          columns={feeColumns}
          data={displayFees}
          isLoading={loadingFees}
          onRefresh={refetchFees}
          rowKey={(f) => f.id}
          searchPlaceholder="Search fee items..."
        />
      )}

      {activeTab === 'fee_group' && (
        <DataTable
          columns={groupColumns}
          data={displayGroups}
          isLoading={loadingGroups}
          onRefresh={refetchGroups}
          rowKey={(g) => g.id}
          searchPlaceholder="Search fee groups..."
        />
      )}

      {/* -------------------------------------------------------- */}
      {/* Create / Edit Modal (Adaptive)                            */}
      {/* -------------------------------------------------------- */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingId
            ? `Edit ${currentTabLabel}`
            : `Create ${currentTabLabel}`
        }
        subtitle={
          activeTab === 'fee'
            ? 'Configure fee name, assigned parent group, financial rate, and billing cadence'
            : 'Create an umbrella financial category for grouping specific fees'
        }
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ---------- Fee Item Form ---------- */}
          {activeTab === 'fee' && (
            <>
              {/* Code — only shown on edit, disabled */}
              {editingId && (
                <Input
                  label="Fee Code"
                  value={feeForm.code}
                  disabled
                  helperText="Auto-generated. Cannot be changed."
                />
              )}

              <Input
                label="Fee Particular Name"
                value={feeForm.name}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, name: e.target.value })
                }
                placeholder="e.g. Monthly Tuition Fee"
                required
              />

              <Select
                label="Fee Group"
                value={feeForm.feeGroupId}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, feeGroupId: e.target.value })
                }
                options={displayGroups.map((g) => ({
                  value: g.id,
                  label: g.name,
                }))}
                placeholder="Select a fee group"
                required
              />

              <Input
                label="Standard Amount (৳)"
                type="number"
                value={feeForm.amount}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, amount: Number(e.target.value) })
                }
                placeholder="1500"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Billing Cadence <span className="text-rose-500">*</span>
                </label>
                <RadioGroup
                  name="frequency"
                  variant="pills"
                  value={feeForm.frequency}
                  onChange={(v) =>
                    setFeeForm({ ...feeForm, frequency: v as any })
                  }
                  options={FEE_FREQUENCY_OPTIONS}
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="checkbox"
                  checked={feeForm.isOptional}
                  onChange={(e) =>
                    setFeeForm({ ...feeForm, isOptional: e.target.checked })
                  }
                  className="rounded text-blue-600"
                />
                <span>Mark as Optional Fee</span>
              </label>
            </>
          )}

          {/* ---------- Fee Group Form ---------- */}
          {activeTab === 'fee_group' && (
            <>
              {/* Code — only shown on edit, disabled */}
              {editingId && (
                <Input
                  label="Fee Group Code"
                  value={groupForm.code}
                  disabled
                  helperText="Auto-generated. Cannot be changed."
                />
              )}

              <Input
                label="Group Name"
                value={groupForm.name}
                onChange={(e) =>
                  setGroupForm({ ...groupForm, name: e.target.value })
                }
                placeholder="e.g. Monthly Tuition Fees"
                required
              />

              <Select
                label="Fee Group Type"
                value={groupForm.type}
                onChange={(e) =>
                  setGroupForm({ ...groupForm, type: e.target.value as FeeGroupType })
                }
                options={FEE_GROUP_TYPE_OPTIONS}
                placeholder="Select fee group type"
                required
              />

              <Textarea
                label="Description (Optional)"
                value={groupForm.description}
                onChange={(e) =>
                  setGroupForm({ ...groupForm, description: e.target.value })
                }
                placeholder="Brief categorization and audit scope notes"
                rows={3}
              />
            </>
          )}

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSaving}>
              {editingId ? 'Update Record' : 'Save Record'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* -------------------------------------------------------- */}
      {/* Delete Confirmation Modal                                 */}
      {/* -------------------------------------------------------- */}
      <Modal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        title="Confirm Delete"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-rose-800 dark:text-rose-200">
              <p className="font-semibold">This action cannot be undone.</p>
              <p className="mt-1 text-xs">
                Are you sure you want to delete{' '}
                <span className="font-bold">{deletingItem?.name}</span>? All
                associated data may be affected.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setDeletingItem(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={handleConfirmDelete}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};