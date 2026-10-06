import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';

import {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useGetClassesQuery,
  useGetSectionsQuery,
  useGetAcademicSessionsQuery,
  useUpdateStudentStatusMutation,
} from '../../features/api/apiSlice';

import {
  DataTable,
  Column,
} from '../../components/tables/DataTable';

import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FilterBar } from '../../components/filters/FilterBar';
import { DatePicker } from '../../components/ui/DatePicker';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { RadioGroup } from '../../components/ui/Radio';
import { Switch } from '../../components/ui/Switch';
import { Student360Modal } from './Student360Modal';

import {
  Plus,
  Eye,
  UserCheck,
  UserX,
  GraduationCap,
  User,
  KeyRound,
  Users,
} from 'lucide-react';

import { Student } from '../../types';

/* ------------------------------------------------------------------ */
/* Guardian Relationship                                              */
/* ------------------------------------------------------------------ */

export type GuardianRelationship =
  | 'FATHER'
  | 'MOTHER'
  | 'GUARDIAN'
  | 'BROTHER'
  | 'SISTER'
  | 'GRANDFATHER'
  | 'GRANDMOTHER'
  | 'UNCLE'
  | 'AUNT'
  | 'OTHER';

/* ------------------------------------------------------------------ */
/* Form Shape                                                         */
/* ------------------------------------------------------------------ */

interface StudentAdmissionFormData {
  firstName: string;
  lastName: string;
  admissionDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  bloodGroup: string;
  nationality: string;
  religion: string;
  birthCertificateNo: string;
  previousSchool: string;
  address: string;

  guardianRelationship: GuardianRelationship;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianEmergencyContact: string;
  guardianOccupation: string;
  guardianWorkplace: string;
  guardianAddress: string;

  sessionId: string;
  classId: string;
  sectionId: string;

  sendWelcomeSms: boolean;
}

type FormErrors = Partial<Record<keyof StudentAdmissionFormData, string>>;

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const genStudentCode = () =>
  `STD-${Math.floor(1000 + Math.random() * 9000)}`;

const genAdmissionNumber = () =>
  `ADM-${new Date().getFullYear()}-${Math.floor(
    1000 + Math.random() * 9000,
  )}`;

const genRollNumber = () =>
  String(Math.floor(1 + Math.random() * 60));

const today = () => new Date().toISOString().slice(0, 10);

const buildInitialForm = (
  sessionId?: string | number,
): StudentAdmissionFormData => ({
  firstName: '',
  lastName: '',
  admissionDate: today(),
  gender: 'MALE',
  dateOfBirth: '2015-01-01',
  bloodGroup: 'B+',
  nationality: 'Bangladeshi',
  religion: 'Islam',
  birthCertificateNo: '',
  previousSchool: '',
  address: '',
  guardianRelationship: 'FATHER',
  guardianName: '',
  guardianEmail: '',
  guardianPhone: '',
  guardianEmergencyContact: '',
  guardianOccupation: '',
  guardianWorkplace: '',
  guardianAddress: '',

  sessionId: sessionId ? String(sessionId) : '',
  classId: '',
  sectionId: '',

  sendWelcomeSms: true,
});

const validateForm = (
  data: StudentAdmissionFormData,
): FormErrors => {
  const errs: FormErrors = {};

  if (!data.firstName.trim()) errs.firstName = 'First name is required';
  else if (data.firstName.trim().length < 2)
    errs.firstName = 'Minimum 2 characters';

  if (!data.lastName.trim()) errs.lastName = 'Last name is required';
  else if (data.lastName.trim().length < 2)
    errs.lastName = 'Minimum 2 characters';

  if (!data.admissionDate) errs.admissionDate = 'Admission date is required';
  if (!data.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';

  if (!data.address.trim()) errs.address = 'Address is required';

  if (!data.guardianRelationship)
    errs.guardianRelationship = 'Relationship is required';

  if (!data.guardianName.trim())
    errs.guardianName = 'Guardian name is required';
  else if (data.guardianName.trim().length < 2)
    errs.guardianName = 'Minimum 2 characters';

  if (!data.guardianPhone.trim())
    errs.guardianPhone = 'Guardian phone is required';

  if (
    data.guardianEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.guardianEmail)
  ) {
    errs.guardianEmail = 'Enter a valid email address';
  }

  if (!data.sessionId) errs.sessionId = 'Session is required';
  if (!data.classId) errs.classId = 'Class assignment is required';

  return errs;
};

