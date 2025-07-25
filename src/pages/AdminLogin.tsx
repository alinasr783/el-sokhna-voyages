import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError(t('login-error', 'Invalid email or password', 'البريد الإلكتروني أو كلمة المرور غير صحيحة'));
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError(t('login-error', 'Login failed. Please try again.', 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back-home', 'Back to Home', 'العودة إلى الرئيسية')}
            </Button>
          </Link>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-luxury">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary p-3 rounded-full">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              {t('admin-login', 'Admin Login', 'تسجيل دخول المدير')}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">
                  {t('email', 'Email', 'البريد الإلكتروني')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email-placeholder', 'Enter your email', 'أدخل بريدك الإلكتروني')}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {t('password', 'Password', 'كلمة المرور')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password-placeholder', 'Enter your password', 'أدخل كلمة المرور')}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-ocean hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {t('signing-in', 'Signing In...', 'جاري تسجيل الدخول...')}
                  </div>
                ) : (
                  t('sign-in', 'Sign In', 'تسجيل الدخول')
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                {t('admin-only', 'Admin access only', 'للمديرين فقط')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};