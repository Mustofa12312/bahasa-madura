import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi kata sandi tidak cocok',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg('');
    const { error } = await signUpWithEmail(data.email, data.password, data.fullName);
    if (error) {
      setErrorMsg(error.message);
      showToast(error.message, 'error');
    } else {
      showToast('Pendaftaran berhasil! Selamat datang di Kamus Madura Digital.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-madura-border shadow-elevated space-y-6">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-madura-muted hover:text-navy transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-ivory font-serif font-black text-lg shadow-sm">
              KM
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-navy">Daftar Akun</h1>
              <span className="text-xs text-madura-muted">Bergabung Melestarikan Budaya</span>
            </div>
          </div>
          <p className="text-xs text-madura-muted leading-relaxed">
            Buat akun untuk menyimpan koleksi kosakata favorit Anda dan berpartisipasi dalam usulan kata baru.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="Contoh: Achmad Syafii"
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          <Input
            label="Alamat Email"
            type="email"
            placeholder="nama@email.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Kata Sandi"
            type="password"
            placeholder="Minimal 6 karakter"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="Ulangi Kata Sandi"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isSubmitting}>
            <UserPlus className="w-4 h-4 mr-1.5" />
            <span>Daftar Akun Baru</span>
          </Button>
        </form>

        <div className="pt-4 border-t border-madura-border text-center text-xs text-madura-muted space-y-2">
          <div>
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-bold text-forest hover:underline">
              Masuk di sini
            </Link>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            <span>Data Anda terlindungi oleh Row Level Security (RLS)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

