import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from ?? '/';

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      await login(form);
      navigate(redirectPath, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <form onSubmit={submit} className="glass-panel rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-slate-900">Вход</h1>
        <p className="mt-2 text-sm text-slate-600">
          Используй свой аккаунт, чтобы открыть ленту, профиль и рецепты.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Username или email
            </label>
            <input
              value={form.login}
              onChange={(event) =>
                setForm((current) => ({ ...current, login: event.target.value }))
              }
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Пароль</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="password"
            />
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-primary px-4 py-2 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Входим...' : 'Войти'}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Регистрация
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
