import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CommentSection from '../components/CommentSection';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import RecipeActionBar from '../components/RecipeActionBar';
import useAuth from '../hooks/useAuth';
import { api } from '../lib/api';
import { formatCategory, formatDate, formatRole } from '../lib/formatters';

function RecipeDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadRecipe = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await api.getRecipe(id, token);
      setRecipe(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipe();
  }, [id, token]);

  if (isLoading) {
    return <Loader label="Загружаем рецепт" />;
  }

  if (error) {
    return (
      <EmptyState
        title="Не удалось загрузить рецепт"
        description={error}
        action={
          <Link
            to="/"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Вернуться в ленту
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel overflow-hidden rounded-xl">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-h-[320px] bg-slate-100">
            {recipe.photoUrl ? (
              <img src={recipe.photoUrl} alt={recipe.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center px-6 text-center">
                <p className="text-3xl font-bold text-slate-500">{recipe.title}</p>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                {formatCategory(recipe.category)}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                {formatDate(recipe.createdAt)}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-slate-900">{recipe.title}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">{recipe.description}</p>

            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">Автор: @{recipe.author.username}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatRole(recipe.author.role)}</p>
                </div>
                <Link
                  to={`/profile/${recipe.author.id}`}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                >
                  Открыть профиль
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-md bg-white px-3 py-2 shadow-sm">
                  Лайки: {recipe.stats.likes}
                </span>
                <span className="rounded-md bg-white px-3 py-2 shadow-sm">
                  Комментарии: {recipe.stats.comments}
                </span>
                <span className="rounded-md bg-white px-3 py-2 shadow-sm">
                  Избранное: {recipe.stats.favorites}
                </span>
              </div>

              <RecipeActionBar recipe={recipe} onChange={loadRecipe} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="glass-panel rounded-xl p-6">
          <h2 className="text-2xl font-bold text-slate-900">Ингредиенты</h2>
          <div className="mt-5 space-y-3">
            {recipe.ingredients.map((ingredient) => (
              <div
                key={`${recipe.id}-ingredient-${ingredient.position}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="font-medium text-slate-900">{ingredient.name}</p>
                <p className="text-sm text-slate-600">
                  {ingredient.quantity} {ingredient.unit}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel rounded-xl p-6">
          <h2 className="text-2xl font-bold text-slate-900">Шаги приготовления</h2>
          <div className="mt-5 space-y-4">
            {recipe.steps.map((step) => (
              <div
                key={`${recipe.id}-step-${step.position}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-medium text-slate-900">Шаг {step.position}</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{step.description}</p>
                {step.imageUrl ? (
                  <img
                    src={step.imageUrl}
                    alt={`Шаг ${step.position}`}
                    className="mt-4 h-52 w-full rounded-lg object-cover"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </article>
      </section>

      <CommentSection recipeId={recipe.id} comments={recipe.comments} onRefresh={loadRecipe} />
    </div>
  );
}

export default RecipeDetail;
