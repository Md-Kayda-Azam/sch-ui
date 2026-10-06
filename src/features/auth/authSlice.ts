import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, School } from '../../types';

interface AuthState {
  token: string | null;
  user: User | null;

  role: string | null;
  roleId: number | null;

  activeSchoolId: number | null;
  activeSchool: School | null;

  isSuperAdmin: boolean;

  permissions: string[];

  isAuthenticated: boolean;
}

// ============================================================
// RESTORE AUTH DATA FROM LOCAL STORAGE
// ============================================================

const storedToken = localStorage.getItem('access_token');

const storedUserJson =
  localStorage.getItem('user_data');

let parsedUser: User | null = null;

if (storedUserJson) {
  try {
    parsedUser = JSON.parse(storedUserJson);

    console.log(
      '[AuthSlice] Stored user:',
      parsedUser,
    );
  } catch (error) {
    console.error(
      '[AuthSlice] Failed to parse stored user:',
      error,
    );

    parsedUser = null;
  }
}

// ============================================================
// INITIAL ROLE
// ============================================================

const initialRole =
  parsedUser?.role?.name ||
  (storedToken ? 'SCHOOL_ADMIN' : null);

// ============================================================
// INITIAL ROLE ID
// ============================================================

const initialRoleId =
  parsedUser?.roleId ||
  (storedToken ? 2 : null);

// ============================================================
// INITIAL PERMISSIONS
//
// IMPORTANT:
//
// Backend response:
//
// {
//   role: "SCHOOL_ADMIN",
//   roleId: 2,
//   permissions: [
//      "student:view",
//      "teacher:view"
//   ]
// }
//
// So permission comes from:
//
// parsedUser.permissions
//
// NOT:
//
// parsedUser.role.permissions
// ============================================================

const initialPermissions =
  parsedUser?.permissions ?? [];

// ============================================================
// INITIAL ACTIVE SCHOOL
// ============================================================

const initialActiveSchoolId =
  parsedUser?.activeSchoolId ??
  parsedUser?.schoolId ??
  null;

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: AuthState = {
  token: storedToken,

  user: parsedUser,

  role: initialRole,

  roleId: initialRoleId,

  activeSchoolId: initialActiveSchoolId,

  activeSchool:
    parsedUser?.school ??
    null,

  isSuperAdmin:
    initialRole === 'SUPER_ADMIN' ||
    initialRoleId === 1,

  permissions: initialPermissions,

  isAuthenticated:
    !!storedToken,
};

// ============================================================
// AUTH SLICE
// ============================================================

