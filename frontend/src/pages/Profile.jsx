import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import RecipeCard from '../components/RecipeCard';
import useAuth from '../hooks/useAuth';
import { api } from '../lib/api';
import { formatDate, formatRole } from '../lib/formatters';

function Profile() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await api.getDashboard(token);
      setDashboard(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  if (isLoading) {
    return <Loader label="Загружаем профиль" />;
  }

  if (error) {
    return <EmptyState title="Не удалось загрузить профиль" description={error} />;
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-xl p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">@{dashboard.profile.username}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {dashboard.profile.email} • {formatRole(dashboard.profile.role)} • с{' '}
              {formatDate(dashboard.profile.createdAt)}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/add-recipe"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Добавить рецепт
              </Link>
              <Link
                to="/favorites"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Открыть избранное
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Рецепты', dashboard.stats.recipes],
              ['Избранное', dashboard.stats.favorites],
              ['Подписки', dashboard.stats.following],
              ['Подписчики', dashboard.stats.followers],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Последние рецепты</h2>
          </div>
          <Link to="/my-recipes" className="text-sm font-medium text-primary hover:underline">
            Смотреть все
          </Link>
        </div>
        {dashboard.recipes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {dashboard.recipes.slice(0, 3).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onRefresh={loadDashboard} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Ты еще ничего не публиковал"
            description="Добавь первый рецепт, и он сразу появится в общей ленте."
            action={
              <Link
                to="/add-recipe"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Добавить рецепт
              </Link>
            }
          />
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Избранное</h2>
            <Link to="/favorites" className="text-sm font-medium text-primary hover:underline">
              Ко всем
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {dashboard.favorites.slice(0, 3).map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 transition hover:bg-white"
              >
                <div>
                  <p className="font-medium text-slate-900">{recipe.title}</p>
                  <p className="mt-1 text-sm text-slate-500">@{recipe.author.username}</p>
                </div>
                <span className="text-sm text-slate-500">{recipe.stats.likes} лайков</span>
              </Link>
            ))}
            {dashboard.favorites.length === 0 ? (
              <p className="text-sm text-slate-600">Пока нет сохраненных рецептов.</p>
            ) : null}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-2xl font-bold text-slate-900">Подписки</h2>
          <div className="mt-5 space-y-3">
            {dashboard.following.map((author) => (
              <Link
                key={author.id}
                to={`/profile/${author.id}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 transition hover:bg-white"
              >
                <div>
                  <p className="font-medium text-slate-900">@{author.username}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatRole(author.role)} • {author.recipesCount} рецептов
                  </p>
                </div>
                <span className="text-sm text-slate-500">{author.followersCount} подписчиков</span>
              </Link>
            ))}
            {dashboard.following.length === 0 ? (
              <p className="text-sm text-slate-600">Ты пока ни на кого не подписан.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
