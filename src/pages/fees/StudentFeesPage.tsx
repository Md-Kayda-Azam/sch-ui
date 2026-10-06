// src/pages/fees/StudentFeesPage.tsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  GraduationCap, Wallet, CheckCircle2, TriangleAlert, Award,
  CalendarDays, Search, Receipt, CreditCard, ListChecks, BookOpen,
  FilePen, Laptop, Volleyball, History, ShieldCheck, X, Lock,
  Printer, ChevronRight, Send, Hourglass, Layers, Hash, Sun,
  BadgeCheck, Filter, Users, ChevronDown, ChevronUp, User,
  Phone, MapPin, ArrowRight, Sparkles, School, BookMarked,
  GraduationCap as GradCap, SlidersHorizontal, Check, SearchX,
  Loader2
} from 'lucide-react';

// ---------- Types ----------
interface MonthData {
  name: string;
  en: string;
  status: 'paid' | 'due';
  amount: string;
  date: string;
  txn: string;
  gateway: string;
  recNo: string;
}

interface SelectedItem {
  title: string;
  amount: string;
}

interface ReceiptData {
  title: string;
  amount: string;
  recNo: string;
  gateway: string;
}

interface ToastState {
  visible: boolean;
  heading: string;
  message: string;
}

interface Student {
  id: number;
  studentCode: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  mobileNumber: string;
  class: string;
  section: string;
  session: string;
  rollNumber: string;
  avatar?: string;
}

interface Session {
  id: number;
  name: string;
  isCurrent: boolean;
}

interface ClassItem {
  id: number;
  name: string;
  sections: string[];
}

type FilterKey = 'all' | 'paid' | 'due';

// ---------- Barcode Component ----------
interface BarcodeProps {
  value: string;
}

const Barcode: React.FC<BarcodeProps> = ({ value }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const jsBarcode = (window as any).JsBarcode;
    if (jsBarcode && svgRef.current) {
      try {
        jsBarcode(svgRef.current, value || 'REC-2026-88', {
          format: 'CODE128',
          lineColor: '#0f172a',
          width: 1.5,
          height: 35,
          displayValue: false,
        });
      } catch (e) {
        console.log('Barcode error', e);
      }
    }
  }, [value]);

  return <svg ref={svgRef} className="max-h-10 max-w-[140px]"></svg>;
};

// ---------- Static Data ----------
const SESSIONS: Session[] = [
  { id: 1, name: '২০২৬-২৭', isCurrent: true },
  { id: 2, name: '২০২৫-২৬', isCurrent: false },
  { id: 3, name: '২০২৪-২৫', isCurrent: false },
];

const CLASSES: ClassItem[] = [
  { id: 1, name: '৬ষ্ঠ শ্রেণী', sections: ['ক', 'খ', 'গ'] },
  { id: 2, name: '৭ম শ্রেণী', sections: ['ক', 'খ', 'গ'] },
  { id: 3, name: '৮ম শ্রেণী', sections: ['ক', 'খ'] },
  { id: 4, name: '৯ম শ্রেণী', sections: ['বিজ্ঞান', 'ব্যবসায়', 'মানবিক'] },
  { id: 5, name: '১০ম শ্রেণী', sections: ['বিজ্ঞান', 'ব্যবসায়', 'মানবিক'] },
];

const STUDENTS: Student[] = [
  {
    id: 1,
    studentCode: 'STD-2026-0842',
    fullName: 'নাসরিন সুলতানা',
    fatherName: 'মোঃ আব্দুল করিম',
    motherName: 'মিসেস ফাতেমা বেগম',
    mobileNumber: '+৮৮০ ১৭১২-৩৪৫৬৭৮',
    class: '১০ম শ্রেণী',
    section: 'বিজ্ঞান',
    session: '২০২৬-২৭',
    rollNumber: '১০০৪',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    id: 2,
    studentCode: 'STD-2026-0843',
    fullName: 'রহিম আহমেদ',
    fatherName: 'মোঃ জামাল উদ্দিন',
    motherName: 'মিসেস রহিমা খাতুন',
    mobileNumber: '+৮৮০ ১৮১২-৪৫৬৭৮৯',
    class: '১০ম শ্রেণী',
    section: 'বিজ্ঞান',
    session: '২০২৬-২৭',
    rollNumber: '১০০৫',
  },
  {
    id: 3,
    studentCode: 'STD-2026-0844',
    fullName: 'ফাতিমা আক্তার',
    fatherName: 'মোঃ সুলতান মাহমুদ',
    motherName: 'মিসেস নাসিমা বেগম',
    mobileNumber: '+৮৮০ ১৯১২-৫৬৭৮৯০',
    class: '১০ম শ্রেণী',
    section: 'বিজ্ঞান',
    session: '২০২৬-২৭',
    rollNumber: '১০০৬',
  },
  {
    id: 4,
    studentCode: 'STD-2026-0845',
    fullName: 'তানভীর হাসান',
    fatherName: 'মোঃ কামাল হোসেন',
    motherName: 'মিসেস সালমা খাতুন',
    mobileNumber: '+৮৮০ ১৬১২-৬৭৮৯০১',
    class: '১০ম শ্রেণী',
    section: 'ব্যবসায়',
    session: '২০২৬-২৭',
    rollNumber: '২০০১',
  },
  {
    id: 5,
    studentCode: 'STD-2026-0846',
    fullName: 'সুমাইয়া ইসলাম',
    fatherName: 'মোঃ রফিকুল ইসলাম',
    motherName: 'মিসেস শিরিন আক্তার',
    mobileNumber: '+৮৮০ ১৫১২-৭৮৯০১২',
    class: '১০ম শ্রেণী',
    section: 'ব্যবসায়',
    session: '২০২৬-২৭',
    rollNumber: '২০০২',
  },
  {
    id: 6,
    studentCode: 'STD-2026-0847',
    fullName: 'আরিফ খান',
    fatherName: 'মোঃ নাসির খান',
    motherName: 'মিসেস রুমা খান',
    mobileNumber: '+৮৮০ ১৪১২-৮৯০১২৩',
    class: '৯ম শ্রেণী',
    section: 'বিজ্ঞান',
    session: '২০২৬-২৭',
    rollNumber: '১০১০',
  },
  {
    id: 7,
    studentCode: 'STD-2026-0848',
    fullName: 'নুসরাত জাহান',
    fatherName: 'মোঃ শহীদুল ইসলাম',
    motherName: 'মিসেস পারভীন আক্তার',
    mobileNumber: '+৮৮০ ১৩১২-৯০১২৩৪',
    class: '৯ম শ্রেণী',
    section: 'বিজ্ঞান',
    session: '২০২৬-২৭',
    rollNumber: '১০১১',
  },
  {
    id: 8,
    studentCode: 'STD-2026-0849',
    fullName: 'সাব্বির রহমান',
    fatherName: 'মোঃ মতিউর রহমান',
    motherName: 'মিসেস রেহানা বেগম',
    mobileNumber: '+৮৮০ ১২১২-০১২৩৪৫',
    class: '৯ম শ্রেণী',
    section: 'ব্যবসায়',
    session: '২০২৬-২৭',
    rollNumber: '২০০৫',
  },
  {
    id: 9,
    studentCode: 'STD-2025-0501',
    fullName: 'মেহেদী হাসান',
    fatherName: 'মোঃ আনোয়ার হোসেন',
    motherName: 'মিসেস সেলিনা আক্তার',
    mobileNumber: '+৮৮০ ১১১২-১২৩৪৫৬',
    class: '১০ম শ্রেণী',
    section: 'বিজ্ঞান',
    session: '২০২৫-২৬',
    rollNumber: '১০০১',
  },
  {
    id: 10,
    studentCode: 'STD-2025-0502',
    fullName: 'জান্নাতুল ফেরদৌস',
    fatherName: 'মোঃ আবুল কালাম',
    motherName: 'মিসেস হাসিনা বেগম',
    mobileNumber: '+৮৮০ ১০১২-২৩৪৫৬৭',
    class: '১০ম শ্রেণী',
    section: 'মানবিক',
    session: '২০২৫-২৬',
    rollNumber: '৩০০১',
  },
];

