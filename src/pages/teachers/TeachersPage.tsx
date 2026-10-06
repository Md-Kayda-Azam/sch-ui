import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';
import {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useUpdateTeacherStatusMutation,
  useGetTeacherAssignmentsQuery,
  useCreateTeacherAssignmentMutation,
  useGetClassesQuery,
  useGetSectionsQuery,
  useGetSubjectsQuery,
  useGetAcademicSessionsQuery,
} from '../../features/api/apiSlice';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import {
  Users,
  Plus,
  Award,
  BookOpen,
  School,
  Phone,
  Mail,
  Pencil,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Teacher, TeacherAssignment } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/app/store';

/* ------------------------------------------------------------------ */
/* Form shape                                                         */
/* ------------------------------------------------------------------ */

interface TeacherFormData {
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  phone: string;
  email: string;
  emergencyContact: string;
  address: string;
  joiningDate: string;
}

const emptyTeacherForm = (): TeacherFormData => ({
  name: '',
  designation: 'Assistant Teacher',
  qualification: 'B.Sc',
  specialization: 'Mathematics',
  phone: '',
  email: '',
  emergencyContact: '',
  address: '',
  joiningDate: new Date().toISOString().slice(0, 10),
});

/* ------------------------------------------------------------------ */

export const TeachersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isEditTeacherOpen, setIsEditTeacherOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const {
    user,
    role,
    roleId,
    activeSchool,
    isSuperAdmin,
  } = useSelector(
    (state: RootState) => state.auth,
  );

  console.log(user, "user")
  // Create form state
  const [teacherForm, setTeacherForm] = useState<TeacherFormData>(() => ({
    name: '',
    designation: 'Assistant Teacher',
    qualification: 'B.Sc',
    specialization: 'Mathematics',
    phone: '01700000000',
    email: '',
    emergencyContact: '01700000000',
    address: 'Dinajpur',
    joiningDate: '2026-01-01',
  }));

  // Edit form state
  const [editForm, setEditForm] = useState<TeacherFormData>(() =>
    emptyTeacherForm(),
  );

  const [assignForm, setAssignForm] = useState({
    teacherId: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    isClassTeacher: false,
  });

  const { can } = usePermission();
  const { t } = useLanguage();

  // Queries
  const {
    data: teachers,
    isLoading: loadingTeachers,
    refetch: refetchTeachers,
  } = useGetTeachersQuery();




  const {
    data: assignments,
    isLoading: loadingAssignments,
    refetch: refetchAssignments,
  } = useGetTeacherAssignmentsQuery();

  const { data: classes } = useGetClassesQuery();
  const { data: sections } = useGetSectionsQuery(
    assignForm.classId ? { classId: Number(assignForm.classId) } : undefined,
  );

  const { data: subjects } = useGetSubjectsQuery();
  const { data: sessions } = useGetAcademicSessionsQuery();
  const currentSession = sessions?.find((s) => s.isCurrent) || sessions?.[0];

  // Mutations
  const [createTeacher, { isLoading: isCreatingTeacher }] =
    useCreateTeacherMutation();
  const [updateTeacher, { isLoading: isUpdatingTeacher }] =
    useUpdateTeacherMutation();
  const [updateTeacherStatus] = useUpdateTeacherStatusMutation();
  const [createAssignment, { isLoading: isCreatingAssign }] =
    useCreateTeacherAssignmentMutation();

  /* ---------------------------------------------------------------- */
  /* Create                                                            */
  /* ---------------------------------------------------------------- */

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeacher({
        ...teacherForm,
        isActive: true,
      }).unwrap();
      setIsAddTeacherOpen(false);
      refetchTeachers();
    } catch (err) {
      console.error('Failed to create teacher:', err);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Edit                                                              */
  /* ---------------------------------------------------------------- */

  const openEditModal = useCallback((teacher: Teacher) => {
    setEditingTeacher(teacher);
    setEditForm({
      name: teacher.user?.name || '',
      designation: teacher.designation || '',
      qualification: teacher.qualification || '',
      specialization: teacher.specialization || '',
      phone: teacher.user?.phone || '',
      email: teacher.user?.email || '',
      emergencyContact: teacher.emergencyContact || '',
      address: teacher.address || '',
      joiningDate: teacher.joiningDate || '',
    });
    setIsEditTeacherOpen(true);
  }, []);

  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    try {
      await updateTeacher({
        id: editingTeacher.id,
        ...editForm,
      }).unwrap();
      setIsEditTeacherOpen(false);
      setEditingTeacher(null);
      refetchTeachers();
    } catch (err) {
      console.error('Failed to update teacher:', err);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Status toggle                                                     */
  /* ---------------------------------------------------------------- */

  const handleStatusToggle = async (teacher: Teacher) => {
    const nextActive = !(teacher.user?.isActive === true);
    try {
      await updateTeacherStatus({
        id: teacher.id,
        isActive: nextActive,
      }).unwrap();
      refetchTeachers();
    } catch (err) {
      console.error('Failed to update teacher status:', err);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Assignment                                                        */
  /* ---------------------------------------------------------------- */

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAssignment({
        teacherId: Number(assignForm.teacherId),
        sessionId: currentSession?.id || 1,
        classId: Number(assignForm.classId),
        sectionId: assignForm.sectionId
          ? Number(assignForm.sectionId)
          : undefined,
        subjectId: assignForm.subjectId
          ? Number(assignForm.subjectId)
          : undefined,
        isClassTeacher: assignForm.isClassTeacher,
        status: 'ACTIVE',
      }).unwrap();
      setIsAssignModalOpen(false);
      refetchAssignments();
    } catch (err) {
      console.error('Failed to create teacher assignment:', err);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Columns                                                           */
  /* ---------------------------------------------------------------- */

  const teacherColumns: Column<Teacher>[] = [
    {
      key: 'name',
      header: 'Teacher Name',
      sortable: true,
      render: (t) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {t.user?.name}
          </span>
          <span className="block text-[11px] text-slate-400">
            {t.qualification || 'Educator'}
          </span>
        </div>
      ),
    },
    {
      key: 'designation',
      header: 'Designation',
      sortable: true,
      render: (t) => (
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {t.designation}
        </span>
      ),
    },
    {
      key: 'specialization',
      header: 'Specialization',
      render: (t) => <span>{t.specialization || 'General'}</span>,
    },
    {
      key: 'phone',
      header: 'Contact',
      render: (t) => (
        <div className="min-w-[180px] space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
            <span className="tabular-nums whitespace-nowrap">
              {t.user?.phone || '—'}
            </span>
            {t.emergencyContact && (
              <>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span
                  className="tabular-nums whitespace-nowrap text-slate-500 dark:text-slate-400"
                  title="Emergency Contact"
                >
                  {t.emergencyContact}
                </span>
              </>
            )}
          </div>
          {t.user?.email && (
            <div className="flex items-center gap-2 pl-0">
              <span
                className="max-w-[180px] truncate text-[12px] text-slate-400 dark:text-slate-500"
                title={t.user.email}
              >
                {t.user.email}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'joiningDate',
      header: 'Joining Date',
      align: 'center',
      render: (t) => (
        <span className="tabular-nums text-xs">
          {t.joiningDate || '2023-01-15'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (t) => (
        <Badge variant={t.user?.isActive === true ? 'success' : 'neutral'}>
          {t.user?.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1.5">
          {can('teacher:update') && (
            <button
              type="button"
              onClick={() => openEditModal(t)}
              title="Edit Teacher"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          )}

          {can('teacher:update') && (
            <button
              type="button"
              onClick={() => handleStatusToggle(t)}
              title={
                t.user?.isActive
                  ? 'Deactivate Teacher'
                  : 'Activate Teacher'
              }
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.user?.isActive ? (
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

  const assignmentColumns: Column<TeacherAssignment>[] = [
    {
      key: 'teacher',
      header: 'Teacher',
      sortable: true,
      render: (a) => (
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {a.teacher?.user?.name || `Teacher ID: ${a.teacherId}`}
        </span>
      ),
    },
    {
      key: 'class',
      header: 'Assigned Class & Section',
      render: (a) => (
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {a.class?.name || `Class ${a.classId}`}{' '}
          {a.section ? `- ${a.section.name}` : ''}
        </span>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (a) => (
        <span className="text-slate-700 dark:text-slate-300">
          {a.subject?.name ||
            (a.isClassTeacher ? 'Class Incharge' : 'All Subjects')}
        </span>
      ),
    },
    {
      key: 'isClassTeacher',
      header: 'Class Teacher',
      align: 'center',
      render: (a) => (
        <Badge variant={a.isClassTeacher ? 'success' : 'neutral'}>
          {a.isClassTeacher ? 'Class Teacher' : 'Subject Teacher'}
        </Badge>
      ),
    },
  ];

  const tabs = [
    {
      id: 'teachers',
      label: 'All Faculty & Teachers',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'assignments',
      label: 'Class & Subject Assignments',
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  const displayTeachers: Teacher[] = teachers || [];

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('nav.teachers', 'Teachers & Staff Management')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage faculty profiles, academic credentials, and classroom
            responsibilities
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'teachers' && can('teacher:create') && (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddTeacherOpen(true)}
            >
              Add Teacher
            </Button>
          )}

          {activeTab === 'assignments' && can("teacher_assignment:create") && (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAssignModalOpen(true)}
            >
              Assign Teacher
            </Button>
          )}
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'teachers' && (
        <DataTable
          columns={teacherColumns}
          data={displayTeachers}
          isLoading={loadingTeachers}
          onRefresh={refetchTeachers}
          rowKey={(t) => t.id}
          searchPlaceholder="Search faculty by name, designation..."
        />
      )}

      {activeTab === 'assignments' && (
        <DataTable
          columns={assignmentColumns}
          data={
            assignments || [
              {
                id: 1,
                schoolId: 1,
                teacherId: 1,
                sessionId: 1,
                classId: 5,
                sectionId: 1,
                isClassTeacher: true,
                status: 'ACTIVE',
                teacher: { name: 'Mohammad Farooq' } as any,
                class: { name: 'Class 5' } as any,
                section: { name: 'A' } as any,
              },
              {
                id: 2,
                schoolId: 1,
                teacherId: 2,
                sessionId: 1,
                classId: 5,
                sectionId: 1,
                subjectId: 2,
                isClassTeacher: false,
                status: 'ACTIVE',
                teacher: { name: 'Nusrat Jahan' } as any,
                class: { name: 'Class 5' } as any,
                section: { name: 'A' } as any,
                subject: { name: 'English For Today' } as any,
              },
            ]
          }
          isLoading={loadingAssignments}
          onRefresh={refetchAssignments}
          rowKey={(a) => a.id}
          searchPlaceholder="Search teacher assignments..."
        />
      )}

      {/* -------------------------------------------------------- */}
      {/* Add Teacher Modal                                         */}
      {/* -------------------------------------------------------- */}
      <Modal
        isOpen={isAddTeacherOpen}
        onClose={() => setIsAddTeacherOpen(false)}
        title="Add Faculty Member"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTeacher} className="space-y-4">
          <Input
            label="Full Name"
            value={teacherForm.name}
            onChange={(e) =>
              setTeacherForm({ ...teacherForm, name: e.target.value })
            }
            placeholder="e.g. Md Arif"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Designation"
              value={teacherForm.designation}
              onChange={(e) =>
                setTeacherForm({
                  ...teacherForm,
                  designation: e.target.value,
                })
              }
              required
            />
            <Input
              label="Qualification"
              value={teacherForm.qualification}
              onChange={(e) =>
                setTeacherForm({
                  ...teacherForm,
                  qualification: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Specialization"
              value={teacherForm.specialization}
              onChange={(e) =>
                setTeacherForm({
                  ...teacherForm,
                  specialization: e.target.value,
                })
              }
            />
            <Input
              label="Phone Number"
              value={teacherForm.phone}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, phone: e.target.value })
              }
              placeholder="+880 1711-XXXXXX"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={teacherForm.email}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, email: e.target.value })
              }
              placeholder="teacher@school.edu"
              required
            />
            <Input
              label="Emergency Contact"
              value={teacherForm.emergencyContact}
              onChange={(e) =>
                setTeacherForm({
                  ...teacherForm,
                  emergencyContact: e.target.value,
                })
              }
              placeholder="01700000000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Address"
              value={teacherForm.address}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, address: e.target.value })
              }
              placeholder="e.g. Dinajpur"
            />
            <Input
              label="Joining Date"
              type="date"
              value={teacherForm.joiningDate}
              onChange={(e) =>
                setTeacherForm({
                  ...teacherForm,
                  joiningDate: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsAddTeacherOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isCreatingTeacher}
            >
              Save Teacher
            </Button>
          </div>
        </form>
      </Modal>

      {/* -------------------------------------------------------- */}
      {/* Edit Teacher Modal                                        */}
      {/* -------------------------------------------------------- */}
      <Modal
        isOpen={isEditTeacherOpen}
        onClose={() => {
          setIsEditTeacherOpen(false);
          setEditingTeacher(null);
        }}
        title={`Edit Teacher${editingTeacher?.user?.name ? ` — ${editingTeacher.user.name}` : ''}`}
        maxWidth="lg"
      >
        <form onSubmit={handleUpdateTeacher} className="space-y-4">
          <Input
            label="Full Name"
            value={editForm.name}
            onChange={(e) =>
              setEditForm({ ...editForm, name: e.target.value })
            }
            placeholder="e.g. Md Arif"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Designation"
              value={editForm.designation}
              onChange={(e) =>
                setEditForm({ ...editForm, designation: e.target.value })
              }
              required
            />
            <Input
              label="Qualification"
              value={editForm.qualification}
              onChange={(e) =>
                setEditForm({ ...editForm, qualification: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Specialization"
              value={editForm.specialization}
              onChange={(e) =>
                setEditForm({ ...editForm, specialization: e.target.value })
              }
            />
            <Input
              label="Phone Number"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              placeholder="+880 1711-XXXXXX"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              placeholder="teacher@school.edu"
              required
            />
            <Input
              label="Emergency Contact"
              value={editForm.emergencyContact}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  emergencyContact: e.target.value,
                })
              }
              placeholder="01700000000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Address"
              value={editForm.address}
              onChange={(e) =>
                setEditForm({ ...editForm, address: e.target.value })
              }
              placeholder="e.g. Dinajpur"
            />
            <Input
              label="Joining Date"
              type="date"
              value={editForm.joiningDate}
              onChange={(e) =>
                setEditForm({ ...editForm, joiningDate: e.target.value })
              }
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setIsEditTeacherOpen(false);
                setEditingTeacher(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isUpdatingTeacher}
            >
              Update Teacher
            </Button>
          </div>
        </form>
      </Modal>

      {/* -------------------------------------------------------- */}
      {/* Assign Teacher Modal                                      */}
      {/* -------------------------------------------------------- */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Teacher Responsibility"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <Select
            label="Select Teacher"
            value={assignForm.teacherId}
            onChange={(e) =>
              setAssignForm({ ...assignForm, teacherId: e.target.value })
            }
            options={(displayTeachers || []).map((t) => ({
              value: t.id,
              label: `${t.user.name} (${t.designation})`,
            }))}
            placeholder="Select a teacher"
            required
          />

          <Select
            label="Assign Class"
            value={assignForm.classId}
            onChange={(e) =>
              setAssignForm({
                ...assignForm,
                classId: e.target.value,
                sectionId: '',
              })
            }
            options={(classes || []).map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            placeholder="Select class"
            required
          />

          <Select
            label="Assign Section"
            value={assignForm.sectionId}
            onChange={(e) =>
              setAssignForm({ ...assignForm, sectionId: e.target.value })
            }
            options={(sections || []).map((s) => ({
              value: s.id,
              label: `Section ${s.name}`,
            }))}
            placeholder="Select section"
          />

          <Select
            label="Assign Subject"
            value={assignForm.subjectId}
            onChange={(e) =>
              setAssignForm({ ...assignForm, subjectId: e.target.value })
            }
            options={(subjects || []).map((s) => ({
              value: s.id,
              label: `${s.name} (${s.code})`,
            }))}
            placeholder="Select subject"
          />

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
            <input
              type="checkbox"
              checked={assignForm.isClassTeacher}
              onChange={(e) =>
                setAssignForm({
                  ...assignForm,
                  isClassTeacher: e.target.checked,
                })
              }
              className="rounded text-blue-600"
            />
            <span>Assign as Primary Class Teacher (In-charge)</span>
          </label>

          <div className="pt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isCreatingAssign}
            >
              Save Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};