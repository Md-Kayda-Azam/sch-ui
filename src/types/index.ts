export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  roleId: number;
  role: Role;
  schoolId?: number;
  activeSchoolId?: number;
  school?: School;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  permissions?: string[];
}

export interface Role {
  id: number;
  name: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'ACCOUNTANT' | string;
  description?: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string; // e.g. "student:create", "fee:payment", etc.
  description?: string;
  module?: string;
}

export interface School {
  id: number;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt?: string;
  isActive?: boolean;
}

export interface AcademicSession {
  id: number;
  schoolId: number;
  name: string;
  year: number;
  isCurrent: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  startDate?: string;
  endDate?: string;
}

export interface Class {
  id: number;
  schoolId: number;
  name: string;
  code?: string;
  order?: number;
  sections?: Section[];
}

export interface Section {
  id: number;
  schoolId: number;
  classId: number;
  name: string;
  capacity?: number;
  class?: Class;
}

export interface Subject {
  id: number;
  schoolId: number;
  name: string;
  code: string;
  type: 'THEORY' | 'PRACTICAL';
}

export interface Department {
  id: number;
  schoolId: number;
  name: string;
  code: string;
}

export interface Student {
  id: number;
  userId: number;
  schoolId: number;

  /* User */
  user?: {
    id: number;
    name: string;
    email: string | null;
    password: string | null;
    phone: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };

  /* School */
  school?: {
    id: number;
    name: string;
    code: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };

  /* Identity */
  studentCode: string;
  admissionNumber: string;
  admissionDate: string;

  /* Personal */
  name: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';

  dateOfBirth?: string;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  birthCertificateNo?: string;
  previousSchool?: string;

  /* Contact */
  phone?: string;
  email?: string;
  emergencyContact?: string;
  address?: string;
  photoUrl?: string;

  /* Status */
  isActive: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'GRADUATED';

  /* SMS */
  sendWelcomeSms?: boolean;

  /* System */
  createdAt: string;
  updatedAt: string;

  /* Relations */
  enrollments?: StudentEnrollment[];
  studentParents?: StudentParent[];
}

export interface StudentEnrollment {
  id: number;
  schoolId: number;
  studentId: number;
  sessionId: number;
  classId: number;
  sectionId?: number;

  rollNumber: string | number;

  isCurrent: boolean;

  status: 'ACTIVE' | 'COMPLETED' | 'TRANSFERRED';

  student?: Student;
  session?: AcademicSession;
  class?: Class;
  section?: Section;
}

export interface Parent {
  id: number;
  schoolId: number;

  name: string;
  phone: string;

  email?: string;
  occupation?: string;
  workplace?: string;
  address?: string;
  emergencyContact?: string;
}

export interface StudentParent {
  id: number;
  studentId: number;
  parentId: number;

  relationship: 'FATHER' | 'MOTHER' | 'GUARDIAN';

  isPrimary: boolean;
  isEmergencyContact: boolean;

  parent?: Parent;
}

export interface Teacher {
  id: number;
  userId: number;
  schoolId: number;

  /* User */
  user: {
    id: number;
    name: string;
    email: string | null;
    password: string | null;
    phone: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };

  /* School */
  school: {
    id: number;
    name: string;
    code: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };

  /* Teacher */
  teacherCode: string;
  joiningDate: string;
  designation: string;
  qualification?: string;
  specialization?: string;

  /* Contact */
  emergencyContact?: string;
  address?: string;

  /* Status */
  isActive: boolean;

  /* System */
  createdAt: string;
  updatedAt: string;

  /* Relations */
  assignments?: TeacherAssignment[];
}

/* Payload for updating a teacher */
export interface UpdateTeacherPayload {
  id: number;

  /* User fields */
  name?: string;
  email?: string;
  phone?: string;

  /* Teacher fields */
  joiningDate?: string;
  designation?: string;
  qualification?: string;
  specialization?: string;
  emergencyContact?: string;
  address?: string;
}

/* Payload for status toggle */
export interface UpdateTeacherStatusPayload {
  id: number;
  isActive: boolean;
}
export interface TeacherAssignment {
  id: number;
  schoolId: number;
  teacherId: number;
  sessionId: number;
  classId: number;
  sectionId?: number;
  subjectId?: number;
  departmentId?: number;
  isClassTeacher: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  teacher?: Teacher;
  class?: Class;
  section?: Section;
  subject?: Subject;
  session?: AcademicSession;
}

export interface StudentAttendance {
  id: number;
  schoolId: number;
  studentId: number;
  enrollmentId?: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
  remarks?: string;
  student?: Student;
}

