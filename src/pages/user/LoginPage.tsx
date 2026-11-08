import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn, ArrowLeft, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg('');
    const { error } = await signInWithEmail(data.email, data.password);
    if (error) {
      setErrorMsg(error.message);
      showToast(error.message, 'error');
    } else {
      showToast('Berhasil masuk! Selamat datang kembali.');
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
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-gold font-serif font-black text-lg shadow-sm">
              KM
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-navy">Masuk Akun</h1>
              <span className="text-xs text-madura-muted">Kamus Madura Digital</span>
            </div>
          </div>
          <p className="text-xs text-madura-muted leading-relaxed">
            Masuk untuk menyinkronkan kata favorit, melacak riwayat, dan mengusulkan kosakata baru.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isSubmitting}>
            <LogIn className="w-4 h-4 mr-1.5" />
            <span>Masuk Sekarang</span>
          </Button>
        </form>

        <div className="pt-4 border-t border-madura-border text-center text-xs text-madura-muted space-y-2">
          <div>
            Belum memiliki akun?{' '}
            <Link to="/register" className="font-bold text-forest hover:underline">
              Daftar akun gratis
            </Link>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            <span>Autentikasi terenkripsi via Supabase Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
};