// ---------- Main Component ----------
const StudentFeesPage: React.FC = () => {
  // View state
  const [view, setView] = useState<'search' | 'fees'>('search');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Filter state
  const [selectedSession, setSelectedSession] = useState<string>('২০২৬-২৭');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');

  // UI state
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    heading: '',
    message: '',
  });
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    title: '',
    amount: '',
  });
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    title: '',
    amount: '',
    recNo: '',
    gateway: '',
  });
  const [searching, setSearching] = useState(false);

  // Load JsBarcode script
  useEffect(() => {
    if (!(window as any).JsBarcode) {
      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Theme init
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (
      savedTheme === 'dark' ||
      (!savedTheme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = (): void => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const triggerToast = (heading: string, message: string): void => {
    setToast({ visible: true, heading, message });
    setTimeout(() => {
      setToast({ visible: false, heading: '', message: '' });
    }, 3200);
  };

  // Filter students based on criteria
  const filteredStudents = useMemo(() => {
    return STUDENTS.filter((s) => {
      if (selectedSession && s.session !== selectedSession) return false;
      if (selectedClass && s.class !== selectedClass) return false;
      if (selectedSection && s.section !== selectedSection) return false;
      return true;
    });
  }, [selectedSession, selectedClass, selectedSection]);

  // Search student by code directly
  const handleDirectSearch = (): void => {
    const query = globalSearch.trim().toLowerCase();
    if (!query) {
      triggerToast('ত্রুটি', 'অনুগ্রহ করে শিক্ষার্থীর আইডি বা নাম লিখুন');
      return;
    }

    setSearching(true);
    // Simulate API call
    setTimeout(() => {
      const found = STUDENTS.find(
        (s) =>
          s.studentCode.toLowerCase().includes(query) ||
          s.fullName.toLowerCase().includes(query)
      );
      setSearching(false);

      if (found) {
        setSelectedStudent(found);
        setView('fees');
        setGlobalSearch('');
        triggerToast('শিক্ষার্থী পাওয়া গেছে', `${found.fullName} এর ফি লোড করা হয়েছে`);
      } else {
        triggerToast('পাওয়া যায়নি', `"${globalSearch}" এর জন্য কোনো শিক্ষার্থী পাওয়া যায়নি`);
      }
    }, 600);
  };

  // Handle student selection from modal
  const handleStudentSelect = (student: Student): void => {
    setSelectedStudent(student);
    setFilterModalOpen(false);
    setView('fees');
    triggerToast('শিক্ষার্থী নির্বাচিত', `${student.fullName} এর ফি লোড করা হয়েছে`);
  };

  // Reset to search view
  const handleBackToSearch = (): void => {
    setView('search');
    setSelectedStudent(null);
  };

  const payFee = (title: string, amount: string): void => {
    setSelectedItem({ title, amount });
    setPaymentModalOpen(true);
  };

  const closePaymentModal = (): void => setPaymentModalOpen(false);

  const processGateway = (gateway: string): void => {
    closePaymentModal();
    triggerToast(
      'পেমেন্ট গেটওয়ে রিডাইরেক্ট',
      `${gateway} গেটওয়েতে সংযোগ স্থাপন করা হচ্ছে...`
    );

    setTimeout(() => {
      openReceiptModal(
        selectedItem.title,
        `৳${parseInt(selectedItem.amount).toLocaleString('bn-BD')}`,
        'Paid',
        'REC-2026-NEW',
        gateway
      );
    }, 1800);
  };

  const openReceiptModal = (
    title: string,
    amount: string,
    status: string,
    recNo: string,
    gateway: string
  ): void => {
    setReceiptData({ title, amount, recNo, gateway });
    setReceiptModalOpen(true);
  };

  const closeReceiptModal = (): void => setReceiptModalOpen(false);

  const monthsData: MonthData[] = [
    { name: 'জানুয়ারি', en: 'Jan', status: 'paid', amount: '৳১,৫০০', date: '০৮ জানু, ২০২৬', txn: 'TXN-99101', gateway: 'bKash', recNo: 'REC-2026-01' },
    { name: 'ফেব্রুয়ারি', en: 'Feb', status: 'paid', amount: '৳১,৫০০', date: '১০ ফেব, ২০২৬', txn: 'TXN-99214', gateway: 'Nagad', recNo: 'REC-2026-02' },
    { name: 'মার্চ', en: 'Mar', status: 'paid', amount: '৳১,৫০০', date: '১২ মার্চ, ২০২৬', txn: 'TXN-99380', gateway: 'bKash', recNo: 'REC-2026-03' },
    { name: 'এপ্রিল', en: 'Apr', status: 'paid', amount: '৳১,৫০০', date: '০৫ এপ্রিল, ২০২৬', txn: 'TXN-99411', gateway: 'Card', recNo: 'REC-2026-04' },
    { name: 'মে', en: 'May', status: 'paid', amount: '৳১,৫০০', date: '০৯ মে, ২০২৬', txn: 'TXN-99520', gateway: 'bKash', recNo: 'REC-2026-05' },
    { name: 'জুন', en: 'Jun', status: 'paid', amount: '৳১,৫০০', date: '১১ জুন, ২০২৬', txn: 'TXN-99632', gateway: 'Nagad', recNo: 'REC-2026-06' },
    { name: 'জুলাই', en: 'Jul', status: 'paid', amount: '৳১,৫০০', date: '০৭ জুলাই, ২০২৬', txn: 'TXN-99719', gateway: 'bKash', recNo: 'REC-2026-07' },
    { name: 'আগস্ট', en: 'Aug', status: 'paid', amount: '৳১,৫০০', date: '১০ আগস্ট, ২০২৬', txn: 'TXN-99805', gateway: 'Rocket', recNo: 'REC-2026-08' },
    { name: 'সেপ্টেম্বর', en: 'Sep', status: 'paid', amount: '৳১,৫০০', date: '১২ সেপ, ২০২৬', txn: 'TXN-99912', gateway: 'bKash', recNo: 'REC-2026-09' },
    { name: 'অক্টোবর', en: 'Oct', status: 'due', amount: '৳১,৫০০', date: '১৫ অক্টোবর, ২০২৬', txn: 'N/A', gateway: '', recNo: '' },
    { name: 'নভেম্বর', en: 'Nov', status: 'due', amount: '৳১,৫০০', date: '১৫ নভেম্বর, ২০২৬', txn: 'N/A', gateway: '', recNo: '' },
    { name: 'ডিসেম্বর', en: 'Dec', status: 'due', amount: '৳১,৫০০', date: '১৫ ডিসেম্বর, ২০২৬', txn: 'N/A', gateway: '', recNo: '' },
  ];

  const filteredMonths = monthsData.filter((month) => {
    const matchesFilter = activeFilter === 'all' || month.status === activeFilter;
    const matchesSearch =
      month.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      month.en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const paidCount = monthsData.filter((m) => m.status === 'paid').length;
  const dueCount = monthsData.filter((m) => m.status === 'due').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .dark .glass-card {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glass-nav {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .dark .glass-nav {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .gradient-text {
          background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: rgba(241, 245, 249, 0.5); }
        .dark ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
        .dark ::-webkit-scrollbar-thumb { background: #334155; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        @media print {
          body * { visibility: hidden; }
          #receiptModal, #receiptModal * { visibility: visible; }
          #receiptModal {
            position: absolute; left: 0; top: 0; width: 100%;
            box-shadow: none; background: white !important; color: black !important;
          }
          .no-print { display: none !important; }
        }

        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          50% { box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-in { animation: zoomIn 0.2s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        /* Custom range slider */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        input[type="range"]::-webkit-slider-track {
          background: #e2e8f0;
          height: 6px;
          border-radius: 9999px;
        }
        .dark input[type="range"]::-webkit-slider-track {
          background: #334155;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -6px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
          border: 2px solid white;
        }
      `}</style>

      {/* ==================== SEARCH VIEW ==================== */}
      {view === 'search' && (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />

          {/* Animated Blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/30 to-purple-400/30 dark:from-indigo-600/20 dark:to-purple-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/30 to-blue-400/30 dark:from-cyan-600/20 dark:to-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-gradient-to-br from-pink-400/20 to-rose-400/20 dark:from-pink-600/10 dark:to-rose-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.8s' }} />

          {/* Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />

          {/* Dark mode toggle - top right */}
          <button
            onClick={toggleDarkMode}
            className="absolute top-6 right-6 z-20 p-3 rounded-2xl glass-card shadow-lg hover:scale-110 transition-transform duration-300 group"
            aria-label="থিম পরিবর্তন করুন"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
            ) : (
              <Sun className="w-5 h-5 text-slate-600 group-hover:rotate-90 transition-transform duration-500" />
            )}
          </button>

          {/* Main Content */}
          <div className="relative z-10 w-full max-w-3xl animate-slide-up">
            {/* Logo & Title */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 shadow-2xl shadow-indigo-500/30 mb-6 animate-pulse-glow">
                <GraduationCap className="w-11 h-11 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
                <span className="gradient-text">স্মার্টএডু</span>{' '}
                <span className="text-slate-900 dark:text-white">ফি পোর্টাল</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
                শিক্ষার্থীর ফি দেখতে এবং পরিচালনা করতে অনুসন্ধান করুন
              </p>
            </div>

            {/* Search Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 border border-white/60 dark:border-slate-800/80">
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDirectSearch()}
                    placeholder="শিক্ষার্থীর আইডি বা নাম লিখুন (যেমন: STD-2026-0842)"
                    className="w-full pl-14 pr-4 py-4 text-sm sm:text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm placeholder:text-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium"
                    autoFocus
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleDirectSearch}
                    disabled={searching}
                    className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                  >
                    {searching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        খোঁজা হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        শিক্ষার্থী খুঁজুন
                      </>
                    )}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </button>

                  <button
                    onClick={() => setFilterModalOpen(true)}
                    className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <SlidersHorizontal className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    শিক্ষার্থী ফিল্টার করুন
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-medium">{STUDENTS.length} জন শিক্ষার্থী নিবন্ধিত</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="font-medium">{SESSIONS.length} টি সক্রিয় সেশন</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="font-medium">{CLASSES.length} টি শ্রেণী</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer hint */}
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
              <Sparkles className="w-3 h-3 inline mr-1" />
              "STD-2026-0842" লিখে খুঁজুন অথবা শিক্ষার্থী ব্রাউজ করতে ফিল্টার ক্লিক করুন
            </p>
          </div>
        </div>
      )}

      {/* ==================== FEES VIEW ==================== */}
      {view === 'fees' && selectedStudent && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
          {/* Back button */}
          <button
            onClick={handleBackToSearch}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
          >
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            অনুসন্ধানে ফিরে যান
          </button>

          {/* SECTION 1: Student Profile Banner */}
          <section className="relative rounded-3xl overflow-hidden glass-card shadow-glass dark:shadow-glass-dark border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left w-full lg:w-auto">
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-5xl font-black ring-4 ring-white dark:ring-slate-900 shadow-xl shadow-brand-500/10">
                    {selectedStudent.fullName?.charAt(0) || 'S'}
                  </div>
                  <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" title="সক্রিয় শিক্ষার্থী স্ট্যাটাস"></span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{selectedStudent.fullName}</h2>
                    <span className="bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" /> রেগুলার শিক্ষার্থী
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    শিক্ষার্থী আইডি: <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{selectedStudent.studentCode}</span> • ভর্তি সেশন: <span className="text-slate-700 dark:text-slate-200 font-semibold">{selectedStudent.session}</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                    <span className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />শ্রেণী: <strong>{selectedStudent.class}</strong>
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-brand-500" />রোল: <strong>{selectedStudent.rollNumber}</strong>
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-500" />শাখা: <strong>{selectedStudent.section}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                <div className="text-center p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">উপস্থিতি</span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">৯৫.৪%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">সবুজ জোন</span>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">জি.পি.এ</span>
                  <span className="text-lg font-extrabold text-brand-600 dark:text-brand-400">৫.০০</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">প্রথম টার্ম</span>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">ফি স্ট্যাটাস</span>
                  <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">২টি বকেয়া</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">অক্টো-নভেম্বর</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Fee Financial Overview */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট ধার্যকৃত সেশন ফি</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">৳২৮,৫০০</h3>
                </div>
                <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl group-hover:scale-110 transition">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>সেশন ২০২৬-২৭</span>
                <span className="font-semibold text-brand-600 dark:text-brand-400">১২টি ক্যাটাগরি</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট পরিশোধিত ফি</p>
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5">৳২০,০০০</h3>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>ক্লিয়ার করা হয়েছে: <strong>৭০%</strong></span>
                <span className="text-emerald-600 font-semibold">৯টি চালান</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 shadow-sm relative overflow-hidden group hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">অবশিষ্ট বকেয়া ফি</p>
                  <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1.5">৳৮,৫০০</h3>
                </div>
                <div className="p-3 bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 transition">
                  <TriangleAlert className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-100 dark:border-rose-900/30 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>শেষ তারিখ: <strong className="text-rose-600 dark:text-rose-400">১৫ অক্টোবর</strong></span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">২ মাস বকেয়া</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">বৃত্তি ও ছাড় (Waiver)</p>
                  <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1.5">৳২,০০০</h3>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>মেধা বৃত্তি (Merit Waiver)</span>
                <span className="text-purple-600 font-bold">১০% ছাড়</span>
              </div>
            </div>
          </section>

          {/* SECTION 3: 12-Month Breakdown */}
          <section className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 space-y-6 shadow-glass dark:shadow-glass-dark">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/80">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <CalendarDays className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <span>সক্রিয় সেশনের ১২ মাসের ফি তালিকা (Active Session 12 Months)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">জানুয়ারি ২০২৬ থেকে ডিসেম্বর ২০২৬ সেশনের টিউশন ফি এর স্ট্যাটাস এবং বিবরণ</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value)
                    }
                    placeholder="মাস খুঁজুন (যেমন: Jan)..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl text-xs font-semibold w-full sm:w-auto">
                  {([
                    { key: 'all' as FilterKey, label: `সকল (${monthsData.length})` },
                    { key: 'paid' as FilterKey, label: `পরিশোধিত (${paidCount})` },
                    { key: 'due' as FilterKey, label: `বকেয়া (${dueCount})` },
                  ]).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveFilter(tab.key)}
                      className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl transition ${activeFilter === tab.key
                        ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMonths.map((month, index) => (
                <div
                  key={index}
                  className={`month-card ${month.status === 'paid'
                    ? 'border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 hover:border-brand-300 dark:hover:border-brand-700'
                    : 'border-2 border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20'
                    } rounded-2xl p-4 transition duration-300 flex flex-col justify-between group hover:shadow-md relative`}
                >
                  {month.status === 'due' && (
                    <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-bl-xl shadow-sm">
                      চলতি মাস (Due)
                    </span>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {month.name}{' '}
                        <span className="text-xs font-normal text-slate-400">({month.en})</span>
                      </h4>
                      {month.status === 'paid' ? (
                        <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      ) : (
                        <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-rose-200 dark:border-rose-800">
                          <TriangleAlert className="w-3 h-3" /> Overdue
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <div className="flex justify-between">
                        <span>টিউশন ফি:</span>
                        <strong
                          className={
                            month.status === 'due'
                              ? 'text-rose-600 dark:text-rose-400 font-bold'
                              : 'text-slate-700 dark:text-slate-200'
                          }
                        >
                          {month.amount}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>{month.status === 'due' ? 'শেষ সময়:' : 'তারিখ:'}</span>
                        <span
                          className={
                            month.status === 'due'
                              ? 'text-rose-600 dark:text-rose-400 font-semibold'
                              : ''
                          }
                        >
                          {month.date}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{month.status === 'due' ? 'লেট ফি:' : 'আইডি:'}</span>
                        <span
                          className={
                            month.status === 'due' ? 'text-slate-400' : 'font-mono'
                          }
                        >
                          {month.status === 'due' ? '৳০.০০' : month.txn}
                        </span>
                      </div>
                    </div>
                  </div>
                  {month.status === 'paid' ? (
                    <button
                      onClick={() =>
                        openReceiptModal(
                          `${month.name} ২০২৬ টিউশন ফি`,
                          month.amount,
                          'Paid',
                          month.recNo,
                          month.gateway
                        )
                      }
                      className="w-full bg-slate-200/70 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" /> রসিদ দেখুন
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        payFee(
                          `${month.name} ২০২৬ টিউশন ফি`,
                          month.amount.replace('৳', '').replace(',', '')
                        )
                      }
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> ফি প্রদান করুন
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: Detailed Ledger */}
          <section className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 space-y-6 shadow-glass dark:shadow-glass-dark">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-indigo-500" />
                  <span>বাৎসরিক ফি খাতের বিবরণ (Detailed Session Ledger)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">প্রতিটি একাডেমিক ও আনুষঙ্গিক খাতের ফি হিসাব</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">
                  মোট খাত: <strong className="text-slate-800 dark:text-slate-200">৭ টি</strong>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-3">ফি খাতের নাম (Category)</th>
                    <th className="py-3 px-3">পরিশোধের ধরণ</th>
                    <th className="py-3 px-3 text-right">নির্ধারিত ফি</th>
                    <th className="py-3 px-3 text-right">ছাড় (Waiver)</th>
                    <th className="py-3 px-3 text-right">পরিশোধিত</th>
                    <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
                    <th className="py-3 px-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                    <td className="py-3.5 px-3 flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <span>বার্ষিক ভর্তি ও সেশন ফি</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">এককালীন</td>
                    <td className="py-3.5 px-3 text-right font-bold">৳৬,০০০</td>
                    <td className="py-3.5 px-3 text-right text-emerald-600 font-semibold">৳০.০০</td>
                    <td className="py-3.5 px-3 text-right text-slate-800 dark:text-slate-200 font-bold">৳৬,০০০</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full">Paid</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() =>
                          openReceiptModal(
                            'বার্ষিক ভর্তি ও সেশন ফি',
                            '৳৬,০০০',
                            'Paid',
                            'REC-2026-ADM',
                            'Bank'
                          )
                        }
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold text-xs underline"
                      >
                        রসিদ
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                    <td className="py-3.5 px-3 flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <span>মাসিক টিউশন ফি (১২ মাস)</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">মাসিক (৳১,৫০০)</td>
                    <td className="py-3.5 px-3 text-right font-bold">৳১৮,০০০</td>
                    <td className="py-3.5 px-3 text-right text-emerald-600 font-semibold">৳২,০০০</td>
                    <td className="py-3.5 px-3 text-right text-slate-800 dark:text-slate-200 font-bold">৳১৩,৫০০</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full">আংশিক</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => payFee('মাসিক টিউশন ফি বকেয়া', '3000')}
                        className="text-rose-600 hover:underline font-bold text-xs"
                      >
                        ফি দিন
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                    <td className="py-3.5 px-3 flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
                        <FilePen className="w-3.5 h-3.5" />
                      </div>
                      <span>অর্ধ-বার্ষিক পরীক্ষা ফি (Midterm)</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">টার্ম ভিত্তিক</td>
                    <td className="py-3.5 px-3 text-right font-bold">৳২,০০০</td>
                    <td className="py-3.5 px-3 text-right text-emerald-600 font-semibold">৳০.০০</td>
                    <td className="py-3.5 px-3 text-right text-slate-800 dark:text-slate-200 font-bold">৳২,০০০</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full">Paid</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() =>
                          openReceiptModal(
                            'অর্ধ-বার্ষিক পরীক্ষা ফি',
                            '৳২,০০০',
                            'Paid',
                            'REC-2026-EX1',
                            'Nagad'
                          )
                        }
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold text-xs underline"
                      >
                        রসিদ
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                    <td className="py-3.5 px-3 flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                        <Laptop className="w-3.5 h-3.5" />
                      </div>
                      <span>আইটি ও কম্পিউটার ল্যাব চার্জ</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">বার্ষিক</td>
                    <td className="py-3.5 px-3 text-right font-bold">৳১,৫০০</td>
                    <td className="py-3.5 px-3 text-right text-emerald-600 font-semibold">৳০.০০</td>
                    <td className="py-3.5 px-3 text-right text-slate-800 dark:text-slate-200 font-bold">৳১,৫০০</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full">Paid</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() =>
                          openReceiptModal(
                            'আইটি ও কম্পিউটার ল্যাব চার্জ',
                            '৳১,৫০০',
                            'Paid',
                            'REC-2026-IT',
                            'bKash'
                          )
                        }
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold text-xs underline"
                      >
                        রসিদ
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                    <td className="py-3.5 px-3 flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
                        <Volleyball className="w-3.5 h-3.5" />
                      </div>
                      <span>ক্রীড়া, লাইব্রেরি ও ক্লাবিং ফি</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">বার্ষিক</td>
                    <td className="py-3.5 px-3 text-right font-bold">৳১,০০০</td>
                    <td className="py-3.5 px-3 text-right text-emerald-600 font-semibold">৳০.০০</td>
                    <td className="py-3.5 px-3 text-right text-rose-600 font-bold">৳০.০০</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 text-[11px] font-bold px-2.5 py-1 rounded-full">বকেয়া</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => payFee('ক্রীড়া ও ক্লাবিং ফি', '1000')}
                        className="text-rose-600 hover:underline font-bold text-xs"
                      >
                        ফি দিন
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 5: Recent Transactions */}
          <section className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 space-y-4 shadow-glass dark:shadow-glass-dark">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/80">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-brand-500" />
                <span>সাম্প্রতিক ট্রানজেকশন হিস্ট্রি (Recent Transactions)</span>
              </h3>
              <span className="text-xs text-slate-400">সর্বশেষ ৫টি ট্রানজেকশন</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-bkash font-black flex items-center justify-center text-sm shadow-sm">
                    bKash
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">সেপ্টেম্বর ২০২৬ টিউশন ফি</h5>
                    <p className="text-slate-400">
                      ট্রানজেকশন আইডি:{' '}
                      <span className="font-mono text-slate-600 dark:text-slate-300">TXN-99912</span> • ১২ সেপ্টেম্বর, ২০২৬
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">৳১,৫০০</span>
                  <button
                    onClick={() =>
                      openReceiptModal(
                        'সেপ্টেম্বর ২০২৬ টিউশন ফি',
                        '৳১,৫০০',
                        'Paid',
                        'REC-2026-09',
                        'bKash'
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition"
                  >
                    স্লিপ
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-nagad font-black flex items-center justify-center text-sm shadow-sm">
                    নগদ
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">অর্ধ-বার্ষিক পরীক্ষা ফি</h5>
                    <p className="text-slate-400">
                      ট্রানজেকশন আইডি:{' '}
                      <span className="font-mono text-slate-600 dark:text-slate-300">TXN-88204</span> • ২৫ জুলাই, ২০২৬
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">৳২,০০০</span>
                  <button
                    onClick={() =>
                      openReceiptModal(
                        'অর্ধ-বার্ষিক পরীক্ষা ফি',
                        '৳২,০০০',
                        'Paid',
                        'REC-2026-EX1',
                        'Nagad'
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition"
                  >
                    স্লিপ
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ==================== FILTER MODAL ==================== */}
      {filterModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setFilterModalOpen(false)}
        >
          <div className="w-full sm:max-w-3xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 p-6 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              </div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Filter className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">শিক্ষার্থী ফিল্টার করুন</h3>
                    <p className="text-xs text-white/80">সেশন, শ্রেণী এবং শাখা অনুযায়ী শিক্ষার্থী ব্রাউজ করুন</p>
                  </div>
                </div>
                <button
                  onClick={() => setFilterModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="p-6 space-y-5 border-b border-slate-200 dark:border-slate-800">
              {/* Session Selector */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  <CalendarDays className="w-3.5 h-3.5" />
                  শিক্ষাবর্ষ (Academic Session)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SESSIONS.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSession(session.name)}
                      className={`relative p-3 rounded-2xl border-2 transition-all duration-200 text-left ${selectedSession === session.name
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-md shadow-indigo-500/10'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-700'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${selectedSession === session.name
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-700 dark:text-slate-300'
                          }`}>
                          {session.name}
                        </span>
                        {selectedSession === session.name && (
                          <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      {session.isCurrent && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 inline-flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          চলমান
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Class Selector */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  <School className="w-3.5 h-3.5" />
                  শ্রেণী (Class)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedClass('');
                      setSelectedSection('');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedClass === ''
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                  >
                    সকল শ্রেণী
                  </button>
                  {CLASSES.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => {
                        setSelectedClass(cls.name);
                        setSelectedSection('');
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedClass === cls.name
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                      {cls.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Selector */}
              {selectedClass && (
                <div className="animate-slide-up">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    <Layers className="w-3.5 h-3.5" />
                    শাখা (Section)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSection('')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedSection === ''
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                      সকল শাখা
                    </button>
                    {CLASSES.find((c) => c.name === selectedClass)?.sections.map((section) => (
                      <button
                        key={section}
                        onClick={() => setSelectedSection(section)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedSection === section
                          ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 px-6 py-3 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    শিক্ষার্থী পাওয়া গেছে
                  </span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full">
                    {filteredStudents.length} জন
                  </span>
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <SearchX className="w-7 h-7 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">কোনো শিক্ষার্থী পাওয়া যায়নি</h4>
                  <p className="text-xs text-slate-500">আপনার ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.map((student, index) => (
                    <button
                      key={student.id}
                      onClick={() => handleStudentSelect(student)}
                      style={{ animationDelay: `${index * 30}ms` }}
                      className="w-full text-left p-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors group animate-fade-in"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-500/20">
                            {student.fullName.charAt(0)}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {student.fullName}
                            </h5>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                              {student.studentCode}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              {student.class}
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              {student.section}
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              রোল {student.rollNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {student.fatherName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {student.mobileNumber}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 flex items-center justify-center transition-all group-hover:scale-110">
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedSession('২০২৬-২৭');
                  setSelectedClass('');
                  setSelectedSection('');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                ফিল্টার রিসেট করুন
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" /> নিরাপদ পেমেন্ট গেটওয়ে
              </h4>
              <button
                onClick={closePaymentModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>ফি খাতের নাম:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedItem.title}</strong>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>শিক্ষার্থী আইডি:</span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedStudent?.studentCode}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">মোট প্রদেয় পরিমাণ:</span>
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
                  ৳{parseInt(selectedItem.amount || '0').toLocaleString('bn-BD')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                পেমেন্ট মেথড নির্বাচন করুন
              </p>

              <button
                onClick={() => processGateway('bKash')}
                className="w-full p-3.5 rounded-2xl border border-pink-200 dark:border-pink-900/40 bg-pink-50/50 dark:bg-pink-950/20 hover:bg-pink-100 dark:hover:bg-pink-900/40 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-600 text-white font-extrabold text-xs flex items-center justify-center">
                    bKash
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    বিকাশ পেমেন্ট (bKash Direct)
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => processGateway('Nagad')}
                className="w-full p-3.5 rounded-2xl border border-orange-200 dark:border-orange-900/40 bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center">
                    নগদ
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    নগদ ওয়ালেট (Nagad Express)
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => processGateway('Card')}
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    ডেবিট / ক্রেডিট কার্ড (Visa/Mastercard)
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-emerald-500" /> ২৫৬-বিট এসএসএল (SSL) এনক্রিপ্টেড পেমেন্ট সিস্টেম
            </p>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptModalOpen && (
        <div
          id="receiptModal"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-800 border border-slate-200 my-8">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center no-print">
              <span className="text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ডিজিটাল পেমেন্ট স্লিপ
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> প্রিন্ট করুন
                </button>
                <button
                  onClick={closeReceiptModal}
                  className="text-slate-400 hover:text-white px-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6" id="printableReceiptArea">
              <div className="text-center space-y-1 border-b-2 border-slate-900/10 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  ঢাকা পাবলিক মডেল স্কুল অ্যান্ড কলেজ
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  মিরপুর-১০, ঢাকা-১২১৬ | ফোন: +৮৮০ ২-৯৮৭৬৫৪৩
                </p>
                <div className="pt-2">
                  <span className="bg-slate-900 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                    অফিসিয়াল মানি রসিদ (OFFICIAL MONEY RECEIPT)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">শিক্ষার্থীর নাম</span>
                  <strong className="text-slate-900 font-bold">{selectedStudent?.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">শিক্ষার্থী আইডি</span>
                  <strong className="font-mono text-slate-900">{selectedStudent?.studentCode}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">শ্রেণী ও শাখা</span>
                  <strong className="text-slate-900">{selectedStudent?.class} • {selectedStudent?.section}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">রোল নম্বর</span>
                  <strong className="text-slate-900">{selectedStudent?.rollNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">রসিদ নম্বর</span>
                  <strong className="font-mono text-indigo-600 font-extrabold">{receiptData.recNo}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">পেমেন্ট মেথড</span>
                  <strong className="text-slate-900">{receiptData.gateway} Online</strong>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">বিবরণ (Particulars)</th>
                      <th className="p-3 text-right">পরিমাণ (Amount)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="p-3 text-slate-800">{receiptData.title}</td>
                      <td className="p-3 text-right font-bold text-slate-900">{receiptData.amount}</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 text-slate-500">অনলাইন প্রসেসিং ও সার্ভিস চার্জ</td>
                      <td className="p-3 text-right text-slate-500">৳০.০০</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-100 font-black border-t border-slate-200 text-sm">
                    <tr>
                      <td className="p-3 text-slate-900">সর্বমোট (Total Paid):</td>
                      <td className="p-3 text-right text-emerald-600">{receiptData.amount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-dashed border-slate-300">
                <div className="text-center">
                  <Barcode value={receiptData.recNo} />
                  <span className="text-[9px] text-slate-400 font-mono block mt-1">
                    VERIFIED TRANSACTION
                  </span>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-16 h-16 rounded-full border-2 border-indigo-500/40 border-dashed flex items-center justify-center text-indigo-600 text-[10px] font-black transform -rotate-12 mx-auto">
                    PAID STAMP
                  </div>
                  <span className="text-[10px] text-slate-500 block font-bold">
                    হিসাব শাখা (Accounts)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        className={`fixed bottom-6 right-6 z-[200] transition-all duration-300 pointer-events-none ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
          }`}
      >
        <div className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">{toast.heading}</h5>
            <p className="text-[11px] text-slate-400">{toast.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeesPage;
// // src/pages/fees/StudentFeesPage.tsx

// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { createPortal } from 'react-dom';
// import {
//   GraduationCap, Wallet, CheckCircle2, TriangleAlert, Award,
//   CalendarDays, Search, Receipt, CreditCard, ListChecks, BookOpen,
//   FilePen, Laptop, Volleyball, History, ShieldCheck, X, Lock,
//   Printer, ChevronRight, Send, Hourglass, Layers, Hash, Sun,
//   BadgeCheck, Filter, Users, ChevronDown, ChevronUp, User,
//   Phone, MapPin, ArrowRight, Sparkles, School, BookMarked,
//   GraduationCap as GradCap, SlidersHorizontal, Check, SearchX,
//   Loader2
// } from 'lucide-react';

// // ---------- Types ----------
// interface MonthData {
//   name: string;
//   en: string;
//   status: 'paid' | 'due';
//   amount: string;
//   date: string;
//   txn: string;
//   gateway: string;
//   recNo: string;
// }

// interface SelectedItem {
//   title: string;
//   amount: string;
// }

// interface ReceiptData {
//   title: string;
//   amount: string;
//   recNo: string;
//   gateway: string;
// }

// interface ToastState {
//   visible: boolean;
//   heading: string;
//   message: string;
// }

// interface Student {
//   id: number;
//   studentCode: string;
//   fullName: string;
//   fatherName: string;
//   motherName: string;
//   mobileNumber: string;
//   class: string;
//   section: string;
//   session: string;
//   rollNumber: string;
//   avatar?: string;
// }

// interface Session {
//   id: number;
//   name: string;
//   isCurrent: boolean;
// }

// interface ClassItem {
//   id: number;
//   name: string;
//   sections: string[];
// }

// type FilterKey = 'all' | 'paid' | 'due';

// // ---------- Barcode Component ----------
// interface BarcodeProps {
//   value: string;
// }

// const Barcode: React.FC<BarcodeProps> = ({ value }) => {
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   useEffect(() => {
//     const jsBarcode = (window as any).JsBarcode;
//     if (jsBarcode && svgRef.current) {
//       try {
//         jsBarcode(svgRef.current, value || 'REC-2026-88', {
//           format: 'CODE128',
//           lineColor: '#0f172a',
//           width: 1.5,
//           height: 35,
//           displayValue: false,
//         });
//       } catch (e) {
//         console.log('Barcode error', e);
//       }
//     }
//   }, [value]);

//   return <svg ref={svgRef} className="max-h-10 max-w-[140px]"></svg>;
// };

// // ---------- Static Data ----------
// const SESSIONS: Session[] = [
//   { id: 1, name: '2026-27', isCurrent: true },
//   { id: 2, name: '2025-26', isCurrent: false },
//   { id: 3, name: '2024-25', isCurrent: false },
// ];

// const CLASSES: ClassItem[] = [
//   { id: 1, name: 'Class 6', sections: ['A', 'B', 'C'] },
//   { id: 2, name: 'Class 7', sections: ['A', 'B', 'C'] },
//   { id: 3, name: 'Class 8', sections: ['A', 'B'] },
//   { id: 4, name: 'Class 9', sections: ['Science', 'Commerce', 'Arts'] },
//   { id: 5, name: 'Class 10', sections: ['Science', 'Commerce', 'Arts'] },
// ];

// const STUDENTS: Student[] = [
//   {
//     id: 1,
//     studentCode: 'STD-2026-0842',
//     fullName: 'Nasrin Sultana',
//     fatherName: 'Md. Abdul Karim',
//     motherName: 'Mrs. Fatema Begum',
//     mobileNumber: '+880 1712-345678',
//     class: 'Class 10',
//     section: 'Science',
//     session: '2026-27',
//     rollNumber: '1004',
//     avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
//   },
//   {
//     id: 2,
//     studentCode: 'STD-2026-0843',
//     fullName: 'Rahim Ahmed',
//     fatherName: 'Md. Jamal Uddin',
//     motherName: 'Mrs. Rahima Khatun',
//     mobileNumber: '+880 1812-456789',
//     class: 'Class 10',
//     section: 'Science',
//     session: '2026-27',
//     rollNumber: '1005',
//   },
//   {
//     id: 3,
//     studentCode: 'STD-2026-0844',
//     fullName: 'Fatima Akter',
//     fatherName: 'Md. Sultan Mahmud',
//     motherName: 'Mrs. Nasima Begum',
//     mobileNumber: '+880 1912-567890',
//     class: 'Class 10',
//     section: 'Science',
//     session: '2026-27',
//     rollNumber: '1006',
//   },
//   {
//     id: 4,
//     studentCode: 'STD-2026-0845',
//     fullName: 'Tanvir Hasan',
//     fatherName: 'Md. Kamal Hossain',
//     motherName: 'Mrs. Salma Khatun',
//     mobileNumber: '+880 1612-678901',
//     class: 'Class 10',
//     section: 'Commerce',
//     session: '2026-27',
//     rollNumber: '2001',
//   },
//   {
//     id: 5,
//     studentCode: 'STD-2026-0846',
//     fullName: 'Sumaiya Islam',
//     fatherName: 'Md. Rafiqul Islam',
//     motherName: 'Mrs. Shirin Akter',
//     mobileNumber: '+880 1512-789012',
//     class: 'Class 10',
//     section: 'Commerce',
//     session: '2026-27',
//     rollNumber: '2002',
//   },
//   {
//     id: 6,
//     studentCode: 'STD-2026-0847',
//     fullName: 'Arif Khan',
//     fatherName: 'Md. Nasir Khan',
//     motherName: 'Mrs. Ruma Khan',
//     mobileNumber: '+880 1412-890123',
//     class: 'Class 9',
//     section: 'Science',
//     session: '2026-27',
//     rollNumber: '1010',
//   },
//   {
//     id: 7,
//     studentCode: 'STD-2026-0848',
//     fullName: 'Nusrat Jahan',
//     fatherName: 'Md. Shahidul Islam',
//     motherName: 'Mrs. Parvin Akter',
//     mobileNumber: '+880 1312-901234',
//     class: 'Class 9',
//     section: 'Science',
//     session: '2026-27',
//     rollNumber: '1011',
//   },
//   {
//     id: 8,
//     studentCode: 'STD-2026-0849',
//     fullName: 'Sabbir Rahman',
//     fatherName: 'Md. Motiur Rahman',
//     motherName: 'Mrs. Rehana Begum',
//     mobileNumber: '+880 1212-012345',
//     class: 'Class 9',
//     section: 'Commerce',
//     session: '2026-27',
//     rollNumber: '2005',
//   },
//   {
//     id: 9,
//     studentCode: 'STD-2025-0501',
//     fullName: 'Mehedi Hasan',
//     fatherName: 'Md. Anwar Hossain',
//     motherName: 'Mrs. Selina Akter',
//     mobileNumber: '+880 1112-123456',
//     class: 'Class 10',
//     section: 'Science',
//     session: '2025-26',
//     rollNumber: '1001',
//   },
//   {
//     id: 10,
//     studentCode: 'STD-2025-0502',
//     fullName: 'Jannatul Ferdous',
//     fatherName: 'Md. Abul Kalam',
//     motherName: 'Mrs. Hasina Begum',
//     mobileNumber: '+880 1012-234567',
//     class: 'Class 10',
//     section: 'Arts',
//     session: '2025-26',
//     rollNumber: '3001',
//   },
// ];

// // ---------- Main Component ----------
// const StudentFeesPage: React.FC = () => {
//   // View state
//   const [view, setView] = useState<'search' | 'fees'>('search');
//   const [darkMode, setDarkMode] = useState<boolean>(false);
//   const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [globalSearch, setGlobalSearch] = useState<string>('');
//   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

//   // Modal state
//   const [filterModalOpen, setFilterModalOpen] = useState(false);
//   const [paymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [receiptModalOpen, setReceiptModalOpen] = useState(false);

//   // Filter state
//   const [selectedSession, setSelectedSession] = useState<string>('2026-27');
//   const [selectedClass, setSelectedClass] = useState<string>('');
//   const [selectedSection, setSelectedSection] = useState<string>('');

//   // UI state
//   const [toast, setToast] = useState<ToastState>({
//     visible: false,
//     heading: '',
//     message: '',
//   });
//   const [selectedItem, setSelectedItem] = useState<SelectedItem>({
//     title: '',
//     amount: '',
//   });
//   const [receiptData, setReceiptData] = useState<ReceiptData>({
//     title: '',
//     amount: '',
//     recNo: '',
//     gateway: '',
//   });
//   const [searching, setSearching] = useState(false);

//   // Load JsBarcode script
//   useEffect(() => {
//     if (!(window as any).JsBarcode) {
//       const script = document.createElement('script');
//       script.src =
//         'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js';
//       script.async = true;
//       document.body.appendChild(script);
//     }
//   }, []);

//   // Theme init
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (
//       savedTheme === 'dark' ||
//       (!savedTheme &&
//         window.matchMedia('(prefers-color-scheme: dark)').matches)
//     ) {
//       setDarkMode(true);
//       document.documentElement.classList.add('dark');
//     } else {
//       setDarkMode(false);
//       document.documentElement.classList.remove('dark');
//     }
//   }, []);

//   const toggleDarkMode = (): void => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     if (newMode) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   };

//   const triggerToast = (heading: string, message: string): void => {
//     setToast({ visible: true, heading, message });
//     setTimeout(() => {
//       setToast({ visible: false, heading: '', message: '' });
//     }, 3200);
//   };

//   // Filter students based on criteria
//   const filteredStudents = useMemo(() => {
//     return STUDENTS.filter((s) => {
//       if (selectedSession && s.session !== selectedSession) return false;
//       if (selectedClass && s.class !== selectedClass) return false;
//       if (selectedSection && s.section !== selectedSection) return false;
//       return true;
//     });
//   }, [selectedSession, selectedClass, selectedSection]);

//   // Search student by code directly
//   const handleDirectSearch = (): void => {
//     const query = globalSearch.trim().toLowerCase();
//     if (!query) {
//       triggerToast('Error', 'Please enter a student code or name');
//       return;
//     }

//     setSearching(true);
//     // Simulate API call
//     setTimeout(() => {
//       const found = STUDENTS.find(
//         (s) =>
//           s.studentCode.toLowerCase().includes(query) ||
//           s.fullName.toLowerCase().includes(query)
//       );
//       setSearching(false);

//       if (found) {
//         setSelectedStudent(found);
//         setView('fees');
//         setGlobalSearch('');
//         triggerToast('Student Found', `Loaded fees for ${found.fullName}`);
//       } else {
//         triggerToast('Not Found', `No student found for "${globalSearch}"`);
//       }
//     }, 600);
//   };

//   // Handle student selection from modal
//   const handleStudentSelect = (student: Student): void => {
//     setSelectedStudent(student);
//     setFilterModalOpen(false);
//     setView('fees');
//     triggerToast('Student Selected', `Loaded fees for ${student.fullName}`);
//   };

//   // Reset to search view
//   const handleBackToSearch = (): void => {
//     setView('search');
//     setSelectedStudent(null);
//   };

//   const payFee = (title: string, amount: string): void => {
//     setSelectedItem({ title, amount });
//     setPaymentModalOpen(true);
//   };

//   const closePaymentModal = (): void => setPaymentModalOpen(false);

//   const processGateway = (gateway: string): void => {
//     closePaymentModal();
//     triggerToast(
//       'Payment Gateway Redirect',
//       `Connecting to ${gateway} gateway...`
//     );

//     setTimeout(() => {
//       openReceiptModal(
//         selectedItem.title,
//         `৳${parseInt(selectedItem.amount).toLocaleString('en-IN')}`,
//         'Paid',
//         'REC-2026-NEW',
//         gateway
//       );
//     }, 1800);
//   };

//   const openReceiptModal = (
//     title: string,
//     amount: string,
//     status: string,
//     recNo: string,
//     gateway: string
//   ): void => {
//     setReceiptData({ title, amount, recNo, gateway });
//     setReceiptModalOpen(true);
//   };

//   const closeReceiptModal = (): void => setReceiptModalOpen(false);

//   const monthsData: MonthData[] = [
//     { name: 'January', en: 'Jan', status: 'paid', amount: '৳1,500', date: '08 Jan, 2026', txn: 'TXN-99101', gateway: 'bKash', recNo: 'REC-2026-01' },
//     { name: 'February', en: 'Feb', status: 'paid', amount: '৳1,500', date: '10 Feb, 2026', txn: 'TXN-99214', gateway: 'Nagad', recNo: 'REC-2026-02' },
//     { name: 'March', en: 'Mar', status: 'paid', amount: '৳1,500', date: '12 Mar, 2026', txn: 'TXN-99380', gateway: 'bKash', recNo: 'REC-2026-03' },
//     { name: 'April', en: 'Apr', status: 'paid', amount: '৳1,500', date: '05 Apr, 2026', txn: 'TXN-99411', gateway: 'Card', recNo: 'REC-2026-04' },
//     { name: 'May', en: 'May', status: 'paid', amount: '৳1,500', date: '09 May, 2026', txn: 'TXN-99520', gateway: 'bKash', recNo: 'REC-2026-05' },
//     { name: 'June', en: 'Jun', status: 'paid', amount: '৳1,500', date: '11 Jun, 2026', txn: 'TXN-99632', gateway: 'Nagad', recNo: 'REC-2026-06' },
//     { name: 'July', en: 'Jul', status: 'paid', amount: '৳1,500', date: '07 Jul, 2026', txn: 'TXN-99719', gateway: 'bKash', recNo: 'REC-2026-07' },
//     { name: 'August', en: 'Aug', status: 'paid', amount: '৳1,500', date: '10 Aug, 2026', txn: 'TXN-99805', gateway: 'Rocket', recNo: 'REC-2026-08' },
//     { name: 'September', en: 'Sep', status: 'paid', amount: '৳1,500', date: '12 Sep, 2026', txn: 'TXN-99912', gateway: 'bKash', recNo: 'REC-2026-09' },
//     { name: 'October', en: 'Oct', status: 'due', amount: '৳1,500', date: '15 Oct, 2026', txn: 'N/A', gateway: '', recNo: '' },
//     { name: 'November', en: 'Nov', status: 'due', amount: '৳1,500', date: '15 Nov, 2026', txn: 'N/A', gateway: '', recNo: '' },
//     { name: 'December', en: 'Dec', status: 'due', amount: '৳1,500', date: '15 Dec, 2026', txn: 'N/A', gateway: '', recNo: '' },
//   ];

//   const filteredMonths = monthsData.filter((month) => {
//     const matchesFilter = activeFilter === 'all' || month.status === activeFilter;
//     const matchesSearch =
//       month.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       month.en.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   const paidCount = monthsData.filter((m) => m.status === 'paid').length;
//   const dueCount = monthsData.filter((m) => m.status === 'due').length;

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
//       <style>{`
//         .glass-card {
//           background: rgba(255, 255, 255, 0.75);
//           backdrop-filter: blur(16px);
//           -webkit-backdrop-filter: blur(16px);
//           border: 1px solid rgba(255, 255, 255, 0.5);
//         }
//         .dark .glass-card {
//           background: rgba(15, 23, 42, 0.75);
//           backdrop-filter: blur(16px);
//           -webkit-backdrop-filter: blur(16px);
//           border: 1px solid rgba(255, 255, 255, 0.08);
//         }
//         .glass-nav {
//           background: rgba(255, 255, 255, 0.85);
//           backdrop-filter: blur(20px);
//           -webkit-backdrop-filter: blur(20px);
//         }
//         .dark .glass-nav {
//           background: rgba(15, 23, 42, 0.85);
//           backdrop-filter: blur(20px);
//           -webkit-backdrop-filter: blur(20px);
//         }
//         .gradient-text {
//           background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }
//         ::-webkit-scrollbar { width: 8px; height: 8px; }
//         ::-webkit-scrollbar-track { background: rgba(241, 245, 249, 0.5); }
//         .dark ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); }
//         ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
//         .dark ::-webkit-scrollbar-thumb { background: #334155; }
//         ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

//         @media print {
//           body * { visibility: hidden; }
//           #receiptModal, #receiptModal * { visibility: visible; }
//           #receiptModal {
//             position: absolute; left: 0; top: 0; width: 100%;
//             box-shadow: none; background: white !important; color: black !important;
//           }
//           .no-print { display: none !important; }
//         }

//         @keyframes zoomIn {
//           from { opacity: 0; transform: scale(0.95); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes pulse-glow {
//           0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
//           50% { box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
//         }
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         @keyframes shimmer {
//           0% { background-position: -1000px 0; }
//           100% { background-position: 1000px 0; }
//         }
//         .animate-in { animation: zoomIn 0.2s ease-out; }
//         .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
//         .animate-fade-in { animation: fadeIn 0.3s ease-out; }
//         .animate-float { animation: float 3s ease-in-out infinite; }
//         .animate-pulse-glow { animation: pulse-glow 2s infinite; }
//         .shimmer {
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
//           background-size: 1000px 100%;
//           animation: shimmer 2s infinite;
//         }

//         /* Custom range slider */
//         input[type="range"] {
//           -webkit-appearance: none;
//           appearance: none;
//           background: transparent;
//           cursor: pointer;
//         }
//         input[type="range"]::-webkit-slider-track {
//           background: #e2e8f0;
//           height: 6px;
//           border-radius: 9999px;
//         }
//         .dark input[type="range"]::-webkit-slider-track {
//           background: #334155;
//         }
//         input[type="range"]::-webkit-slider-thumb {
//           -webkit-appearance: none;
//           appearance: none;
//           margin-top: -6px;
//           background: linear-gradient(135deg, #6366f1, #06b6d4);
//           height: 18px;
//           width: 18px;
//           border-radius: 9999px;
//           box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
//           border: 2px solid white;
//         }
//       `}</style>

//       {/* ==================== SEARCH VIEW ==================== */}
//       {view === 'search' && (
//         <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
//           {/* Animated Gradient Background */}
//           <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />

//           {/* Animated Blobs */}
//           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/30 to-purple-400/30 dark:from-indigo-600/20 dark:to-purple-600/20 rounded-full blur-3xl animate-float" />
//           <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/30 to-blue-400/30 dark:from-cyan-600/20 dark:to-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
//           <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-gradient-to-br from-pink-400/20 to-rose-400/20 dark:from-pink-600/10 dark:to-rose-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.8s' }} />

//           {/* Grid Pattern Overlay */}
//           <div
//             className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
//             style={{
//               backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)`,
//               backgroundSize: '50px 50px'
//             }}
//           />

//           {/* Dark mode toggle - top right */}
//           <button
//             onClick={toggleDarkMode}
//             className="absolute top-6 right-6 z-20 p-3 rounded-2xl glass-card shadow-lg hover:scale-110 transition-transform duration-300 group"
//             aria-label="Toggle theme"
//           >
//             {darkMode ? (
//               <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
//             ) : (
//               <Sun className="w-5 h-5 text-slate-600 group-hover:rotate-90 transition-transform duration-500" />
//             )}
//           </button>

//           {/* Main Content */}
//           <div className="relative z-10 w-full max-w-3xl animate-slide-up">
//             {/* Logo & Title */}
//             <div className="text-center mb-10">
//               <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 shadow-2xl shadow-indigo-500/30 mb-6 animate-pulse-glow">
//                 <GraduationCap className="w-11 h-11 text-white" />
//               </div>
//               <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
//                 <span className="gradient-text">SmartEdu</span>{' '}
//                 <span className="text-slate-900 dark:text-white">Fee Portal</span>
//               </h1>
//               <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
//                 Search for a student to view and manage their fees
//               </p>
//             </div>

//             {/* Search Card */}
//             <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 border border-white/60 dark:border-slate-800/80">
//               <div className="space-y-4">
//                 {/* Search Input */}
//                 <div className="relative group">
//                   <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
//                     <Search className="w-5 h-5" />
//                   </div>
//                   <input
//                     type="text"
//                     value={globalSearch}
//                     onChange={(e) => setGlobalSearch(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleDirectSearch()}
//                     placeholder="Enter student code or name (e.g. STD-2026-0842)"
//                     className="w-full pl-14 pr-4 py-4 text-sm sm:text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm placeholder:text-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium"
//                     autoFocus
//                   />
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <button
//                     onClick={handleDirectSearch}
//                     disabled={searching}
//                     className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
//                   >
//                     {searching ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         Searching...
//                       </>
//                     ) : (
//                       <>
//                         <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
//                         Search Student
//                       </>
//                     )}
//                     <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
//                   </button>

//                   <button
//                     onClick={() => setFilterModalOpen(true)}
//                     className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
//                   >
//                     <SlidersHorizontal className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
//                     Filter Students
//                   </button>
//                 </div>

//                 {/* Quick Stats */}
//                 <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
//                   <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
//                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//                     <span className="font-medium">{STUDENTS.length} Students Enrolled</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
//                     <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
//                     <span className="font-medium">{SESSIONS.length} Active Sessions</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
//                     <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
//                     <span className="font-medium">{CLASSES.length} Classes</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer hint */}
//             <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
//               <Sparkles className="w-3 h-3 inline mr-1" />
//               Try searching "STD-2026-0842" or click Filter to browse students
//             </p>
//           </div>
//         </div>
//       )}

//       {/* ==================== FEES VIEW ==================== */}
//       {view === 'fees' && selectedStudent && (
//         <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
//           {/* Back button */}
//           <button
//             onClick={handleBackToSearch}
//             className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
//           >
//             <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
//             Back to Search
//           </button>

//           {/* SECTION 1: Student Profile Banner */}
//           <section className="relative rounded-3xl overflow-hidden glass-card shadow-glass dark:shadow-glass-dark border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8">
//             <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
//             <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

//             <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6">
//               <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left w-full lg:w-auto">
//                 <div className="relative group">
//                   <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-5xl font-black ring-4 ring-white dark:ring-slate-900 shadow-xl shadow-brand-500/10">
//                     {selectedStudent.fullName?.charAt(0) || 'S'}
//                   </div>
//                   <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" title="Active Student Status"></span>
//                 </div>

//                 <div className="space-y-1.5">
//                   <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
//                     <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{selectedStudent.fullName}</h2>
//                     <span className="bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
//                       <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" /> Regular Student
//                     </span>
//                   </div>

//                   <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
//                     Student ID: <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{selectedStudent.studentCode}</span> • Session: <span className="text-slate-700 dark:text-slate-200 font-semibold">{selectedStudent.session}</span>
//                   </p>

//                   <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
//                     <span className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
//                       <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />Class: <strong>{selectedStudent.class}</strong>
//                     </span>
//                     <span className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
//                       <Hash className="w-3.5 h-3.5 text-brand-500" />Roll: <strong>{selectedStudent.rollNumber}</strong>
//                     </span>
//                     <span className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
//                       <Layers className="w-3.5 h-3.5 text-cyan-500" />Section: <strong>{selectedStudent.section}</strong>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-3 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
//                 <div className="text-center p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
//                   <span className="text-[11px] font-semibold text-slate-400 block mb-1">Attendance</span>
//                   <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">95.4%</span>
//                   <span className="text-[10px] text-slate-400 block mt-0.5">Green Zone</span>
//                 </div>
//                 <div className="text-center p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
//                   <span className="text-[11px] font-semibold text-slate-400 block mb-1">GPA</span>
//                   <span className="text-lg font-extrabold text-brand-600 dark:text-brand-400">5.00</span>
//                   <span className="text-[10px] text-slate-400 block mt-0.5">First Term</span>
//                 </div>
//                 <div className="text-center p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
//                   <span className="text-[11px] font-semibold text-slate-400 block mb-1">Fee Status</span>
//                   <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">2 Due</span>
//                   <span className="text-[10px] text-slate-400 block mt-0.5">Oct-Nov</span>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* SECTION 2: Fee Financial Overview */}
//           <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
//             <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:shadow-lg transition">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Session Fee</p>
//                   <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">৳28,500</h3>
//                 </div>
//                 <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl group-hover:scale-110 transition">
//                   <Wallet className="w-5 h-5" />
//                 </div>
//               </div>
//               <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
//                 <span>Session 2026-27</span>
//                 <span className="font-semibold text-brand-600 dark:text-brand-400">12 Categories</span>
//               </div>
//             </div>

//             <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:shadow-lg transition">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Paid</p>
//                   <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5">৳20,000</h3>
//                 </div>
//                 <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition">
//                   <CheckCircle2 className="w-5 h-5" />
//                 </div>
//               </div>
//               <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
//                 <span>Cleared: <strong>70%</strong></span>
//                 <span className="text-emerald-600 font-semibold">9 Invoices</span>
//               </div>
//             </div>

//             <div className="glass-card rounded-2xl p-5 border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 shadow-sm relative overflow-hidden group hover:shadow-lg transition">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">Outstanding Due</p>
//                   <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1.5">৳8,500</h3>
//                 </div>
//                 <div className="p-3 bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 transition">
//                   <TriangleAlert className="w-5 h-5" />
//                 </div>
//               </div>
//               <div className="mt-4 pt-3 border-t border-rose-100 dark:border-rose-900/30 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
//                 <span>Deadline: <strong className="text-rose-600 dark:text-rose-400">15 Oct</strong></span>
//                 <span className="text-rose-600 dark:text-rose-400 font-bold">2 Months Due</span>
//               </div>
//             </div>

//             <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:shadow-lg transition">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scholarship & Waiver</p>
//                   <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1.5">৳2,000</h3>
//                 </div>
//                 <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition">
//                   <Award className="w-5 h-5" />
//                 </div>
//               </div>
//               <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
//                 <span>Merit Waiver</span>
//                 <span className="text-purple-600 font-bold">10% Off</span>
//               </div>
//             </div>
//           </section>

//           {/* SECTION 3: 12-Month Breakdown */}
//           <section className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 space-y-6 shadow-glass dark:shadow-glass-dark">
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/80">
//               <div>
//                 <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
//                   <CalendarDays className="w-5 h-5 text-brand-600 dark:text-brand-400" />
//                   <span>Active Session 12 Months Fee Status</span>
//                 </h3>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">January 2026 to December 2026 tuition fee status and details</p>
//               </div>

//               <div className="flex flex-col sm:flex-row items-center gap-3">
//                 <div className="relative w-full sm:w-48">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       setSearchQuery(e.target.value)
//                     }
//                     placeholder="Search month (e.g. Jan)..."
//                     className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-200"
//                   />
//                 </div>

//                 <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl text-xs font-semibold w-full sm:w-auto">
//                   {([
//                     { key: 'all' as FilterKey, label: `All (${monthsData.length})` },
//                     { key: 'paid' as FilterKey, label: `Paid (${paidCount})` },
//                     { key: 'due' as FilterKey, label: `Due (${dueCount})` },
//                   ]).map((tab) => (
//                     <button
//                       key={tab.key}
//                       onClick={() => setActiveFilter(tab.key)}
//                       className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl transition ${activeFilter === tab.key
//                         ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
//                         : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
//                         }`}
//                     >
//                       {tab.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {filteredMonths.map((month, index) => (
//                 <div
//                   key={index}
//                   className={`month-card ${month.status === 'paid'
//                     ? 'border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 hover:border-brand-300 dark:hover:border-brand-700'
//                     : 'border-2 border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20'
//                     } rounded-2xl p-4 transition duration-300 flex flex-col justify-between group hover:shadow-md relative`}
//                 >
//                   {month.status === 'due' && (
//                     <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-bl-xl shadow-sm">
//                       Current Month
//                     </span>
//                   )}
//                   <div>
//                     <div className="flex items-center justify-between mb-3">
//                       <h4 className="font-bold text-slate-900 dark:text-white text-base">
//                         {month.name}{' '}
//                         <span className="text-xs font-normal text-slate-400">({month.en})</span>
//                       </h4>
//                       {month.status === 'paid' ? (
//                         <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
//                           <CheckCircle2 className="w-3 h-3" /> Paid
//                         </span>
//                       ) : (
//                         <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-rose-200 dark:border-rose-800">
//                           <TriangleAlert className="w-3 h-3" /> Overdue
//                         </span>
//                       )}
//                     </div>
//                     <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
//                       <div className="flex justify-between">
//                         <span>Tuition Fee:</span>
//                         <strong
//                           className={
//                             month.status === 'due'
//                               ? 'text-rose-600 dark:text-rose-400 font-bold'
//                               : 'text-slate-700 dark:text-slate-200'
//                           }
//                         >
//                           {month.amount}
//                         </strong>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>{month.status === 'due' ? 'Deadline:' : 'Date:'}</span>
//                         <span
//                           className={
//                             month.status === 'due'
//                               ? 'text-rose-600 dark:text-rose-400 font-semibold'
//                               : ''
//                           }
//                         >
//                           {month.date}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>{month.status === 'due' ? 'Late Fee:' : 'ID:'}</span>
//                         <span
//                           className={
//                             month.status === 'due' ? 'text-slate-400' : 'font-mono'
//                           }
//                         >
//                           {month.status === 'due' ? '৳0.00' : month.txn}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   {month.status === 'paid' ? (
//                     <button
//                       onClick={() =>
//                         openReceiptModal(
//                           `${month.name} 2026 Tuition Fee`,
//                           month.amount,
//                           'Paid',
//                           month.recNo,
//                           month.gateway
//                         )
//                       }
//                       className="w-full bg-slate-200/70 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5"
//                     >
//                       <Receipt className="w-3.5 h-3.5" /> View Receipt
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() =>
//                         payFee(
//                           `${month.name} 2026 Tuition Fee`,
//                           month.amount.replace('৳', '').replace(',', '')
//                         )
//                       }
//                       className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
//                     >
//                       <CreditCard className="w-3.5 h-3.5" /> Pay Fee
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* SECTION 4: Detailed Ledger */}
//           <section className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 space-y-6 shadow-glass dark:shadow-glass-dark">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
//               <div>
//                 <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
//                   <ListChecks className="w-5 h-5 text-indigo-500" />
//                   <span>Detailed Session Ledger</span>
//                 </h3>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Breakdown of each academic and ancillary fee category</p>
//               </div>
//               <div className="flex items-center gap-2 text-xs">
//                 <span className="text-slate-500">
//                   Total Categories: <strong className="text-slate-800 dark:text-slate-200">7</strong>
//                 </span>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
//                     <th className="py-3 px-3">Fee Category</th>
//                     <th className="py-3 px-3">Payment Type</th>
//                     <th className="py-3 px-3 text-right">Amount</th>
//                     <th className="py-3 px-3 text-right">Waiver</th>
//                     <th className="py-3 px-3 text-right">Paid</th>
//                     <th className="py-3 px-3 text-center">Status</th>
//                     <th className="py-3 px-3 text-center">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-xs sm:text-sm divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
//                   <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
//                     <td className="py-3.5 px-3 flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
//                       <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
//                         <BookOpen className="w-3.5 h-3.5" />
//                       </div>
//                       <span>Annual Admission & Session Fee</span>
//                     </td>
//                     <td className="py-3.5 px-3 text-slate-500">One-time</td>
//                     <td className="py-3.5 px-3 text-right font-bold">৳6,000</td>
//                     <td className="py-3.5 px-3 text-right text-emerald-600 font-semibold">৳0.00</td>
//                     <td className="py-3.5 px-3 text-right text-slate-800 dark:text-slate-200 font-bold">৳6,000</td>
//                     <td className="py-3.5 px-3 text-center">
//                       <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full">Paid</span>
//                     </td>
//                     <td className="py-3.5 px-3 text-center">
//                       <button
//                         onClick={() =>
//                           openReceiptModal(
//                             'Annual Admission & Session Fee',
//                             '৳6,000',
//                             'Paid',
//                             'REC-2026-ADM',
//                             'Bank'
//                           )
//                         }
//                         className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold text-xs underline"
//                       >
//                         Receipt
//                       </button>
//                     </td>
//                   </tr>

//                   <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
//                     <td className="py-3.5 px-3 flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
//                       <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
//                         <GraduationCap className="w-3.5 h-3.5" />
//                       </div>
//                       <span>Monthly Tuition Fee (12 Months)</span>
//                     </td>
//                     <td className="py-3.5 px-3 text-slate-500">Monthly (৳1,500)</td>
//                     <td className="py-3.5 px-3 text-right font-bold">৳18,000</td>
//                     <td className="py-3.5 px-3 text-right text-emerald-600 font-semibold">৳2,000</td>
//                     <td className="py-3.5 px-3 text-right text-slate-800 dark:text-slate-200 font-bold">৳13,500</td>
//                     <td className="py-3.5 px-3 text-center">
//                       <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full">Partial</span>
//                     </td>
//                     <td className="py-3.5 px-3 text-center">
//                       <button
//                         onClick={() => payFee('Monthly Tuition Fee Due', '3000')}
//                         className="text-rose-600 hover:underline font-bold text-xs"
//                       >
//                         Pay Fee
//                       </button>
//                     </td>
//                   </tr>

//                   <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
//                     <td className="py-3.5 px-3 flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
//                       <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
//                         <FilePen className="w-3.5 h-3.5" />
//                       </div>
//                       <span>Half-Yearly Exam Fee (Midterm)</span>
//                     </td>
//                     <td className="py-3.5 px-3 text-slate-500">Term-based</td>
//                     <td className="py-3.5 px-3 text-right font-bold">৳2,000</td>
//                     <td className="py-3.5 px-3 text-right text-emerald-600 font-semibold">৳0.00</td>
//                     <td className="py-3.5 px-3 text-right text-slate-800 dark:text-slate-200 font-bold">৳2,000</td>
//                     <td className="py-3.5 px-3 text-center">
//                       <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full">Paid</span>
//                     </td>
//                     <td className="py-3.5 px-3 text-center">
//                       <button
//                         onClick={() =>
//                           openReceiptModal(
//                             'Half-Yearly Exam Fee',
//                             '৳2,000',
//                             'Paid',
//                             'REC-2026-EX1',
//                             'Nagad'
//                           )
//                         }
//                         className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold text-xs underline"
//                       >
//                         Receipt
//                       </button>
//                     </td>
//                   </tr>

//                   <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
//                     <td className="py-3.5 px-3 flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
//                       <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
//                         <Laptop className="w-3.5 h-3.5" />
//                       </div>
//                       <span>IT & Computer Lab Charge</span>
//                     </td>
//                     <td className="py-3.5 px-3 text-slate-500">Annual</td>
//                     <td className="py-3.5 px-3 text-right font-bold">৳1,500</td>
//                     <td className="py-3.5 px-3 text-right text-emerald-600 font-semibold">৳0.00</td>
//                     <td className="py-3.5 px-3 text-right text-slate-800 dark:text-slate-200 font-bold">৳1,500</td>
//                     <td className="py-3.5 px-3 text-center">
//                       <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full">Paid</span>
//                     </td>
//                     <td className="py-3.5 px-3 text-center">
//                       <button
//                         onClick={() =>
//                           openReceiptModal(
//                             'IT & Computer Lab Charge',
//                             '৳1,500',
//                             'Paid',
//                             'REC-2026-IT',
//                             'bKash'
//                           )
//                         }
//                         className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold text-xs underline"
//                       >
//                         Receipt
//                       </button>
//                     </td>
//                   </tr>

//                   <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
//                     <td className="py-3.5 px-3 flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100">
//                       <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
//                         <Volleyball className="w-3.5 h-3.5" />
//                       </div>
//                       <span>Sports, Library & Clubbing Fee</span>
//                     </td>
//                     <td className="py-3.5 px-3 text-slate-500">Annual</td>
//                     <td className="py-3.5 px-3 text-right font-bold">৳1,000</td>
//                     <td className="py-3.5 px-3 text-right text-emerald-600 font-semibold">৳0.00</td>
//                     <td className="py-3.5 px-3 text-right text-rose-600 font-bold">৳0.00</td>
//                     <td className="py-3.5 px-3 text-center">
//                       <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 text-[11px] font-bold px-2.5 py-1 rounded-full">Due</span>
//                     </td>
//                     <td className="py-3.5 px-3 text-center">
//                       <button
//                         onClick={() => payFee('Sports & Clubbing Fee', '1000')}
//                         className="text-rose-600 hover:underline font-bold text-xs"
//                       >
//                         Pay Fee
//                       </button>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </section>

//           {/* SECTION 5: Recent Transactions */}
//           <section className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 space-y-4 shadow-glass dark:shadow-glass-dark">
//             <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/80">
//               <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
//                 <History className="w-5 h-5 text-brand-500" />
//                 <span>Recent Transaction History</span>
//               </h3>
//               <span className="text-xs text-slate-400">Last 5 transactions</span>
//             </div>

//             <div className="space-y-3">
//               <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-bkash font-black flex items-center justify-center text-sm shadow-sm">
//                     bKash
//                   </div>
//                   <div>
//                     <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">September 2026 Tuition Fee</h5>
//                     <p className="text-slate-400">
//                       Transaction ID:{' '}
//                       <span className="font-mono text-slate-600 dark:text-slate-300">TXN-99912</span> • 12 September, 2026
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between sm:justify-end gap-4">
//                   <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">৳1,500</span>
//                   <button
//                     onClick={() =>
//                       openReceiptModal(
//                         'September 2026 Tuition Fee',
//                         '৳1,500',
//                         'Paid',
//                         'REC-2026-09',
//                         'bKash'
//                       )
//                     }
//                     className="px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition"
//                   >
//                     Slip
//                   </button>
//                 </div>
//               </div>

//               <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-nagad font-black flex items-center justify-center text-sm shadow-sm">
//                     Nagad
//                   </div>
//                   <div>
//                     <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Half-Yearly Exam Fee</h5>
//                     <p className="text-slate-400">
//                       Transaction ID:{' '}
//                       <span className="font-mono text-slate-600 dark:text-slate-300">TXN-88204</span> • 25 July, 2026
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between sm:justify-end gap-4">
//                   <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">৳2,000</span>
//                   <button
//                     onClick={() =>
//                       openReceiptModal(
//                         'Half-Yearly Exam Fee',
//                         '৳2,000',
//                         'Paid',
//                         'REC-2026-EX1',
//                         'Nagad'
//                       )
//                     }
//                     className="px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition"
//                   >
//                     Slip
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </main>
//       )}

//       {/* ==================== FILTER MODAL ==================== */}
//       {filterModalOpen && (
//         <div
//           className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in"
//           onClick={(e) => e.target === e.currentTarget && setFilterModalOpen(false)}
//         >
//           <div className="w-full sm:max-w-3xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up max-h-[92vh] flex flex-col">
//             {/* Modal Header */}
//             <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 p-6 text-white overflow-hidden">
//               <div className="absolute inset-0 opacity-10">
//                 <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
//               </div>
//               <div className="relative flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
//                     <Filter className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-black">Filter Students</h3>
//                     <p className="text-xs text-white/80">Browse students by session, class and section</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setFilterModalOpen(false)}
//                   className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Filter Controls */}
//             <div className="p-6 space-y-5 border-b border-slate-200 dark:border-slate-800">
//               {/* Session Selector */}
//               <div>
//                 <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
//                   <CalendarDays className="w-3.5 h-3.5" />
//                   Academic Session
//                 </label>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                   {SESSIONS.map((session) => (
//                     <button
//                       key={session.id}
//                       onClick={() => setSelectedSession(session.name)}
//                       className={`relative p-3 rounded-2xl border-2 transition-all duration-200 text-left ${selectedSession === session.name
//                         ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-md shadow-indigo-500/10'
//                         : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-700'
//                         }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className={`text-sm font-bold ${selectedSession === session.name
//                           ? 'text-indigo-600 dark:text-indigo-400'
//                           : 'text-slate-700 dark:text-slate-300'
//                           }`}>
//                           {session.name}
//                         </span>
//                         {selectedSession === session.name && (
//                           <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
//                             <Check className="w-3 h-3 text-white" />
//                           </div>
//                         )}
//                       </div>
//                       {session.isCurrent && (
//                         <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 inline-flex items-center gap-1">
//                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                           Current
//                         </span>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Class Selector */}
//               <div>
//                 <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
//                   <School className="w-3.5 h-3.5" />
//                   Class
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     onClick={() => {
//                       setSelectedClass('');
//                       setSelectedSection('');
//                     }}
//                     className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedClass === ''
//                       ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
//                       : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
//                       }`}
//                   >
//                     All Classes
//                   </button>
//                   {CLASSES.map((cls) => (
//                     <button
//                       key={cls.id}
//                       onClick={() => {
//                         setSelectedClass(cls.name);
//                         setSelectedSection('');
//                       }}
//                       className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedClass === cls.name
//                         ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
//                         : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
//                         }`}
//                     >
//                       {cls.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Section Selector */}
//               {selectedClass && (
//                 <div className="animate-slide-up">
//                   <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
//                     <Layers className="w-3.5 h-3.5" />
//                     Section
//                   </label>
//                   <div className="flex flex-wrap gap-2">
//                     <button
//                       onClick={() => setSelectedSection('')}
//                       className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedSection === ''
//                         ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
//                         : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
//                         }`}
//                     >
//                       All Sections
//                     </button>
//                     {CLASSES.find((c) => c.name === selectedClass)?.sections.map((section) => (
//                       <button
//                         key={section}
//                         onClick={() => setSelectedSection(section)}
//                         className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedSection === section
//                           ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
//                           : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
//                           }`}
//                       >
//                         {section}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Student List */}
//             <div className="flex-1 overflow-y-auto">
//               <div className="sticky top-0 px-6 py-3 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-10">
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                     Students Found
//                   </span>
//                   <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full">
//                     {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
//                   </span>
//                 </div>
//               </div>

//               {filteredStudents.length === 0 ? (
//                 <div className="p-12 text-center">
//                   <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
//                     <SearchX className="w-7 h-7 text-slate-400" />
//                   </div>
//                   <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">No students found</h4>
//                   <p className="text-xs text-slate-500">Try adjusting your filters</p>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-slate-100 dark:divide-slate-800">
//                   {filteredStudents.map((student, index) => (
//                     <button
//                       key={student.id}
//                       onClick={() => handleStudentSelect(student)}
//                       style={{ animationDelay: `${index * 30}ms` }}
//                       className="w-full text-left p-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors group animate-fade-in"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="relative shrink-0">
//                           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-500/20">
//                             {student.fullName.charAt(0)}
//                           </div>
//                           <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
//                               {student.fullName}
//                             </h5>
//                             <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono">
//                               {student.studentCode}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
//                             <span className="flex items-center gap-1">
//                               <GraduationCap className="w-3 h-3" />
//                               {student.class}
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <Layers className="w-3 h-3" />
//                               {student.section}
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <Hash className="w-3 h-3" />
//                               Roll {student.rollNumber}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
//                             <span className="flex items-center gap-1">
//                               <User className="w-3 h-3" />
//                               {student.fatherName}
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <Phone className="w-3 h-3" />
//                               {student.mobileNumber}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="shrink-0">
//                           <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 flex items-center justify-center transition-all group-hover:scale-110">
//                             <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
//                           </div>
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
//               <button
//                 onClick={() => {
//                   setSelectedSession('2026-27');
//                   setSelectedClass('');
//                   setSelectedSection('');
//                 }}
//                 className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
//               >
//                 Reset Filters
//               </button>
//               <button
//                 onClick={() => setFilterModalOpen(false)}
//                 className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Payment Modal */}
//       {paymentModalOpen && (
//         <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in">
//             <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
//               <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
//                 <ShieldCheck className="w-5 h-5 text-brand-600" /> Secure Payment Gateway
//               </h4>
//               <button
//                 onClick={closePaymentModal}
//                 className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
//               <div className="flex justify-between text-xs text-slate-500">
//                 <span>Fee Category:</span>
//                 <strong className="text-slate-800 dark:text-slate-200">{selectedItem.title}</strong>
//               </div>
//               <div className="flex justify-between text-xs text-slate-500">
//                 <span>Student ID:</span>
//                 <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedStudent?.studentCode}</strong>
//               </div>
//               <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
//                 <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Payable:</span>
//                 <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
//                   ৳{parseInt(selectedItem.amount || '0').toLocaleString('en-IN')}
//                 </span>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                 Select Payment Method
//               </p>

//               <button
//                 onClick={() => processGateway('bKash')}
//                 className="w-full p-3.5 rounded-2xl border border-pink-200 dark:border-pink-900/40 bg-pink-50/50 dark:bg-pink-950/20 hover:bg-pink-100 dark:hover:bg-pink-900/40 flex items-center justify-between transition group"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-xl bg-pink-600 text-white font-extrabold text-xs flex items-center justify-center">
//                     bKash
//                   </div>
//                   <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
//                     bKash Direct Payment
//                   </span>
//                 </div>
//                 <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
//               </button>

//               <button
//                 onClick={() => processGateway('Nagad')}
//                 className="w-full p-3.5 rounded-2xl border border-orange-200 dark:border-orange-900/40 bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 flex items-center justify-between transition group"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center">
//                     Nagad
//                   </div>
//                   <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
//                     Nagad Express Wallet
//                   </span>
//                 </div>
//                 <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
//               </button>

//               <button
//                 onClick={() => processGateway('Card')}
//                 className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition group"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
//                     <CreditCard className="w-4 h-4" />
//                   </div>
//                   <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
//                     Debit / Credit Card (Visa/Mastercard)
//                   </span>
//                 </div>
//                 <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
//               </button>
//             </div>

//             <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
//               <Lock className="w-3 h-3 text-emerald-500" /> 256-bit SSL Encrypted Payment System
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Receipt Modal */}
//       {receiptModalOpen && (
//         <div
//           id="receiptModal"
//           className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
//         >
//           <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-800 border border-slate-200 my-8">
//             <div className="bg-slate-900 p-4 text-white flex justify-between items-center no-print">
//               <span className="text-xs font-bold flex items-center gap-2">
//                 <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Digital Payment Slip
//               </span>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => window.print()}
//                   className="bg-brand-600 hover:bg-brand-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5"
//                 >
//                   <Printer className="w-3.5 h-3.5" /> Print
//                 </button>
//                 <button
//                   onClick={closeReceiptModal}
//                   className="text-slate-400 hover:text-white px-2"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-8 space-y-6" id="printableReceiptArea">
//               <div className="text-center space-y-1 border-b-2 border-slate-900/10 pb-4">
//                 <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-md">
//                   <GraduationCap className="w-6 h-6" />
//                 </div>
//                 <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
//                   Dhaka Public Model School & College
//                 </h2>
//                 <p className="text-xs text-slate-500 font-medium">
//                   Mirpur-10, Dhaka-1216 | Phone: +880 2-9876543
//                 </p>
//                 <div className="pt-2">
//                   <span className="bg-slate-900 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
//                     Official Money Receipt
//                   </span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
//                 <div>
//                   <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
//                   <strong className="text-slate-900 font-bold">{selectedStudent?.fullName}</strong>
//                 </div>
//                 <div>
//                   <span className="text-slate-400 block text-[10px] uppercase font-bold">Student ID</span>
//                   <strong className="font-mono text-slate-900">{selectedStudent?.studentCode}</strong>
//                 </div>
//                 <div>
//                   <span className="text-slate-400 block text-[10px] uppercase font-bold">Class & Section</span>
//                   <strong className="text-slate-900">{selectedStudent?.class} • {selectedStudent?.section}</strong>
//                 </div>
//                 <div>
//                   <span className="text-slate-400 block text-[10px] uppercase font-bold">Roll Number</span>
//                   <strong className="text-slate-900">{selectedStudent?.rollNumber}</strong>
//                 </div>
//                 <div>
//                   <span className="text-slate-400 block text-[10px] uppercase font-bold">Receipt No</span>
//                   <strong className="font-mono text-indigo-600 font-extrabold">{receiptData.recNo}</strong>
//                 </div>
//                 <div>
//                   <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
//                   <strong className="text-slate-900">{receiptData.gateway} Online</strong>
//                 </div>
//               </div>

//               <div className="border border-slate-200 rounded-2xl overflow-hidden">
//                 <table className="w-full text-left text-xs">
//                   <thead className="bg-slate-100 font-bold text-slate-600 border-b border-slate-200">
//                     <tr>
//                       <th className="p-3">Particulars</th>
//                       <th className="p-3 text-right">Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100 font-medium">
//                     <tr>
//                       <td className="p-3 text-slate-800">{receiptData.title}</td>
//                       <td className="p-3 text-right font-bold text-slate-900">{receiptData.amount}</td>
//                     </tr>
//                     <tr className="bg-slate-50/50">
//                       <td className="p-3 text-slate-500">Online Processing & Service Charge</td>
//                       <td className="p-3 text-right text-slate-500">৳0.00</td>
//                     </tr>
//                   </tbody>
//                   <tfoot className="bg-slate-100 font-black border-t border-slate-200 text-sm">
//                     <tr>
//                       <td className="p-3 text-slate-900">Total Paid:</td>
//                       <td className="p-3 text-right text-emerald-600">{receiptData.amount}</td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>

//               <div className="pt-4 flex items-center justify-between border-t border-dashed border-slate-300">
//                 <div className="text-center">
//                   <Barcode value={receiptData.recNo} />
//                   <span className="text-[9px] text-slate-400 font-mono block mt-1">
//                     VERIFIED TRANSACTION
//                   </span>
//                 </div>
//                 <div className="text-center space-y-1">
//                   <div className="w-16 h-16 rounded-full border-2 border-indigo-500/40 border-dashed flex items-center justify-center text-indigo-600 text-[10px] font-black transform -rotate-12 mx-auto">
//                     PAID STAMP
//                   </div>
//                   <span className="text-[10px] text-slate-500 block font-bold">
//                     Accounts Section
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast */}
//       <div
//         className={`fixed bottom-6 right-6 z-[200] transition-all duration-300 pointer-events-none ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
//           }`}
//       >
//         <div className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800">
//           <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
//             <CheckCircle2 className="w-4 h-4" />
//           </div>
//           <div>
//             <h5 className="text-xs font-bold text-white">{toast.heading}</h5>
//             <p className="text-[11px] text-slate-400">{toast.message}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentFeesPage;

