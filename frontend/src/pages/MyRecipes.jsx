import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import RecipeCard from '../components/RecipeCard';
import useAuth from '../hooks/useAuth';
import { api } from '../lib/api';

function MyRecipes() {
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
    return <Loader label="Загружаем твои рецепты" />;
  }

  if (error) {
    return <EmptyState title="Не удалось загрузить список рецептов" description={error} />;
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-xl p-6">
        <h1 className="text-3xl font-bold text-slate-900">Мои рецепты</h1>
        <p className="mt-2 text-sm text-slate-600">Все твои опубликованные рецепты в одном месте.</p>
      </section>

      {dashboard.recipes.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dashboard.recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onRefresh={loadDashboard} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="Публикаций пока нет"
          description="Добавь первый рецепт, и он появится здесь и в общей ленте."
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
    </div>
  );
}

export default MyRecipes;