export interface TeacherAttendance {
  id: number;
  schoolId: number;
  teacherId: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'PERSONAL_LEAVE';
  remarks?: string;
  teacher?: Teacher;
}

export interface AttendanceReportSummary {
  date?: string;
  month?: string;
  totalStudents: number;
  present: number;
  absent: number;
  leave: number;
  attendanceRate: number;
  records?: Array<{
    studentId: number;
    studentName: string;
    studentCode: string;
    roll: string | number;
    className: string;
    sectionName: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
    remarks?: string;
  }>;
}

export interface FeeGroup {
  id: number;
  schoolId: number;
  name: string;
  type: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Fee {
  id: number;
  schoolId: number;
  feeGroupId: number;
  name: string;
  amount: number;
  frequency: 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
  isOptional: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  feeGroup?: FeeGroup;
}

// ==================================================
// STUDENT FEE (Ledger-Based)
// ==================================================
export interface StudentFee {
  id: number;
  schoolId: number;
  studentId: number;
  enrollmentId: number;
  feeId: number;

  /**
   * Billing period:
   *   Monthly  → "2026-09"
   *   Yearly   → "2026"
   *   Exam     → "HALF-YEARLY-2026"
   *   Once     → "ONCE"
   */
  billingPeriod: string;

  /**
   * ⚠️ IMMUTABLE — original fee amount
   * Never changes after creation (except via FeeAdjustment)
   */
  baseAmount: number;

  /**
   * ⚠️ CACHED — computed from ledger
   * Source of truth = baseAmount + adjustments - payments
   */
  cachedPaidAmount: number;
  cachedDueAmount: number;

  status: 'UNPAID' | 'PARTIAL' | 'PAID';
  dueDate: string | null;
  remarks: string | null;

  createdAt?: string;
  updatedAt?: string;

  // Relations (optional — populated by backend)
  fee?: Fee;
  student?: Student;
  enrollment?: any;

  // Ledger relations (optional)
  adjustments?: FeeAdjustment[];
  payments?: FeePaymentItem[];

  /**
   * ⚠️ Deprecated — old field names for backward compatibility
   * Use baseAmount / cachedPaidAmount / cachedDueAmount instead
   */
  amount?: number;
  discount?: number;
  paidAmount?: number;
  dueAmount?: number;
}

// ==================================================
// FEE ADJUSTMENT (Ledger)
// ==================================================
export interface FeeAdjustment {
  id: number;
  studentFeeId: number;

  type:
  | 'DISCOUNT'
  | 'SCHOLARSHIP'
  | 'WAIVER'
  | 'EXTRA_CHARGE'
  | 'CORRECTION';

  /**
   * Signed amount:
   *   DISCOUNT/SCHOLARSHIP/WAIVER → negative
   *   EXTRA_CHARGE/CORRECTION     → positive
   */
  amount: number;

  reason: string;
  adjustedBy: number;
  createdAt: string;

  // Relations (optional)
  studentFee?: StudentFee;
}

// ==================================================
// FEE PAYMENT ITEM (Snapshot)
// ==================================================
export interface FeePaymentItem {
  id: number;
  paymentId: number;       // ✅ NEW name
  feePaymentId?: number;   // old name (backward compat)
  studentFeeId: number;

  /** Amount paid against this fee in this payment */
  amount: number;

  // ---- SNAPSHOT FIELDS (state at payment time) ----
  baseAmountAtPayment: number;
  discountAtPayment: number;
  netAmountAtPayment: number;
  paidBeforePayment: number;
  dueBeforePayment: number;

  createdAt: string;

