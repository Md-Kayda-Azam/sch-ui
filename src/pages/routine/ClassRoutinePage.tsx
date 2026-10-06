import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';
import {
  useGetClassesQuery,
  useGetSectionsQuery,
  useGetSubjectsQuery,
  useGetTeachersQuery,
} from '../../features/api/apiSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  useForm,
  FormInput,
  FormSelect,
  FormSwitch,
  FormRadioGroup,
} from '../../components/form';
import {
  CalendarRange,
  Clock,
  Plus,
  BookOpen,
  User,
  MapPin,
  Coffee,
  Calendar,
  Layers,
  Search,
  Printer,
  ChevronRight,
  Sparkles,
  Check,
  Grid3X3,
  ListFilter,
  Trash2,
} from 'lucide-react';
import { RoutinePeriod } from '../../types';

interface CreateRoutineFormData {
  dayOfWeek: 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'SATURDAY' | 'FRIDAY';
  periodNumber: number;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  isBreak: boolean;
}

const DAYS_ORDER = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'SATURDAY'] as const;

const DAY_LABELS: Record<string, string> = {
  SUNDAY: 'Sunday',
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
};

const INITIAL_ROUTINE: RoutinePeriod[] = [
  // Sunday
  {
    id: 1,
    dayOfWeek: 'SUNDAY',
    periodNumber: 1,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 1,
    subjectName: 'Higher Mathematics',
    teacherName: 'Dr. Rafiqul Islam',
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    roomNumber: 'Room 301',
    isBreak: false,
  },
  {
    id: 2,
    dayOfWeek: 'SUNDAY',
    periodNumber: 2,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 2,
    subjectName: 'English Literature',
    teacherName: 'Fatima Sultana',
    startTime: '09:45 AM',
    endTime: '10:30 AM',
    roomNumber: 'Room 301',
    isBreak: false,
  },
  {
    id: 3,
    dayOfWeek: 'SUNDAY',
    periodNumber: 3,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 3,
    subjectName: 'Physics',
    teacherName: 'Engr. Nazmul Huda',
    startTime: '10:30 AM',
    endTime: '11:15 AM',
    roomNumber: 'Physics Lab 1',
    isBreak: false,
  },
  {
    id: 4,
    dayOfWeek: 'SUNDAY',
    periodNumber: 4,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 0,
    subjectName: 'Tiffin & Recess Break',
    teacherName: 'Duty Proctor',
    startTime: '11:15 AM',
    endTime: '11:45 AM',
    roomNumber: 'Cafeteria',
    isBreak: true,
  },
  {
    id: 5,
    dayOfWeek: 'SUNDAY',
    periodNumber: 5,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 4,
    subjectName: 'Biology',
    teacherName: 'Dr. Shahnaz Begum',
    startTime: '11:45 AM',
    endTime: '12:30 PM',
    roomNumber: 'Bio Lab',
    isBreak: false,
  },
  {
    id: 6,
    dayOfWeek: 'SUNDAY',
    periodNumber: 6,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 5,
    subjectName: 'Chemistry',
    teacherName: 'Mohammad Faruk',
    startTime: '12:30 PM',
    endTime: '01:15 PM',
    roomNumber: 'Room 301',
    isBreak: false,
  },

  // Monday
  {
    id: 7,
    dayOfWeek: 'MONDAY',
    periodNumber: 1,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 3,
    subjectName: 'Physics',
    teacherName: 'Engr. Nazmul Huda',
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    roomNumber: 'Room 301',
    isBreak: false,
  },
  {
    id: 8,
    dayOfWeek: 'MONDAY',
    periodNumber: 2,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 1,
    subjectName: 'Higher Mathematics',
    teacherName: 'Dr. Rafiqul Islam',
    startTime: '09:45 AM',
    endTime: '10:30 AM',
    roomNumber: 'Room 301',
    isBreak: false,
  },
  {
    id: 9,
    dayOfWeek: 'MONDAY',
    periodNumber: 3,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 6,
    subjectName: 'ICT & Computing',
    teacherName: 'Tanvir Ahmed',
    startTime: '10:30 AM',
    endTime: '11:15 AM',
    roomNumber: 'Computer Lab 2',
    isBreak: false,
  },
  {
    id: 10,
    dayOfWeek: 'MONDAY',
    periodNumber: 4,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 0,
    subjectName: 'Tiffin & Recess Break',
    teacherName: 'Duty Proctor',
    startTime: '11:15 AM',
    endTime: '11:45 AM',
    roomNumber: 'Cafeteria',
    isBreak: true,
  },
  {
    id: 11,
    dayOfWeek: 'MONDAY',
    periodNumber: 5,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 2,
    subjectName: 'English Literature',
    teacherName: 'Fatima Sultana',
    startTime: '11:45 AM',
    endTime: '12:30 PM',
    roomNumber: 'Room 301',
    isBreak: false,
  },

  // Tuesday
  {
    id: 12,
    dayOfWeek: 'TUESDAY',
    periodNumber: 1,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 5,
    subjectName: 'Chemistry',
    teacherName: 'Mohammad Faruk',
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    roomNumber: 'Chemistry Lab',
    isBreak: false,
  },
  {
    id: 13,
    dayOfWeek: 'TUESDAY',
    periodNumber: 2,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 4,
    subjectName: 'Biology',
    teacherName: 'Dr. Shahnaz Begum',
    startTime: '09:45 AM',
    endTime: '10:30 AM',
    roomNumber: 'Bio Lab',
    isBreak: false,
  },
  {
    id: 14,
    dayOfWeek: 'TUESDAY',
    periodNumber: 3,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 1,
    subjectName: 'Higher Mathematics',
    teacherName: 'Dr. Rafiqul Islam',
    startTime: '10:30 AM',
    endTime: '11:15 AM',
    roomNumber: 'Room 301',
    isBreak: false,
  },

  // Wednesday
  {
    id: 15,
    dayOfWeek: 'WEDNESDAY',
    periodNumber: 1,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 2,
    subjectName: 'English Literature',
    teacherName: 'Fatima Sultana',
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    roomNumber: 'Room 301',
    isBreak: false,
  },
  {
    id: 16,
    dayOfWeek: 'WEDNESDAY',
    periodNumber: 2,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 3,
    subjectName: 'Physics',
    teacherName: 'Engr. Nazmul Huda',
    startTime: '09:45 AM',
    endTime: '10:30 AM',
    roomNumber: 'Room 301',
    isBreak: false,
  },
  {
    id: 17,
    dayOfWeek: 'WEDNESDAY',
    periodNumber: 3,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 5,
    subjectName: 'Chemistry',
    teacherName: 'Mohammad Faruk',
    startTime: '10:30 AM',
    endTime: '11:15 AM',
    roomNumber: 'Room 301',
    isBreak: false,
  },

  // Thursday
  {
    id: 18,
    dayOfWeek: 'THURSDAY',
    periodNumber: 1,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 1,
    subjectName: 'Higher Mathematics',
    teacherName: 'Dr. Rafiqul Islam',
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    roomNumber: 'Room 301',
    isBreak: false,
  },
  {
    id: 19,
    dayOfWeek: 'THURSDAY',
    periodNumber: 2,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 6,
    subjectName: 'ICT & Computing',
    teacherName: 'Tanvir Ahmed',
    startTime: '09:45 AM',
    endTime: '10:30 AM',
    roomNumber: 'Computer Lab 2',
    isBreak: false,
  },
  {
    id: 20,
    dayOfWeek: 'THURSDAY',
    periodNumber: 3,
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 4,
    subjectName: 'Biology',
    teacherName: 'Dr. Shahnaz Begum',
    startTime: '10:30 AM',
    endTime: '11:15 AM',
    roomNumber: 'Room 301',
    isBreak: false,
  },
];

