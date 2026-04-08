import { Link } from 'react-router-dom';

import { formatCategory, formatDate, formatRole } from '../lib/formatters';
import RecipeActionBar from './RecipeActionBar';

function RecipeCard({ recipe, onRefresh }) {
  const recipeLink = `/recipe/${recipe.id}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={recipeLink} className="block h-52 overflow-hidden bg-slate-100">
        {recipe.photoUrl ? (
          <img src={recipe.photoUrl} alt={recipe.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <span className="text-lg font-semibold text-slate-500">{recipe.title}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">
              Автор:{' '}
              <Link to={`/profile/${recipe.author.id}`} className="font-medium text-primary hover:underline">
                @{recipe.author.username}
              </Link>
            </p>
            <Link to={recipeLink} className="mt-1 block text-xl font-bold text-slate-900 hover:text-primary">
              {recipe.title}
            </Link>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {formatCategory(recipe.category)}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600">{recipe.description}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">{formatDate(recipe.createdAt)}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{formatRole(recipe.author.role)}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            Комментарии: {recipe.stats.comments}
          </span>
          {recipe.ingredientsPreview.map((item) => (
            <span key={`${recipe.id}-${item}`} className="rounded-full bg-slate-100 px-3 py-1">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto border-t border-slate-200 pt-3">
          <RecipeActionBar recipe={recipe} onChange={onRefresh} compact />
        </div>

        <Link
          to={recipeLink}
          className="mt-3 inline-flex items-center justify-between rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Открыть рецепт
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default RecipeCard;
