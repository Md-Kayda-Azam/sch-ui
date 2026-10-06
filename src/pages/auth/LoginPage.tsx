import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { useLoginMutation } from '../../features/api/apiSlice';
import { useLanguage } from '../../context/LanguageContext';
import { useForm, FormInput } from '../../components/form';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, UserCheck, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { control, handleSubmit, setValue } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage('');

    try {
      const response = await loginMutation({
        email: data.email.trim(),
        password: data.password,
      }).unwrap();
      dispatch(
        setCredentials({
          accessToken: response.accessToken,
          user: response.user,
        })
      );
      navigate('/');
    } catch (err: any) {
      toast.error(err.data.message);
      console.warn('API login failed or offline, checking demo fallback:', err);
      // If backend is offline during local evaluation, permit demo credentials
      // if (data.email.includes('admin') || data.password === 'password123' || err?.status === 'FETCH_ERROR') {
      //   const demoUser = {
      //     id: 1,
      //     name: data.email.startsWith('super') ? 'Dr. Tariqul Islam' : 'Abdul Karim',
      //     email: data.email,
      //     roleId: data.email.startsWith('super') ? 1 : data.email.startsWith('teacher') ? 3 : data.email.startsWith('acc') ? 4 : 2,
      //     role: {
      //       id: data.email.startsWith('super') ? 1 : 2,
      //       name: data.email.startsWith('super') ? 'SUPER_ADMIN' : data.email.startsWith('teacher') ? 'TEACHER' : data.email.startsWith('acc') ? 'ACCOUNTANT' : 'SCHOOL_ADMIN',
      //     },
      //     schoolId: 1,
      //     school: {
      //       id: 1,
      //       name: 'Al Madina Model School',
      //       code: 'AMS-1001',
      //       status: 'ACTIVE' as const,
      //     },
      //     status: 'ACTIVE' as const,
      //   };
      //   dispatch(
      //     setCredentials({
      //       accessToken: 'demo_jwt_token_' + Date.now(),
      //       user: demoUser,
      //     })
      //   );
      //   navigate('/');
      // } else {
      //   setErrorMessage(err?.data?.message || t('auth.loginFailed', 'Invalid email or password.'));
      // }
    }
  };

  const handleQuickFill = (roleType: 'super' | 'school' | 'teacher' | 'accountant') => {
    switch (roleType) {
      case 'super':
        setValue('email', 'superadmin@schoolcore.edu');
        setValue('password', 'password123');
        break;
      case 'school':
        setValue('email', 'admin@almadinaschool.edu.bd');
        setValue('password', 'password123');
        break;
      case 'teacher':
        setValue('email', 'teacher@almadinaschool.edu.bd');
        setValue('password', 'password123');
        break;
      case 'accountant':
        setValue('email', 'accountant@almadinaschool.edu.bd');
        setValue('password', 'password123');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
          SC
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('auth.loginTitle', 'Sign in to SchoolCore')}
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {t('auth.loginSubtitle', 'Enter your credentials to access your administrative workspace')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="email"
              control={control}
              label={t('auth.email', 'Email Address')}
              type="email"
              placeholder="admin@school.com"
              leftIcon={<Mail className="w-4 h-4" />}
              rules={{
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              required
            />

            <FormInput
              name="password"
              control={control}
              label={t('auth.password', 'Password')}
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              }}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
              >
                {isLoading ? t('auth.signingIn', 'Signing In...') : t('auth.signIn', 'Sign In')}
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials */}
          {/* <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('auth.selectDemoRole', 'Quick Demo Switcher')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('super')}
                className="p-2 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('auth.superAdmin', 'Super Admin')}
                </div>
                <div className="text-[10px] text-slate-400 truncate">All Schools</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('school')}
                className="p-2 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('auth.schoolAdmin', 'School Admin')}
                </div>
                <div className="text-[10px] text-slate-400 truncate">Al Madina School</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('accountant')}
                className="p-2 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('auth.accountant', 'Accountant')}
                </div>
                <div className="text-[10px] text-slate-400 truncate">Fees & Ledgers</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('teacher')}
                className="p-2 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('auth.teacher', 'Teacher')}
                </div>
                <div className="text-[10px] text-slate-400 truncate">Class & Results</div>
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
