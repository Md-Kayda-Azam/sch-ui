import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';
import {
  useGetExamsQuery,
  useCreateExamMutation,
  useGetExamSubjectsQuery,
  useCreateExamSubjectMutation,
  useGetResultGradesQuery,
  useCreateResultGradeMutation,
  useGetClassesQuery,
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
import { Award, Plus, Calendar, BookOpen, Layers } from 'lucide-react';
import { Exam, ExamSubject, ResultGrade } from '../../types';

export const ExamsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  // Form states
  const [examForm, setExamForm] = useState({
    name: '',
    code: '',
    sessionId: '',
    startDate: '2026-10-15',
    endDate: '2026-10-30',
  });

  const [examSubjectForm, setExamSubjectForm] = useState({
    examId: '',
    classId: '',
    subjectId: '',
    fullMarks: 100,
    passMarks: 33,
    examDate: '2026-10-16',
  });

  const [gradeForm, setGradeForm] = useState({
    name: 'A+',
    minMark: 80,
    maxMark: 100,
    gradePoint: 5.0,
    comment: 'Outstanding',
  });

  const { can } = usePermission();
  const { t } = useLanguage();

  // Queries
  const { data: exams, isLoading: loadingExams, refetch: refetchExams } = useGetExamsQuery();
  const { data: examSubjects, isLoading: loadingSubjects, refetch: refetchExamSubjects } = useGetExamSubjectsQuery();
  const { data: grades, isLoading: loadingGrades, refetch: refetchGrades } = useGetResultGradesQuery();
  const { data: classes } = useGetClassesQuery();
  const { data: subjects } = useGetSubjectsQuery();
  const { data: sessions } = useGetAcademicSessionsQuery();

  const [createExam, { isLoading: isCreatingExam }] = useCreateExamMutation();
  const [createExamSubject, { isLoading: isCreatingExamSub }] = useCreateExamSubjectMutation();
  const [createGrade, { isLoading: isCreatingGrade }] = useCreateResultGradeMutation();

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExam({
        name: examForm.name,
        code: examForm.code,
        sessionId: Number(examForm.sessionId || sessions?.[0]?.id || 1),
        startDate: examForm.startDate,
        endDate: examForm.endDate,
        status: 'UPCOMING',
      }).unwrap();
      setIsExamModalOpen(false);
      refetchExams();
    } catch (err) {
      console.error('Failed to create exam:', err);
    }
  };

  const handleCreateExamSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExamSubject({
        examId: Number(examSubjectForm.examId),
        classId: Number(examSubjectForm.classId),
        subjectId: Number(examSubjectForm.subjectId),
        fullMarks: Number(examSubjectForm.fullMarks),
        passMarks: Number(examSubjectForm.passMarks),
        examDate: examSubjectForm.examDate,
      }).unwrap();
      setIsSubjectModalOpen(false);
      refetchExamSubjects();
    } catch (err) {
      console.error('Failed to create exam subject:', err);
    }
  };

  const handleCreateGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGrade({
        name: gradeForm.name,
        minMark: Number(gradeForm.minMark),
        maxMark: Number(gradeForm.maxMark),
        gradePoint: Number(gradeForm.gradePoint),
        comment: gradeForm.comment,
      }).unwrap();
      setIsGradeModalOpen(false);
      refetchGrades();
    } catch (err) {
      console.error('Failed to create grade:', err);
    }
  };

  const examColumns: Column<Exam>[] = [
    { key: 'name', header: 'Exam Name', sortable: true },
    { key: 'code', header: 'Exam Code', align: 'center', sortable: true },
    {
      key: 'dates',
      header: 'Schedule',
      align: 'center',
      render: (e) => (
        <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
          {e.startDate} to {e.endDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (e) => (
        <Badge
          variant={
            e.status === 'ONGOING'
              ? 'success'
              : e.status === 'UPCOMING'
              ? 'info'
              : 'neutral'
          }
        >
          {e.status}
        </Badge>
      ),
    },
  ];

  const examSubColumns: Column<ExamSubject>[] = [
    {
      key: 'subject',
      header: 'Exam Subject',
      sortable: true,
      render: (es) => (
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {es.subject?.name || 'Subject Name'}
        </span>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      align: 'center',
      render: (es) => es.class?.name || `Class ${es.classId}`,
    },
    {
      key: 'fullMarks',
      header: 'Full Marks',
      align: 'right',
      sortable: true,
      render: (es) => <span className="tabular-nums font-bold">{es.fullMarks}</span>,
    },
    {
      key: 'passMarks',
      header: 'Pass Marks',
      align: 'right',
      sortable: true,
      render: (es) => <span className="tabular-nums text-rose-600 font-semibold">{es.passMarks}</span>,
    },
    {
      key: 'examDate',
      header: 'Exam Date',
      align: 'center',
      render: (es) => <span className="text-xs tabular-nums text-slate-500">{es.examDate || '2026-10-16'}</span>,
    },
  ];

  const gradeColumns: Column<ResultGrade>[] = [
    {
      key: 'name',
      header: 'Grade Letter',
      align: 'center',
      render: (g) => (
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {g.name}
        </span>
      ),
    },
    {
      key: 'marksRange',
      header: 'Mark Interval',
      align: 'center',
      render: (g) => (
        <span className="tabular-nums font-mono text-xs text-slate-700 dark:text-slate-300">
          {g.minMark}% – {g.maxMark}%
        </span>
      ),
    },
    {
      key: 'gradePoint',
      header: 'Grade Point (GPA)',
      align: 'center',
      render: (g) => (
        <span className="font-bold tabular-nums text-emerald-600">
          {Number(g.gradePoint).toFixed(2)}
        </span>
      ),
    },
    { key: 'comment', header: 'Remarks / Comment' },
  ];

  const tabs = [
    { id: 'exams', label: 'Examinations', icon: <Award className="w-4 h-4" /> },
    { id: 'subjects', label: 'Exam Subjects & Marks', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'grades', label: 'Dynamic Grading Scale', icon: <Layers className="w-4 h-4" /> },
  ];

  const displayExams: Exam[] = exams || [
    { id: 1, schoolId: 1, sessionId: 1, name: 'Half Yearly Examination 2026', code: 'EXAM-HY-2026', startDate: '2026-07-01', endDate: '2026-07-15', status: 'COMPLETED' },
    { id: 2, schoolId: 1, sessionId: 1, name: 'Annual Final Examination 2026', code: 'EXAM-FIN-2026', startDate: '2026-11-20', endDate: '2026-12-05', status: 'UPCOMING' },
  ];

  const displayGrades: ResultGrade[] = grades || [
    { id: 1, schoolId: 1, name: 'A+', minMark: 80, maxMark: 100, gradePoint: 5.0, comment: 'Outstanding' },
    { id: 2, schoolId: 1, name: 'A', minMark: 70, maxMark: 79, gradePoint: 4.0, comment: 'Excellent' },
    { id: 3, schoolId: 1, name: 'A-', minMark: 60, maxMark: 69, gradePoint: 3.5, comment: 'Very Good' },
    { id: 4, schoolId: 1, name: 'B', minMark: 50, maxMark: 59, gradePoint: 3.0, comment: 'Good' },
    { id: 5, schoolId: 1, name: 'C', minMark: 40, maxMark: 49, gradePoint: 2.0, comment: 'Satisfactory' },
    { id: 6, schoolId: 1, name: 'D', minMark: 33, maxMark: 39, gradePoint: 1.0, comment: 'Pass' },
    { id: 7, schoolId: 1, name: 'F', minMark: 0, maxMark: 32, gradePoint: 0.0, comment: 'Failed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('exams.title', 'Examination & Grading System')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure examination schedules, full/pass marks, and institutional GPA grading scale
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'exams' && can('exam:create') && (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsExamModalOpen(true)}
            >
              Create Exam
            </Button>
          )}

          {activeTab === 'subjects' && can('examSubject:create') && (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsSubjectModalOpen(true)}
            >
              Add Exam Subject
            </Button>
          )}

          {activeTab === 'grades' && can('resultGrade:create') && (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsGradeModalOpen(true)}
            >
              Add Grade Tier
            </Button>
          )}
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'exams' && (
        <DataTable
          columns={examColumns}
          data={displayExams}
          isLoading={loadingExams}
          onRefresh={refetchExams}
          rowKey={(e) => e.id}
          searchPlaceholder="Search exams..."
        />
      )}

      {activeTab === 'subjects' && (
        <DataTable
          columns={examSubColumns}
          data={examSubjects || [
            { id: 1, schoolId: 1, examId: 1, classId: 5, subjectId: 1, fullMarks: 100, passMarks: 33, examDate: '2026-07-02', subject: { name: 'Bangla 1st Paper' } as any, class: { name: 'Class 5' } as any },
            { id: 2, schoolId: 1, examId: 1, classId: 5, subjectId: 2, fullMarks: 100, passMarks: 33, examDate: '2026-07-04', subject: { name: 'English For Today' } as any, class: { name: 'Class 5' } as any },
            { id: 3, schoolId: 1, examId: 1, classId: 5, subjectId: 3, fullMarks: 100, passMarks: 33, examDate: '2026-07-06', subject: { name: 'General Mathematics' } as any, class: { name: 'Class 5' } as any },
          ]}
          isLoading={loadingSubjects}
          onRefresh={refetchExamSubjects}
          rowKey={(es) => es.id}
          searchPlaceholder="Search exam subjects..."
        />
      )}

      {activeTab === 'grades' && (
        <DataTable
          columns={gradeColumns}
          data={displayGrades}
          isLoading={loadingGrades}
          onRefresh={refetchGrades}
          rowKey={(g) => g.id}
          searchPlaceholder="Search grades..."
        />
      )}

      {/* Create Exam Modal */}
      <Modal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        title="Schedule New Examination"
        maxWidth="md"
      >
        <form onSubmit={handleCreateExam} className="space-y-4">
          <Input
            label="Exam Title"
            value={examForm.name}
            onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
            placeholder="e.g. Annual Final Examination 2026"
            required
          />

          <Input
            label="Exam Code"
            value={examForm.code}
            onChange={(e) => setExamForm({ ...examForm, code: e.target.value })}
            placeholder="e.g. EXAM-FINAL-2026"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={examForm.startDate}
              onChange={(e) => setExamForm({ ...examForm, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={examForm.endDate}
              onChange={(e) => setExamForm({ ...examForm, endDate: e.target.value })}
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsExamModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isCreatingExam}>
              Save Exam
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Exam Subject Modal */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title="Add Exam Subject & Marks Schema"
        maxWidth="md"
      >
        <form onSubmit={handleCreateExamSubject} className="space-y-4">
          <Select
            label="Select Exam"
            value={examSubjectForm.examId}
            onChange={(e) => setExamSubjectForm({ ...examSubjectForm, examId: e.target.value })}
            options={displayExams.map((e) => ({ value: e.id, label: e.name }))}
            placeholder="Select exam"
            required
          />

          <Select
            label="Class"
            value={examSubjectForm.classId}
            onChange={(e) => setExamSubjectForm({ ...examSubjectForm, classId: e.target.value })}
            options={(classes || []).map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select class"
            required
          />

          <Select
            label="Subject"
            value={examSubjectForm.subjectId}
            onChange={(e) => setExamSubjectForm({ ...examSubjectForm, subjectId: e.target.value })}
            options={(subjects || []).map((s) => ({ value: s.id, label: `${s.name} (${s.code})` }))}
            placeholder="Select subject"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Marks"
              type="number"
              value={examSubjectForm.fullMarks}
              onChange={(e) => setExamSubjectForm({ ...examSubjectForm, fullMarks: Number(e.target.value) })}
              required
            />
            <Input
              label="Pass Marks"
              type="number"
              value={examSubjectForm.passMarks}
              onChange={(e) => setExamSubjectForm({ ...examSubjectForm, passMarks: Number(e.target.value) })}
              required
            />
          </div>

          <Input
            label="Exam Date"
            type="date"
            value={examSubjectForm.examDate}
            onChange={(e) => setExamSubjectForm({ ...examSubjectForm, examDate: e.target.value })}
            required
          />

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsSubjectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isCreatingExamSub}>
              Save Exam Subject
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Grade Modal */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title="Add Grade Tier"
        maxWidth="md"
      >
        <form onSubmit={handleCreateGrade} className="space-y-4">
          <Input
            label="Grade Name (e.g. A+, A)"
            value={gradeForm.name}
            onChange={(e) => setGradeForm({ ...gradeForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Minimum Mark (%)"
              type="number"
              value={gradeForm.minMark}
              onChange={(e) => setGradeForm({ ...gradeForm, minMark: Number(e.target.value) })}
              required
            />
            <Input
              label="Maximum Mark (%)"
              type="number"
              value={gradeForm.maxMark}
              onChange={(e) => setGradeForm({ ...gradeForm, maxMark: Number(e.target.value) })}
              required
            />
          </div>
          <Input
            label="Grade Point (GPA)"
            type="number"
            step="0.01"
            value={gradeForm.gradePoint}
            onChange={(e) => setGradeForm({ ...gradeForm, gradePoint: Number(e.target.value) })}
            required
          />
          <Input
            label="Remarks"
            value={gradeForm.comment}
            onChange={(e) => setGradeForm({ ...gradeForm, comment: e.target.value })}
          />

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsGradeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isCreatingGrade}>
              Save Grade
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
