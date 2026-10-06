import React, {
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import { RootState } from '../app/store';

import {
  logout,
  setActiveSchool,
} from '../features/auth/authSlice';

import { usePermission } from '../features/auth/usePermission';

import {
  useLanguage,
} from '../context/LanguageContext';

import {
  useTheme,
  COLOR_THEMES,
} from '../context/ThemeContext';

import {
  useGetSchoolsQuery,
  useGetAcademicSessionsQuery,
} from '../features/api/apiSlice';

import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarCheck,
  Receipt,
  Shield,
  Settings,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
  Globe,
  LogOut,
  Building,
  Building2,
  BookOpen,
  PieChart,
  FolderTree,
  Calculator,
  CalendarDays,
  ClipboardCheck,
  Trophy,
  Palette,
  Check,
  CalendarRange,
  FileText,
  Megaphone,
  User,
  Award,
} from 'lucide-react';


// ============================================================
// TYPES
// ============================================================

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;

  /**
   * Backend permission name.
   *
   * Example:
   * student:view
   * fee_payment:view
   * student_result:view
   */
  permission?: string;

  /**
   * Alternative:
   *
   * Show menu only for specific role IDs.
   *
   * 1 = SUPER_ADMIN
   * 2 = SCHOOL_ADMIN
   * 3 = TEACHER
   * 4 = ACCOUNTANT
   * 5 = STUDENT
   */
  roles?: number[];

  badge?: string;
}


// ============================================================
// DASHBOARD LAYOUT
// ============================================================