  // Relations (optional)
  studentFee?: StudentFee;
  payment?: any;
}

export interface FeePayment {
  id: number;
  schoolId: number;
  studentId: number;
  receiptNumber: string;
  paymentDate: string;
  paymentMethod: 'CASH' | 'BKASH' | 'NAGAD' | 'BANK' | 'CARD';
  amount: number;
  reversedAmount: number;
  netAmount: number;
  status: 'COMPLETED' | 'REVERSED' | 'PARTIALLY_REVERSED';
  remarks?: string;
  receivedBy?: string;
  items?: FeePaymentItem[];
  student?: Student;
  createdAt?: string;
}

export interface FeePaymentReceipt {
  receiptNumber: string;
  paymentDate: string;
  paymentMethod: string;
  school: {
    name: string;
    code: string;
    address?: string;
    phone?: string;
  };
  student: {
    id: number;
    name: string;
    studentCode: string;
    admissionNumber: string;
    className: string;
    sectionName: string;
    rollNumber: string | number;
  };
  items: Array<{
    feeName: string;
    billingPeriod: string;
    amount: number;
  }>;
  totalAmount: number;
  receivedBy: string;
  remarks?: string;
}

export interface LedgerEntry {
  id: number;
  date: string;
  type: 'FEE_CHARGE' | 'PAYMENT' | 'REVERSAL' | 'DISCOUNT';
  feeName: string;
  billingPeriod: string;
  debit: number; // charge
  credit: number; // payment
  balance: number;
  receiptNumber?: string;
  remarks?: string;
}

export interface FeeDashboardData {
  totalFees: number;
  totalDiscount: number;
  totalPaid: number;
  totalDue: number;
  grossCollection: number;
  reversedAmount: number;
  netCollection: number;
  paymentCount: number;
  reversalCount: number;
  monthlyTrend?: Array<{
    month: string;
    gross: number;
    reversed: number;
    net: number;
  }>;
  paymentMethodBreakdown?: Array<{
    method: string;
    amount: number;
    percentage: number;
  }>;
}

export interface Exam {
  id: number;
  schoolId: number;
  sessionId: number;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export interface ExamSubject {
  id: number;
  schoolId: number;
  examId: number;
  classId: number;
  sectionId?: number;
  subjectId: number;
  fullMarks: number;
  passMarks: number;
  examDate?: string;
  subject?: Subject;
  class?: Class;
}

export interface ResultGrade {
  id: number;
  schoolId: number;
  name: string; // e.g. "A+", "A"
  minMark: number;
  maxMark: number;
  gradePoint: number; // e.g. 5.0, 4.0
  comment?: string;
}

export interface StudentResult {
  id: number;
  schoolId: number;
  examSubjectId: number;
  studentId: number;
  obtainedMarks: number;
  isAbsent: boolean;
  gradePoint?: number;
  gradeName?: string;
  remarks?: string;
  student?: Student;
  examSubject?: ExamSubject;
}

export interface MarksheetSubject {
  subjectName: string;
  subjectCode: string;
  fullMarks: number;
  passMarks: number;
  obtainedMarks: number;
  isAbsent: boolean;
  gradeName: string;
  gradePoint: number;
}

export interface StudentMarksheet {
  school: {
    name: string;
    code: string;
    address?: string;
    phone?: string;
  };
  student: {
    id: number;
    name: string;
    studentCode: string;
    admissionNumber: string;
    className: string;
    sectionName: string;
    rollNumber: string | number;
  };
  exam: {
    name: string;
    code: string;
    year: string | number;
  };
  subjects: MarksheetSubject[];
  totalMarks: number;
  obtainedTotalMarks: number;
  averageMarks: number;
  gpa: number;
  finalResult: 'PASSED' | 'FAILED';
  marksPosition?: number;
  gpaPosition?: number;
}

export interface RankingItem {
  position: number;
  studentId: number;
  studentName: string;
  studentCode: string;
  rollNumber: string | number;
  className: string;
  sectionName?: string;
  totalMarks: number;
  averageMarks: number;
  gpa: number;
  status: 'PASSED' | 'FAILED';
}

export interface Homework {
  id: number;
  schoolId?: number;
  title: string;
  description: string;
  classId: number;
  className?: string;
  sectionId?: number;
  sectionName?: string;
  subjectId: number;
  subjectName?: string;
  assignedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  teacherId?: number;
  teacherName?: string;
  totalMarks?: number;
  status: 'ACTIVE' | 'SUBMITTED' | 'EVALUATED' | 'CLOSED';
  attachments?: string[];
  submissionCount?: number;
  totalStudents?: number;
}

export interface RoutinePeriod {
  id: number;
  dayOfWeek: 'SATURDAY' | 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "09:45 AM"
  periodNumber: number;
  classId: number;
  className?: string;
  sectionId?: number;
  sectionName?: string;
  subjectId: number;
  subjectName?: string;
  teacherId?: number;
  teacherName?: string;
  roomNumber?: string;
  isBreak?: boolean;
}

export interface Announcement {
  id: number;
  schoolId?: number;
  title: string;
  content: string;
  targetAudience: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'PARENTS' | 'STAFF';
  category: 'ACADEMIC' | 'EXAMINATION' | 'EVENT' | 'HOLIDAY' | 'URGENT' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  publishedDate: string; // YYYY-MM-DD
  expiryDate?: string;
  authorName?: string;
  authorRole?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  sendNotification?: boolean;
}
