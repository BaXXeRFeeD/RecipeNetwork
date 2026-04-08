import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import RecipeCard from '../components/RecipeCard';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import { api } from '../lib/api';
import { CATEGORY_OPTIONS } from '../lib/constants';

function Home() {
  const { token, user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [followingOnly, setFollowingOnly] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 350);

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.getFeed(
        {
          search: debouncedSearch,
          category,
          followingOnly,
        },
        token,
      );
      setData(response);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [debouncedSearch, category, followingOnly, token]);

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-xl p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Лента рецептов</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Общая лента рецептов с фильтрами, поиском и подписками на авторов.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={user ? '/add-recipe' : '/register'}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              {user ? 'Добавить рецепт' : 'Создать аккаунт'}
            </Link>
            <Link
              to={user ? '/profile' : '/login'}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {user ? 'Открыть профиль' : 'Войти'}
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <div className="rounded-md bg-slate-100 px-4 py-2 text-slate-700">
            Рецептов: <span className="font-semibold">{data?.summary.totalRecipes ?? '...'}</span>
          </div>
          <div className="rounded-md bg-slate-100 px-4 py-2 text-slate-700">
            Авторов: <span className="font-semibold">{data?.summary.totalAuthors ?? '...'}</span>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-xl p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск рецептов"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!user}
            onClick={() => setFollowingOnly((current) => !current)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              followingOnly
                ? 'bg-primary text-white'
                : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
            } ${!user ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            Только подписки
          </button>
        </div>
      </section>

      {isLoading ? <Loader label="Загружаем ленту" /> : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && data?.items?.length === 0 ? (
        <EmptyState
          title="Рецепты не найдены"
          description="Попробуй изменить поиск или сбросить фильтр категории."
          action={
            user ? (
              <Link
                to="/add-recipe"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Добавить рецепт
              </Link>
            ) : null
          }
        />
      ) : null}

      {!isLoading && !error && data?.items?.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.items.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onRefresh={loadFeed} />
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default Home;