export const DashboardLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    userDropdownOpen,
    setUserDropdownOpen,
  ] = useState(false);

  const [
    schoolDropdownOpen,
    setSchoolDropdownOpen,
  ] = useState(false);

  const [
    themePickerOpen,
    setThemePickerOpen,
  ] = useState(false);


  // ==========================================================
  // REFS
  // ==========================================================

  const themePickerRef =
    useRef<HTMLDivElement>(null);

  const userDropdownRef =
    useRef<HTMLDivElement>(null);

  const schoolDropdownRef =
    useRef<HTMLDivElement>(null);


  // ==========================================================
  // ROUTER
  // ==========================================================

  const location = useLocation();

  const navigate = useNavigate();


  // ==========================================================
  // REDUX
  // ==========================================================

  const dispatch = useDispatch();

  const {
    user,
    role,
    roleId,
    activeSchool,
    isSuperAdmin,
  } = useSelector(
    (state: RootState) => state.auth,
  );


  // ==========================================================
  // PERMISSION
  // ==========================================================

  const {
    can,
    hasAny,
  } = usePermission();


  // ==========================================================
  // LANGUAGE
  // ==========================================================

  const {
    language,
    setLanguage,
    t,
  } = useLanguage();


  // ==========================================================
  // THEME
  // ==========================================================

  const {
    isDark,
    setTheme,
    colorTheme,
    setColorTheme,
    activeColorHex,
  } = useTheme();


  // ==========================================================
  // CLOSE DROPDOWNS ON OUTSIDE CLICK
  // ==========================================================

  useEffect(() => {

    const handleOutsideClick = (
      event: MouseEvent,
    ) => {

      const target =
        event.target as Node;


      // Theme dropdown
      if (
        themePickerRef.current &&
        !themePickerRef.current.contains(
          target,
        )
      ) {
        setThemePickerOpen(false);
      }


      // User dropdown
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(
          target,
        )
      ) {
        setUserDropdownOpen(false);
      }


      // School dropdown
      if (
        schoolDropdownRef.current &&
        !schoolDropdownRef.current.contains(
          target,
        )
      ) {
        setSchoolDropdownOpen(false);
      }
    };


    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );


    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };

  }, []);


  // ==========================================================
  // SCHOOLS
  //
  // Only SUPER_ADMIN needs all schools.
  // ==========================================================

  const {
    data: schools,
  } = useGetSchoolsQuery(
    undefined,
    {
      skip: !isSuperAdmin,
    },
  );


  // ==========================================================
  // ACADEMIC SESSIONS
  // ==========================================================

  const {
    data: sessions,
  } = useGetAcademicSessionsQuery();


  const currentSession =
    sessions?.find(
      (session) =>
        session.isCurrent,
    ) ||
    sessions?.[0] ||
    {
      name: '2026',
    };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {

    dispatch(logout());

    navigate(
      '/login',
      {
        replace: true,
      },
    );
  };


  // ==========================================================
  // NAVIGATION GROUPS
  //
  // IMPORTANT:
  //
  // Permission names MUST exactly match backend.
  //
  // Backend examples:
  //
  // student:view
  // teacher:view
  // student_attendance:view
  // fee:view
  // fee_payment:view
  // student_fee:view
  // exam:view
  // student_result:view
  // result_grade:view
  // exam_subject:view
  // user:view
  // school:view
  // ==========================================================

  const navGroups: NavGroup[] = [

    // ========================================================
    // ACADEMIC & CURRICULUM
    // ========================================================

    {
      title: t(
        'nav.academic',
        'Academic & Curriculum',
      ),

      items: [

        // ----------------------------------------------------
        // Dashboard
        // ----------------------------------------------------

        {
          name: t(
            'nav.dashboard',
            'Dashboard',
          ),

          path: '/',

          icon: (
            <LayoutDashboard
              className="w-4 h-4"
            />
          ),
        },


        // ----------------------------------------------------
        // Class Routine
        // ----------------------------------------------------

        {
          name: t(
            'nav.routine',
            'Class Routine',
          ),

          path: '/routine',

          icon: (
            <CalendarRange
              className="w-4 h-4"
            />
          ),
        },


        // ----------------------------------------------------
        // Homework
        // ----------------------------------------------------

        {
          name: t(
            'nav.homework',
            'Homework',
          ),

          path: '/homework',

          icon: (
            <FileText
              className="w-4 h-4"
            />
          ),
        },


        // ----------------------------------------------------
        // Announcements
        // ----------------------------------------------------

        {
          name: t(
            'nav.announcements',
            'Announcements',
          ),

          path: '/announcements',

          icon: (
            <Megaphone
              className="w-4 h-4"
            />
          ),
        },


        // ----------------------------------------------------
        // Academic Setup
        //
        // Your backend currently has:
        //
        // academic_session:view
        // class:view
        // section:view
        // subject:view
        // department:view
        //
        // So use hasAny-style permission handling below.
        //
        // NavItem itself supports only one permission, so
        // we will handle this using a special permission
        // identifier later in filter.
        // ----------------------------------------------------

        {
          name: t(
            'nav.academicSetup',
            'Academic Setup',
          ),

          path: '/academic',

          icon: (
            <BookOpen
              className="w-4 h-4"
            />
          ),

          permission: 'academic_session:view',
        },
      ],
    },


    // ========================================================
    // STUDENTS & STAFF
    // ========================================================

    {
      title: t(
        'nav.students',
        'Students & Staff',
      ),

      items: [

        // ----------------------------------------------------
        // Students
        // ----------------------------------------------------

        {
          name: t(
            'nav.studentsDirectory',
            'Students Directory',
          ),

          path: '/students',

          icon: (
            <GraduationCap
              className="w-4 h-4"
            />
          ),

          permission: 'student:view',
        },


        // ----------------------------------------------------
        // Teachers
        // ----------------------------------------------------

        {
          name: t(
            'nav.teachers',
            'Teachers & Staff',
          ),

          path: '/teachers',

          icon: (
            <Users
              className="w-4 h-4"
            />
          ),

          permission: 'teacher:view',
        },


        // ----------------------------------------------------
        // Attendance
        //
        // Backend:
        // student_attendance:view
        // ----------------------------------------------------

        {
          name: t(
            'nav.attendance',
            'Attendance System',
          ),

          path: '/attendance',

          icon: (
            <CalendarCheck
              className="w-4 h-4"
            />
          ),

          permission:
            'student_attendance:view',
        },
      ],
    },


    // ========================================================
    // FINANCIAL & FEES
    // ========================================================

    {
      title: t(
        'nav.fees',
        'Financial & Fees',
      ),

      items: [

        // ----------------------------------------------------
        // Fee Dashboard
        //
        // Your current backend response has fee:view.
        //
        // If later you create:
        // fee_dashboard:view
        //
        // change this permission.
        // ----------------------------------------------------

        {
          name: t(
            'nav.feeDashboard',
            'Fee Analytics & Ledger',
          ),

          path: '/fees/dashboard',

          icon: (
            <PieChart
              className="w-4 h-4"
            />
          ),

          permission: 'fee:view',
        },


        // ----------------------------------------------------
        // Fee Structure
        // ----------------------------------------------------

        {
          name: t(
            'nav.allFees',
            'Fee Structure & Groups',
          ),

          path: '/fees/structure',

          icon: (
            <FolderTree
              className="w-4 h-4"
            />
          ),

          permission: 'fee:view',
        },


        // ----------------------------------------------------
        // Student Fees
        //
        // Backend:
        // student_fee:view
        // ----------------------------------------------------

        {
          name: t(
            'nav.studentFees',
            'Student Invoicing & Dues',
          ),

          path: '/fees/student-fees',

          icon: (
            <Calculator
              className="w-4 h-4"
            />
          ),

          permission:
            'student_fee:view',
        },


        // ----------------------------------------------------
        // Fee Payments
        //
        // Backend:
        // fee_payment:view
        // ----------------------------------------------------

        {
          name: t(
            'nav.payments',
            'Fee Collection & POS',
          ),

          path: '/fees/payments',

          icon: (
            <Receipt
              className="w-4 h-4"
            />
          ),

          permission:
            'fee_payment:view',
        },
      ],
    },


    // ========================================================
    // EXAMS & RESULTS
    // ========================================================

    {
      title: t(
        'nav.examination',
        'Exams & Results',
      ),

      items: [

        // ----------------------------------------------------
        // Exams
        // ----------------------------------------------------

        {
          name: t(
            'nav.exams',
            'Exam Schedules & Grading',
          ),

          path: '/exams',

          icon: (
            <CalendarDays
              className="w-4 h-4"
            />
          ),

          permission: 'exam:view',
        },


        // ----------------------------------------------------
        // Student Results
        //
        // Backend:
        // student_result:view
        // ----------------------------------------------------

        {
          name: t(
            'nav.studentResults',
            'Marks Entry & Scores',
          ),

          path: '/results',

          icon: (
            <ClipboardCheck
              className="w-4 h-4"
            />
          ),

          permission:
            'student_result:view',
        },


        // ----------------------------------------------------
        // Rankings
        //
        // Your current /auth/me response does NOT contain:
        //
        // ranking:view
        //
        // Therefore this menu will stay hidden for normal
        // users until backend permission is added.
        //
        // SUPER_ADMIN will still see it.
        // ----------------------------------------------------

        {
          name: t(
            'nav.ranking',
            'Rankings & Marksheets',
          ),

          path: '/rankings',

          icon: (
            <Trophy
              className="w-4 h-4"
            />
          ),

          permission:
            'ranking:view',
        },


        // ----------------------------------------------------
        // Result Grade
        // ----------------------------------------------------

        {
          name: t(
            'nav.resultGrades',
            'Result Grades',
          ),

          path: '/result-grades',

          icon: (
            <Award
              className="w-4 h-4"
            />
          ),

          permission:
            'result_grade:view',
        },


        // ----------------------------------------------------
        // Exam Subjects
        // ----------------------------------------------------

        {
          name: t(
            'nav.examSubjects',
            'Exam Subjects',
          ),

          path: '/exam-subjects',

          icon: (
            <BookOpen
              className="w-4 h-4"
            />
          ),

          permission:
            'exam_subject:view',
        },
      ],
    },


    // ========================================================
    // ADMINISTRATION
    // ========================================================

    {
      title: t(
        'nav.administration',
        'Administration',
      ),

      items: [

        // ----------------------------------------------------
        // Users & RBAC
        // ----------------------------------------------------

        {
          name: t(
            'nav.users',
            'Users & RBAC Roles',
          ),

          path: '/admin/users',

          icon: (
            <Shield
              className="w-4 h-4"
            />
          ),

          permission:
            'user:view',
        },


        // ----------------------------------------------------
        // Institutions
        //
        // IMPORTANT:
        //
        // Even if SCHOOL_ADMIN has:
        //
        // school:view
        //
        // this menu is ONLY for roleId 1.
        // ----------------------------------------------------

        {
          name: t(
            'nav.schools',
            'Institutions (Multi-School)',
          ),

          path: '/admin/schools',

          icon: (
            <Building2
              className="w-4 h-4"
            />
          ),

          permission:
            'school:view',

          roles: [1],
        },


        // ----------------------------------------------------
        // Settings
        // ----------------------------------------------------

        {
          name: t(
            'nav.settings',
            'System Settings',
          ),

          path: '/settings',

          icon: (
            <Settings
              className="w-4 h-4"
            />
          ),
        },
      ],
    },
  ];


  // ==========================================================
  // PERMISSION + ROLE FILTER
  // ==========================================================

  const getVisibleItems = (
    items: NavItem[],
  ) => {

    return items.filter(
      (item) => {

        // ----------------------------------------------------
        // SUPER ADMIN
        //
        // SUPER_ADMIN can see all navigation items unless
        // you explicitly restrict something differently.
        // ----------------------------------------------------

        if (isSuperAdmin) {

          // If roles exist and SUPER_ADMIN is not included,
          // hide it.
          if (
            item.roles &&
            !item.roles.includes(
              roleId ?? 0,
            )
          ) {
            return false;
          }

          return true;
        }


        // ----------------------------------------------------
        // ROLE CHECK
        //
        // If item has roles, current role must be included.
        // ----------------------------------------------------

        if (
          item.roles &&
          !item.roles.includes(
            roleId ?? 0,
          )
        ) {
          return false;
        }


        // ----------------------------------------------------
        // PERMISSION CHECK
        // ----------------------------------------------------

        if (
          item.permission &&
          !can(item.permission)
        ) {
          return false;
        }


        // ----------------------------------------------------
        // No restriction
        // ----------------------------------------------------

        return true;
      },
    );
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        h-screen
        w-full
        bg-slate-50
        dark:bg-slate-950
        text-slate-900
        dark:text-slate-100
        flex
        flex-col
        overflow-hidden
        antialiased
      "
    >

      {/* ==================================================== */}
      {/* HEADER                                               */}
      {/* ==================================================== */}

      <header
        className="
          no-print
          h-14
          shrink-0
          bg-white/95
          dark:bg-slate-900/95
          backdrop-blur-md
          border-b
          border-slate-200
          dark:border-slate-800
          z-40
          px-4
          sm:px-6
          flex
          items-center
          justify-between
        "
      >

        {/* ================================================== */}
        {/* LEFT                                               */}
        {/* ================================================== */}

        <div className="flex items-center gap-3">

          {/* Mobile Menu */}
          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen,
              )
            }
            className="
              lg:hidden
              p-1.5
              rounded-lg
              text-slate-500
              hover:text-slate-900
              dark:hover:text-slate-100
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-colors
            "
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>


          {/* Logo */}
          <Link
            to="/"
            className="
              flex
              items-center
              gap-2.5
              text-slate-900
              dark:text-slate-100
              font-bold
              text-lg
              tracking-tight
              hover:opacity-95
              group
              transition-opacity
            "
          >

            <div
              className="
                w-8
                h-8
                rounded-lg
                bg-theme-gradient
                flex
                items-center
                justify-center
                text-white
                text-xs
                font-black
                shadow-xs
                group-hover:scale-105
                transition-transform
              "
            >
              SC
            </div>

            <div className="flex flex-col leading-none">

              <span className="font-extrabold tracking-tight">
                SchoolCore
              </span>

              <span
                className="
                  text-[10px]
                  text-slate-400
                  font-semibold
                  tracking-wider
                  uppercase
                  mt-0.5
                "
              >
                Enterprise SaaS
              </span>

            </div>

          </Link>
        </div>


        {/* ================================================== */}
        {/* CENTER                                             */}
        {/* ================================================== */}

        <div
          className="
            hidden
            md:flex
            items-center
            gap-4
            text-xs
          "
        >

          {/* ================================================= */}
          {/* SCHOOL SWITCHER                                  */}
          {/* ================================================= */}

          {isSuperAdmin &&
            schools &&
            schools.length > 0 ? (

            <div
              className="relative"
              ref={schoolDropdownRef}
            >

              <button
                onClick={() =>
                  setSchoolDropdownOpen(
                    !schoolDropdownOpen,
                  )
                }
                className="
                  flex
                  items-center
                  gap-1.5
                  py-1
                  px-2.5
                  rounded-lg
                  border
                  border-slate-200
                  dark:border-slate-700
                  bg-slate-50
                  dark:bg-slate-800/80
                  text-slate-700
                  dark:text-slate-200
                  font-medium
                  hover:bg-slate-100
                  dark:hover:bg-slate-700
                  transition-colors
                "
              >

                <Building
                  className="
                    w-3.5
                    h-3.5
                    text-theme-primary
                  "
                />

                <span
                  className="
                    truncate
                    max-w-[180px]
                  "
                >
                  {activeSchool?.name ||
                    'All Schools'}
                </span>

                <ChevronDown
                  className="
                    w-3
                    h-3
                    text-slate-400
                  "
                />

              </button>


              {schoolDropdownOpen && (

                <div
                  className="
                    absolute
                    left-0
                    mt-1
                    w-64
                    bg-white
                    dark:bg-slate-900
                    border
                    border-slate-200
                    dark:border-slate-800
                    rounded-xl
                    shadow-lg
                    py-1.5
                    z-50
                    animate-in
                    fade-in
                  "
                >

                  <div
                    className="
                      px-3
                      py-1
                      text-[11px]
                      font-semibold
                      text-slate-400
                      uppercase
                      tracking-wider
                    "
                  >
                    Switch School
                  </div>


                  {schools.map(
                    (school) => (

                      <button
                        key={school.id}
                        onClick={() => {

                          dispatch(
                            setActiveSchool({
                              schoolId:
                                school.id,

                              school,
                            }),
                          );

                          setSchoolDropdownOpen(
                            false,
                          );
                        }}
                        className={`
                          w-full
                          text-left
                          px-3
                          py-1.5
                          text-xs
                          flex
                          items-center
                          justify-between
                          hover:bg-slate-50
                          dark:hover:bg-slate-800
                          transition-colors
                          ${activeSchool?.id ===
                            school.id
                            ? `
                                text-theme-primary
                                font-semibold
                                bg-theme-subtle
                              `
                            : `
                                text-slate-700
                                dark:text-slate-300
                              `
                          }
                        `}
                      >

                        <span className="truncate">
                          {school.name}
                        </span>

                        <span
                          className="
                            text-[10px]
                            text-slate-400
                            ml-2
                            shrink-0
                          "
                        >
                          {school.code}
                        </span>

                      </button>

                    ),
                  )}

                </div>
              )}

            </div>

          ) : (

            <div
              className="
                flex
                items-center
                gap-1.5
                text-slate-600
                dark:text-slate-300
                font-medium
              "
            >

              <Building
                className="
                  w-3.5
                  h-3.5
                  text-slate-400
                "
              />

              <span
                className="
                  truncate
                  max-w-[200px]
                "
              >
                {activeSchool?.name ||
                  'SchoolCore Portal'}
              </span>

            </div>
          )}


          <span
            className="
              text-slate-300
              dark:text-slate-700
            "
          >
            |
          </span>


          {/* ================================================= */}
          {/* CURRENT SESSION                                  */}
          {/* ================================================= */}

          <div
            className="
              text-slate-500
              dark:text-slate-400
            "
          >

            <span>
              {t(
                'dashboard.currentSession',
                'Academic Session',
              )}
              :{' '}
            </span>

            <span
              className="
                font-semibold
                text-slate-700
                dark:text-slate-200
                tabular-nums
              "
            >
              {currentSession.name}
            </span>

          </div>

        </div>


        {/* ================================================== */}
        {/* RIGHT ACTIONS                                     */}
        {/* ================================================== */}

        <div className="flex items-center gap-2">

          {/* ================================================= */}
          {/* COLOR THEME                                     */}
          {/* ================================================= */}

          <div
            className="relative"
            ref={themePickerRef}
          >

            <button
              onClick={() =>
                setThemePickerOpen(
                  !themePickerOpen,
                )
              }
              title="Global Theme Color"
              className="
                flex
                items-center
                gap-1.5
                px-2.5
                py-1
                text-xs
                font-semibold
                rounded-lg
                text-slate-700
                dark:text-slate-200
                hover:bg-slate-100
                dark:hover:bg-slate-800
                transition-colors
                border
                border-slate-200
                dark:border-slate-800
                shadow-2xs
              "
            >

              <Palette
                className="
                  w-3.5
                  h-3.5
                  text-slate-500
                "
              />

              <span
                className="
                  w-2.5
                  h-2.5
                  rounded-full
                  shrink-0
                  shadow-2xs
                "
                style={{
                  backgroundColor:
                    activeColorHex,
                }}
              />

              <span
                className="
                  hidden
                  sm:inline
                  text-[11px]
                  capitalize
                "
              >
                {
                  COLOR_THEMES
                    .find(
                      (color) =>
                        color.id ===
                        colorTheme,
                    )
                    ?.name
                    .split(' ')[0]
                }
              </span>

              <ChevronDown
                className="
                  w-3
                  h-3
                  text-slate-400
                "
              />

            </button>


            {/* Color Picker */}
            {themePickerOpen && (

              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-56
                  bg-white
                  dark:bg-slate-900
                  border
                  border-slate-200
                  dark:border-slate-800
                  rounded-xl
                  shadow-xl
                  p-2
                  z-50
                  animate-in
                  fade-in
                "
              >

                <div
                  className="
                    px-2
                    py-1
                    text-[11px]
                    font-bold
                    text-slate-400
                    uppercase
                    tracking-wider
                    border-b
                    border-slate-100
                    dark:border-slate-800
                    mb-1
                  "
                >
                  Global Color Theme
                </div>


                <div className="space-y-1">

                  {COLOR_THEMES.map(
                    (themeOption) => {

                      const isSelected =
                        colorTheme ===
                        themeOption.id;


                      return (
                        <button
                          key={
                            themeOption.id
                          }
                          onClick={() => {

                            setColorTheme(
                              themeOption.id,
                            );

                            setThemePickerOpen(
                              false,
                            );
                          }}
                          className={`
                            w-full
                            flex
                            items-center
                            justify-between
                            px-2.5
                            py-1.5
                            rounded-lg
                            text-xs
                            transition-colors
                            ${isSelected
                              ? `
                                  bg-theme-subtle
                                  text-theme-primary
                                  font-bold
                                `
                              : `
                                  text-slate-700
                                  dark:text-slate-300
                                  hover:bg-slate-100
                                  dark:hover:bg-slate-800
                                `
                            }
                          `}
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2.5
                            "
                          >

                            <span
                              className="
                                w-3.5
                                h-3.5
                                rounded-full
                                shadow-xs
                                shrink-0
                                ring-1
                                ring-black/10
                                dark:ring-white/10
                              "
                              style={{
                                backgroundColor:
                                  themeOption.swatch,
                              }}
                            />

                            <span>
                              {
                                themeOption.name
                              }
                            </span>

                          </div>


                          {isSelected && (
                            <Check
                              className="
                                w-3.5
                                h-3.5
                                text-theme-primary
                              "
                            />
                          )}

                        </button>
                      );
                    },
                  )}

                </div>

              </div>
            )}

          </div>


          {/* ================================================= */}
          {/* LANGUAGE                                        */}
          {/* ================================================= */}

          <button
            onClick={() =>
              setLanguage(
                language === 'en'
                  ? 'bn'
                  : 'en',
              )
            }
            title="Toggle Language"
            className="
              flex
              items-center
              gap-1
              px-2
              py-1
              text-xs
              font-semibold
              rounded-lg
              text-slate-600
              dark:text-slate-300
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-colors
              border
              border-slate-200
              dark:border-slate-800
            "
          >

            <Globe
              className="
                w-3.5
                h-3.5
                text-slate-400
              "
            />

            <span>
              {language === 'en'
                ? 'বাং'
                : 'EN'}
            </span>

          </button>


          {/* ================================================= */}
          {/* DARK / LIGHT                                    */}
          {/* ================================================= */}

          <button
            onClick={() =>
              setTheme(
                isDark
                  ? 'light'
                  : 'dark',
              )
            }
            title="Toggle Dark / Light Mode"
            className="
              p-1.5
              rounded-lg
              text-slate-600
              dark:text-slate-300
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-colors
              border
              border-slate-200
              dark:border-slate-800
            "
          >

            {isDark ? (
              <Sun
                className="
                  w-4
                  h-4
                  text-amber-400
                "
              />
            ) : (
              <Moon
                className="
                  w-4
                  h-4
                  text-slate-500
                "
              />
            )}

          </button>


          {/* ================================================= */}
          {/* USER DROPDOWN                                   */}
          {/* ================================================= */}

          <div
            className="relative"
            ref={userDropdownRef}
          >

            <button
              onClick={() =>
                setUserDropdownOpen(
                  !userDropdownOpen,
                )
              }
              className="
                flex
                items-center
                gap-2
                pl-2
                pr-1.5
                py-1
                rounded-lg
                hover:bg-slate-100
                dark:hover:bg-slate-800
                transition-colors
                border
                border-transparent
                hover:border-slate-200
                dark:hover:border-slate-700
              "
            >

              <div
                className="
                  w-7
                  h-7
                  rounded-full
                  bg-theme-subtle
                  text-theme-primary
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-bold
                  ring-1
                  border-theme-subtle
                "
              >
                {user?.name?.charAt(0) ||
                  'U'}
              </div>


              <div
                className="
                  hidden
                  sm:flex
                  flex-col
                  text-left
                "
              >

                <span
                  className="
                    text-xs
                    font-semibold
                    text-slate-800
                    dark:text-slate-200
                    leading-none
                    truncate
                    max-w-[120px]
                  "
                >
                  {user?.name ||
                    'Administrator'}
                </span>

                <span
                  className="
                    text-[10px]
                    text-slate-400
                    mt-0.5
                    leading-none
                  "
                >
                  {role || 'Staff'}
                </span>

              </div>


              <ChevronDown
                className="
                  w-3
                  h-3
                  text-slate-400
                "
              />

            </button>


            {/* User Dropdown */}
            {userDropdownOpen && (

              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-52
                  bg-white
                  dark:bg-slate-900
                  border
                  border-slate-200
                  dark:border-slate-800
                  rounded-xl
                  shadow-xl
                  py-1.5
                  z-50
                  animate-in
                  fade-in
                "
              >

                <div
                  className="
                    px-3
                    py-2
                    border-b
                    border-slate-100
                    dark:border-slate-800
                  "
                >

                  <p
                    className="
                      text-xs
                      font-semibold
                      text-slate-900
                      dark:text-slate-100
                      truncate
                    "
                  >
                    {user?.name ||
                      'Admin User'}
                  </p>

                  <p
                    className="
                      text-[11px]
                      text-slate-400
                      truncate
                    "
                  >
                    {user?.email ||
                      'admin@school.com'}
                  </p>

                </div>


                {/* Profile */}
                <Link
                  to="/settings"
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    text-xs
                    text-slate-700
                    dark:text-slate-300
                    hover:bg-slate-50
                    dark:hover:bg-slate-800
                    transition-colors
                  "
                >

                  <User
                    className="
                      w-3.5
                      h-3.5
                      text-slate-400
                    "
                  />

                  <span>
                    My Profile
                  </span>

                </Link>


                {/* Settings */}
                <Link
                  to="/settings"
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    text-xs
                    text-slate-700
                    dark:text-slate-300
                    hover:bg-slate-50
                    dark:hover:bg-slate-800
                    transition-colors
                  "
                >

                  <Settings
                    className="
                      w-3.5
                      h-3.5
                      text-slate-400
                    "
                  />

                  <span>
                    {t(
                      'nav.settings',
                      'Settings',
                    )}
                  </span>

                </Link>


                {/* Logout */}
                <button
                  onClick={
                    handleLogout
                  }
                  className="
                    w-full
                    text-left
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    text-xs
                    text-rose-600
                    dark:text-rose-400
                    hover:bg-rose-50
                    dark:hover:bg-rose-950/30
                    transition-colors
                    border-t
                    border-slate-100
                    dark:border-slate-800
                    mt-1
                  "
                >

                  <LogOut
                    className="
                      w-3.5
                      h-3.5
                    "
                  />

                  <span>
                    {t(
                      'nav.logout',
                      'Logout',
                    )}
                  </span>

                </button>

              </div>
            )}

          </div>

        </div>

      </header>


      {/* ==================================================== */}
      {/* BODY                                                 */}
      {/* ==================================================== */}

      <div
        className="
          flex-1
          flex
          overflow-hidden
          relative
        "
      >

        {/* ================================================== */}
        {/* MOBILE BACKDROP                                   */}
        {/* ================================================== */}

        {sidebarOpen && (

          <div
            className="
              fixed
              inset-0
              bg-slate-950/60
              backdrop-blur-xs
              z-30
              lg:hidden
            "
            onClick={() =>
              setSidebarOpen(false)
            }
          />

        )}


        {/* ================================================== */}
        {/* SIDEBAR                                            */}
        {/* ================================================== */}

        <aside
          className={`
            no-print
            fixed
            lg:static
            inset-y-0
            left-0
            z-40
            w-64
            shrink-0
            h-full
            bg-white
            dark:bg-slate-900
            border-r
            border-slate-200
            dark:border-slate-800
            flex
            flex-col
            justify-between
            transform
            transition-transform
            duration-200
            ease-in-out
            select-none
            lg:translate-x-0
            ${sidebarOpen
              ? 'translate-x-0 shadow-2xl'
              : '-translate-x-full'
            }
          `}
        >

          {/* ================================================= */}
          {/* NAVIGATION                                       */}
          {/* ================================================= */}

          <div
            className="
              flex-1
              overflow-y-auto
              px-3
              py-3.5
              space-y-4
            "
          >

            {navGroups.map(
              (
                group,
                groupIndex,
              ) => {

                const visibleItems =
                  getVisibleItems(
                    group.items,
                  );


                // ------------------------------------------------
                // Hide empty group
                // ------------------------------------------------

                if (
                  visibleItems.length ===
                  0
                ) {
                  return null;
                }


                return (
                  <div
                    key={groupIndex}
                    className="space-y-1"
                  >

                    {/* Group title */}
                    <h4
                      className="
                        px-3
                        text-[10px]
                        font-bold
                        text-slate-400
                        uppercase
                        tracking-wider
                      "
                    >
                      {group.title}
                    </h4>


                    <div
                      className="
                        space-y-0.5
                        pt-0.5
                      "
                    >

                      {visibleItems.map(
                        (item) => {

                          const isActive =
                            item.path === '/'
                              ? location.pathname ===
                              '/'
                              : location.pathname.startsWith(
                                item.path,
                              );


                          return (
                            <Link
                              key={
                                item.path
                              }
                              to={
                                item.path
                              }
                              onClick={() =>
                                setSidebarOpen(
                                  false,
                                )
                              }
                              className={`
                                flex
                                items-center
                                justify-between
                                px-3
                                py-2
                                rounded-lg
                                text-xs
                                font-medium
                                transition-all
                                ${isActive
                                  ? `
                                      bg-theme-subtle
                                      text-theme-primary
                                      font-semibold
                                      shadow-2xs
                                      border-l-3
                                      border-theme-primary
                                      pl-2.5
                                    `
                                  : `
                                      text-slate-600
                                      dark:text-slate-400
                                      hover:text-slate-900
                                      dark:hover:text-slate-100
                                      hover:bg-slate-100/70
                                      dark:hover:bg-slate-800/60
                                    `
                                }
                              `}
                            >

                              {/* Icon + Name */}
                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2.5
                                  truncate
                                "
                              >

                                <span
                                  className={`
                                    transition-colors
                                    shrink-0
                                    ${isActive
                                      ? 'text-theme-primary'
                                      : 'text-slate-400'
                                    }
                                  `}
                                >
                                  {item.icon}
                                </span>


                                <span
                                  className="truncate"
                                >
                                  {item.name}
                                </span>

                              </div>


                              {/* Badge */}
                              {item.badge && (

                                <span
                                  className="
                                    text-[10px]
                                    px-1.5
                                    py-0.5
                                    rounded
                                    bg-theme-subtle
                                    text-theme-primary
                                    font-semibold
                                  "
                                >
                                  {item.badge}
                                </span>

                              )}

                            </Link>
                          );
                        },
                      )}

                    </div>

                  </div>
                );
              },
            )}

          </div>


          {/* ================================================= */}
          {/* SIDEBAR FOOTER                                   */}
          {/* ================================================= */}

          <div
            className="
              p-3
              border-t
              border-slate-100
              dark:border-slate-800
              bg-slate-50/50
              dark:bg-slate-900/50
              text-[11px]
              text-slate-400
              flex
              items-center
              justify-between
            "
          >

            <div
              className="
                flex
                items-center
                gap-1.5
                truncate
              "
            >

              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-emerald-500
                  shrink-0
                "
              />

              <span
                className="truncate"
              >
                SchoolCore v2.4
              </span>

            </div>


            <span
              className="
                font-semibold
                text-slate-500
                dark:text-slate-400
                shrink-0
              "
            >
              {role || 'User'}
            </span>

          </div>

        </aside>


        {/* ================================================== */}
        {/* MAIN CONTENT                                      */}
        {/* ================================================== */}

        <main
          className="
            flex-1
            h-full
            overflow-y-auto
            overflow-x-hidden
            p-4
            sm:p-6
            lg:p-8
            relative
          "
        >

          {/* ================================================= */}
          {/* AMBIENT BACKGROUND                                */}
          {/* ================================================= */}

          <div
            className="
              pointer-events-none
              fixed
              top-14
              right-0
              w-[500px]
              h-[500px]
              bg-theme-subtle
              rounded-full
              blur-3xl
              opacity-30
              dark:opacity-15
              -z-10
            "
            style={{
              transform:
                'translate(20%, -20%)',
            }}
          />


          <div
            className="
              pointer-events-none
              fixed
              bottom-0
              left-64
              w-[400px]
              h-[400px]
              bg-theme-subtle
              rounded-full
              blur-3xl
              opacity-20
              dark:opacity-10
              -z-10
            "
            style={{
              transform:
                'translate(-20%, 20%)',
            }}
          />


          {/* ================================================= */}
          {/* CONTENT WRAPPER                                  */}
          {/* ================================================= */}

          <div
            className="
              w-full
              mx-auto
              relative
              z-10
              space-y-6
            "
          >
            {children}
          </div>

        </main>

      </div>

    </div>
  );
};