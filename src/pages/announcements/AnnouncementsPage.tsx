import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';
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
  FormRadioGroup,
} from '../../components/form';
import {
  Megaphone,
  Plus,
  Bell,
  Calendar,
  AlertTriangle,
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Pin,
  Share2,
  Bookmark,
  ShieldCheck,
  Send,
  Check,
} from 'lucide-react';
import { Announcement } from '../../types';

interface CreateAnnouncementFormData {
  title: string;
  category: 'ACADEMIC' | 'EXAMINATION' | 'EVENT' | 'HOLIDAY' | 'URGENT' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  targetAudience: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'PARENTS' | 'STAFF';
  publishedDate: string;
  expiryDate: string;
  content: string;
  sendNotification: boolean;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'Mid-Term Examination Schedule & Admit Card Distribution',
    content: 'The Mid-Term Examinations for academic session 2026 will commence on October 12, 2026. Students must collect their verified admit cards and clear outstanding fees from the accounts counter by October 5, 2026. The detailed subject-wise routine has been published on the examination board portal.',
    category: 'EXAMINATION',
    priority: 'URGENT',
    targetAudience: 'ALL',
    publishedDate: '2026-09-24',
    expiryDate: '2026-10-15',
    authorName: 'Academic Controller',
    authorRole: 'Examination Board',
    status: 'PUBLISHED',
    sendNotification: true,
  },
  {
    id: 2,
    title: 'Autumn Vacation & School Closure Notice',
    content: 'The school premises will remain closed from October 18 to October 26, 2026 on account of Durga Puja and Autumn Vacation. Normal academic classes will resume on Monday, October 27 at standard morning school hours (08:30 AM). Online portal services will remain active.',
    category: 'HOLIDAY',
    priority: 'MEDIUM',
    targetAudience: 'ALL',
    publishedDate: '2026-09-23',
    expiryDate: '2026-10-27',
    authorName: 'Principal Office',
    authorRole: 'Administration',
    status: 'PUBLISHED',
    sendNotification: false,
  },
  {
    id: 3,
    title: 'Mandatory Faculty Curriculum Meeting for Term 2 Preparation',
    content: 'All departmental heads and teaching staff are requested to attend the Term 2 curriculum alignment conference this Thursday at 03:00 PM in the Main Conference Auditorium. Please bring updated lesson plans, syllabus progression sheets, and continuous assessment logs.',
    category: 'ACADEMIC',
    priority: 'HIGH',
    targetAudience: 'TEACHERS',
    publishedDate: '2026-09-22',
    expiryDate: '2026-09-30',
    authorName: 'Vice Principal (Academics)',
    authorRole: 'Staff Coordinator',
    status: 'PUBLISHED',
    sendNotification: true,
  },
  {
    id: 4,
    title: 'Parent-Teacher Meeting (PTM) for Grades 9 & 10',
    content: 'The First Term PTM will take place on Saturday, October 3, from 09:00 AM to 01:00 PM. Parents and guardians will receive student progress portfolios and personalized feedback from subject specialists. Individual slots will be emailed to guardian contact emails.',
    category: 'EVENT',
    priority: 'HIGH',
    targetAudience: 'PARENTS',
    publishedDate: '2026-09-20',
    expiryDate: '2026-10-04',
    authorName: 'Student Guidance Bureau',
    authorRole: 'Counseling & Guidance',
    status: 'PUBLISHED',
    sendNotification: true,
  },
  {
    id: 5,
    title: 'National Science Olympiad 2026 School Selection Round',
    content: 'Registration is now open for students of Classes 8-10 wishing to compete in the National Science & Math Olympiad preliminary qualifiers. Interested students should submit their names to Mr. Tanvir Ahmed in the Computer Lab before September 30.',
    category: 'GENERAL',
    priority: 'LOW',
    targetAudience: 'STUDENTS',
    publishedDate: '2026-09-18',
    expiryDate: '2026-09-30',
    authorName: 'Science Club Moderator',
    authorRole: 'Co-Curricular Committee',
    status: 'PUBLISHED',
    sendNotification: false,
  },
];

