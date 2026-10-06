import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Clock,
  BookOpen,
  Calendar,
  Bell,
  MessageSquare,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  Send,
  Users,
  Building,
  User,
  Pin,
  CalendarDays,
  FileText,
} from 'lucide-react';

// ============================================================================
// 1. CLASS ROUTINE MODAL
// ============================================================================
export const ClassRoutineModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

  const periods = [
    { period: 'Period 1', time: '08:30 - 09:15', subject: 'General Mathematics', teacher: 'Md. Shafiqul Islam', room: 'Room 302' },
    { period: 'Period 2', time: '09:15 - 10:00', subject: 'English 1st Paper', teacher: 'Nazma Begum', room: 'Room 302' },
    { period: 'Period 3', time: '10:00 - 10:45', subject: 'Physics (Theory)', teacher: 'Kamrul Hasan', room: 'Physics Lab' },
    { period: 'Tiffin Break', time: '10:45 - 11:15', subject: 'Midday Recess / Lunch', teacher: '—', room: 'Cafeteria & Ground', isBreak: true },
    { period: 'Period 4', time: '11:15 - 12:00', subject: 'Chemistry (Lab)', teacher: 'Dr. Farhana Yasmin', room: 'Chemistry Lab' },
    { period: 'Period 5', time: '12:00 - 12:45', subject: 'ICT & Programming', teacher: 'Tariqul Alam', room: 'Computer Lab 1' },
    { period: 'Period 6', time: '12:45 - 01:30', subject: 'Bangladesh & Global Studies', teacher: 'Sultana Razia', room: 'Room 302' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Class Routine & Timetable"
      subtitle="View, verify, and export live class schedules"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-500">Academic Session 2026 · Standard Shift</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button
              variant="outline"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => window.print()}
            >
              Print Routine
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Class and Day Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
            {classes.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedClass === cls
                    ? 'bg-white dark:bg-slate-900 text-theme-primary shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedDay === day
                    ? 'bg-theme-primary text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3">Time Window</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Assigned Faculty</th>
                <th className="py-2.5 px-3 text-right">Classroom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {periods.map((item, idx) => (
                <tr
                  key={idx}
                  className={item.isBreak ? 'bg-amber-50/60 dark:bg-amber-950/20 font-medium' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {item.period}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 tabular-nums">
                    {item.time}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`font-semibold ${item.isBreak ? 'text-amber-700 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {item.subject}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {item.teacher}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.room}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================================
// 2. STUDENT HOMEWORK & ASSIGNMENTS MODAL
// ============================================================================
export const StudentHomeworkModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [filterClass, setFilterClass] = useState('All');

  const homeworkList = [
    {
      id: 1,
      title: 'Physics Chapter 4: Newton’s Laws Problem Set',
      subject: 'Physics',
      className: 'Class 10 - Section A',
      teacher: 'Kamrul Hasan',
      dueDate: '2026-09-28',
      submittedCount: 38,
      totalCount: 42,
      status: 'ACTIVE',
      instructions: 'Complete Exercise 4.1 questions 1 to 15 in the class notebook. Show all conversion units.',
    },
    {
      id: 2,
      title: 'English Composition: The Impact of Renewable Energy',
      subject: 'English',
      className: 'Class 9 - Section B',
      teacher: 'Nazma Begum',
      dueDate: '2026-09-29',
      submittedCount: 35,
      totalCount: 40,
      status: 'ACTIVE',
      instructions: 'Write a 250-word structured essay addressing renewable energy adoption in modern infrastructure.',
    },
    {
      id: 3,
      title: 'Higher Mathematics: Coordinate Geometry Theorems',
      subject: 'Higher Math',
      className: 'Class 10 - Section A',
      teacher: 'Md. Shafiqul Islam',
      dueDate: '2026-10-02',
      submittedCount: 14,
      totalCount: 42,
      status: 'ACTIVE',
      instructions: 'Prove propositions 11.2 and 11.3 with standard diagrammatic notations.',
    },
    {
      id: 4,
      title: 'Chemistry Laboratory Worksheet: Acid-Base Titration',
      subject: 'Chemistry',
      className: 'Class 10 - Section B',
      teacher: 'Dr. Farhana Yasmin',
      dueDate: '2026-09-24',
      submittedCount: 40,
      totalCount: 40,
      status: 'GRADED',
      instructions: 'Submit titration curve graph and calculate molar concentration of standard NaOH.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Homework & Assignments"
      subtitle="Track curriculum assignments, submission quotas, and review deadlines"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-500">4 Active Assignments in Session</span>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Homework Cards */}
        <div className="space-y-3">
          {homeworkList.map((hw) => {
            const completionPct = Math.round((hw.submittedCount / hw.totalCount) * 100);
            return (
              <div
                key={hw.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-theme-subtle transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-subtle text-theme-primary">
                        {hw.subject}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {hw.className}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs text-slate-500">Faculty: {hw.teacher}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {hw.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={hw.status === 'GRADED' ? 'success' : 'info'}>
                      {hw.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  {hw.instructions}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{hw.dueDate}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Submissions:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                      {hw.submittedCount} / {hw.totalCount} ({completionPct}%)
                    </span>
                    <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

// ============================================================================
// 3. ANNOUNCEMENTS & NOTICE BOARD MODAL
// ============================================================================
export const NoticeBoardModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('All');

  const notices = [
    {
      id: 1,
      title: 'Term-2 Examination Routine & Syllabus Published',
      category: 'Examination',
      date: '2026-09-24',
      author: 'Academic Coordination Committee',
      priority: 'HIGH',
      content: 'The final timetable for Term-2 Assessments is now released. Examinations commence from October 15, 2026. Admit cards will be issued starting October 05 upon dues clearance.',
      isPinned: true,
    },
    {
      id: 2,
      title: 'September 2026 Tuition Fee Payment Deadline',
      category: 'Financial',
      date: '2026-09-22',
      author: 'Accounts & Bursar Office',
      priority: 'MEDIUM',
      content: 'All guardians are kindly requested to complete monthly tuition payments by September 30. Payments can be completed online via bKash/Nagad gateway or at the school counter.',
      isPinned: true,
    },
    {
      id: 3,
      title: 'Annual Science Fair & Robotics Competition 2026',
      category: 'Event',
      date: '2026-09-20',
      author: 'Science Club',
      priority: 'NORMAL',
      content: 'Project registration is now open for students of Class 6 to 10. Interested teams must submit project abstracts to the physics coordinator by October 10.',
      isPinned: false,
    },
    {
      id: 4,
      title: 'Parent-Teacher Progress Meeting Scheduled for Saturday',
      category: 'General',
      date: '2026-09-18',
      author: 'Principal Office',
      priority: 'NORMAL',
      content: 'Bi-monthly parent-teacher conference will be conducted this Saturday from 09:30 AM to 01:00 PM. Parents are encouraged to review midterm progress logs.',
      isPinned: false,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notice Board & School Announcements"
      subtitle="Official notices, academic memos, and emergency broadcasts"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-500">Live Campus Bulletin</span>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Notice List */}
        <div className="space-y-3">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all ${
                n.isPinned
                  ? 'bg-white dark:bg-slate-900 border-theme-primary/30 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {n.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-theme-subtle text-theme-primary">
                        <Pin className="w-3 h-3 rotate-45" /> Pinned
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {n.category}
                    </span>
                    <span className="text-xs text-slate-400 tabular-nums">
                      {n.date}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {n.title}
                  </h4>
                </div>

                <Badge variant={n.priority === 'HIGH' ? 'danger' : n.priority === 'MEDIUM' ? 'warning' : 'default'}>
                  {n.priority}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {n.content}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Issued by: <strong className="text-slate-600 dark:text-slate-300">{n.author}</strong></span>
                <span className="text-theme-primary font-medium cursor-pointer hover:underline">
                  Download Notice PDF →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

// ============================================================================
// 4. MESSAGES & BROADCAST COMMUNICATION MODAL
// ============================================================================
export const MessagesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [broadcastText, setBroadcastText] = useState('');
  const [targetAudience, setTargetAudience] = useState('ALL_PARENTS');
  const [sentSuccess, setSentSuccess] = useState(false);

  const messages = [
    {
      id: 1,
      sender: 'Accounts Department',
      recipient: 'All Parents (SMS Broadcast)',
      subject: 'Fee Reminder: September Billing Due on 30th',
      time: 'Today, 09:15 AM',
      preview: 'Dear Guardian, kindly ensure tuition fees for September are cleared before the due date.',
    },
    {
      id: 2,
      sender: 'Dr. Farhana Yasmin (Faculty)',
      recipient: 'Principal Office',
      subject: 'Lab Chemicals Supply Requisition for Term-2 Practicals',
      time: 'Yesterday, 04:30 PM',
      preview: 'Submitted procurement request for standard titration reagents for upcoming examinations.',
    },
    {
      id: 3,
      sender: 'Academic Office',
      recipient: 'Teaching Faculty Staff',
      subject: 'Staff Coordination Meeting on Monday at 02:00 PM',
      time: 'Sep 23, 11:00 AM',
      preview: 'Agenda includes midterm marks moderation, answer script verification, and sports day schedule.',
    },
  ];

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setBroadcastText('');
      setSentSuccess(false);
    }, 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Communications & Broadcast Center"
      subtitle="Direct messaging, parent SMS notifications, and faculty memos"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-500">SMS Gateway: Connected · 4,250 Credits</span>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Quick Broadcast Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-theme-primary" />
            Quick Broadcast Message
          </h4>

          {sentSuccess ? (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Broadcast dispatched successfully to 850 recipients!
            </div>
          ) : (
            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-theme-primary"
                >
                  <option value="ALL_PARENTS">All Enrolled Guardians (850)</option>
                  <option value="ALL_TEACHERS">Faculty Staff Members (48)</option>
                  <option value="CLASS_10">Class 10 Parents Only (84)</option>
                  <option value="CLASS_9">Class 9 Parents Only (80)</option>
                </select>
                <span className="text-[11px] text-slate-400">Target channel: SMS & Parent App</span>
              </div>

              <textarea
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="Type your official announcement or notification message here..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-theme-primary"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">160 characters per SMS</span>
                <Button size="sm" variant="primary" type="submit">
                  Dispatch Broadcast
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Recent Communication Logs */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recent Communications Log
          </h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            {messages.map((m) => (
              <div key={m.id} className="p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{m.subject}</span>
                  <span className="text-[10px] text-slate-400 tabular-nums">{m.time}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span>From: <strong className="text-slate-700 dark:text-slate-300">{m.sender}</strong></span>
                  <span>·</span>
                  <span>To: <strong className="text-theme-primary">{m.recipient}</strong></span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                  {m.preview}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