/* ------------------------------------------------------------------ */
/* Static Options                                                     */
/* ------------------------------------------------------------------ */

const BLOOD_GROUP_OPTIONS = [
  { value: 'A+', label: 'A Positive (A+)' },
  { value: 'A-', label: 'A Negative (A-)' },
  { value: 'B+', label: 'B Positive (B+)' },
  { value: 'B-', label: 'B Negative (B-)' },
  { value: 'O+', label: 'O Positive (O+)' },
  { value: 'O-', label: 'O Negative (O-)' },
  { value: 'AB+', label: 'AB Positive (AB+)' },
  { value: 'AB-', label: 'AB Negative (AB-)' },
];

const RELATIONSHIP_OPTIONS = [
  { value: 'FATHER', label: 'Father' },
  { value: 'MOTHER', label: 'Mother' },
  { value: 'BROTHER', label: 'Brother' },
  { value: 'SISTER', label: 'Sister' },
  { value: 'GRANDFATHER', label: 'Grandfather' },
  { value: 'GRANDMOTHER', label: 'Grandmother' },
  { value: 'UNCLE', label: 'Uncle' },
  { value: 'AUNT', label: 'Aunt' },
  { value: 'GUARDIAN', label: 'Guardian' },
  { value: 'OTHER', label: 'Other' },
];

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

/* ------------------------------------------------------------------ */
/* Students Page                                                      */
/* ------------------------------------------------------------------ */

