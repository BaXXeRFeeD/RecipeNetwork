import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import RecipeCard from '../components/RecipeCard';
import useAuth from '../hooks/useAuth';
import { api } from '../lib/api';
import { formatDate, formatRole } from '../lib/formatters';

function UserProfile() {
  const { userId } = useParams();
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await api.getProfile(userId, token);
      setProfile(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [token, userId]);

  if (isLoading) {
    return <Loader label="Загружаем профиль автора" />;
  }

  if (error) {
    return <EmptyState title="Не удалось загрузить профиль автора" description={error} />;
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-xl p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">@{profile.profile.username}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {formatRole(profile.profile.role)} • с {formatDate(profile.profile.createdAt)}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Рецепты', profile.stats.recipes],
              ['Подписчики', profile.stats.followers],
              ['Подписки', profile.stats.following],
              ['Лайки', profile.stats.likesReceived],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {profile.recipes.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {profile.recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onRefresh={loadProfile} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="У автора пока нет опубликованных рецептов"
          description="Загляни позже или подпишись на автора."
        />
      )}
    </div>
  );
}

export default UserProfile;
