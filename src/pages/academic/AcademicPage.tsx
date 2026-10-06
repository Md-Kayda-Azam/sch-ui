import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';
import {
  useGetAcademicSessionsQuery,
  useCreateAcademicSessionMutation,
  useGetClassesQuery,
  useCreateClassMutation,
  useGetSectionsQuery,
  useCreateSectionMutation,
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateAcademicSessionMutation,
  useDeleteAcademicSessionMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useUpdateClassStatusMutation,
  useUpdateSectionStatusMutation,
  useUpdateSubjectStatusMutation,
  useUpdateAcademicSessionStatusMutation,
  useUpdateDepartmentStatusMutation,
} from '../../features/api/apiSlice';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Switch } from '../../components/ui/Switch';
import { DatePicker } from '../../components/ui/DatePicker';
import {
  Plus,
  School,
  Calendar,
  BookOpen,
  Layers,
  Award,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { AcademicSession, Class, Section, Subject, Department } from '../../types';
import { toast } from 'react-hot-toast';

/* -------------------- Auto Code Generators -------------------- */

const generateClassCode = (name: string, order: number): string => {
  const numMatch = name.match(/\d+/);
  const n = numMatch ? parseInt(numMatch[0], 10) : order;
  return `CLS-${String(n).padStart(2, '0')}`;
};

const generateSubjectCode = (name: string): string => {
  const cleaned = name.replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
  if (!cleaned) return '';
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return words.map((w) => w[0]).join('').slice(0, 4);
  return cleaned.slice(0, 3);
};

const generateDeptCode = (name: string): string => {
  const cleaned = name.replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
  if (!cleaned) return '';
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return words.map((w) => w[0]).join('').slice(0, 4);
  return cleaned.slice(0, 3);
};

/* -------------------- Component -------------------- */

export const AcademicPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('academic_session');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: number; name: string } | null>(null);

  // Form states
  const [sessionForm, setSessionForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: true,
  });
  const [classForm, setClassForm] = useState({ name: '', code: '', numericOrder: 1 });
  const [sectionForm, setSectionForm] = useState({ classId: 1, name: '', capacity: 40 });
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    shortName: '',
    isOptional: false,
  });
  const [deptForm, setDeptForm] = useState({ name: '', code: '', description: '' });

  const { can } = usePermission();
  const { t } = useLanguage();

  // Queries
  const { data: sessions, isLoading: loadingSessions, refetch: refetchSessions } =
    useGetAcademicSessionsQuery();
  const { data: classes, isLoading: loadingClasses, refetch: refetchClasses } =
    useGetClassesQuery();
  const { data: sections, isLoading: loadingSections, refetch: refetchSections } =
    useGetSectionsQuery();
  const { data: subjects, isLoading: loadingSubjects, refetch: refetchSubjects } =
    useGetSubjectsQuery();
  const { data: departments, isLoading: loadingDepts, refetch: refetchDepts } =
    useGetDepartmentsQuery();

  // Mutations - Create
  const [createSession, { isLoading: creatingSession }] = useCreateAcademicSessionMutation();
  const [createClass, { isLoading: creatingClass }] = useCreateClassMutation();
  const [createSection, { isLoading: creatingSection }] = useCreateSectionMutation();
  const [createSubject, { isLoading: creatingSubject }] = useCreateSubjectMutation();
  const [createDept, { isLoading: creatingDept }] = useCreateDepartmentMutation();

  // Mutations - Update
  const [updateSession, { isLoading: updatingSession }] = useUpdateAcademicSessionMutation();
  const [updateClass, { isLoading: updatingClass }] = useUpdateClassMutation();
  const [updateSection, { isLoading: updatingSection }] = useUpdateSectionMutation();
  const [updateSubject, { isLoading: updatingSubject }] = useUpdateSubjectMutation();
  const [updateDept, { isLoading: updatingDept }] = useUpdateDepartmentMutation();

  // Mutations - Delete
  const [deleteSession, { isLoading: deletingSession }] = useDeleteAcademicSessionMutation();
  const [deleteClass, { isLoading: deletingClass }] = useDeleteClassMutation();
  const [deleteSection, { isLoading: deletingSection }] = useDeleteSectionMutation();
  const [deleteSubject, { isLoading: deletingSubject }] = useDeleteSubjectMutation();
  const [deleteDept, { isLoading: deletingDept }] = useDeleteDepartmentMutation();

  // Mutations - Status
  const [updateSessionStatus] = useUpdateAcademicSessionStatusMutation();
  const [updateClassStatus] = useUpdateClassStatusMutation();
  const [updateSectionStatus] = useUpdateSectionStatusMutation();
  const [updateSubjectStatus] = useUpdateSubjectStatusMutation();
  const [updateDeptStatus] = useUpdateDepartmentStatusMutation();

  /* -------------------- Helpers -------------------- */

  const resetForms = () => {
    setSessionForm({ name: '', startDate: '', endDate: '', isCurrent: true });
    setClassForm({ name: '', code: '', numericOrder: (classes?.length || 0) + 1 });
    setSectionForm({ classId: classes?.[0]?.id || 1, name: '', capacity: 40 });
    setSubjectForm({ name: '', code: '', shortName: '', isOptional: false });
    setDeptForm({ name: '', code: '', description: '' });
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
    if (activeTab === 'academic_session') {
      setSessionForm({
        name: item.name || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        isCurrent: !!item.isCurrent,
      });
    } else if (activeTab === 'class') {
      setClassForm({
        name: item.name || '',
        code: item.code || '',
        numericOrder: item.numericOrder ?? item.order ?? 1,
      });
    } else if (activeTab === 'section') {
      setSectionForm({
        classId: item.classId || classes?.[0]?.id || 1,
        name: item.name || '',
        capacity: item.capacity || 40,
      });
    } else if (activeTab === 'subject') {
      setSubjectForm({
        name: item.name || '',
        code: item.code || '',
        shortName: item.shortName || '',
        isOptional: !!item.isOptional,
      });
    } else if (activeTab === 'department') {
      setDeptForm({
        name: item.name || '',
        code: item.code || '',
        description: item.description || '',
      });
    }
    setIsModalOpen(true);
  };

  const refetchCurrent = () => {
    if (activeTab === 'academic_session') refetchSessions();
    else if (activeTab === 'class') refetchClasses();
    else if (activeTab === 'section') refetchSections();
    else if (activeTab === 'subject') refetchSubjects();
    else if (activeTab === 'department') refetchDepts();
  };

  /* -------------------- Submit (Create / Update) -------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'academic_session') {
        const payload: any = {
          name: sessionForm.name,
          startDate: sessionForm.startDate,
          endDate: sessionForm.endDate,
          isCurrent: sessionForm.isCurrent,
        };
        if (editingId) {
          await updateSession({ id: editingId, data: payload } as any).unwrap();
          toast.success('Academic session updated successfully!');
        } else {
          await createSession(payload).unwrap();
          toast.success('Academic session created successfully!');
        }
      } else if (activeTab === 'class') {
        const payload: any = {
          name: classForm.name,
          code: classForm.code || generateClassCode(classForm.name, classForm.numericOrder),
          numericOrder: classForm.numericOrder,
        };
        if (editingId) {
          await updateClass({ id: editingId, data: payload } as any).unwrap();
          toast.success('Class updated successfully!');
        } else {
          await createClass(payload).unwrap();
          toast.success('Class created successfully!');
        }
      } else if (activeTab === 'section') {
        const payload: any = sectionForm;
        if (editingId) {
          await updateSection({ id: editingId, data: payload } as any).unwrap();
          toast.success('Section updated successfully!');
        } else {
          await createSection(payload).unwrap();
          toast.success('Section created successfully!');
        }
      } else if (activeTab === 'subject') {
        const payload: any = {
          name: subjectForm.name,
          code: subjectForm.code || generateSubjectCode(subjectForm.name),
          shortName: subjectForm.shortName || subjectForm.name,
          isOptional: subjectForm.isOptional,
        };
        if (editingId) {
          await updateSubject({ id: editingId, data: payload } as any).unwrap();
          toast.success('Subject updated successfully!');
        } else {
          await createSubject(payload).unwrap();
          toast.success('Subject created successfully!');
        }
      } else if (activeTab === 'department') {
        const payload: any = {
          name: deptForm.name,
          code: deptForm.code || generateDeptCode(deptForm.name),
          description: deptForm.description,
        };
        if (editingId) {
          await updateDept({ id: editingId, data: payload } as any).unwrap();
          toast.success('Department updated successfully!');
        } else {
          await createDept(payload).unwrap();
          toast.success('Department created successfully!');
        }
      }
      closeModal();
      refetchCurrent();
    } catch (err) {
      console.error('Failed to save academic entity:', err);
      toast.error(editingId ? 'Failed to update record.' : 'Failed to create record.');
    }
  };

  /* -------------------- Status Toggle -------------------- */

  const handleToggleStatus = async (item: any, checked: boolean) => {
    const isActive = checked;
    try {
      if (activeTab === 'academic_session') {
        await updateSessionStatus({ id: item.id, isActive } as any).unwrap();
      } else if (activeTab === 'class') {
        await updateClassStatus({ id: item.id, isActive } as any).unwrap();
      } else if (activeTab === 'section') {
        await updateSectionStatus({ id: item.id, isActive } as any).unwrap();
      } else if (activeTab === 'subject') {
        await updateSubjectStatus({ id: item.id, isActive } as any).unwrap();
      } else if (activeTab === 'department') {
        await updateDeptStatus({ id: item.id, isActive } as any).unwrap();
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
      if (activeTab === 'academic_session') {
        await deleteSession({ id: deletingItem.id, isActive: true } as any).unwrap();
      } else if (activeTab === 'class') {
        await deleteClass({ id: deletingItem.id, isActive: true } as any).unwrap();
      } else if (activeTab === 'section') {
        await deleteSection({ id: deletingItem.id, isActive: true } as any).unwrap();
      } else if (activeTab === 'subject') {
        await deleteSubject({ id: deletingItem.id, isActive: true } as any).unwrap();
      } else if (activeTab === 'department') {
        await deleteDept({ id: deletingItem.id, isActive: true } as any).unwrap();
      }
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
            onClick={() => setDeletingItem({ id: item.id, name: item.name })}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          </Button>
        )} */}
        {!canUpdate && !canDelete && <span className="text-slate-400 text-xs">—</span>}
      </div>
    );
  };

  /* -------------------- Reusable Status Cell -------------------- */

  const renderStatus = (item: any) => {
    const isActive = (item.isCurrent || '');
    const canUpdate = can(`${activeTab}:update`);
    return (
      <div className="flex flex-col items-center gap-1.5">
        {/* <Badge variant={isActive ? 'success' : 'neutral'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge> */}
        {canUpdate && (
          <Switch
            size="md"
            checked={isActive}
            onChange={(checked) => handleToggleStatus(item, checked)}
            className="justify-center"
          />
        )}
      </div>
    );
  };

  /* -------------------- Columns -------------------- */

  const sessionColumns: Column<AcademicSession>[] = [
    { key: 'name', header: 'Session Name', sortable: true },
    {
      key: 'startDate',
      header: 'Start Date',
      align: 'center',
      render: (s: any) => s.startDate || '—',
    },
    {
      key: 'endDate',
      header: 'End Date',
      align: 'center',
      render: (s: any) => s.endDate || '—',
    },
    {
      key: 'isCurrent',
      header: 'Current Session',
      align: 'center',
      render: (s) => (
        <Badge variant={s.isCurrent ? 'success' : 'neutral'}>
          {s.isCurrent ? 'Current Session' : 'Past Session'}
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

  const classColumns: Column<Class>[] = [
    {
      key: 'numericOrder' as any,
      header: 'Order',
      align: 'center',
      sortable: true,
      width: '80px',
      render: (c: any) => c.numericOrder ?? c.order ?? '—',
    },
    { key: 'name', header: 'Class Name', sortable: true },
    { key: 'code', header: 'Code', align: 'center' },
    // {
    //   key: 'status',
    //   header: 'Status',
    //   align: 'center',
    //   render: renderStatus,
    // },
    {
      key: 'actions' as any,
      header: 'Actions',
      align: 'center',
      width: '110px',
      render: renderActions,
    },
  ];

  const sectionColumns: Column<Section>[] = [
    { key: 'name', header: 'Section Name', sortable: true },
    {
      key: 'class',
      header: 'Assigned Class',
      render: (s) => s.class?.name || `Class ID: ${s.classId}`,
    },
    { key: 'capacity', header: 'Capacity', align: 'center', sortable: true },
    // {
    //   key: 'status',
    //   header: 'Status',
    //   align: 'center',
    //   render: renderStatus,
    // },
    {
      key: 'actions' as any,
      header: 'Actions',
      align: 'center',
      width: '110px',
      render: renderActions,
    },
  ];

  const subjectColumns: Column<Subject>[] = [
    { key: 'name', header: 'Subject Name', sortable: true },
    { key: 'code', header: 'Subject Code', align: 'center' },
    {
      key: 'shortName' as any,
      header: 'Short Name',
      align: 'center',
      render: (sub: any) => sub.shortName || '—',
    },
    {
      key: 'isOptional' as any,
      header: 'Optional',
      align: 'center',
      render: (sub: any) => (
        <Badge variant={sub.isOptional ? 'warning' : 'neutral'}>
          {sub.isOptional ? 'Optional' : 'Core'}
        </Badge>
      ),
    },
    // {
    //   key: 'status',
    //   header: 'Status',
    //   align: 'center',
    //   render: renderStatus,
    // },
    {
      key: 'actions' as any,
      header: 'Actions',
      align: 'center',
      width: '110px',
      render: renderActions,
    },
  ];

  const deptColumns: Column<Department>[] = [
    { key: 'name', header: 'Department Name', sortable: true },
    { key: 'code', header: 'Code', align: 'center' },
    {
      key: 'description' as any,
      header: 'Description',
      render: (d: any) => d.description || '—',
    },
    // {
    //   key: 'status',
    //   header: 'Status',
    //   align: 'center',
    //   render: renderStatus,
    // },
    {
      key: 'actions' as any,
      header: 'Actions',
      align: 'center',
      width: '110px',
      render: renderActions,
    },
  ];

  const tabs = [
    { id: 'academic_session', label: 'Academic Sessions', icon: <Calendar className="w-4 h-4" /> },
    { id: 'class', label: 'Classes', icon: <School className="w-4 h-4" /> },
    { id: 'section', label: 'Sections', icon: <Layers className="w-4 h-4" /> },
    { id: 'subject', label: 'Subjects', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'department', label: 'Departments', icon: <Award className="w-4 h-4" /> },
  ];

  const isSaving =
    creatingSession ||
    creatingClass ||
    creatingSection ||
    creatingSubject ||
    creatingDept ||
    updatingSession ||
    updatingClass ||
    updatingSection ||
    updatingSubject ||
    updatingDept;

  const isDeleting =
    deletingSession || deletingClass || deletingSection || deletingSubject || deletingDept;

  const currentTabLabel =
    tabs.find((t) => t.id === activeTab)?.label.slice(0, -1) || 'Item';

  /* -------------------- Render -------------------- */

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('nav.academic', 'Academic Management')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure institutional taxonomy: sessions, classes, sections, subjects, and
            departments
          </p>
        </div>

        {can(`${activeTab}:create`) && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreate}
          >
            Add {currentTabLabel}
          </Button>
        )}
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'academic_session' && (
        <DataTable
          columns={sessionColumns}
          data={
            sessions || []
          }
          isLoading={loadingSessions}
          onRefresh={refetchSessions}
          rowKey={(s) => s.id}
          searchPlaceholder="Search academic sessions..."
        />
      )}

      {activeTab === 'class' && (
        <DataTable
          columns={classColumns}
          data={
            classes || []
          }
          isLoading={loadingClasses}
          onRefresh={refetchClasses}
          rowKey={(c) => c.id}
          searchPlaceholder="Search classes..."
        />
      )}

      {activeTab === 'section' && (
        <DataTable
          columns={sectionColumns}
          data={
            sections || []
          }
          isLoading={loadingSections}
          onRefresh={refetchSections}
          rowKey={(s) => s.id}
          searchPlaceholder="Search sections..."
        />
      )}

      {activeTab === 'subject' && (
        <DataTable
          columns={subjectColumns}
          data={
            subjects || []
          }
          isLoading={loadingSubjects}
          onRefresh={refetchSubjects}
          rowKey={(s) => s.id}
          searchPlaceholder="Search subjects..."
        />
      )}

      {activeTab === 'department' && (
        <DataTable
          columns={deptColumns}
          data={
            departments || []
          }
          isLoading={loadingDepts}
          onRefresh={refetchDepts}
          rowKey={(d) => d.id}
          searchPlaceholder="Search departments..."
        />
      )}

      {/* ---------- Create / Edit Modal ---------- */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingId
            ? `Edit ${currentTabLabel}`
            : `Add New ${currentTabLabel}`
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Academic Session */}
          {activeTab === 'academic_session' && (
            <>
              <Input
                label="Session Name / Year"
                value={sessionForm.name}
                onChange={(e) => setSessionForm({ ...sessionForm, name: e.target.value })}
                placeholder="e.g. 2026"
                required
              />
              <DatePicker
                label="Start Date"
                value={sessionForm.startDate}
                onChange={(d) => setSessionForm({ ...sessionForm, startDate: d })}
                placeholder="Select session start date"
                required
              />
              <DatePicker
                label="End Date"
                value={sessionForm.endDate}
                onChange={(d) => setSessionForm({ ...sessionForm, endDate: d })}
                placeholder="Select session end date"
                required
              />
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={sessionForm.isCurrent}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, isCurrent: e.target.checked })
                  }
                  className="rounded text-blue-600"
                />
                Mark as Active Current Session
              </label>
            </>
          )}

          {/* Class */}
          {activeTab === 'class' && (
            <>
              <Input
                label="Class Name"
                value={classForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setClassForm({
                    ...classForm,
                    name,
                    code: generateClassCode(name, classForm.numericOrder),
                  });
                }}
                placeholder="e.g. Class 5"
                required
              />
              <Input
                label="Class Code"
                value={classForm.code}
                onChange={(e) => setClassForm({ ...classForm, code: e.target.value })}
                placeholder="Auto-generated"
                helperText="Auto-generated from name/number. You can edit."
              />
              <Input
                label="Display Order (numericOrder)"
                type="number"
                value={classForm.numericOrder}
                onChange={(e) => {
                  const numericOrder = Number(e.target.value);
                  setClassForm({
                    ...classForm,
                    numericOrder,
                    code: generateClassCode(classForm.name, numericOrder),
                  });
                }}
                required
              />
            </>
          )}

          {/* Section */}
          {activeTab === 'section' && (
            <>
              <Select
                label="Select Class"
                value={sectionForm.classId}
                onChange={(e) =>
                  setSectionForm({ ...sectionForm, classId: Number(e.target.value) })
                }
                options={(classes || []).map((c) => ({ value: c.id, label: c.name }))}
                required
              />
              <Input
                label="Section Name"
                value={sectionForm.name}
                onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                placeholder="e.g. A or Science"
                required
              />
              <Input
                label="Maximum Student Capacity"
                type="number"
                value={sectionForm.capacity}
                onChange={(e) =>
                  setSectionForm({ ...sectionForm, capacity: Number(e.target.value) })
                }
                required
              />
            </>
          )}

          {/* Subject */}
          {activeTab === 'subject' && (
            <>
              <Input
                label="Subject Name"
                value={subjectForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setSubjectForm({
                    ...subjectForm,
                    name,
                    code: generateSubjectCode(name),
                    shortName: subjectForm.shortName || name,
                  });
                }}
                placeholder="e.g. English"
                required
              />
              <Input
                label="Subject Code"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                placeholder="Auto-generated"
                helperText="Auto-generated from subject name. You can edit."
              />
              <Input
                label="Short Name"
                value={subjectForm.shortName}
                onChange={(e) => setSubjectForm({ ...subjectForm, shortName: e.target.value })}
                placeholder="e.g. English"
              />
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={subjectForm.isOptional}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, isOptional: e.target.checked })
                  }
                  className="rounded text-blue-600"
                />
                Mark as Optional Subject
              </label>
            </>
          )}

          {/* Department */}
          {activeTab === 'department' && (
            <>
              <Input
                label="Department Name"
                value={deptForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setDeptForm({ ...deptForm, name, code: generateDeptCode(name) });
                }}
                placeholder="e.g. Science"
                required
              />
              <Input
                label="Code"
                value={deptForm.code}
                onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                placeholder="Auto-generated"
                helperText="Auto-generated from department name. You can edit."
              />
              <Input
                label="Description"
                value={deptForm.description}
                onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                placeholder="e.g. Science Department"
              />
            </>
          )}

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSaving}>
              {editingId ? 'Update Record' : 'Save Record'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ---------- Delete Confirmation Modal ---------- */}
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
                <span className="font-bold">{deletingItem?.name}</span>? All associated data
                may be affected.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setDeletingItem(null)}>
              Cancel
            </Button>
            <Button variant="danger" type="button" isLoading={isDeleting} onClick={handleConfirmDelete}>
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};