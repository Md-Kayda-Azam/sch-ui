import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';
import {
  useGetRankingsQuery,
  useGetMarksheetQuery,
  useGetExamsQuery,
  useGetClassesQuery,
  useGetStudentsQuery,
} from '../../features/api/apiSlice';
import { Tabs } from '../../components/ui/Tabs';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Award, Printer, Search, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { RankingItem, StudentMarksheet } from '../../types';

export const RankingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ranking' | 'marksheet'>('ranking');

  // Ranking Filters
  const [examId, setExamId] = useState('1');
  const [classId, setClassId] = useState('5');
  const [rankingType, setRankingType] = useState<'marks' | 'gpa'>('marks');

  // Marksheet Student Selection
  const [marksheetStudentId, setMarksheetStudentId] = useState('1');

  const { can } = usePermission();
  const { t } = useLanguage();

  // Queries
  const { data: exams } = useGetExamsQuery();
  const { data: classes } = useGetClassesQuery();
  const { data: students } = useGetStudentsQuery({ classId: Number(classId) });

  const { data: rankings, isLoading: loadingRankings, refetch: refetchRankings } = useGetRankingsQuery({
    examId: Number(examId),
    classId: Number(classId),
    type: rankingType,
  });

  const { data: marksheetData, isLoading: loadingMarksheet } = useGetMarksheetQuery(
    { studentId: Number(marksheetStudentId), examId: Number(examId) },
    { skip: !marksheetStudentId || !examId }
  );

  const selectedStudent = students?.find((s) => s.id === Number(marksheetStudentId)) || students?.[0];

  const rankingColumns: Column<RankingItem>[] = [
    {
      key: 'position',
      header: 'Position',
      align: 'center',
      width: '80px',
      render: (r) => (
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black tabular-nums ${
            r.position === 1
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 ring-1 ring-amber-400'
              : r.position === 2
              ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              : r.position === 3
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {r.position}
        </span>
      ),
    },
    {
      key: 'student',
      header: 'Student Name & ID',
      sortable: true,
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{r.studentName}</span>
          <span className="block text-[11px] text-slate-400 tabular-nums">{r.studentCode}</span>
        </div>
      ),
    },
    {
      key: 'rollNumber',
      header: 'Roll',
      align: 'center',
      render: (r) => <span className="font-semibold tabular-nums">{r.rollNumber}</span>,
    },
    {
      key: 'totalMarks',
      header: 'Total Marks',
      align: 'right',
      sortable: true,
      render: (r) => (
        <span className="font-bold tabular-nums text-blue-600 dark:text-blue-400">
          {r.totalMarks}
        </span>
      ),
    },
    {
      key: 'averageMarks',
      header: 'Average %',
      align: 'right',
      render: (r) => <span className="tabular-nums text-slate-600 dark:text-slate-400">{r.averageMarks}%</span>,
    },
    {
      key: 'gpa',
      header: 'GPA',
      align: 'center',
      sortable: true,
      render: (r) => (
        <span className="font-bold tabular-nums text-purple-600 dark:text-purple-400">
          {Number(r.gpa).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Result',
      align: 'center',
      render: (r) => (
        <Badge variant={r.status === 'PASSED' ? 'success' : 'danger'}>
          {r.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Marksheet',
      align: 'right',
      render: (r) => (
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<FileText className="w-3.5 h-3.5" />}
          onClick={() => {
            setMarksheetStudentId(String(r.studentId));
            setActiveTab('marksheet');
          }}
        >
          Marksheet
        </Button>
      ),
    },
  ];

  const displayRankings: RankingItem[] = rankings || [
    { position: 1, studentId: 1, studentName: 'Rahim Uddin', studentCode: 'STD-1001', rollNumber: '01', className: 'Class 5', totalMarks: 475, averageMarks: 95, gpa: 5.0, status: 'PASSED' },
    { position: 2, studentId: 2, studentName: 'Karim Mollah', studentCode: 'STD-1002', rollNumber: '03', className: 'Class 5', totalMarks: 462, averageMarks: 92.4, gpa: 4.8, status: 'PASSED' },
    { position: 3, studentId: 3, studentName: 'Hasan Mahmud', studentCode: 'STD-1003', rollNumber: '02', className: 'Class 5', totalMarks: 450, averageMarks: 90, gpa: 4.6, status: 'PASSED' },
    { position: 4, studentId: 4, studentName: 'Fatima Akter', studentCode: 'STD-1004', rollNumber: '04', className: 'Class 5', totalMarks: 430, averageMarks: 86, gpa: 4.4, status: 'PASSED' },
  ];

  const displayMarksheet: StudentMarksheet = marksheetData || {
    school: {
      name: 'AL MADINA MODEL SCHOOL & COLLEGE',
      code: 'AMS-1001',
      address: 'Gulshan-2, Dhaka, Bangladesh',
      phone: '+880 1711-000000',
    },
    student: {
      id: Number(marksheetStudentId),
      name: selectedStudent?.fullName || 'Abdullah Al Mamun',
      studentCode: selectedStudent?.studentCode || 'STD-1001',
      admissionNumber: 'ADM-2026-001',
      className: 'Class 5',
      sectionName: 'A',
      rollNumber: '01',
    },
    exam: {
      name: 'Half Yearly Examination 2026',
      code: 'EXAM-HY-2026',
      year: '2026',
    },
    subjects: [
      { subjectName: 'Bangla 1st Paper', subjectCode: 'BAN-101', fullMarks: 100, passMarks: 33, obtainedMarks: 88, isAbsent: false, gradeName: 'A+', gradePoint: 5.0 },
      { subjectName: 'English For Today', subjectCode: 'ENG-101', fullMarks: 100, passMarks: 33, obtainedMarks: 82, isAbsent: false, gradeName: 'A+', gradePoint: 5.0 },
      { subjectName: 'General Mathematics', subjectCode: 'MATH-101', fullMarks: 100, passMarks: 33, obtainedMarks: 95, isAbsent: false, gradeName: 'A+', gradePoint: 5.0 },
      { subjectName: 'General Science', subjectCode: 'SCI-101', fullMarks: 100, passMarks: 33, obtainedMarks: 78, isAbsent: false, gradeName: 'A', gradePoint: 4.0 },
      { subjectName: 'Bangladesh & Global Studies', subjectCode: 'BGS-101', fullMarks: 100, passMarks: 33, obtainedMarks: 84, isAbsent: false, gradeName: 'A+', gradePoint: 5.0 },
    ],
    totalMarks: 500,
    obtainedTotalMarks: 427,
    averageMarks: 85.4,
    gpa: 4.80,
    finalResult: 'PASSED',
    marksPosition: 1,
    gpaPosition: 1,
  };

  const tabs = [
    { id: 'ranking', label: 'Academic Rankings & Merit List', icon: <Award className="w-4 h-4" /> },
    { id: 'marksheet', label: 'Official Marksheet / Academic Transcript', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('exams.rankings', 'Academic Rankings & Official Marksheets')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic merit ranking by marks or GPA, and printable student academic transcripts
          </p>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={(id: any) => setActiveTab(id)} />

      {/* 1. RANKING DASHBOARD (Section 38) */}
      {activeTab === 'ranking' && (
        <div className="space-y-6">
          <Card className="p-4!">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <Select
                  label="Examination"
                  value={examId}
                  onChange={(e) => setExamId(e.target.value)}
                  options={(exams || [
                    { id: 1, name: 'Half Yearly Examination 2026' },
                  ]).map((e: any) => ({ value: e.id, label: e.name }))}
                />

                <Select
                  label="Class"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  options={(classes || [
                    { id: 1, name: 'Class 1' },
                    { id: 5, name: 'Class 5' },
                  ]).map((c) => ({ value: c.id, label: c.name }))}
                />

                <Select
                  label="Ranking Basis (API Type)"
                  value={rankingType}
                  onChange={(e) => setRankingType(e.target.value as any)}
                  options={[
                    { value: 'marks', label: 'Rank by Total Marks' },
                    { value: 'gpa', label: 'Rank by GPA' },
                  ]}
                />
              </div>

              <div className="pt-4 sm:pt-0">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => window.print()}
                >
                  Print Merit List
                </Button>
              </div>
            </div>
          </Card>

          <DataTable
            columns={rankingColumns}
            data={displayRankings}
            isLoading={loadingRankings}
            onRefresh={refetchRankings}
            rowKey={(r) => r.studentId}
            searchPlaceholder="Search ranking list..."
          />
        </div>
      )}

      {/* 2. OFFICIAL MARKSHEET (Section 39) */}
      {activeTab === 'marksheet' && (
        <div className="space-y-6">
          {/* Controls */}
          <Card className="no-print p-4!">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="w-full sm:max-w-md">
                <Select
                  label="Select Student for Transcript"
                  value={marksheetStudentId}
                  onChange={(e) => setMarksheetStudentId(e.target.value)}
                  options={(students || [
                    { id: 1, fullName: 'Rahim Uddin', studentCode: 'STD-1001' },
                    { id: 2, fullName: 'Karim Mollah', studentCode: 'STD-1002' },
                    { id: 3, fullName: 'Hasan Mahmud', studentCode: 'STD-1003' },
                  ]).map((s: any) => ({
                    value: s.id,
                    label: `${s.fullName} (${s.studentCode || 'STD'})`,
                  }))}
                />
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print Official Marksheet
              </Button>
            </div>
          </Card>

          {/* Printable Marksheet Container */}
          <div className="print-container bg-white text-slate-900 p-8 sm:p-12 rounded-xl border border-slate-200 shadow-md max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                {displayMarksheet.school.name}
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                {displayMarksheet.school.address} · Institutional EIIN / Code: {displayMarksheet.school.code}
              </p>
              <div className="inline-block mt-3 px-4 py-1 rounded bg-slate-900 text-white font-bold text-xs uppercase tracking-widest">
                Academic Transcript & Marksheet
              </div>
            </div>

            {/* Exam & Student Metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs py-2 border-b border-slate-200">
              <div className="space-y-1">
                <div>Student Name: <strong className="text-sm font-bold">{displayMarksheet.student.name}</strong></div>
                <div>Student ID: <strong className="font-mono">{displayMarksheet.student.studentCode}</strong></div>
                <div>Admission No: <strong>{displayMarksheet.student.admissionNumber}</strong></div>
              </div>
              <div className="space-y-1 text-right">
                <div>Examination: <strong className="font-bold">{displayMarksheet.exam.name}</strong></div>
                <div>Class & Section: <strong>{displayMarksheet.student.className} ({displayMarksheet.student.sectionName})</strong></div>
                <div>Roll No: <strong className="font-bold">{displayMarksheet.student.rollNumber}</strong></div>
              </div>
            </div>

            {/* Subject-wise Marks Table */}
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3 text-center">Full Marks</th>
                    <th className="py-2.5 px-3 text-center">Pass Marks</th>
                    <th className="py-2.5 px-3 text-right">Obtained Marks</th>
                    <th className="py-2.5 px-3 text-center">Letter Grade</th>
                    <th className="py-2.5 px-3 text-center">Grade Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {displayMarksheet.subjects.map((sub, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold">{sub.subjectName}</td>
                      <td className="py-2.5 px-3 text-center tabular-nums">{sub.fullMarks}</td>
                      <td className="py-2.5 px-3 text-center tabular-nums">{sub.passMarks}</td>
                      <td className="py-2.5 px-3 text-right font-bold tabular-nums text-blue-700">
                        {sub.isAbsent ? 'ABS' : sub.obtainedMarks}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">{sub.gradeName}</td>
                      <td className="py-2.5 px-3 text-center tabular-nums font-semibold">
                        {sub.gradePoint.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold">
                  <tr>
                    <td className="py-2.5 px-3">SUMMARY TOTALS:</td>
                    <td className="py-2.5 px-3 text-center tabular-nums">{displayMarksheet.totalMarks}</td>
                    <td className="py-2.5 px-3 text-center">—</td>
                    <td className="py-2.5 px-3 text-right text-blue-800 tabular-nums">
                      {displayMarksheet.obtainedTotalMarks}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-700 font-black">
                      {displayMarksheet.finalResult}
                    </td>
                    <td className="py-2.5 px-3 text-center text-purple-800 tabular-nums font-black text-sm">
                      GPA {displayMarksheet.gpa.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="block text-slate-500 text-[10px] uppercase">Average Marks</span>
                <span className="text-base font-bold tabular-nums">{displayMarksheet.averageMarks}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="block text-slate-500 text-[10px] uppercase">Marks Position</span>
                <span className="text-base font-bold tabular-nums text-blue-700">
                  {displayMarksheet.marksPosition || 1}st in Class
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="block text-slate-500 text-[10px] uppercase">GPA Position</span>
                <span className="text-base font-bold tabular-nums text-purple-700">
                  {displayMarksheet.gpaPosition || 1}st
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="block text-slate-500 text-[10px] uppercase">Final Result</span>
                <span className="text-base font-bold text-emerald-700">
                  {displayMarksheet.finalResult}
                </span>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-12 text-xs flex justify-between items-center text-slate-600">
              <div className="border-t border-slate-400 pt-1 text-center w-36">
                <span>Class Teacher</span>
              </div>
              <div className="border-t border-slate-400 pt-1 text-center w-36">
                <span>Controller of Exams</span>
              </div>
              <div className="border-t border-slate-400 pt-1 text-center w-36">
                <span>Principal / Headmaster</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
