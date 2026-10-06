import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import {
  User, School, AcademicSession, Class, Section, Subject, Department,
  Student, StudentEnrollment, Parent, StudentParent, Teacher, TeacherAssignment,
  StudentAttendance, TeacherAttendance, AttendanceReportSummary,
  FeeGroup, Fee, StudentFee, FeePayment, FeePaymentReceipt,
  FeeDashboardData, Exam, ExamSubject, ResultGrade, StudentResult,
  RankingItem, StudentMarksheet, LedgerEntry,
  UpdateTeacherStatusPayload,
  UpdateTeacherPayload
} from '../../types';

export const getApiBaseUrl = (): string => {
  const customUrl = localStorage.getItem('api_base_url');
  if (customUrl) return customUrl;
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
};

const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    const schoolId = state.auth.activeSchoolId;
    if (schoolId) {
      headers.set('x-school-id', String(schoolId));
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error) {
      console.warn(`[API] Error on ${typeof args === 'string' ? args : args.url}:`, result.error);
    }
    return result;
  },
  tagTypes: [
    'Auth',
    'Schools',
    'Users',
    'AcademicSessions',
    'Classes',
    'Sections',
    'Subjects',
    'Departments',
    'Students',
    'StudentEnrollments',
    'Parents',
    'StudentParents',
    'Teachers',
    'TeacherAssignments',
    'StudentAttendance',
    'TeacherAttendance',
    'AttendanceReports',
    'FeeGroups',
    'Fees',
    'StudentFees',
    'FeePayments',
    'Ledger',
    'CollectionReport',
    'FeeDashboard',
    'Exams',
    'ExamSubjects',
    'ResultGrades',
    'StudentResults',
    'ResultReports',
    'Rankings',
    'Marksheet',
  ],
  endpoints: (builder) => ({
    // ==========================================
    // 1. AUTH
    // ==========================================
    login: builder.mutation<{ accessToken: string; user: User }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    // ==========================================
    // 2. SCHOOLS
    // ==========================================
    getSchools: builder.query<School[], { search?: string; status?: string } | void>({
      query: (params) => ({
        url: '/schools',
        params: params || {},
      }),
      providesTags: ['Schools'],
    }),
    getSchool: builder.query<School, number>({
      query: (id) => `/schools/${id}`,
      providesTags: (result, error, id) => [{ type: 'Schools', id }],
    }),
    createSchool: builder.mutation<School, Partial<School>>({
      query: (body) => ({
        url: '/schools',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Schools'],
    }),
    updateSchool: builder.mutation<School, { id: number; data: Partial<School> }>({
      query: ({ id, data }) => ({
        url: `/schools/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Schools', { type: 'Schools', id }],
    }),
    updateSchoolStatus: builder.mutation<School, { id: number; isActive: Boolean }>({
      query: ({ id, isActive }) => ({
        url: `/schools/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Schools'],
    }),

    // ==========================================
    // 3. USERS
    // ==========================================
    getUsers: builder.query<User[], { schoolId?: number; roleId?: number; status?: string; search?: string } | void>({
      query: (params) => ({
        url: '/users',
        params: params || {},
      }),
      providesTags: ['Users'],
    }),
    getUser: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    createUser: builder.mutation<User, Partial<User> & { password?: string }>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation<User, { id: number; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Users', { type: 'Users', id }],
    }),
    updateUserStatus: builder.mutation<User, { id: number; status: 'ACTIVE' | 'INACTIVE' }>({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Users'],
    }),

    // ==========================================
    // 4. ACADEMIC
    // ==========================================
    getAcademicSessions: builder.query<AcademicSession[], { schoolId?: number } | void>({
      query: (params) => ({
        url: '/academic-sessions',
        params: params || {},
      }),
      providesTags: ['AcademicSessions'],
    }),
    createAcademicSession: builder.mutation<AcademicSession, Partial<AcademicSession>>({
      query: (body) => ({
        url: '/academic-sessions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AcademicSessions'],
    }),
    updateAcademicSession: builder.mutation<AcademicSession, { id: number; data: Partial<AcademicSession> }>({
      query: ({ id, data }) => ({
        url: `/academic-sessions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['AcademicSessions'],
    }),
    updateAcademicSessionStatus: builder.mutation<AcademicSession, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/academic-sessions/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['AcademicSessions'],
    }),
    deleteAcademicSession: builder.mutation<AcademicSession, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/academic-sessions/${id}`,
        method: 'DELETE',
        body: { isActive },
      }),
      invalidatesTags: ['AcademicSessions'],
    }),
    // <------- Sections ------------->
    getClasses: builder.query<Class[], { schoolId?: number } | void>({
      query: (params) => ({
        url: '/classes',
        params: params || {},
      }),
      providesTags: ['Classes'],
    }),
    createClass: builder.mutation<Class, Partial<Class>>({
      query: (body) => ({
        url: '/classes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Classes'],
    }),
    updateClass: builder.mutation<Class, { id: number; data: Partial<Class> }>({
      query: ({ id, data }) => ({
        url: `/classes/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Classes'],
    }),
    updateClassStatus: builder.mutation<Class, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/classes/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Classes'],
    }),
    deleteClass: builder.mutation<Class, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/classes/${id}`,
        method: 'DELETE',
        body: { isActive },
      }),
      invalidatesTags: ['Sections'],
    }),
    // <------- Sections ------------->
    getSections: builder.query<Section[], { classId?: number; schoolId?: number } | void>({
      query: (params) => ({
        url: '/sections',
        params: params || {},
      }),
      providesTags: ['Sections'],
    }),
    createSection: builder.mutation<Section, Partial<Section>>({
      query: (body) => ({
        url: '/sections',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Sections'],
    }),
    updateSection: builder.mutation<Section, { id: number; data: Partial<Section> }>({
      query: ({ id, data }) => ({
        url: `/sections/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Sections'],
    }),
    updateSectionStatus: builder.mutation<Section, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/sections/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Sections'],
    }),
    deleteSection: builder.mutation<Section, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/sections/${id}`,
        method: 'DELETE',
        body: { isActive },
      }),
      invalidatesTags: ['Sections'],
    }),
    // <------- Subjects ------------->
    getSubjects: builder.query<Subject[], { schoolId?: number } | void>({
      query: (params) => ({
        url: '/subjects',
        params: params || {},
      }),
      providesTags: ['Subjects'],
    }),
    createSubject: builder.mutation<Subject, Partial<Subject>>({
      query: (body) => ({
        url: '/subjects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subjects'],
    }),
    updateSubject: builder.mutation<Subject, { id: number; data: Partial<Subject> }>({
      query: ({ id, data }) => ({
        url: `/subjects/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Subjects'],
    }),
    updateSubjectStatus: builder.mutation<Subject, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/subjects/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Subjects'],
    }),
    deleteSubject: builder.mutation<Subject, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/subjects/${id}`,
        method: 'DELETE',
        body: { isActive },
      }),
      invalidatesTags: ['Subjects'],
    }),
    // <------- Departments ------------->
    getDepartments: builder.query<Department[], { schoolId?: number } | void>({
      query: (params) => ({
        url: '/departments',
        params: params || {},
      }),
      providesTags: ['Departments'],
    }),
    createDepartment: builder.mutation<Department, Partial<Department>>({
      query: (body) => ({
        url: '/departments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Departments'],
    }),
    updateDepartment: builder.mutation<Department, { id: number; data: Partial<Department> }>({
      query: ({ id, data }) => ({
        url: `/departments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Departments'],
    }),
    updateDepartmentStatus: builder.mutation<Department, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/departments/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Departments'],
    }),
    deleteDepartment: builder.mutation<Department, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/departments/${id}`,
        method: 'DELETE',
        body: { isActive },
      }),
      invalidatesTags: ['Departments'],
    }),
    // ==========================================
    // 5. STUDENTS & ENROLLMENTS
    // ==========================================
    getStudents: builder.query<Student[], { sessionId?: number; classId?: number; sectionId?: number; status?: string; search?: string } | void>({
      query: (params) => ({
        url: '/students',
        params: params || {},
      }),
      providesTags: ['Students'],
    }),
    getStudent: builder.query<Student, number>({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Students', id }],
    }),
    createStudent: builder.mutation<Student, Partial<Student>>({
      query: (body) => ({
        url: '/students',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Students'],
    }),
    updateStudent: builder.mutation<Student, { id: number; data: Partial<Student> }>({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Students', { type: 'Students', id }],
    }),
    updateStudentStatus: builder.mutation<Student, { id: number; status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' }>({
      query: ({ id, status }) => ({
        url: `/students/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Students'],
    }),

    getStudentEnrollments: builder.query<StudentEnrollment[], { studentId?: number; sessionId?: number; classId?: number; sectionId?: number; isCurrent?: boolean } | void>({
      query: (params) => ({
        url: '/student-enrollments',
        params: params || {},
      }),
      providesTags: ['StudentEnrollments'],
    }),
    createStudentEnrollment: builder.mutation<StudentEnrollment, Partial<StudentEnrollment>>({
      query: (body) => ({
        url: '/student-enrollments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StudentEnrollments', 'Students'],
    }),
    updateStudentEnrollment: builder.mutation<StudentEnrollment, { id: number; data: Partial<StudentEnrollment> }>({
      query: ({ id, data }) => ({
        url: `/student-enrollments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['StudentEnrollments', 'Students'],
    }),

    // Parents & Student Parents
    getParents: builder.query<Parent[], { search?: string } | void>({
      query: (params) => ({
        url: '/parents',
        params: params || {},
      }),
      providesTags: ['Parents'],
    }),
    createParent: builder.mutation<Parent, Partial<Parent>>({
      query: (body) => ({
        url: '/parents',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Parents'],
    }),
    getStudentParents: builder.query<StudentParent[], { studentId?: number; parentId?: number } | void>({
      query: (params) => ({
        url: '/student-parents',
        params: params || {},
      }),
      providesTags: ['StudentParents'],
    }),
    createStudentParent: builder.mutation<StudentParent, Partial<StudentParent>>({
      query: (body) => ({
        url: '/student-parents',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StudentParents', 'Students'],
    }),

    // ==========================================
    // 6. TEACHERS
    // ==========================================
    getTeachers: builder.query<Teacher[], { status?: string; search?: string } | void>({
      query: (params) => ({
        url: '/teachers',
        params: params || {},
      }),
      providesTags: ['Teachers'],
    }),
    getTeacher: builder.query<Teacher, number>({
      query: (id) => `/teachers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Teachers', id }],
    }),
    createTeacher: builder.mutation<Teacher, Partial<Teacher>>({
      query: (body) => ({
        url: '/teachers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Teachers'],
    }),
    updateTeacher: builder.mutation<Teacher, UpdateTeacherPayload>({
      query: ({ id, ...data }) => ({
        url: `/teachers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Teachers', { type: 'Teachers', id }],
    }),
    updateTeacherStatus: builder.mutation<Teacher, UpdateTeacherStatusPayload>({
      query: ({ id, isActive }) => ({
        url: `/teachers/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Teachers'],
    }),

    getTeacherAssignments: builder.query<TeacherAssignment[], { teacherId?: number; sessionId?: number; classId?: number } | void>({
      query: (params) => ({
        url: '/teacher-assignments',
        params: params || {},
      }),
      providesTags: ['TeacherAssignments'],
    }),
    createTeacherAssignment: builder.mutation<TeacherAssignment, Partial<TeacherAssignment>>({
      query: (body) => ({
        url: '/teacher-assignments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TeacherAssignments'],
    }),

    // ==========================================
    // 7. ATTENDANCE
    // ==========================================
    getStudentAttendances: builder.query<StudentAttendance[], { date?: string; studentId?: number; enrollmentId?: number; status?: string }>({
      query: (params) => ({
        url: '/student-attendances',
        params,
      }),
      providesTags: ['StudentAttendance'],
    }),
    saveStudentAttendance: builder.mutation<StudentAttendance[], Array<{ studentId: number; enrollmentId?: number; date: string; status: string; remarks?: string }>>({
      query: (body) => ({
        url: '/student-attendances',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StudentAttendance', 'AttendanceReports'],
    }),
    getTeacherAttendances: builder.query<TeacherAttendance[], { date?: string; teacherId?: number; status?: string }>({
      query: (params) => ({
        url: '/teacher-attendances',
        params,
      }),
      providesTags: ['TeacherAttendance'],
    }),
    saveTeacherAttendance: builder.mutation<TeacherAttendance[], Array<{ teacherId: number; date: string; status: string; remarks?: string }>>({
      query: (body) => ({
        url: '/teacher-attendances',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TeacherAttendance', 'AttendanceReports'],
    }),
    getStudentAttendanceReports: builder.query<AttendanceReportSummary, { date?: string; month?: string; classId?: number; sectionId?: number; studentId?: number; sessionId?: number }>({
      query: (params) => ({
        url: '/student-attendance-reports',
        params,
      }),
      providesTags: ['AttendanceReports'],
    }),

    // ==========================================
    // 8. FEES
    // ==========================================
    getFeeGroups: builder.query<FeeGroup[], { schoolId?: number } | void>({
      query: (params) => ({
        url: '/fee-groups',
        params: params || {},
      }),
      providesTags: ['FeeGroups'],
    }),
    createFeeGroup: builder.mutation<FeeGroup, Partial<FeeGroup>>({
      query: (body) => ({
        url: '/fee-groups',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FeeGroups'],
    }),
    updateFeeGroup: builder.mutation<FeeGroup, { id: number; data: Partial<FeeGroup> }>({
      query: ({ id, data }) => ({
        url: `/fee-groups/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['FeeGroups'],
    }),
    updateFeeGroupStatus: builder.mutation<FeeGroup, { id: number; isActive: Boolean }>({
      query: ({ id, isActive }) => ({
        url: `/fee-groups/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['FeeGroups'],
    }),
    getFees: builder.query<Fee[], { feeGroupId?: number; schoolId?: number } | void>({
      query: (params) => ({
        url: '/fees',
        params: params || {},
      }),
      providesTags: ['Fees'],
    }),
    createFee: builder.mutation<Fee, Partial<Fee>>({
      query: (body) => ({
        url: '/fees',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Fees'],
    }),
    updateFee: builder.mutation<Fee, { id: number; data: Partial<Fee> }>({
      query: ({ id, data }) => ({
        url: `/fees/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Fees'],
    }),
    updateFeeStatus: builder.mutation<Fee, { id: number; isActive: Boolean }>({
      query: ({ id, isActive }) => ({
        url: `/fees/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Fees'],
    }),
    getStudentFees: builder.query<StudentFee[], { studentId?: number; status?: string; billingPeriod?: string; classId?: number } | void>({
      query: (params) => ({
        url: '/student-fees',
        params: params || {},
      }),
      providesTags: ['StudentFees'],
    }),
    createStudentFee: builder.mutation<StudentFee, Partial<StudentFee>>({
      query: (body) => ({
        url: '/student-fees',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StudentFees', 'Ledger', 'FeeDashboard'],
    }),
    generateMonthlyFees: builder.mutation<{ generated: number; skipped: number; failed: number }, { sessionId: number; classId?: number; sectionId?: number; feeId: number; billingPeriod: string; dueDate: string }>({
      query: (body) => ({
        url: '/student-fees/generate-monthly',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StudentFees', 'Ledger', 'FeeDashboard'],
    }),
    getStudentFeeLedger: builder.query<LedgerEntry[], number>({
      query: (studentId) => `/student-fees/ledger/${studentId}`,
      providesTags: (result, error, studentId) => [{ type: 'Ledger', id: studentId }],
    }),
    getFeeCollectionReport: builder.query<{ grossCollection: number; reversedAmount: number; netCollection: number; totalDue: number; paymentCount: number; reversalCount: number; records?: any[] }, { dateFrom?: string; dateTo?: string }>({
      query: (params) => ({
        url: '/student-fees/collection-report',
        params,
      }),
      providesTags: ['CollectionReport'],
    }),
    getFeeDashboard: builder.query<FeeDashboardData, { dateFrom?: string; dateTo?: string } | void>({
      query: (params) => ({
        url: '/student-fees/fee-dashboard',
        params: params || {},
      }),
      providesTags: ['FeeDashboard'],
    }),

    // ==========================================
    // 9. PAYMENTS & REVERSALS (Atomic multi-fee collection)
    // ==========================================
    getFeePayments: builder.query<FeePayment[], { studentId?: number; status?: string; dateFrom?: string; dateTo?: string } | void>({
      query: (params) => ({
        url: '/fee-payments',
        params: params || {},
      }),
      providesTags: ['FeePayments'],
    }),
    getFeePayment: builder.query<FeePayment, number>({
      query: (id) => `/fee-payments/${id}`,
      providesTags: (result, error, id) => [{ type: 'FeePayments', id }],
    }),
    createFeePayment: builder.mutation<FeePayment, {
      studentId: number;
      paymentDate: string;
      paymentMethod: string;
      remarks?: string;
      items: Array<{ studentFeeId: number; amount: number }>;
    }>({
      query: (body) => ({
        url: '/fee-payments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FeePayments', 'StudentFees', 'Ledger', 'CollectionReport', 'FeeDashboard'],
    }),
    reverseFeePayment: builder.mutation<FeePayment, { id: number; amount?: number; reason: string }>({
      query: ({ id, ...body }) => ({
        url: `/fee-payments/${id}/reverse`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FeePayments', 'StudentFees', 'Ledger', 'CollectionReport', 'FeeDashboard'],
    }),
    getFeePaymentReceipt: builder.query<FeePaymentReceipt, number>({
      query: (id) => `/fee-payments/${id}/receipt`,
    }),

    // ==========================================
    // 10. EXAMINATIONS
    // ==========================================
    getExams: builder.query<Exam[], { sessionId?: number; status?: string } | void>({
      query: (params) => ({
        url: '/exams',
        params: params || {},
      }),
      providesTags: ['Exams'],
    }),
    getExam: builder.query<Exam, number>({
      query: (id) => `/exams/${id}`,
      providesTags: (result, error, id) => [{ type: 'Exams', id }],
    }),
    createExam: builder.mutation<Exam, Partial<Exam>>({
      query: (body) => ({
        url: '/exams',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Exams'],
    }),
    updateExam: builder.mutation<Exam, { id: number; data: Partial<Exam> }>({
      query: ({ id, data }) => ({
        url: `/exams/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Exams'],
    }),
    deleteExam: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/exams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exams'],
    }),

    // Exam Subjects
    getExamSubjects: builder.query<ExamSubject[], { examId?: number; classId?: number; sectionId?: number } | void>({
      query: (params) => ({
        url: '/exam-subjects',
        params: params || {},
      }),
      providesTags: ['ExamSubjects'],
    }),
    createExamSubject: builder.mutation<ExamSubject, Partial<ExamSubject>>({
      query: (body) => ({
        url: '/exam-subjects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ExamSubjects'],
    }),
    deleteExamSubject: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/exam-subjects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ExamSubjects'],
    }),

    // Result Grades
    getResultGrades: builder.query<ResultGrade[], { schoolId?: number } | void>({
      query: (params) => ({
        url: '/result-grades',
        params: params || {},
      }),
      providesTags: ['ResultGrades'],
    }),
    createResultGrade: builder.mutation<ResultGrade, Partial<ResultGrade>>({
      query: (body) => ({
        url: '/result-grades',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ResultGrades'],
    }),

    // ==========================================
    // 11. RESULTS, MARKSHEET & RANKING
    // ==========================================
    getStudentResults: builder.query<StudentResult[], { examSubjectId?: number; studentId?: number; examId?: number } | void>({
      query: (params) => ({
        url: '/student-results',
        params: params || {},
      }),
      providesTags: ['StudentResults'],
    }),
    saveStudentResultsBatch: builder.mutation<StudentResult[], Array<{ examSubjectId: number; studentId: number; obtainedMarks: number; isAbsent: boolean; remarks?: string }>>({
      query: (body) => ({
        url: '/student-results',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StudentResults', 'ResultReports', 'Rankings', 'Marksheet'],
    }),
    getStudentResultReport: builder.query<any, { studentId: number; examId: number }>({
      query: (params) => ({
        url: '/student-results/reports/student',
        params,
      }),
      providesTags: ['ResultReports'],
    }),
    getSubjectResultReport: builder.query<any, { examSubjectId: number }>({
      query: (params) => ({
        url: '/student-results/reports/subject',
        params,
      }),
      providesTags: ['ResultReports'],
    }),
    getClassResultReport: builder.query<any, { examId: number; classId: number; sectionId?: number }>({
      query: (params) => ({
        url: '/student-results/reports/class',
        params,
      }),
      providesTags: ['ResultReports'],
    }),
    getExamSummaryReport: builder.query<any, { examId: number }>({
      query: (params) => ({
        url: '/student-results/reports/exam-summary',
        params,
      }),
      providesTags: ['ResultReports'],
    }),
    getRankings: builder.query<RankingItem[], { examId: number; classId: number; sectionId?: number; type?: 'marks' | 'gpa' }>({
      query: (params) => ({
        url: '/student-results/reports/ranking',
        params,
      }),
      providesTags: ['Rankings'],
    }),
    getMarksheet: builder.query<StudentMarksheet, { studentId: number; examId: number }>({
      query: (params) => ({
        url: '/student-results/marksheet',
        params,
      }),
      providesTags: ['Marksheet'],
    }),

    createFeeAdjustment: builder.mutation<ResultGrade, Partial<ResultGrade>>({
      query: (body) => ({
        url: '/result-grades',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ResultGrades'],
    }),
  }),
});

export const {
  // Auth
  useLoginMutation,
  useGetMeQuery,
  // Schools
  useGetSchoolsQuery,
  useGetSchoolQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useUpdateSchoolStatusMutation,
  // Users
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  // Academic
  useGetAcademicSessionsQuery,
  useCreateAcademicSessionMutation,
  useUpdateAcademicSessionMutation,
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useGetSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,

  useDeleteAcademicSessionMutation,
  useDeleteClassMutation,
  useDeleteDepartmentMutation,
  useDeleteSectionMutation,
  useDeleteSubjectMutation,

  useUpdateAcademicSessionStatusMutation,
  useUpdateClassStatusMutation,
  useUpdateDepartmentStatusMutation,
  useUpdateSectionStatusMutation,
  useUpdateSubjectStatusMutation,
  // Students
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useUpdateStudentStatusMutation,
  useGetStudentEnrollmentsQuery,
  useCreateStudentEnrollmentMutation,
  useUpdateStudentEnrollmentMutation,
  useGetParentsQuery,
  useCreateParentMutation,
  useGetStudentParentsQuery,
  useCreateStudentParentMutation,
  // Teachers
  useGetTeachersQuery,
  useGetTeacherQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useUpdateTeacherStatusMutation,
  useGetTeacherAssignmentsQuery,
  useCreateTeacherAssignmentMutation,
  // Attendance
  useGetStudentAttendancesQuery,
  useSaveStudentAttendanceMutation,
  useGetTeacherAttendancesQuery,
  useSaveTeacherAttendanceMutation,
  useGetStudentAttendanceReportsQuery,
  // Fees
  useGetFeeGroupsQuery,
  useCreateFeeGroupMutation,
  useUpdateFeeGroupMutation,
  useUpdateFeeGroupStatusMutation,
  useGetFeesQuery,
  useCreateFeeMutation,
  useUpdateFeeMutation,
  useUpdateFeeStatusMutation,
  useGetStudentFeesQuery,
  useCreateStudentFeeMutation,
  useGenerateMonthlyFeesMutation,
  useGetStudentFeeLedgerQuery,
  useGetFeeCollectionReportQuery,
  useGetFeeDashboardQuery,
  useCreateFeeAdjustmentMutation,
  // Payments
  useGetFeePaymentsQuery,
  useGetFeePaymentQuery,
  useCreateFeePaymentMutation,
  useReverseFeePaymentMutation,
  useGetFeePaymentReceiptQuery,
  // Exams
  useGetExamsQuery,
  useGetExamQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useGetExamSubjectsQuery,
  useCreateExamSubjectMutation,
  useDeleteExamSubjectMutation,
  useGetResultGradesQuery,
  useCreateResultGradeMutation,
  // Results
  useGetStudentResultsQuery,
  useSaveStudentResultsBatchMutation,
  useGetStudentResultReportQuery,
  useGetSubjectResultReportQuery,
  useGetClassResultReportQuery,
  useGetExamSummaryReportQuery,
  useGetRankingsQuery,
  useGetMarksheetQuery,
} = apiSlice;
