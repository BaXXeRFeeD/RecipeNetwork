import { useEffect, useState } from 'react';

import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import RecipeCard from '../components/RecipeCard';
import useAuth from '../hooks/useAuth';
import { api } from '../lib/api';

function Favorites() {
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
    return <Loader label="Загружаем избранное" />;
  }

  if (error) {
    return <EmptyState title="Не удалось загрузить избранное" description={error} />;
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-xl p-6">
        <h1 className="text-3xl font-bold text-slate-900">Избранное</h1>
        <p className="mt-2 text-sm text-slate-600">Здесь собраны рецепты, которые ты сохранил.</p>
      </section>

      {dashboard.favorites.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dashboard.favorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onRefresh={loadDashboard} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="Пока нет сохраненных рецептов"
          description="Добавляй рецепты в избранное из ленты или со страницы рецепта."
        />
      )}
    </div>
  );
}

export default Favorites;