export const StudentsPage: React.FC = () => {
  /* ---------------------------------------------------------------- */
  /* Context                                                          */
  /* ---------------------------------------------------------------- */

  const { can } = usePermission();
  const { t } = useLanguage();

  /* ---------------------------------------------------------------- */
  /* Page State                                                       */
  /* ---------------------------------------------------------------- */

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);
  const [is360Open, setIs360Open] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  /* ---------------------------------------------------------------- */
  /* Form State                                                       */
  /* ---------------------------------------------------------------- */

  const [formData, setFormData] =
    useState<StudentAdmissionFormData>(() => buildInitialForm());
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Field updater helper */
  const updateField = useCallback(
    <K extends keyof StudentAdmissionFormData>(
      key: K,
      value: StudentAdmissionFormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setFormErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  /* ---------------------------------------------------------------- */
  /* Queries                                                          */
  /* ---------------------------------------------------------------- */

  const {
    data: students,
    isLoading,
    refetch,
  } = useGetStudentsQuery({
    classId: selectedClassId ? Number(selectedClassId) : undefined,
    sectionId: selectedSectionId
      ? Number(selectedSectionId)
      : undefined,
    status: selectedStatus || undefined,
  });

  console.log(students, "students")

  const { data: classes } = useGetClassesQuery();

  const { data: sections } = useGetSectionsQuery(
    selectedClassId ? { classId: Number(selectedClassId) } : undefined,
    { skip: !selectedClassId },
  );

  const { data: sessions } = useGetAcademicSessionsQuery();

  const currentSession =
    sessions?.find((s) => s.isCurrent) || sessions?.[0];

  /* Sections for the form's selected class */
  const { data: formSections } = useGetSectionsQuery(
    formData.classId
      ? { classId: Number(formData.classId) }
      : undefined,
    { skip: !formData.classId },
  );

  /* ---------------------------------------------------------------- */
  /* Session dropdown options                                         */
  /* ---------------------------------------------------------------- */

  const sessionOptions = useMemo(
    () =>
      (sessions || []).map((s) => ({
        value: String(s.id),
        label: `${s.name}${s.isCurrent ? ' (Current)' : ''}`,
      })),
    [sessions],
  );

  const classOptions = useMemo(
    () =>
      (classes || []).map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    [classes],
  );

  const formSectionOptions = useMemo(
    () =>
      (formSections || []).map((s) => ({
        value: String(s.id),
        label: `Section ${s.name}`,
      })),
    [formSections],
  );

  /* ---------------------------------------------------------------- */
  /* Reset form on modal open                                         */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (isAddModalOpen) {
      setFormData(buildInitialForm(currentSession?.id));
      setFormErrors({});
    }
  }, [isAddModalOpen, currentSession?.id]);

  /* Clear section when class changes */
  useEffect(() => {
    setFormData((prev) =>
      prev.sectionId
        ? { ...prev, sectionId: '' }
        : prev,
    );
  }, [formData.classId]);

  /* ---------------------------------------------------------------- */
  /* Mutations                                                        */
  /* ---------------------------------------------------------------- */

  const [createStudent] = useCreateStudentMutation();
  const [updateStatus] = useUpdateStudentStatusMutation();

  /* ---------------------------------------------------------------- */
  /* Submit                                                           */
  /* ---------------------------------------------------------------- */

  const onSubmitAdmission = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const errs = validateForm(formData);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      setIsSubmitting(true);

      const fullName =
        `${formData.firstName} ${formData.lastName}`.trim();

      const sessionId = formData.sessionId
        ? Number(formData.sessionId)
        : currentSession?.id;

      const payload = {
        name: fullName,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        fullName,

        studentCode: genStudentCode(),
        admissionNumber: genAdmissionNumber(),
        admissionDate: formData.admissionDate,

        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        nationality: formData.nationality.trim(),
        religion: formData.religion.trim(),
        birthCertificateNo: formData.birthCertificateNo.trim(),
        previousSchool: formData.previousSchool.trim(),

        address: formData.address.trim(),

        status: 'ACTIVE' as const,
        sendWelcomeSms: formData.sendWelcomeSms,

        guardian: {
          relationship: formData.guardianRelationship,
          name: formData.guardianName.trim(),
          email: formData.guardianEmail.trim(),
          phone: formData.guardianPhone.trim(),
          emergencyContact:
            formData.guardianEmergencyContact.trim(),
          occupation: formData.guardianOccupation.trim(),
          workplace: formData.guardianWorkplace.trim(),
          address: formData.guardianAddress.trim(),
        },

        ...(formData.classId &&
          sessionId && {
          enrollment: {
            sessionId,
            classId: Number(formData.classId),
            sectionId: formData.sectionId
              ? Number(formData.sectionId)
              : undefined,
            rollNumber: Number(genRollNumber()),
            isCurrent: true,
            status: 'ACTIVE' as const,
          },
        }),
      };
      console.log(payload, "payload")
      await createStudent(payload).unwrap();

      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      console.error('Failed to create student:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Status Toggle                                                    */
  /* ---------------------------------------------------------------- */

  const handleStatusToggle = async (student: Student) => {
    const nextStatus =
      student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      await updateStatus({
        id: student.id,
        status: nextStatus,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to update student status:', err);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Table Columns                                                    */
  /* ---------------------------------------------------------------- */

  const columns: Column<Student>[] = [
    {
      key: 'photo',
      header: 'Photo',
      width: '60px',
      render: (student) => (
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
          {student.firstName?.charAt(0) || 'S'}
        </div>
      ),
    },
    {
      key: 'studentCode',
      header: 'ID / Code',
      sortable: true,
      render: (student) => (
        <div>
          <span className="font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
            {student.studentCode}
          </span>
          <span className="block text-[11px] text-slate-400 tabular-nums">
            {student.admissionNumber}
          </span>
        </div>
      ),
    },
    {
      key: 'fullName',
      header: 'Full Name',
      sortable: true,
      render: (student) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {`${student.user?.name}`}
          </span>
          <span className="block text-[11px] text-slate-400">
            {student.gender} · {student.bloodGroup || 'Blood: N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'class',
      header: 'Class & Section',
      render: (student) => {
        const enrollment =
          student.enrollments?.find((item) => item.isCurrent) ||
          student.enrollments?.[0];
        return (
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {enrollment?.class?.name || 'Class 5'}
            {enrollment?.section
              ? ` - ${enrollment.section.name}`
              : ' - A'}
          </span>
        );
      },
    },
    {
      key: 'roll',
      header: 'Roll',
      align: 'center',
      render: (student) => {
        const enrollment =
          student.enrollments?.find((item) => item.isCurrent) ||
          student.enrollments?.[0];
        return (
          <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-200">
            {enrollment?.rollNumber || '01'}
          </span>
        );
      },
    },
    {
      key: 'guardian',
      header: 'Guardian',
      render: (student) => {
        const primary =
          student.studentParents?.find((item) => item.isPrimary) ||
          student.studentParents?.[0];
        const parent = primary?.parent;
        return (
          <div>
            <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">
              {parent?.name || '—'}
            </span>
            <span className="block text-[11px] text-slate-400 tabular-nums">
              {parent?.phone || '—'}
              {primary?.relationship
                ? ` · ${primary.relationship}`
                : ''}
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (student) => (
        <Badge
          variant={
            student.status === 'ACTIVE'
              ? 'success'
              : student.status === 'GRADUATED'
                ? 'info'
                : 'neutral'
          }
        >
          {student.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (student) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Eye className="w-3.5 h-3.5 text-blue-600" />}
            onClick={() => {
              setSelectedStudent(student);
              setIs360Open(true);
            }}
          >
            360° Profile
          </Button>

          {can('student:update') && (
            <button
              type="button"
              onClick={() => handleStatusToggle(student)}
              title={
                student.status === 'ACTIVE'
                  ? 'Deactivate Student'
                  : 'Activate Student'
              }
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {student.status === 'ACTIVE' ? (
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

  const displayStudents: Student[] = students || [];

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('students.title', 'Students Directory')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t(
              'students.subtitle',
              'Manage admissions, demographics, enrollments, and complete 360° student records',
            )}
          </p>
        </div>

        {can('student:create') && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            {t('students.addStudent', 'Add Student')}
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <FilterBar
        hasActiveFilters={
          !!(selectedClassId || selectedSectionId || selectedStatus)
        }
        onReset={() => {
          setSelectedClassId('');
          setSelectedSectionId('');
          setSelectedStatus('');
        }}
      >
        <select
          value={selectedClassId}
          onChange={(e) => {
            setSelectedClassId(e.target.value);
            setSelectedSectionId('');
          }}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="">All Classes</option>
          {(classes || []).map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSectionId}
          onChange={(e) => setSelectedSectionId(e.target.value)}
          disabled={!selectedClassId}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none disabled:opacity-50"
        >
          <option value="">All Sections</option>
          {(sections || []).map((item) => (
            <option key={item.id} value={item.id}>
              Section {item.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="GRADUATED">Graduated</option>
        </select>
      </FilterBar>

      {/* Students Table */}
      <DataTable
        columns={columns}
        data={displayStudents}
        isLoading={isLoading}
        onRefresh={refetch}
        rowKey={(student) => student.id}
        searchPlaceholder="Search students by name, ID, or admission no..."
        searchField={(student) =>
          `${student.fullName} ${student.studentCode} ${student.admissionNumber}`
        }
      />

      {/* Student 360 Modal */}
      <Student360Modal
        student={selectedStudent}
        isOpen={is360Open}
        onClose={() => {
          setIs360Open(false);
          setSelectedStudent(null);
        }}
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Admit New Student"
        subtitle="Create student profile with guardian info and class enrollment"
        maxWidth="2xl"
      >
        <form onSubmit={onSubmitAdmission} className="space-y-4">
          {/* Personal Info */}
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-theme-primary" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Personal Information
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="e.g. Md"
              value={formData.firstName}
              onChange={(e) =>
                updateField('firstName', e.target.value)
              }
              error={formErrors.firstName}
              required
            />

            <Input
              label="Last Name"
              placeholder="e.g. Kamal"
              value={formData.lastName}
              onChange={(e) =>
                updateField('lastName', e.target.value)
              }
              error={formErrors.lastName}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              label="Admission Date"
              value={formData.admissionDate}
              onChange={(d) => updateField('admissionDate', d)}
              placeholder="Select admission date"
              error={formErrors.admissionDate}
              required
            />

            <DatePicker
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(d) => updateField('dateOfBirth', d)}
              placeholder="Select date of birth"
              fromYear={2000}
              toYear={new Date().getFullYear()}
              error={formErrors.dateOfBirth}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Blood Group"
              value={formData.bloodGroup}
              onValueChange={(v) => updateField('bloodGroup', v)}
              options={BLOOD_GROUP_OPTIONS}
            />

            <Input
              label="Nationality"
              placeholder="Bangladeshi"
              value={formData.nationality}
              onChange={(e) =>
                updateField('nationality', e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Religion"
              placeholder="Islam"
              value={formData.religion}
              onChange={(e) =>
                updateField('religion', e.target.value)
              }
            />

            <Input
              label="Birth Certificate No."
              placeholder="1234567890"
              value={formData.birthCertificateNo}
              onChange={(e) =>
                updateField('birthCertificateNo', e.target.value)
              }
            />
          </div>

          <Input
            label="Previous School"
            placeholder="ABC School"
            value={formData.previousSchool}
            onChange={(e) =>
              updateField('previousSchool', e.target.value)
            }
          />

          <Input
            label="Student Address"
            placeholder="Street address, City, Postal Code"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            error={formErrors.address}
            required
          />

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Gender <span className="text-rose-500">*</span>
            </label>

            <RadioGroup
              name="gender"
              variant="pills"
              value={formData.gender}
              onChange={(v) =>
                updateField('gender', v as StudentAdmissionFormData['gender'])
              }
              options={GENDER_OPTIONS}
            />
          </div>

          {/* Student Account */}

          {/* Guardian Info */}
          <div className="flex items-center gap-1.5 pt-2">
            <Users className="w-4 h-4 text-theme-primary" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Guardian Information
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Relationship"
              value={formData.guardianRelationship}
              onValueChange={(v) =>
                updateField(
                  'guardianRelationship',
                  v as GuardianRelationship,
                )
              }
              options={RELATIONSHIP_OPTIONS}
              error={formErrors.guardianRelationship}
              required
            />

            <Input
              label="Guardian Name"
              placeholder="e.g. Md Abdul Karim"
              value={formData.guardianName}
              onChange={(e) =>
                updateField('guardianName', e.target.value)
              }
              error={formErrors.guardianName}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Guardian Email"
              type="email"
              placeholder="guardian@example.com"
              value={formData.guardianEmail}
              onChange={(e) =>
                updateField('guardianEmail', e.target.value)
              }
              error={formErrors.guardianEmail}
            />

            <Input
              label="Guardian Phone"
              placeholder="01700000000"
              value={formData.guardianPhone}
              onChange={(e) =>
                updateField('guardianPhone', e.target.value)
              }
              error={formErrors.guardianPhone}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Guardian Emergency Contact"
              placeholder="01700000000"
              value={formData.guardianEmergencyContact}
              onChange={(e) =>
                updateField('guardianEmergencyContact', e.target.value)
              }
            />

            <Input
              label="Occupation"
              placeholder="e.g. Businessman"
              value={formData.guardianOccupation}
              onChange={(e) =>
                updateField('guardianOccupation', e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Workplace"
              placeholder="e.g. ABC Company"
              value={formData.guardianWorkplace}
              onChange={(e) =>
                updateField('guardianWorkplace', e.target.value)
              }
            />

            <Input
              label="Guardian Address"
              placeholder="Street address, City, Postal Code"
              value={formData.guardianAddress}
              onChange={(e) =>
                updateField('guardianAddress', e.target.value)
              }
            />
          </div>

          {/* Academic Enrollment */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-theme-primary" />
              <span>
                Academic Enrollment (Session: {currentSession?.name || '—'})
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Academic Session"
                value={formData.sessionId}
                onValueChange={(v) => updateField('sessionId', v)}
                options={sessionOptions}
                placeholder="Select Session"
                error={formErrors.sessionId}
                required
              />

              <Select
                label="Assign Class"
                value={formData.classId}
                onValueChange={(v) => updateField('classId', v)}
                options={classOptions}
                placeholder="Select Class"
                error={formErrors.classId}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Assign Section"
                value={formData.sectionId}
                onValueChange={(v) => updateField('sectionId', v)}
                options={formSectionOptions}
                placeholder={
                  formData.classId
                    ? 'Select Section'
                    : 'Select class first'
                }
                disabled={!formData.classId}
              />
            </div>
          </div>

          {/* Welcome SMS */}
          <div className="pt-1">
            <Switch
              label="Send SMS Welcome Notification"
              description="Dispatch guardian SMS credential notification with admission confirmation"
              checked={formData.sendWelcomeSms}
              onChange={(v) => updateField('sendWelcomeSms', v)}
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
            >
              Complete Admission
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};