export const AnnouncementsPage: React.FC = () => {
  const { t } = useLanguage();
  const { can } = usePermission();

  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  // React Hook Form for Create Announcement
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateAnnouncementFormData>({
    defaultValues: {
      title: '',
      category: 'GENERAL',
      priority: 'MEDIUM',
      targetAudience: 'ALL',
      publishedDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      content: '',
      sendNotification: true,
    },
    mode: 'onTouched',
  });

  const onSubmitCreate = async (data: CreateAnnouncementFormData) => {
    const newAnnouncement: Announcement = {
      id: Date.now(),
      title: data.title.trim(),
      category: data.category,
      priority: data.priority,
      targetAudience: data.targetAudience,
      publishedDate: data.publishedDate,
      expiryDate: data.expiryDate,
      content: data.content.trim(),
      authorName: 'School Administrator',
      authorRole: 'Administration Office',
      status: 'PUBLISHED',
      sendNotification: data.sendNotification,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setIsCreateModalOpen(false);
    reset();
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ann.authorName && ann.authorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAudience = selectedAudience === 'ALL' || ann.targetAudience === selectedAudience || ann.targetAudience === 'ALL';
    const matchesCategory = selectedCategory === 'ALL' || ann.category === selectedCategory;
    const matchesPriority = selectedPriority === 'ALL' || ann.priority === selectedPriority;

    return matchesSearch && matchesAudience && matchesCategory && matchesPriority;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="danger">Urgent Notice</Badge>;
      case 'HIGH':
        return <Badge variant="warning">High Priority</Badge>;
      case 'MEDIUM':
        return <Badge variant="info">Standard</Badge>;
      case 'LOW':
        return <Badge variant="neutral">Info</Badge>;
      default:
        return <Badge variant="neutral">{priority}</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'EXAMINATION':
        return 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
      case 'ACADEMIC':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900';
      case 'HOLIDAY':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
      case 'EVENT':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900';
      default:
        return 'text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Institutional Notice & Announcements
            </h1>
            <Badge variant="default">Campus Bulletin</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Broadcast official circulars, exam notices, holiday alerts, and institutional updates to students, parents, and staff
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => {
              reset({
                title: '',
                category: 'GENERAL',
                priority: 'MEDIUM',
                targetAudience: 'ALL',
                publishedDate: new Date().toISOString().split('T')[0],
                expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                content: '',
                sendNotification: true,
              });
              setIsCreateModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Announcement
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search circulars by title, keywords, or administrative authority..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-theme-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Audiences</option>
              <option value="STUDENTS">Students Only</option>
              <option value="TEACHERS">Teachers & Faculty</option>
              <option value="PARENTS">Guardians & Parents</option>
              <option value="STAFF">Administrative Staff</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="EXAMINATION">Examinations</option>
              <option value="ACADEMIC">Academic</option>
              <option value="HOLIDAY">Holidays</option>
              <option value="EVENT">Events</option>
              <option value="GENERAL">General Notice</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Standard</option>
              <option value="LOW">Information</option>
            </select>
          </div>
        </div>

        {/* Quick filter badge tabs */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 overflow-x-auto">
          <span className="font-semibold shrink-0">Quick Views:</span>
          {['ALL', 'EXAMINATION', 'HOLIDAY', 'ACADEMIC', 'EVENT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-colors shrink-0 font-medium ${
                selectedCategory === cat
                  ? 'bg-theme-subtle text-theme-primary font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {cat === 'ALL' ? 'All Bulletins' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <Megaphone className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No announcements match your filter</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search terms or create a new announcement.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryColor(
                      ann.category
                    )}`}
                  >
                    {ann.category}
                  </span>
                  {getPriorityBadge(ann.priority)}
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    Target: {ann.targetAudience}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.publishedDate}
                  </span>
                  {ann.expiryDate && (
                    <span className="hidden sm:inline">
                      · Valid till {ann.expiryDate}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3
                  onClick={() => setSelectedAnnouncement(ann)}
                  className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-theme-primary transition-colors cursor-pointer"
                >
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-3 leading-relaxed">
                  {ann.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-theme-primary" />
                  <span>
                    Issued by: <strong className="text-slate-700 dark:text-slate-300">{ann.authorName}</strong> ({ann.authorRole})
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAnnouncement(ann)}
                  rightIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Read Full Notice
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE ANNOUNCEMENT MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Broadcast New Announcement"
        subtitle="Publish institutional notices, exam schedules, and circulars"
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
          <FormInput
            name="title"
            control={control}
            label="Notice Title"
            placeholder="e.g. Mid-Term Examination Routine & Admit Card Release"
            rules={{
              required: 'Title is required',
              minLength: { value: 5, message: 'Minimum 5 characters required' },
            }}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              name="category"
              control={control}
              label="Notice Category"
              options={[
                { value: 'ACADEMIC', label: 'Academic & Syllabus' },
                { value: 'EXAMINATION', label: 'Examination & Results' },
                { value: 'HOLIDAY', label: 'Holiday & Vacation' },
                { value: 'EVENT', label: 'Campus Event & PTM' },
                { value: 'URGENT', label: 'Urgent Circular' },
                { value: 'GENERAL', label: 'General Announcement' },
              ]}
              rules={{ required: 'Please select category' }}
              required
            />

            <FormSelect
              name="targetAudience"
              control={control}
              label="Target Audience"
              options={[
                { value: 'ALL', label: 'All (Campus-Wide)' },
                { value: 'STUDENTS', label: 'Students Only' },
                { value: 'TEACHERS', label: 'Teachers & Faculty' },
                { value: 'PARENTS', label: 'Parents & Guardians' },
                { value: 'STAFF', label: 'Administrative Staff' },
              ]}
              rules={{ required: 'Target audience is required' }}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Priority Urgency <span className="text-rose-500">*</span>
            </label>
            <FormRadioGroup
              name="priority"
              control={control}
              variant="pills"
              options={[
                { value: 'LOW', label: 'Low / Info' },
                { value: 'MEDIUM', label: 'Standard' },
                { value: 'HIGH', label: 'High Priority' },
                { value: 'URGENT', label: 'Urgent Alert' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormDatePicker
              name="publishedDate"
              control={control}
              label="Publication Date"
              rules={{ required: 'Publication date is required' }}
              required
            />

            <FormDatePicker
              name="expiryDate"
              control={control}
              label="Archive / Expiry Date (Optional)"
            />
          </div>

          <FormTextarea
            name="content"
            control={control}
            label="Announcement Message Content"
            placeholder="Type the official message, instructions, action items, dates, and administrative details..."
            rows={5}
            rules={{
              required: 'Announcement content is required',
              minLength: { value: 15, message: 'Minimum 15 characters required' },
            }}
            required
          />

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <FormSwitch
              name="sendNotification"
              control={control}
              label="Dispatch SMS and App Push Alert"
              description="Immediately send instant notification to target recipients on mobile"
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
              Publish Announcement
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW FULL ANNOUNCEMENT MODAL */}
      {selectedAnnouncement && (
        <Modal
          isOpen={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          title={selectedAnnouncement.title}
          subtitle={`Issued by ${selectedAnnouncement.authorName} (${selectedAnnouncement.authorRole})`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryColor(
                  selectedAnnouncement.category
                )}`}
              >
                {selectedAnnouncement.category}
              </span>
              {getPriorityBadge(selectedAnnouncement.priority)}
              <span className="text-slate-500 font-medium">
                Audience: <strong>{selectedAnnouncement.targetAudience}</strong>
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-500 font-mono">
              <span>Published: {selectedAnnouncement.publishedDate}</span>
              {selectedAnnouncement.expiryDate && (
                <span>Valid Until: {selectedAnnouncement.expiryDate}</span>
              )}
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">Official Notice:</h4>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                {selectedAnnouncement.content}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button variant="primary" onClick={() => setSelectedAnnouncement(null)}>
                Close Notice
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
