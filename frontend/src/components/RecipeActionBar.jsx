import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookmark, FiHeart, FiTrash2, FiUserPlus } from 'react-icons/fi';

import useAuth from '../hooks/useAuth';
import { api } from '../lib/api';

function RecipeActionBar({ recipe, onChange, compact = false }) {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [isWorking, setIsWorking] = useState(false);

  const requireAuth = () => {
    if (user) {
      return true;
    }

    navigate('/login');
    return false;
  };

  const runAction = async (handler) => {
    try {
      setIsWorking(true);
      await handler();
      await onChange?.();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsWorking(false);
    }
  };

  const buttonClass = (isActive) =>
    `inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'border-primary bg-blue-50 text-primary'
        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
    }`;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? '' : 'mt-2'}`}>
      <button
        type="button"
        disabled={isWorking}
        onClick={() => {
          if (!requireAuth()) {
            return;
          }

          runAction(() =>
            recipe.viewer.isLiked
              ? api.unlikeRecipe(recipe.id, token)
              : api.likeRecipe(recipe.id, token),
          );
        }}
        className={buttonClass(recipe.viewer.isLiked)}
      >
        <FiHeart />
        {recipe.stats.likes}
      </button>

      <button
        type="button"
        disabled={isWorking}
        onClick={() => {
          if (!requireAuth()) {
            return;
          }

          runAction(() =>
            recipe.viewer.isFavorited
              ? api.unfavoriteRecipe(recipe.id, token)
              : api.favoriteRecipe(recipe.id, token),
          );
        }}
        className={buttonClass(recipe.viewer.isFavorited)}
      >
        <FiBookmark />
        {recipe.stats.favorites}
      </button>

      {user && user.id !== recipe.author.id ? (
        <button
          type="button"
          disabled={isWorking}
          onClick={() =>
            runAction(() =>
              recipe.viewer.isFollowingAuthor
                ? api.unsubscribe(recipe.author.id, token)
                : api.subscribe(recipe.author.id, token),
            )
          }
          className={buttonClass(recipe.viewer.isFollowingAuthor)}
        >
          <FiUserPlus />
          {recipe.viewer.isFollowingAuthor ? 'Отписаться' : 'Подписаться'}
        </button>
      ) : null}

      {recipe.viewer.canEdit ? (
        <button
          type="button"
          disabled={isWorking}
          onClick={async () => {
            const confirmed = window.confirm('Удалить рецепт? Это действие нельзя отменить.');

            if (!confirmed) {
              return;
            }

            try {
              setIsWorking(true);
              await api.deleteRecipe(recipe.id, token);
              navigate(user ? '/my-recipes' : '/');
            } catch (error) {
              alert(error.message);
            } finally {
              setIsWorking(false);
            }
          }}
          className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          <FiTrash2 />
          Удалить
        </button>
      ) : null}
    </div>
  );
}

export default RecipeActionBar;
