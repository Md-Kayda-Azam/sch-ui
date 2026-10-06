import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';
import {
  useGetClassesQuery,
  useGetSectionsQuery,
  useGetSubjectsQuery,
} from '../../features/api/apiSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  useForm,
  FormInput,
  FormSelect,
  FormDatePicker,
  FormTextarea,
  FormSwitch,
} from '../../components/form';
import {
  BookOpen,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Users,
  GraduationCap,
  Layers,
  Sparkles,
  ArrowRight,
  Send,
  Eye,
  Check,
} from 'lucide-react';
import { Homework } from '../../types';

interface CreateHomeworkFormData {
  title: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  assignedDate: string;
  dueDate: string;
  totalMarks: number;
  description: string;
  sendNotification: boolean;
}

const INITIAL_HOMEWORKS: Homework[] = [
  {
    id: 1,
    title: 'Algebra: Quadratic Equations & Graphing',
    description: 'Solve problems 1 to 15 from Chapter 4 (Page 112). Show all intermediate factoring and quadratic formula steps clearly in the homework notebook.',
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 1,
    subjectName: 'Higher Mathematics',
    assignedDate: '2026-09-24',
    dueDate: '2026-09-28',
    teacherId: 1,
    teacherName: 'Dr. Rafiqul Islam',
    totalMarks: 20,
    status: 'ACTIVE',
    submissionCount: 32,
    totalStudents: 40,
  },
  {
    id: 2,
    title: 'Creative Writing: Impact of Green Energy in Bangladesh',
    description: 'Write an argumentative essay of 350-400 words detailing the benefits of solar and wind microgrids in rural coastal communities.',
    classId: 1,
    className: 'Class 10',
    sectionId: 2,
    sectionName: 'Section B',
    subjectId: 2,
    subjectName: 'English Literature',
    assignedDate: '2026-09-23',
    dueDate: '2026-09-27',
    teacherId: 2,
    teacherName: 'Fatima Sultana',
    totalMarks: 25,
    status: 'ACTIVE',
    submissionCount: 28,
    totalStudents: 38,
  },
  {
    id: 3,
    title: 'Mechanics: Laws of Motion & Momentum Lab Report',
    description: 'Complete the lab analysis report for the inclined plane trolley experiment. Include velocity-time curve analysis and error calculation.',
    classId: 2,
    className: 'Class 9',
    sectionId: 3,
    sectionName: 'Section A',
    subjectId: 3,
    subjectName: 'Physics',
    assignedDate: '2026-09-21',
    dueDate: '2026-09-25',
    teacherId: 3,
    teacherName: 'Engr. Nazmul Huda',
    totalMarks: 15,
    status: 'EVALUATED',
    submissionCount: 42,
    totalStudents: 42,
  },
  {
    id: 4,
    title: 'Cellular Respiration & Krebs Cycle Flowchart',
    description: 'Draw a comprehensive colored flowchart illustrating glycolysis, pyruvate oxidation, and the citric acid cycle. Mention ATP yield at each phase.',
    classId: 1,
    className: 'Class 10',
    sectionId: 1,
    sectionName: 'Section A',
    subjectId: 4,
    subjectName: 'Biology',
    assignedDate: '2026-09-20',
    dueDate: '2026-09-26',
    teacherId: 4,
    teacherName: 'Dr. Shahnaz Begum',
    totalMarks: 15,
    status: 'ACTIVE',
    submissionCount: 35,
    totalStudents: 40,
  },
  {
    id: 5,
    title: 'Periodic Table & Chemical Bonding Practice Sheet',
    description: 'Answer worksheet questions on ionic vs covalent dipole moments and Lewis electron dot representations for polyatomic anions.',
    classId: 2,
    className: 'Class 9',
    sectionId: 4,
    sectionName: 'Section B',
    subjectId: 5,
    subjectName: 'Chemistry',
    assignedDate: '2026-09-18',
    dueDate: '2026-09-22',
    teacherId: 5,
    teacherName: 'Mohammad Faruk',
    totalMarks: 20,
    status: 'CLOSED',
    submissionCount: 39,
    totalStudents: 40,
  },
];