export const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    // ========================================================
    // SET LOGIN CREDENTIALS
    // ========================================================

    setCredentials: (
      state,

      action: PayloadAction<{
        accessToken: string;
        user: User;
        permissions?: string[];
      }>,
    ) => {
      const {
        accessToken,
        user,
        permissions,
      } = action.payload;

      // ------------------------------------------------------
      // Token
      // ------------------------------------------------------

      state.token =
        accessToken;

      // ------------------------------------------------------
      // User
      // ------------------------------------------------------

      state.user =
        user;

      // ------------------------------------------------------
      // Role
      // ------------------------------------------------------

      state.role =
        user.role?.name ??
        (user.roleId === 1
          ? 'SUPER_ADMIN'
          : null);

      // ------------------------------------------------------
      // Role ID
      // ------------------------------------------------------

      state.roleId =
        user.roleId ?? null;

      // ------------------------------------------------------
      // Active School
      // ------------------------------------------------------

      state.activeSchoolId =
        user.activeSchoolId ??
        user.schoolId ??
        null;

      // ------------------------------------------------------
      // Active School Object
      // ------------------------------------------------------

      state.activeSchool =
        user.school ??
        null;

      // ------------------------------------------------------
      // Super Admin
      // ------------------------------------------------------

      state.isSuperAdmin =
        user.roleId === 1 ||
        user.role?.name === 'SUPER_ADMIN';

      // ------------------------------------------------------
      // Permissions
      //
      // IMPORTANT:
      //
      // permissions argument থাকলে সেটাই use হবে.
      //
      // না থাকলে user.permissions use হবে.
      //
      // কখনোই default permissions দেওয়া হবে না.
      // ------------------------------------------------------

      state.permissions =
        permissions ??
        user.permissions ??
        [];

      // ------------------------------------------------------
      // Authenticated
      // ------------------------------------------------------

      state.isAuthenticated =
        true;

      // ------------------------------------------------------
      // Save token
      // ------------------------------------------------------

      localStorage.setItem(
        'access_token',
        accessToken,
      );

      // ------------------------------------------------------
      // Save complete user including permissions
      // ------------------------------------------------------

      localStorage.setItem(
        'user_data',
        JSON.stringify(user),
      );

      console.log(
        '[AuthSlice] Login permissions:',
        state.permissions,
      );
    },

    // ========================================================
    // SET ACTIVE SCHOOL
    // ========================================================

    setActiveSchool: (
      state,

      action: PayloadAction<{
        schoolId: number;
        school?: School;
      }>,
    ) => {
      state.activeSchoolId =
        action.payload.schoolId;

      if (action.payload.school) {
        state.activeSchool =
          action.payload.school;
      }

      // Update user_data as well
      if (state.user) {
        state.user = {
          ...state.user,

          activeSchoolId:
            action.payload.schoolId,

          school:
            action.payload.school ??
            state.user.school,
        };

        localStorage.setItem(
          'user_data',
          JSON.stringify(state.user),
        );
      }
    },

    // ========================================================
    // UPDATE PERMISSIONS
    // ========================================================

    updatePermissions: (
      state,

      action: PayloadAction<string[]>,
    ) => {
      state.permissions =
        action.payload;

      // Keep user_data synchronized
      if (state.user) {
        state.user = {
          ...state.user,
          permissions:
            action.payload,
        };

        localStorage.setItem(
          'user_data',
          JSON.stringify(state.user),
        );
      }

      console.log(
        '[AuthSlice] Permissions updated:',
        state.permissions,
      );
    },

    // ========================================================
    // UPDATE USER PROFILE
    // ========================================================

    updateUserProfile: (
      state,

      action: PayloadAction<Partial<User>>,
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };

        localStorage.setItem(
          'user_data',
          JSON.stringify(state.user),
        );
      }
    },

    // ========================================================
    // LOGOUT
    // ========================================================

    logout: (
      state,
    ) => {
      state.token = null;

      state.user = null;

      state.role = null;

      state.roleId = null;

      state.activeSchoolId = null;

      state.activeSchool = null;

      state.isSuperAdmin = false;

      state.permissions = [];

      state.isAuthenticated = false;

      localStorage.removeItem(
        'access_token',
      );

      localStorage.removeItem(
        'user_data',
      );
    },
  },
});

// ============================================================
// EXPORT ACTIONS
// ============================================================

export const {
  setCredentials,
  setActiveSchool,
  updatePermissions,
  updateUserProfile,
  logout,
} = authSlice.actions;

// ============================================================
// EXPORT REDUCER
// ============================================================

export default authSlice.reducer;
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { User, School } from '../../types';

// interface AuthState {
//   token: string | null;
//   user: User | null;
//   role: string | null;
//   roleId: number | null;
//   activeSchoolId: number | null;
//   activeSchool: School | null;
//   isSuperAdmin: boolean;
//   permissions: string[];
//   isAuthenticated: boolean;
// }

// // Initial state restoring from localStorage if available
// const storedToken = localStorage.getItem('access_token');
// const storedUserJson = localStorage.getItem('user_data');
// let parsedUser: User | null = null;
// if (storedUserJson) {
//   try {
//     parsedUser = JSON.parse(storedUserJson);
//     console.log(parsedUser, "parsedUser")
//   } catch {
//     parsedUser = null;
//   }
// }