export const ClassRoutinePage: React.FC = () => {
  const { t } = useLanguage();
  const { can } = usePermission();

  const [routine, setRoutine] = useState<RoutinePeriod[]>(INITIAL_ROUTINE);
  const [selectedClassId, setSelectedClassId] = useState<string>('1');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('1');
  const [selectedDay, setSelectedDay] = useState<string>('SUNDAY');
  const [viewType, setViewType] = useState<'matrix' | 'day'>('matrix');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: classes } = useGetClassesQuery();
  const { data: sections } = useGetSectionsQuery();
  const { data: subjects } = useGetSubjectsQuery();
  const { data: teachers } = useGetTeachersQuery();

  // React Hook Form for Routine creation
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<CreateRoutineFormData>({
    defaultValues: {
      dayOfWeek: 'SUNDAY',
      periodNumber: 1,
      classId: '1',
      sectionId: '1',
      subjectId: '1',
      teacherName: '',
      startTime: '09:00 AM',
      endTime: '09:45 AM',
      roomNumber: 'Room 301',
      isBreak: false,
    },
    mode: 'onTouched',
  });

  const isBreakWatched = watch('isBreak');

  const onSubmitCreate = async (data: CreateRoutineFormData) => {
    const matchedClass = classes?.find((c) => String(c.id) === String(data.classId));
    const matchedSection = sections?.find((s) => String(s.id) === String(data.sectionId));
    const matchedSubject = subjects?.find((s) => String(s.id) === String(data.subjectId));

    const newPeriod: RoutinePeriod = {
      id: Date.now(),
      dayOfWeek: data.dayOfWeek,
      periodNumber: Number(data.periodNumber),
      classId: Number(data.classId),
      className: matchedClass?.name || 'Class 10',
      sectionId: Number(data.sectionId),
      sectionName: matchedSection ? `Section ${matchedSection.name}` : 'Section A',
      subjectId: Number(data.subjectId),
      subjectName: data.isBreak ? 'Tiffin & Recess Break' : matchedSubject?.name || 'General Subject',
      teacherName: data.isBreak ? 'Duty Proctor' : data.teacherName || 'Faculty',
      startTime: data.startTime,
      endTime: data.endTime,
      roomNumber: data.roomNumber || 'Room 101',
      isBreak: data.isBreak,
    };

    setRoutine((prev) => [...prev, newPeriod]);
    setIsCreateModalOpen(false);
    reset();
  };

  const handleDeletePeriod = (id: number) => {
    setRoutine((prev) => prev.filter((p) => p.id !== id));
  };

  // Filter periods by current class
  const classPeriods = routine.filter(
    (p) => String(p.classId) === String(selectedClassId)
  );

  const activeClassName =
    classes?.find((c) => String(c.id) === String(selectedClassId))?.name || 'Class 10';
  const activeSectionName =
    sections?.find((s) => String(s.id) === String(selectedSectionId))?.name || 'A';

  // Periods per day for day-view
  const dayPeriods = classPeriods
    .filter((p) => p.dayOfWeek === selectedDay)
    .sort((a, b) => a.periodNumber - b.periodNumber);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Class Routine & Timetable
            </h1>
            <Badge variant="default">Session 2026</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Weekly class schedule, periods, assigned faculty, classroom allocation, and break slots
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            Print Timetable
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              reset({
                dayOfWeek: 'SUNDAY',
                periodNumber: 1,
                classId: selectedClassId,
                sectionId: selectedSectionId,
                subjectId: subjects?.[0]?.id ? String(subjects[0].id) : '1',
                teacherName: '',
                startTime: '09:00 AM',
                endTime: '09:45 AM',
                roomNumber: 'Room 301',
                isBreak: false,
              });
              setIsCreateModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Routine
          </Button>
        </div>
      </div>

      {/* Control and Scope Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-theme-primary"
            >
              {(classes || [{ id: 1, name: 'Class 10' }, { id: 2, name: 'Class 9' }]).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Section:</span>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-theme-primary"
            >
              {(sections || [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]).map((s) => (
                <option key={s.id} value={s.id}>
                  Section {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:border-slate-700 hidden sm:block" />

          <span className="text-xs text-slate-400">
            Active Scope: <strong className="text-slate-700 dark:text-slate-300">{activeClassName} - Section {activeSectionName}</strong>
          </span>
        </div>

        {/* View Switcher: Weekly Matrix vs Day-by-Day */}
        <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 p-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 self-start md:self-auto">
          <button
            onClick={() => setViewType('matrix')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewType === 'matrix'
                ? 'bg-white dark:bg-slate-900 text-theme-primary shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Weekly Matrix</span>
          </button>
          <button
            onClick={() => setViewType('day')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewType === 'day'
                ? 'bg-white dark:bg-slate-900 text-theme-primary shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Day View</span>
          </button>
        </div>
      </div>

      {/* VIEW: WEEKLY MATRIX TIMETABLE */}
      {viewType === 'matrix' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-theme-primary" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Full Weekly Timetable Matrix ({activeClassName})
              </h2>
            </div>
            <span className="text-xs text-slate-400">Sunday to Thursday Academic Cycle</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="p-3 text-center border-r border-slate-200 dark:border-slate-800 w-24">
                  Day
                </div>
                {[1, 2, 3, 4, 5].map((periodNum) => (
                  <div key={periodNum} className="p-3 text-center border-r border-slate-200 dark:border-slate-800 last:border-r-0">
                    Period {periodNum}
                  </div>
                ))}
              </div>

              {DAYS_ORDER.slice(0, 5).map((day) => {
                const daySlots = classPeriods
                  .filter((p) => p.dayOfWeek === day)
                  .sort((a, b) => a.periodNumber - b.periodNumber);

                return (
                  <div
                    key={day}
                    className="grid grid-cols-6 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Day Column */}
                    <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                        {DAY_LABELS[day]}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {daySlots.length} Slots
                      </span>
                    </div>

                    {/* Periods 1 to 5 */}
                    {[1, 2, 3, 4, 5].map((pNum) => {
                      const slot = daySlots.find((s) => s.periodNumber === pNum);

                      if (!slot) {
                        return (
                          <div
                            key={pNum}
                            className="p-3 border-r border-slate-100 dark:border-slate-800/60 last:border-r-0 flex items-center justify-center min-h-[90px] text-slate-300 dark:text-slate-700 text-xs italic"
                          >
                            No Class
                          </div>
                        );
                      }

                      if (slot.isBreak) {
                        return (
                          <div
                            key={pNum}
                            className="p-3 border-r border-slate-100 dark:border-slate-800/60 last:border-r-0 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col items-center justify-center text-center min-h-[90px]"
                          >
                            <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-1" />
                            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                              {slot.subjectName}
                            </span>
                            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={pNum}
                          className="p-3 border-r border-slate-100 dark:border-slate-800/60 last:border-r-0 flex flex-col justify-between min-h-[90px] group relative hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <span className="text-xs font-bold text-theme-primary leading-tight">
                                {slot.subjectName}
                              </span>
                              <span className="text-[10px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {slot.roomNumber}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="truncate">{slot.teacherName}</span>
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              {slot.startTime}
                            </span>
                            <button
                              onClick={() => handleDeletePeriod(slot.id)}
                              className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 transition-opacity p-0.5"
                              title="Delete period slot"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW: DAY-BY-DAY TIMELINE */
        <div className="space-y-4">
          {/* Day selection tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {DAYS_ORDER.slice(0, 5).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedDay === d
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {DAY_LABELS[d]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayPeriods.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No routine slots assigned for {DAY_LABELS[selectedDay]}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Click "Create Routine" to assign subjects and periods for this day.
                </p>
              </div>
            ) : (
              dayPeriods.map((period) => (
                <div
                  key={period.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    period.isBreak
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Period {period.periodNumber}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {period.startTime} - {period.endTime}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        {period.isBreak && <Coffee className="w-4 h-4 text-amber-600" />}
                        <span>{period.subjectName}</span>
                      </h3>
                      {!period.isBreak && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{period.teacherName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{period.roomNumber}</span>
                    </span>

                    <button
                      onClick={() => handleDeletePeriod(period.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CREATE ROUTINE MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Timetable Period"
        subtitle="Schedule a class period, faculty assignment, and lecture room"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              name="dayOfWeek"
              control={control}
              label="Day of Week"
              options={DAYS_ORDER.map((d) => ({ value: d, label: DAY_LABELS[d] }))}
              rules={{ required: 'Please select a day' }}
              required
            />

            <FormInput
              name="periodNumber"
              control={control}
              label="Period Slot (1 to 8)"
              type="number"
              rules={{
                required: 'Period slot number is required',
                min: { value: 1, message: 'Minimum slot is 1' },
                max: { value: 8, message: 'Maximum slot is 8' },
              }}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              name="classId"
              control={control}
              label="Class"
              options={(classes || []).map((c) => ({ value: c.id, label: c.name }))}
              rules={{ required: 'Please select class' }}
              required
            />

            <FormSelect
              name="sectionId"
              control={control}
              label="Section"
              options={(sections || []).map((s) => ({ value: s.id, label: `Section ${s.name}` }))}
              rules={{ required: 'Please select section' }}
              required
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <FormSwitch
              name="isBreak"
              control={control}
              label="Mark as Recess / Tiffin Break"
              description="Slot will be marked as non-academic dining and relaxation recess"
            />
          </div>

          {!isBreakWatched && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  name="subjectId"
                  control={control}
                  label="Subject"
                  options={(subjects || []).map((s) => ({ value: s.id, label: s.name }))}
                  rules={{ required: 'Subject is required' }}
                  required
                />

                <FormInput
                  name="teacherName"
                  control={control}
                  label="Assigned Teacher / Instructor"
                  placeholder="e.g. Dr. Rafiqul Islam"
                  rules={{ required: 'Teacher name is required' }}
                  required
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormInput
              name="startTime"
              control={control}
              label="Start Time"
              placeholder="09:00 AM"
              rules={{ required: 'Start time is required' }}
              required
            />

            <FormInput
              name="endTime"
              control={control}
              label="End Time"
              placeholder="09:45 AM"
              rules={{ required: 'End time is required' }}
              required
            />

            <FormInput
              name="roomNumber"
              control={control}
              label="Room Number / Lab"
              placeholder="Room 301"
              rules={{ required: 'Room number is required' }}
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Save Routine Period
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
