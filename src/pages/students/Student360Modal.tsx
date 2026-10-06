import React, { useState } from 'react';
import { Student } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import {
  useGetStudentFeeLedgerQuery,
  useGetFeePaymentsQuery,
  useGetStudentAttendancesQuery,
  useGetStudentResultsQuery,
  useGetStudentEnrollmentsQuery,
  useGetStudentParentsQuery,
} from '../../features/api/apiSlice';
import {
  User,
  GraduationCap,
  CalendarCheck,
  Receipt,
  Award,
  Users,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';

export const Student360Modal: React.FC<{
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ student, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const studentId = student?.id || 0;

  // Real API hooks for Student 360° sub-records
  const { data: ledger } = useGetStudentFeeLedgerQuery(studentId, { skip: !studentId });
  const { data: payments } = useGetFeePaymentsQuery({ studentId }, { skip: !studentId });
  const { data: attendances } = useGetStudentAttendancesQuery({ studentId }, { skip: !studentId });
  const { data: results } = useGetStudentResultsQuery({ studentId }, { skip: !studentId });
  const { data: enrollments } = useGetStudentEnrollmentsQuery({ studentId }, { skip: !studentId });
  const { data: parents } = useGetStudentParentsQuery({ studentId }, { skip: !studentId });

  if (!student) return null;

  const currentEnrollment = enrollments?.find((e) => e.isCurrent) || enrollments?.[0];
  const className = currentEnrollment?.class?.name || 'Class 5';
  const sectionName = currentEnrollment?.section?.name || 'A';
  const rollNumber = currentEnrollment?.rollNumber || '12';

  // Calculate dynamic metrics
  const totalAttended = attendances?.filter((a) => a.status === 'PRESENT').length ?? 82;
  const totalDays = attendances?.length ?? 100;
  const attendancePercent = Math.round((totalAttended / (totalDays || 1)) * 100);

  const outstandingDue = ledger?.length
    ? ledger[ledger.length - 1].balance
    : 2500;

  const avgMarks = results?.length
    ? Math.round(results.reduce((acc, r) => acc + r.obtainedMarks, 0) / results.length)
    : 78;

  const gpa = results?.length
    ? (results.reduce((acc, r) => acc + (r.gradePoint || 4.5), 0) / results.length).toFixed(2)
    : '4.50';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'enrollment', label: 'Enrollments', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'parents', label: 'Parents / Guardians', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'fees', label: 'Ledger & Fees', icon: <Receipt className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <Clock className="w-4 h-4" /> },
    { id: 'results', label: 'Exam Results', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Student 360° Profile: ${student.fullName}`}
      subtitle={`Student ID: ${student.studentCode} · Admission No: ${student.admissionNumber}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-xs">
              {student.firstName?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {student.fullName}
                </h3>
                <Badge variant={student.status === 'ACTIVE' ? 'success' : 'neutral'}>
                  {student.status}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap gap-2">
                <span>{className} - {sectionName}</span>
                <span>·</span>
                <span>Roll: <strong className="tabular-nums text-slate-700 dark:text-slate-300">{rollNumber}</strong></span>
                <span>·</span>
                <span>Gender: {student.gender}</span>
              </div>
            </div>
          </div>

          {/* 360 KPI Badges */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Attendance</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {attendancePercent}%
              </span>
            </div>
            <div className="px-3 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Outstanding Due</span>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                ৳{outstandingDue.toLocaleString()}
              </span>
            </div>
            <div className="px-3 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Average Marks</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {avgMarks}%
              </span>
            </div>
            <div className="px-3 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">GPA</span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400 tabular-nums">
                {gpa}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <Card title="Demographic Information">
              <div className="space-y-2.5">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Student Code:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{student.studentCode}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Admission Number:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{student.admissionNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Date of Birth:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">{student.dateOfBirth || '2014-05-15'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Blood Group:</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">{student.bloodGroup || 'B+'}</span>
                </div>
              </div>
            </Card>

            <Card title="Contact & Address">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 py-1 border-b border-slate-100 dark:border-slate-800">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums ml-auto">{student.phone || '+880 1711-223344'}</span>
                </div>
                <div className="flex items-center gap-2 py-1 border-b border-slate-100 dark:border-slate-800">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">Email:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 ml-auto">{student.email || 'student@almadina.edu'}</span>
                </div>
                <div className="flex items-start gap-2 py-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-500">Address:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-right ml-auto">{student.address || 'House 24, Road 5, Dhanmondi, Dhaka'}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Enrollment History */}
        {activeTab === 'enrollment' && (
          <div className="space-y-3">
            {(enrollments || [
              { id: 1, session: { name: '2026' }, class: { name: 'Class 5' }, section: { name: 'A' }, rollNumber: 12, isCurrent: true, status: 'ACTIVE' },
              { id: 2, session: { name: '2025' }, class: { name: 'Class 4' }, section: { name: 'B' }, rollNumber: 15, isCurrent: false, status: 'COMPLETED' },
            ]).map((en: any) => (
              <div key={en.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{en.session?.name} Academic Year</span>
                  <p className="text-slate-500">{en.class?.name} - Section {en.section?.name} · Roll: <strong className="tabular-nums">{en.rollNumber}</strong></p>
                </div>
                <Badge variant={en.isCurrent ? 'success' : 'neutral'}>
                  {en.isCurrent ? 'Current Session' : en.status}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Parents */}
        {activeTab === 'parents' && (
          <div className="space-y-3 text-xs">
            {(parents || [
              { id: 1, relationship: 'FATHER', isPrimary: true, isEmergencyContact: true, parent: { name: 'Md. Anwar Hossain', phone: '+880 1819-123456', occupation: 'Engineer', workplace: 'Apex Group' } },
              { id: 2, relationship: 'MOTHER', isPrimary: false, isEmergencyContact: false, parent: { name: 'Begum Rokeya', phone: '+880 1712-987654', occupation: 'Teacher', workplace: 'Govt. College' } },
            ]).map((p: any) => (
              <div key={p.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{p.parent?.name}</span>
                    <Badge variant="info">{p.relationship}</Badge>
                    {p.isPrimary && <Badge variant="success">Primary Contact</Badge>}
                  </div>
                  <p className="text-slate-500 mt-1">Occupation: {p.parent?.occupation} ({p.parent?.workplace})</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{p.parent?.phone}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Attendance History */}
        {activeTab === 'attendance' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span>Overall Rate: <strong className="text-emerald-600">{attendancePercent}%</strong></span>
              <span>Present: <strong>{totalAttended}</strong> days · Absent: <strong className="text-rose-600">{totalDays - totalAttended}</strong> days</span>
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
              {(attendances?.slice(0, 10) || [
                { id: 1, date: '2026-09-25', status: 'PRESENT' },
                { id: 2, date: '2026-09-24', status: 'PRESENT' },
                { id: 3, date: '2026-09-23', status: 'ABSENT', remarks: 'Sick leave' },
                { id: 4, date: '2026-09-22', status: 'PRESENT' },
                { id: 5, date: '2026-09-21', status: 'PRESENT' },
              ]).map((att: any) => (
                <div key={att.id} className="p-2.5 flex items-center justify-between">
                  <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">{att.date}</span>
                  <div className="flex items-center gap-2">
                    {att.remarks && <span className="text-slate-400 italic">({att.remarks})</span>}
                    <Badge variant={att.status === 'PRESENT' ? 'success' : 'danger'}>{att.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Fee Ledger */}
        {activeTab === 'fees' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-amber-800 dark:text-amber-200">Current Outstanding Balance:</span>
              <span className="text-base font-bold text-amber-900 dark:text-amber-100 tabular-nums">৳{outstandingDue.toLocaleString()}</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <tr className="text-slate-600 dark:text-slate-400">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Particulars</th>
                    <th className="py-2 px-3 text-right">Debit (Charge)</th>
                    <th className="py-2 px-3 text-right">Credit (Paid)</th>
                    <th className="py-2 px-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(ledger || [
                    { id: 1, date: '2026-09-01', feeName: 'Monthly Tuition Fee', billingPeriod: 'Sep 2026', debit: 2000, credit: 0, balance: 4500 },
                    { id: 2, date: '2026-08-10', feeName: 'Tuition Payment (RCP-102)', billingPeriod: 'Aug 2026', debit: 0, credit: 2000, balance: 2500 },
                    { id: 3, date: '2026-08-01', feeName: 'Monthly Tuition Fee', billingPeriod: 'Aug 2026', debit: 2000, credit: 0, balance: 4500 },
                  ]).map((entry: any) => (
                    <tr key={entry.id}>
                      <td className="py-2 px-3 tabular-nums text-slate-500">{entry.date}</td>
                      <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{entry.feeName}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-rose-600">{entry.debit ? `৳${entry.debit}` : '—'}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-emerald-600">{entry.credit ? `৳${entry.credit}` : '—'}</td>
                      <td className="py-2 px-3 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">৳{entry.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Payments */}
        {activeTab === 'payments' && (
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <tr className="text-slate-600 dark:text-slate-400">
                    <th className="py-2 px-3">Receipt No</th>
                    <th className="py-2 px-3">Payment Date</th>
                    <th className="py-2 px-3">Method</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(payments || [
                    { id: 1, receiptNumber: 'RCP-2026-0042', paymentDate: '2026-09-10', paymentMethod: 'CASH', amount: 2000, status: 'COMPLETED' },
                    { id: 2, receiptNumber: 'RCP-2026-0012', paymentDate: '2026-08-05', paymentMethod: 'BKASH', amount: 2000, status: 'COMPLETED' },
                  ]).map((p: any) => (
                    <tr key={p.id}>
                      <td className="py-2 px-3 font-semibold text-blue-600 tabular-nums">{p.receiptNumber}</td>
                      <td className="py-2 px-3 tabular-nums">{p.paymentDate}</td>
                      <td className="py-2 px-3 font-mono">{p.paymentMethod}</td>
                      <td className="py-2 px-3 text-right font-bold tabular-nums">৳{p.amount}</td>
                      <td className="py-2 px-3 text-center">
                        <Badge variant={p.status === 'COMPLETED' ? 'success' : 'danger'}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Results */}
        {activeTab === 'results' && (
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <tr className="text-slate-600 dark:text-slate-400">
                    <th className="py-2 px-3">Subject</th>
                    <th className="py-2 px-3 text-center">Full Marks</th>
                    <th className="py-2 px-3 text-center">Pass Marks</th>
                    <th className="py-2 px-3 text-right">Obtained</th>
                    <th className="py-2 px-3 text-center">Grade</th>
                    <th className="py-2 px-3 text-center">GPA Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(results || [
                    { id: 1, examSubject: { subject: { name: 'Bangla 1st Paper' }, fullMarks: 100, passMarks: 33 }, obtainedMarks: 85, gradeName: 'A+', gradePoint: 5.0 },
                    { id: 2, examSubject: { subject: { name: 'English For Today' }, fullMarks: 100, passMarks: 33 }, obtainedMarks: 76, gradeName: 'A', gradePoint: 4.0 },
                    { id: 3, examSubject: { subject: { name: 'General Mathematics' }, fullMarks: 100, passMarks: 33 }, obtainedMarks: 92, gradeName: 'A+', gradePoint: 5.0 },
                  ]).map((res: any) => (
                    <tr key={res.id}>
                      <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {res.examSubject?.subject?.name || 'Subject'}
                      </td>
                      <td className="py-2 px-3 text-center tabular-nums">{res.examSubject?.fullMarks || 100}</td>
                      <td className="py-2 px-3 text-center tabular-nums">{res.examSubject?.passMarks || 33}</td>
                      <td className="py-2 px-3 text-right font-bold tabular-nums text-blue-600">{res.obtainedMarks}</td>
                      <td className="py-2 px-3 text-center font-bold text-emerald-600">{res.gradeName}</td>
                      <td className="py-2 px-3 text-center tabular-nums font-semibold">{res.gradePoint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
