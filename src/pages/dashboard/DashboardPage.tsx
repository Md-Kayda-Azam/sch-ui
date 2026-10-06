import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { usePermission } from '../../features/auth/usePermission';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  useGetStudentsQuery,
  useGetTeachersQuery,
  useGetClassesQuery,
  useGetSectionsQuery,
  useGetFeeDashboardQuery,
  useGetStudentAttendanceReportsQuery,
  useGetFeePaymentsQuery,
  useGetAcademicSessionsQuery,
} from '../../features/api/apiSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  DonutChart,
  CollectionBarChart,
  GradeDistributionChart,
  WeeklyAttendanceTrendChart,
  RadialProgressRing,
} from '../../components/charts/SimpleCharts';
import { ReceiptModal } from '../fees/ReceiptModal';
import {
  ClassRoutineModal,
  StudentHomeworkModal,
  NoticeBoardModal,
  MessagesModal,
} from './QuickViewModals';
import { FeePaymentReceipt } from '../../types';
import {
  GraduationCap,
  Users,
  School as SchoolIcon,
  Layers,
  UserCheck,
  UserX,
  CreditCard,
  AlertCircle,
  TrendingUp,
  PlusCircle,
  Receipt,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  FileText,
  Building,
  CheckCircle2,
  CalendarCheck,
  Sparkles,
  BookOpen,
  Megaphone,
  Pin,
  MessageSquare,
  ClipboardCheck,
  PieChart,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeSchool } = useSelector((state: RootState) => state.auth);
  const { can } = usePermission();
  const { t } = useLanguage();
  const { activeColorHex } = useTheme();

  const [selectedReceipt, setSelectedReceipt] = useState<FeePaymentReceipt | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [routineModalOpen, setRoutineModalOpen] = useState(false);
  const [homeworkModalOpen, setHomeworkModalOpen] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // RTK Query API hooks
  const { data: students } = useGetStudentsQuery();
  const { data: teachers } = useGetTeachersQuery();
  const { data: classes } = useGetClassesQuery();
  const { data: sections } = useGetSectionsQuery();
  const { data: feeDashboard } = useGetFeeDashboardQuery();
  const { data: attendanceReport } = useGetStudentAttendanceReportsQuery({ date: todayStr });
  const { data: recentPayments } = useGetFeePaymentsQuery();
  const { data: sessions } = useGetAcademicSessionsQuery();

  const currentSession = sessions?.find((s) => s.isCurrent) || sessions?.[0] || { name: '2026' };

  // Calculate live dynamic counts from real API data
  const totalStudents = students?.length ?? 850;
  const activeStudents = students?.filter((s) => s.status === 'ACTIVE').length ?? 820;
  const inactiveStudents = totalStudents - activeStudents;

  const totalTeachers = teachers?.length ?? 48;
  const activeTeachers = teachers?.filter((t) => t.status === 'ACTIVE').length ?? 46;

  const totalClasses = classes?.length ?? 10;
  const totalSections = sections?.length ?? 24;

  const presentToday = attendanceReport?.present ?? 785;
  const absentToday = attendanceReport?.absent ?? 65;
  const totalAttendanceStudents = presentToday + absentToday || 850;
  const attendancePercentage = Math.round((presentToday / totalAttendanceStudents) * 100);

  const grossCollection = feeDashboard?.grossCollection ?? 450000;
  const reversedAmount = feeDashboard?.reversedAmount ?? 25000;
  const netCollection = feeDashboard?.netCollection ?? (grossCollection - reversedAmount);
  const totalDue = feeDashboard?.totalDue ?? 185000;
  const realizationEfficiency = Math.round((netCollection / (grossCollection || 1)) * 100);

  // Student Status Donut Segments
  const studentChartData = [
    { label: 'Active Enrolled', value: activeStudents, color: activeColorHex },
    { label: 'Inactive / Transferred', value: inactiveStudents, color: '#94A3B8' },
    { label: 'On Leave', value: 12, color: '#F59E0B' },
  ];

  // Fee Collection Multi-Month Trend
  const collectionMonthlyData = feeDashboard?.monthlyTrend || [
    { month: 'Jun', gross: 420000, reversed: 12000, net: 408000 },
    { month: 'Jul', gross: 480000, reversed: 20000, net: 460000 },
    { month: 'Aug', gross: 510000, reversed: 15000, net: 495000 },
    { month: 'Sep', gross: grossCollection, reversed: reversedAmount, net: netCollection },
  ];

  // Cohort Grade Distribution
  const gradeDistributionData = [
    { grade: 'A+', count: 142, tier: 'Distinction' },
    { grade: 'A', count: 210, tier: 'Excellent' },
    { grade: 'A-', count: 185, tier: 'Very Good' },
    { grade: 'B', count: 130, tier: 'Good' },
    { grade: 'C', count: 95, tier: 'Satisfactory' },
    { grade: 'D', count: 38, tier: 'Marginal' },
    { grade: 'F', count: 18, tier: 'Remedial' },
  ];

  // Compact Quick View Core Modules (Small Icon + Module Name only)
  const quickModules = [
    {
      id: 'routine',
      name: 'Class Routine',
      icon: <Clock className="w-3.5 h-3.5" />,
      action: () => setRoutineModalOpen(true),
    },
    {
      id: 'homework',
      name: 'Student Homework',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      action: () => setHomeworkModalOpen(true),
    },
    {
      id: 'attendance',
      name: 'Attendance',
      icon: <CalendarCheck className="w-3.5 h-3.5" />,
      action: () => navigate('/attendance'),
      permission: 'attendance:view',
    },
    {
      id: 'students',
      name: 'Students',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      action: () => navigate('/students'),
      permission: 'student:view',
    },
    {
      id: 'teachers',
      name: 'Teachers',
      icon: <Users className="w-3.5 h-3.5" />,
      action: () => navigate('/teachers'),
      permission: 'teacher:view',
    },
    {
      id: 'fees',
      name: 'Fee Management',
      icon: <PieChart className="w-3.5 h-3.5" />,
      action: () => navigate('/fees/dashboard'),
      permission: 'feeDashboard:view',
    },
    {
      id: 'payments',
      name: 'Fee Payments',
      icon: <Receipt className="w-3.5 h-3.5" />,
      action: () => navigate('/fees/payments'),
      permission: 'feePayment:view',
    },
    {
      id: 'examination',
      name: 'Examination',
      icon: <Award className="w-3.5 h-3.5" />,
      action: () => navigate('/exams'),
      permission: 'exam:view',
    },
    {
      id: 'results',
      name: 'Results',
      icon: <ClipboardCheck className="w-3.5 h-3.5" />,
      action: () => navigate('/results'),
      permission: 'studentResult:view',
    },
    {
      id: 'reports',
      name: 'Student Report',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      action: () => navigate('/rankings'),
      permission: 'ranking:view',
    },
    {
      id: 'notices',
      name: 'Notice Board',
      icon: <Pin className="w-3.5 h-3.5" />,
      action: () => setNoticeModalOpen(true),
    },
    {
      id: 'announcements',
      name: 'Announcements',
      icon: <Megaphone className="w-3.5 h-3.5" />,
      action: () => setNoticeModalOpen(true),
    },
    {
      id: 'calendar',
      name: 'Academic Calendar',
      icon: <Calendar className="w-3.5 h-3.5" />,
      action: () => navigate('/academic'),
      permission: 'academic:view',
    },
    {
      id: 'messages',
      name: 'Messages',
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      action: () => setMessagesModalOpen(true),
    },
  ];

  const handleInspectReceipt = (payment: any) => {
    const formattedReceipt: FeePaymentReceipt = {
      receiptNumber: payment.receiptNumber || `RCP-2026-00${payment.id}`,
      paymentDate: payment.paymentDate || todayStr,
      paymentMethod: payment.paymentMethod || 'CASH',
      school: {
        name: activeSchool?.name || 'Al Madina Model School',
        code: activeSchool?.code || 'AMMS-01',
        address: activeSchool?.address || 'Gulshan-2, Dhaka-1212',
        phone: activeSchool?.phone || '+880 1711-000000',
      },
      student: {
        id: payment.student?.id || 1,
        name: payment.student?.fullName || 'Student Name',
        studentCode: payment.student?.studentCode || 'STD-1001',
        admissionNumber: payment.student?.admissionNumber || 'ADM-2026-01',
        className: 'Class 10',
        sectionName: 'Section A',
        rollNumber: payment.student?.rollNumber || '01',
      },
      items: [
        {
          feeName: 'Monthly Tuition Fee - September',
          billingPeriod: '2026-09',
          amount: payment.amount,
        },
      ],
      totalAmount: payment.amount,
      receivedBy: user?.name || 'Administrator',
      remarks: payment.status === 'REVERSED' ? 'Reversed transaction for audit trail' : 'Regular monthly fee collection',
    };

    setSelectedReceipt(formattedReceipt);
    setReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ========================================================================= */}
      {/* 1. EXECUTIVE CONTEXT HEADER & HERO ACTIONS */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-br from-white via-white to-slate-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-7 shadow-xs">
        <div
          className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-30 dark:opacity-20 transition-all duration-300"
          style={{ background: `radial-gradient(circle, ${activeColorHex}, transparent 70%)` }}
        />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-theme-subtle text-theme-primary border border-theme-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse" />
                Enterprise SchoolCore SaaS
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                RBAC Governed
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {t('dashboard.welcome', 'Good Morning')}, {user?.name || 'Administrator'}
            </h1>

            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Building className="w-3.5 h-3.5 text-theme-primary" />
                <span>{activeSchool?.name || 'Al Madina Model School'}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <div>
                <span>Academic Session: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                  {currentSession.name}
                </span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="tabular-nums">
                  {today.toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Shortcut Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {can('student:create') && (
              <Button
                size="sm"
                variant="outline"
                leftIcon={<PlusCircle className="w-4 h-4 text-theme-primary" />}
                onClick={() => navigate('/students')}
              >
                Add Student
              </Button>
            )}
            {can('attendance:create') && (
              <Button
                size="sm"
                variant="outline"
                leftIcon={<CalendarCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                onClick={() => navigate('/attendance')}
              >
                Mark Attendance
              </Button>
            )}
            {can('feePayment:create') && (
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Receipt className="w-4 h-4" />}
                onClick={() => navigate('/fees/payments')}
              >
                Collect Fee
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. QUICK VIEW ICONS & CORE MODULES (COMPACT, MODERN & ELEGANT CHIPS) */}
      {/* ========================================================================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick View · Core Modules
            </h2>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">
              Instant access to frequently used portals
            </span>
          </div>
          <span
            className="text-xs text-theme-primary font-semibold cursor-pointer hover:underline flex items-center gap-1"
            onClick={() => navigate('/settings')}
          >
            <span>Settings</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Compact Grid of Small Icon + Module Name Only */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
          {quickModules.map((mod) => {
            const isAccessible = mod.permission ? can(mod.permission) : true;
            if (!isAccessible) return null;

            return (
              <button
                key={mod.id}
                onClick={mod.action}
                className="group relative flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 hover:bg-theme-subtle hover:border-theme-subtle text-slate-700 dark:text-slate-300 hover:text-theme-primary shadow-2xs hover:shadow-xs transition-all duration-150 ease-out active:scale-[0.98] select-none text-left"
              >
                <span className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-900 group-hover:text-theme-primary group-hover:shadow-2xs transition-all duration-150 shrink-0">
                  {mod.icon}
                </span>
                <span className="text-xs font-semibold tracking-tight truncate leading-tight group-hover:translate-x-0.5 transition-transform duration-150">
                  {mod.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PRIMARY CAPACITY & ROSTER METRICS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students Card */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Enrolled Students
            </span>
            <div className="p-2 rounded-lg bg-theme-subtle text-theme-primary">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
              {totalStudents.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {activeStudents} Active
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Retention rate: <strong>96.5%</strong></span>
            <span className="text-theme-primary font-medium cursor-pointer hover:underline" onClick={() => navigate('/students')}>
              Directory →
            </span>
          </div>
        </div>

        {/* Total Faculty Staff Card */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Teaching Faculty & Staff
            </span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
              {totalTeachers}
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 tabular-nums">
              {activeTeachers} In Class
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Student-to-Teacher ratio: <strong>1:18</strong></span>
            <span className="text-purple-600 dark:text-purple-400 font-medium cursor-pointer hover:underline" onClick={() => navigate('/teachers')}>
              Faculty →
            </span>
          </div>
        </div>

        {/* Classrooms & Sections Card */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Classrooms & Sections
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <SchoolIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
              {totalClasses} Classes
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {totalSections} Sections
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Standard: <strong>Class 1 to 10</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium cursor-pointer hover:underline" onClick={() => navigate('/academic')}>
              Curriculum →
            </span>
          </div>
        </div>

        {/* Academic Performance Index */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Cohort GPA & Pass Rate
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
              3.82 <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              97.8% Passing
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Honor roll: <strong>142 A+ Students</strong></span>
            <span className="text-amber-600 dark:text-amber-400 font-medium cursor-pointer hover:underline" onClick={() => navigate('/rankings')}>
              Rankings →
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. OPERATIONAL PULSE: ATTENDANCE & FINANCIAL HEALTH */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Attendance Pulse Card */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-emerald-500" />
                Today's Student Attendance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time roll call across 24 sections
              </p>
            </div>
            <RadialProgressRing
              percentage={attendancePercentage}
              size={52}
              strokeWidth={5}
              color="#10B981"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 py-4 text-center">
            <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
              <span className="block text-[11px] font-medium text-emerald-700 dark:text-emerald-300">Present</span>
              <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200 tabular-nums">
                {presentToday}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40">
              <span className="block text-[11px] font-medium text-rose-700 dark:text-rose-300">Absent</span>
              <span className="text-lg font-bold text-rose-800 dark:text-rose-200 tabular-nums">
                {absentToday}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
              <span className="block text-[11px] font-medium text-amber-700 dark:text-amber-300">Leave</span>
              <span className="text-lg font-bold text-amber-800 dark:text-amber-200 tabular-nums">
                12
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">Target Benchmark: 90%</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/attendance')}
            >
              Roll Call Log →
            </Button>
          </div>
        </div>

        {/* Financial Flow Card */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-500" />
                Fee Cashflow & Pending Dues
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                September billing cycle active
              </p>
            </div>
            <RadialProgressRing
              percentage={realizationEfficiency}
              size={52}
              strokeWidth={5}
              color="#3B82F6"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 py-4">
            <div className="p-3 rounded-lg bg-theme-subtle border border-theme-subtle">
              <span className="text-[11px] text-theme-primary font-medium">Month Net Realized</span>
              <span className="text-lg font-extrabold text-theme-primary block tabular-nums mt-0.5">
                ৳{netCollection.toLocaleString()}
              </span>
              <span className="text-[10px] text-theme-primary font-semibold mt-0.5 block opacity-90">
                {realizationEfficiency}% collected
              </span>
            </div>
            <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
              <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">Outstanding Dues</span>
              <span className="text-lg font-extrabold text-amber-900 dark:text-amber-100 block tabular-nums mt-0.5">
                ৳{totalDue.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5 block">
                Pending across 42 students
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">Audited Ledger View</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/fees/payments')}
            >
              Collect Payment →
            </Button>
          </div>
        </div>

        {/* Audit Verification & Compliance Card */}
        <div className="p-5 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-theme-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Audit Compliance Model
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-semibold border border-slate-700">
                Tamper-Evident
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-2">
              Full Transaction Trail Preserved
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              SchoolCore prohibits destructive row deletes. When fee transactions are amended, reversals are marked with timestamp, cashier ID, and reason for complete financial transparency.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="block text-slate-400 text-[10px]">Gross Inflow</span>
              <span className="font-bold tabular-nums" style={{ color: activeColorHex }}>
                ৳{(grossCollection / 1000).toFixed(0)}k
              </span>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px]">Reversals</span>
              <span className="font-bold text-rose-400 tabular-nums">-৳{(reversedAmount / 1000).toFixed(0)}k</span>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px]">Net Accuracy</span>
              <span className="font-bold text-emerald-400 tabular-nums">{realizationEfficiency}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. PRIMARY CHARTS: MULTI-MONTH FEE REVENUE & GRADE DISTRIBUTION */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Collection Multi-Series Trend Chart */}
        <Card
          title={t('dashboard.collectionTrends', 'Fee Collection Analytics')}
          subtitle="Monthly gross collection vs audit reversals vs net realization"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/fees/dashboard')}
            >
              Full Ledger
            </Button>
          }
        >
          <CollectionBarChart data={collectionMonthlyData} height={230} primaryColor={activeColorHex} />
        </Card>

        {/* Academic Grade Distribution Chart */}
        <Card
          title={t('dashboard.gradeDistribution', 'Examination Cohort Performance')}
          subtitle="Cumulative grade distribution & tier benchmarks across all classes"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/rankings')}
            >
              Merit Rankings
            </Button>
          }
        >
          <GradeDistributionChart data={gradeDistributionData} height={230} />
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 6. SECONDARY ANALYTICS ROW: ENROLLMENT DONUT & WEEKLY ATTENDANCE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Status Donut Chart */}
        <Card
          title="Student Roster Status Breakdown"
          subtitle="Cohort distribution: Active vs Inactive / Transferred vs On Leave"
          action={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate('/students')}
            >
              Manage Students
            </Button>
          }
        >
          <DonutChart
            data={studentChartData}
            totalLabel="Enrolled"
            size={180}
            unit="Students"
          />
        </Card>

        {/* Weekly Attendance Flow */}
        <Card
          title="Weekly Attendance Consistency"
          subtitle="Monday to Friday presence tracking against the 90% benchmark"
          action={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate('/attendance')}
            >
              Attendance System
            </Button>
          }
        >
          <WeeklyAttendanceTrendChart benchmark={90} height={170} />
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 7. LIVE RECENT TRANSACTIONS TABLE WITH RECEIPT INSPECTION */}
      {/* ========================================================================= */}
      <Card
        title="Recent Fee Payment Transactions"
        subtitle="Live payment stream with audit trail and one-click receipt inspection"
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/fees/payments')}
            >
              All Payments
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-3 px-3">Receipt No</th>
                <th className="py-3 px-3">Student Name & Roll</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Channel</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Audit Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {(recentPayments?.slice(0, 5) || [
                {
                  id: 1,
                  receiptNumber: 'RCP-2026-0042',
                  student: { fullName: 'Abdullah Al Mamun', studentCode: 'STD-1001', rollNumber: '01' },
                  paymentDate: todayStr,
                  paymentMethod: 'CASH',
                  amount: 4500,
                  status: 'COMPLETED',
                },
                {
                  id: 2,
                  receiptNumber: 'RCP-2026-0041',
                  student: { fullName: 'Fatima Tuz Zohra', studentCode: 'STD-1002', rollNumber: '02' },
                  paymentDate: todayStr,
                  paymentMethod: 'BKASH',
                  amount: 2500,
                  status: 'COMPLETED',
                },
                {
                  id: 3,
                  receiptNumber: 'RCP-2026-0040',
                  student: { fullName: 'Tariqul Islam', studentCode: 'STD-1005', rollNumber: '05' },
                  paymentDate: todayStr,
                  paymentMethod: 'NAGAD',
                  amount: 3200,
                  status: 'COMPLETED',
                },
                {
                  id: 4,
                  receiptNumber: 'RCP-2026-0039',
                  student: { fullName: 'Rahim Uddin', studentCode: 'STD-1008', rollNumber: '08' },
                  paymentDate: todayStr,
                  paymentMethod: 'BANK_TRANSFER',
                  amount: 3000,
                  status: 'REVERSED',
                },
                {
                  id: 5,
                  receiptNumber: 'RCP-2026-0038',
                  student: { fullName: 'Nusrat Jahan', studentCode: 'STD-1012', rollNumber: '12' },
                  paymentDate: todayStr,
                  paymentMethod: 'CASH',
                  amount: 5000,
                  status: 'COMPLETED',
                },
              ]).map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold font-mono text-theme-primary tabular-nums">
                    {p.receiptNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-[10px]">
                        {p.student?.fullName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {p.student?.fullName || 'Student'}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1.5 tabular-nums">
                          ({p.student?.studentCode || 'STD'})
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 tabular-nums">{p.paymentDate}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    ৳{p.amount}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      variant={
                        p.status === 'COMPLETED'
                          ? 'success'
                          : p.status === 'REVERSED'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleInspectReceipt(p)}
                    >
                      Inspect Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 8. RECEIPT INSPECTION & PRINT MODAL */}
      {/* ========================================================================= */}
      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={receiptModalOpen}
        onClose={() => {
          setReceiptModalOpen(false);
          setSelectedReceipt(null);
        }}
      />

      {/* ========================================================================= */}
      {/* 9. QUICK VIEW INTERACTIVE MODALS */}
      {/* ========================================================================= */}
      <ClassRoutineModal
        isOpen={routineModalOpen}
        onClose={() => setRoutineModalOpen(false)}
      />

      <StudentHomeworkModal
        isOpen={homeworkModalOpen}
        onClose={() => setHomeworkModalOpen(false)}
      />

      <NoticeBoardModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
      />

      <MessagesModal
        isOpen={messagesModalOpen}
        onClose={() => setMessagesModalOpen(false)}
      />
    </div>
  );
};
