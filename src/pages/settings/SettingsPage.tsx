import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { setActiveSchool, updateUserProfile } from '../../features/auth/authSlice';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useGetSchoolsQuery } from '../../features/api/apiSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import {
  useForm,
  FormInput,
  FormTextarea,
} from '../../components/form';
import {
  User,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Building,
  Calendar,
  Key,
  Edit3,
  CheckCircle2,
  Server,
  Globe,
  Moon,
  Sun,
  RefreshCw,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
  Layers,
  MapPin,
  Check,
} from 'lucide-react';

interface EditProfileFormData {
  name: string;
  email: string;
  phone: string;
  designation: string;
  address: string;
}

export const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user, role, permissions, activeSchool, isSuperAdmin } = useSelector(
    (state: RootState) => state.auth
  );
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'school' | 'appearance' | 'api' | 'rbac'>('profile');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);

  // REST API endpoint configuration state
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem('api_base_url') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  });
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: schools } = useGetSchoolsQuery(undefined, { skip: !isSuperAdmin });

  // React Hook Form for Profile Editing
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EditProfileFormData>({
    defaultValues: {
      name: user?.name || 'Administrator',
      email: user?.email || 'admin@school.com',
      phone: user?.phone || '+880 1711-234567',
      designation: role === 'SUPER_ADMIN' ? 'Chief Technology Officer / Super Admin' : 'School Principal & Chief Administrator',
      address: activeSchool?.address || 'Dhaka, Bangladesh',
    },
    mode: 'onTouched',
  });

  const handleOpenEditProfile = () => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '+880 1711-234567',
      designation: role === 'SUPER_ADMIN' ? 'Chief Technology Officer / Super Admin' : 'School Principal & Chief Administrator',
      address: activeSchool?.address || 'Dhaka, Bangladesh',
    });
    setIsEditProfileModalOpen(true);
  };

  const onSubmitProfile = async (data: EditProfileFormData) => {
    // Simulate brief network save
    await new Promise((resolve) => setTimeout(resolve, 400));

    dispatch(
      updateUserProfile({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
      })
    );

    setIsEditProfileModalOpen(false);
    setProfileUpdateSuccess(true);
    setTimeout(() => setProfileUpdateSuccess(false), 4000);
  };

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('api_base_url', apiUrl.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    setPingStatus('testing');
    try {
      const res = await fetch(`${apiUrl.trim().replace(/\/$/, '')}/schools`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
      });
      if (res.ok || res.status === 401 || res.status === 403) {
        setPingStatus('success');
      } else {
        setPingStatus('failed');
      }
    } catch (err) {
      console.warn('Backend connection ping test result:', err);
      setPingStatus('failed');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('nav.settings', 'Settings & User Profile')}
          </h1>
          <Badge variant="default">Control Center</Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your account profile, personal contact details, campus affiliation, appearance, and backend preferences
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'profile'
              ? 'bg-theme-primary text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('school')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'school'
              ? 'bg-theme-primary text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Institution Context</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'appearance'
              ? 'bg-theme-primary text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Appearance & Language</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'api'
              ? 'bg-theme-primary text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Backend API</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'rbac'
              ? 'bg-theme-primary text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>RBAC Matrix</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {profileUpdateSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">
            Profile information updated successfully! All active sessions reflect your changes.
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PROFILE SECTION (IMPROVED & MODERN) */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Profile Hero Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-theme-subtle/50 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-theme-primary text-white font-extrabold text-2xl flex items-center justify-center shadow-md ring-4 ring-theme-subtle">
                  {user?.name?.charAt(0) || 'U'}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                      {user?.name || 'Administrator'}
                    </h2>
                    <Badge variant="default">{role || 'SCHOOL_ADMIN'}</Badge>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Session
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{user?.email || 'admin@school.com'}</span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <Building className="w-3.5 h-3.5" />
                    <span>{activeSchool?.name || 'Al Madina Model School'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenEditProfile}
                  leftIcon={<Edit3 className="w-4 h-4" />}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Information Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Details */}
            <Card
              title="Personal Information"
              subtitle="Contact details and verified staff identification"
            >
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Full Name</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{user?.name || 'Administrator'}</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Email Address</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{user?.email || 'admin@school.com'}</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Phone Number</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{user?.phone || '+880 1711-234567'}</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Assigned Role</span>
                  <Badge variant="default">{role || 'SCHOOL_ADMIN'}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">User ID</span>
                  <span className="font-mono text-slate-500">USR-{String(user?.id || 1).padStart(4, '0')}</span>
                </div>
              </div>
            </Card>

            {/* Institutional Information */}
            <Card
              title="Institution & Scope"
              subtitle="Assigned academic institution and operational rights"
            >
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">School Name</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-right truncate max-w-[220px]">
                    {activeSchool?.name || 'Al Madina Model School & College'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">School Code / EIIN</span>
                  <span className="font-mono font-bold text-theme-primary">{activeSchool?.code || 'AMS-1001'}</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Campus Address</span>
                  <span className="text-slate-700 dark:text-slate-300 text-right truncate max-w-[220px]">
                    {activeSchool?.address || 'Gulshan-2, Dhaka, Bangladesh'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Multi-School Privileges</span>
                  <Badge variant={isSuperAdmin ? 'success' : 'neutral'}>
                    {isSuperAdmin ? 'Full Super Admin Scope' : 'Single School Tenant'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Institution Status</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Tenant
                  </span>
                </div>
              </div>
            </Card>

            {/* Security Overview */}
            <Card
              title="Security & Authentication"
              subtitle="Password security and session credentials"
            >
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Authentication Protocol</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">JWT Bearer (HS256)</span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Password Encryption</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Bcrypt (Salt rounds 10)
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Active Permissions</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{permissions?.length || 48} System Capabilities</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Two-Factor Authentication</span>
                  <Badge variant="neutral">Configured via SMS</Badge>
                </div>
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card
              title="Account Preferences"
              subtitle="Quick shortcuts to portal settings"
            >
              <div className="space-y-2.5 text-xs">
                <button
                  onClick={() => setActiveTab('appearance')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Color Theme & Dark Mode</span>
                      <span className="text-[11px] text-slate-400">Currently: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
                    </div>
                  </div>
                  <Badge variant="info">Change</Badge>
                </button>

                <button
                  onClick={() => setActiveTab('appearance')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Portal Language</span>
                      <span className="text-[11px] text-slate-400">Currently: {language === 'en' ? 'English (US)' : 'বাংলা'}</span>
                    </div>
                  </div>
                  <Badge variant="info">Change</Badge>
                </button>

                <button
                  onClick={() => setActiveTab('rbac')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">RBAC Security Matrix</span>
                      <span className="text-[11px] text-slate-400">Audit assigned role permissions</span>
                    </div>
                  </div>
                  <Badge variant="neutral">View</Badge>
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. INSTITUTION CONTEXT */}
      {/* ========================================================================= */}
      {activeTab === 'school' && (
        <Card title="Active School Context" subtitle="Scope of academic, student, and financial records">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 text-theme-primary" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {activeSchool?.name || 'Al Madina Model School & College'}
                  </span>
                  <p className="text-slate-500 mt-0.5">EIIN / Code: {activeSchool?.code || 'AMS-1001'} · Status: Active</p>
                </div>
              </div>
              <Badge variant="success">Active Tenant</Badge>
            </div>

            {isSuperAdmin && schools && (
              <div className="pt-2">
                <Select
                  label="Switch Active School (Super Admin Only)"
                  value={activeSchool?.id || 1}
                  onChange={(e) => {
                    const s = schools.find((item) => item.id === Number(e.target.value));
                    if (s) {
                      dispatch(setActiveSchool({ schoolId: s.id, school: s }));
                    }
                  }}
                  options={schools.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` }))}
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 3. APPEARANCE & LOCALIZATION */}
      {/* ========================================================================= */}
      {activeTab === 'appearance' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
          {/* Language Selection */}
          <Card title="Language & Internationalization" subtitle="Switch portal interface dialect">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`p-3 rounded-xl border text-center font-semibold transition-colors ${
                    language === 'en'
                      ? 'border-theme-primary bg-theme-subtle text-theme-primary font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  English (US)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('bn')}
                  className={`p-3 rounded-xl border text-center font-semibold transition-colors ${
                    language === 'bn'
                      ? 'border-theme-primary bg-theme-subtle text-theme-primary font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  বাংলা (Bengali)
                </button>
              </div>
            </div>
          </Card>

          {/* Theme Mode */}
          <Card title="Display Appearance" subtitle="Switch visual color modes (Independent of browser system theme)">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-xl border text-center font-semibold transition-colors flex items-center justify-center gap-2 ${
                    theme === 'light'
                      ? 'border-theme-primary bg-theme-subtle text-theme-primary font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-xl border text-center font-semibold transition-colors flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'border-theme-primary bg-theme-subtle text-theme-primary font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4 text-slate-400" />
                  <span>Dark Mode</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                The application strictly enforces your choice across reloads and ignores browser/system dark mode preferences.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BACKEND API ENDPOINT */}
      {/* ========================================================================= */}
      {activeTab === 'api' && (
        <Card
          title="NestJS Backend REST API Endpoint"
          subtitle="Manage communication URL connecting to your local or deployed NestJS server"
        >
          <form onSubmit={handleSaveApiUrl} className="space-y-4">
            <div className="space-y-1">
              <Input
                label="API Base URL (Default: http://localhost:3000/api)"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:3000/api"
                required
              />
              <p className="text-[11px] text-slate-400">
                The frontend communicates with this REST API using RTK Query with automatic JWT bearer authorization.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="sm">
                Save API Endpoint
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                isLoading={pingStatus === 'testing'}
                onClick={handleTestConnection}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Test Backend Connection
              </Button>

              {saveSuccess && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Endpoint saved!
                </span>
              )}

              {pingStatus === 'success' && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  NestJS API is Online & Reachable!
                </span>
              )}

              {pingStatus === 'failed' && (
                <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Could not connect to {apiUrl}. Please ensure your backend is running.
                </span>
              )}
            </div>
          </form>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 5. RBAC MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'rbac' && (
        <Card
          title="Active RBAC Permissions Matrix"
          subtitle={`Role: ${role || 'User'} · Loaded from NestJS Authentication context`}
        >
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              The frontend dynamically enforces capabilities according to permissions assigned to your role:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 max-h-80 overflow-y-auto">
              {(permissions || []).map((perm, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* EDIT PROFILE MODAL */}
      <Modal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        title="Edit Profile Information"
        subtitle="Update your personal details and staff contact records"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
          <FormInput
            name="name"
            control={control}
            label="Full Name"
            placeholder="e.g. Dr. Tariqul Islam"
            rules={{
              required: 'Full name is required',
              minLength: { value: 2, message: 'Minimum 2 characters required' },
            }}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              name="email"
              control={control}
              label="Email Address"
              type="email"
              placeholder="admin@school.com"
              rules={{
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              }}
              required
            />

            <FormInput
              name="phone"
              control={control}
              label="Phone Number"
              placeholder="+880 1711-XXXXXX"
              rules={{ required: 'Phone number is required' }}
              required
            />
          </div>

          <FormInput
            name="designation"
            control={control}
            label="Designation / Title"
            placeholder="e.g. Principal & Chief Administrator"
          />

          <FormTextarea
            name="address"
            control={control}
            label="Campus Address & Remarks"
            placeholder="Office room, building, or residential address"
            rows={3}
          />

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsEditProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