export const HomeworkPage: React.FC = () => {
  const { t } = useLanguage();
  const { can } = usePermission();

  const [homeworks, setHomeworks] = useState<Homework[]>(INITIAL_HOMEWORKS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const { data: classes } = useGetClassesQuery();
  const { data: sections } = useGetSectionsQuery();
  const { data: subjects } = useGetSubjectsQuery();

  // React Hook Form for Create Homework
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateHomeworkFormData>({
    defaultValues: {
      title: '',
      classId: classes?.[0]?.id ? String(classes[0].id) : '1',
      sectionId: '',
      subjectId: subjects?.[0]?.id ? String(subjects[0].id) : '1',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalMarks: 20,
      description: '',
      sendNotification: true,
    },
    mode: 'onTouched',
  });

  const onSubmitCreate = async (data: CreateHomeworkFormData) => {
    // Resolve class & subject names for clean display
    const matchedClass = classes?.find((c) => String(c.id) === String(data.classId));
    const matchedSection = sections?.find((s) => String(s.id) === String(data.sectionId));
    const matchedSubject = subjects?.find((s) => String(s.id) === String(data.subjectId));

    const newHw: Homework = {
      id: Date.now(),
      title: data.title.trim(),
      description: data.description.trim(),
      classId: Number(data.classId),
      className: matchedClass?.name || 'Class 10',
      sectionId: data.sectionId ? Number(data.sectionId) : undefined,
      sectionName: matchedSection?.name ? `Section ${matchedSection.name}` : 'All Sections',
      subjectId: Number(data.subjectId),
      subjectName: matchedSubject?.name || 'General Subject',
      assignedDate: data.assignedDate,
      dueDate: data.dueDate,
      totalMarks: Number(data.totalMarks),
      status: 'ACTIVE',
      teacherName: 'Assigned Teacher',
      submissionCount: 0,
      totalStudents: 40,
    };

    setHomeworks([newHw, ...homeworks]);
    setIsCreateModalOpen(false);
    reset();
  };

  // Filter logic
  const filteredHomeworks = homeworks.filter((hw) => {
    const matchesSearch =
      hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hw.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hw.subjectName && hw.subjectName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClass = selectedClassId === 'ALL' || String(hw.classId) === String(selectedClassId);
    const matchesStatus = selectedStatus === 'ALL' || hw.status === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  // KPI metrics
  const totalCount = homeworks.length;
  const activeCount = homeworks.filter((h) => h.status === 'ACTIVE').length;
  const evaluatedCount = homeworks.filter((h) => h.status === 'EVALUATED').length;
  const dueSoonCount = homeworks.filter((h) => {
    if (h.status !== 'ACTIVE') return false;
    const diff = new Date(h.dueDate).getTime() - new Date().getTime();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Homework & Academic Tasks
            </h1>
            <Badge variant="default">Academic 360</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Assign curriculum homework tasks, monitor submission velocity, and grade student submissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => {
              reset({
                title: '',
                classId: classes?.[0]?.id ? String(classes[0].id) : '1',
                sectionId: '',
                subjectId: subjects?.[0]?.id ? String(subjects[0].id) : '1',
                assignedDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                totalMarks: 20,
                description: '',
                sendNotification: true,
              });
              setIsCreateModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Homework
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Homework</span>
            <div className="p-2 rounded-lg bg-theme-subtle text-theme-primary">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{totalCount}</p>
          <span className="text-[11px] text-slate-400">All registered tasks</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Active & Ongoing</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{activeCount}</p>
          <span className="text-[11px] text-slate-400">Open for submissions</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Due Within 72h</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">{dueSoonCount}</p>
          <span className="text-[11px] text-slate-400">Upcoming deadlines</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Evaluated & Graded</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">{evaluatedCount}</p>
          <span className="text-[11px] text-slate-400">Marked & returned</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 w-full items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search homework by title, keywords, or subject..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-theme-primary"
            />
          </div>

          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Classes</option>
            {(classes || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="EVALUATED">Evaluated</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 self-end md:self-auto border border-slate-200 dark:border-slate-800 p-0.5 rounded-lg bg-slate-50 dark:bg-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-theme-primary shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-theme-primary shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Homework List: Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHomeworks.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No homework records found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or create a new homework assignment.</p>
            </div>
          ) : (
            filteredHomeworks.map((hw) => {
              const submissionRate = hw.totalStudents
                ? Math.round(((hw.submissionCount || 0) / hw.totalStudents) * 100)
                : 0;

              return (
                <div
                  key={hw.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-theme-subtle text-theme-primary border border-theme-subtle">
                          {hw.subjectName}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {hw.className} {hw.sectionName && `· ${hw.sectionName}`}
                        </span>
                      </div>
                      <Badge
                        variant={
                          hw.status === 'ACTIVE'
                            ? 'success'
                            : hw.status === 'EVALUATED'
                            ? 'info'
                            : 'neutral'
                        }
                      >
                        {hw.status}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-theme-primary transition-colors line-clamp-1">
                        {hw.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {hw.description}
                      </p>
                    </div>

                    {/* Timeline dates & marks */}
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Calendar className="w-3.5 h-3.5" /> Assigned:
                        </span>
                        <span className="font-mono">{hw.assignedDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-rose-500" /> Deadline:
                        </span>
                        <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{hw.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                        <span className="text-slate-400">Total Marks:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{hw.totalMarks} pts</span>
                      </div>
                    </div>

                    {/* Submission progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Submissions received</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {hw.submissionCount} / {hw.totalStudents} ({submissionRate}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-theme-primary transition-all duration-300 rounded-full"
                          style={{ width: `${submissionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                      By {hw.teacherName || 'Faculty'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedHomework(hw)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Homework List: Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-4 font-bold">Subject & Title</th>
                  <th className="py-3 px-4 font-bold">Class / Section</th>
                  <th className="py-3 px-4 font-bold">Assigned</th>
                  <th className="py-3 px-4 font-bold">Due Date</th>
                  <th className="py-3 px-4 font-bold text-center">Submissions</th>
                  <th className="py-3 px-4 font-bold text-center">Marks</th>
                  <th className="py-3 px-4 font-bold text-center">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredHomeworks.map((hw) => (
                  <tr key={hw.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{hw.title}</div>
                      <span className="text-[11px] text-theme-primary font-medium">{hw.subjectName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {hw.className} {hw.sectionName && `(${hw.sectionName})`}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{hw.assignedDate}</td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">{hw.dueDate}</td>
                    <td className="py-3 px-4 text-center font-mono">
                      {hw.submissionCount} / {hw.totalStudents}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                      {hw.totalMarks}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          hw.status === 'ACTIVE'
                            ? 'success'
                            : hw.status === 'EVALUATED'
                            ? 'info'
                            : 'neutral'
                        }
                      >
                        {hw.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedHomework(hw)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE HOMEWORK MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Homework Assignment"
        subtitle="Publish a syllabus task with submission guidelines and deadline"
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
          <FormInput
            name="title"
            control={control}
            label="Homework Title"
            placeholder="e.g. Chapter 4: Quadratic Equations Problem Set"
            rules={{
              required: 'Title is required',
              minLength: { value: 4, message: 'Minimum 4 characters required' },
            }}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormSelect
              name="classId"
              control={control}
              label="Class"
              options={(classes || []).map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Select Class"
              rules={{ required: 'Please select a class' }}
              required
            />

            <FormSelect
              name="sectionId"
              control={control}
              label="Section (Optional)"
              options={[
                { value: '', label: 'All Sections' },
                ...(sections || []).map((s) => ({ value: s.id, label: `Section ${s.name}` })),
              ]}
              placeholder="All Sections"
            />

            <FormSelect
              name="subjectId"
              control={control}
              label="Subject"
              options={(subjects || []).map((s) => ({ value: s.id, label: s.name }))}
              placeholder="Select Subject"
              rules={{ required: 'Please select a subject' }}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormDatePicker
              name="assignedDate"
              control={control}
              label="Assigned Date"
              rules={{ required: 'Assigned date is required' }}
              required
            />

            <FormDatePicker
              name="dueDate"
              control={control}
              label="Submission Deadline"
              rules={{ required: 'Due date is required' }}
              required
            />

            <FormInput
              name="totalMarks"
              control={control}
              label="Total Marks"
              type="number"
              rules={{
                required: 'Total marks is required',
                min: { value: 1, message: 'Must be at least 1 mark' },
              }}
              required
            />
          </div>

          <FormTextarea
            name="description"
            control={control}
            label="Assignment Details & Instructions"
            placeholder="Specify exercise numbers, submission formatting, reference pages, and guidelines..."
            rows={4}
            rules={{ required: 'Assignment instructions are required' }}
            required
          />

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <FormSwitch
              name="sendNotification"
              control={control}
              label="Notify Students & Guardians"
              description="Send automated app and SMS notification regarding this newly assigned task"
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
              Publish Homework
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW HOMEWORK DETAILS MODAL */}
      {selectedHomework && (
        <Modal
          isOpen={!!selectedHomework}
          onClose={() => setSelectedHomework(null)}
          title={selectedHomework.title}
          subtitle={`${selectedHomework.subjectName} · ${selectedHomework.className}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Class & Section:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedHomework.className} ({selectedHomework.sectionName || 'All'})
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Total Marks:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedHomework.totalMarks} Points
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Assigned On:</span>
                  <p className="font-mono text-slate-800 dark:text-slate-200">{selectedHomework.assignedDate}</p>
                </div>
                <div>
                  <span className="text-slate-400">Due Deadline:</span>
                  <p className="font-mono font-bold text-rose-600 dark:text-rose-400">{selectedHomework.dueDate}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Assignment Instructions:</h4>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 leading-relaxed text-slate-700 dark:text-slate-300">
                {selectedHomework.description}
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  Submission Status: {selectedHomework.submissionCount} / {selectedHomework.totalStudents} Submitted
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  Ready for evaluation and teacher grading
                </span>
              </div>
              <Badge variant="success">{selectedHomework.status}</Badge>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button variant="primary" onClick={() => setSelectedHomework(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