// // Fallback initial demo permissions if running offline
// // const defaultAdminPermissions = [
// //   'school:view', 'school:create', 'school:update', 'school:delete',
// //   'user:view', 'user:create', 'user:update', 'user:delete',
// //   'academic:view', 'academic:create', 'academic:update', 'academic:delete',
// //   'student:view', 'student:create', 'student:update', 'student:delete',
// //   'enrollment:view', 'enrollment:create', 'enrollment:update', 'enrollment:delete',
// //   'parent:view', 'parent:create', 'parent:update', 'parent:delete',
// //   'teacher:view', 'teacher:create', 'teacher:update', 'teacher:delete',
// //   'assignment:view', 'assignment:create', 'assignment:update',
// //   'attendance:view', 'attendance:create', 'attendance:update', 'attendance:report',
// //   'feeGroup:view', 'feeGroup:create', 'feeGroup:update',
// //   'fee:view', 'fee:create', 'fee:update',
// //   'studentFee:view', 'studentFee:create', 'studentFee:generate',
// //   'feePayment:view', 'feePayment:create', 'feePayment:reverse', 'feePayment:receipt',
// //   'ledger:view', 'feeReport:view', 'feeDashboard:view',
// //   'exam:view', 'exam:create', 'exam:update', 'exam:delete',
// //   'examSubject:view', 'examSubject:create', 'examSubject:update',
// //   'resultGrade:view', 'resultGrade:create', 'resultGrade:update',
// //   'studentResult:view', 'studentResult:create', 'studentResult:update',
// //   'marksheet:view', 'resultReport:view', 'ranking:view'
// // ];

// const initialRole = parsedUser?.role?.name || (storedToken ? 'SCHOOL_ADMIN' : null);
// const initialRoleId = parsedUser?.roleId || (storedToken ? 2 : null);

// const initialState: AuthState = {
//   token: storedToken,
//   user: parsedUser,
//   role: initialRole,
//   roleId: initialRoleId,
//   activeSchoolId: parsedUser?.schoolId || 1,
//   activeSchool: parsedUser?.school || {
//     id: 1,
//     name: 'Al Madina Model School',
//     code: 'AMS-1001',
//     address: 'Gulshan-2, Dhaka, Bangladesh',
//     phone: '+880 1711-000000',
//     email: 'info@almadinaschool.edu.bd',
//     status: true,
//   },
//   isSuperAdmin: initialRole === 'SUPER_ADMIN' || initialRoleId === 1,
//   permissions: parsedUser?.role?.permissions?.map(p => p.name) ?? [],
//   isAuthenticated: !!storedToken,
// };

// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (
//       state,
//       action: PayloadAction<{
//         accessToken: string;
//         user: User;
//         permissions?: string[];
//       }>
//     ) => {
//       const { accessToken, user, permissions } = action.payload;
//       state.token = accessToken;
//       state.user = user;
//       state.role = user.role?.name || (user.roleId === 1 ? 'SUPER_ADMIN' : 'SCHOOL_ADMIN');
//       state.roleId = user.roleId;
//       state.activeSchoolId = user.schoolId || 1;
//       state.activeSchool = user.school || null;
//       state.isSuperAdmin = user.roleId === 1 || user.role?.name === 'SUPER_ADMIN';
//       state.permissions = permissions || user.role?.permissions?.map(p => p.name) || [];
//       state.isAuthenticated = true;

//       localStorage.setItem('access_token', accessToken);
//       localStorage.setItem('user_data', JSON.stringify(user));
//     },
//     setActiveSchool: (
//       state,
//       action: PayloadAction<{ schoolId: number; school?: School }>
//     ) => {
//       state.activeSchoolId = action.payload.schoolId;
//       if (action.payload.school) {
//         state.activeSchool = action.payload.school;
//       }
//     },
//     updatePermissions: (state, action: PayloadAction<string[]>) => {
//       state.permissions = action.payload;
//     },
//     updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
//       if (state.user) {
//         state.user = { ...state.user, ...action.payload };
//         localStorage.setItem('user_data', JSON.stringify(state.user));
//       }
//     },
//     logout: (state) => {
//       state.token = null;
//       state.user = null;
//       state.role = null;
//       state.roleId = null;
//       state.activeSchoolId = null;
//       state.activeSchool = null;
//       state.isSuperAdmin = false;
//       state.permissions = [];
//       state.isAuthenticated = false;

//       localStorage.removeItem('access_token');
//       localStorage.removeItem('user_data');
//     },
//   },
// });

// export const { setCredentials, setActiveSchool, updatePermissions, updateUserProfile, logout } = authSlice.actions;
// export default authSlice.reducer;
