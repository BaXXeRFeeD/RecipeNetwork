import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import { api } from '../lib/api';
import { formatCategory, formatDate, formatRole } from '../lib/formatters';

function Admin() {
  const { token, user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [usersResponse, recipesResponse] = await Promise.all([
        api.getUsers(token),
        api.getRecipes({}, token),
      ]);
      setUsers(usersResponse);
      setRecipes(recipesResponse);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [token]);

  const updateRole = async (userId, role) => {
    try {
      setIsWorking(true);
      await api.updateUserRole(userId, role, token);
      await loadAdminData();
    } catch (actionError) {
      alert(actionError.message);
    } finally {
      setIsWorking(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Удалить пользователя?')) {
      return;
    }

    try {
      setIsWorking(true);
      await api.deleteUser(userId, token);

      if (userId === user?.id) {
        logout();
        return;
      }

      await loadAdminData();
    } catch (actionError) {
      alert(actionError.message);
    } finally {
      setIsWorking(false);
    }
  };

  const deleteRecipe = async (recipeId) => {
    if (!window.confirm('Удалить рецепт?')) {
      return;
    }

    try {
      setIsWorking(true);
      await api.deleteRecipe(recipeId, token);
      await loadAdminData();
    } catch (actionError) {
      alert(actionError.message);
    } finally {
      setIsWorking(false);
    }
  };

  if (isLoading) {
    return <Loader label="Загружаем админ-панель" />;
  }

  if (error) {
    return <EmptyState title="Не удалось загрузить админ-панель" description={error} />;
  }

  const adminsCount = users.filter((item) => item.role === 'admin').length;

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-xl p-6">
        <h1 className="text-3xl font-bold text-slate-900">Админ-панель</h1>
        <p className="mt-2 text-sm text-slate-600">
          Управление пользователями и рецептами проекта.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Пользователи</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{users.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Админы</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{adminsCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Рецепты</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{recipes.length}</p>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Пользователи</h2>
          <span className="text-sm text-slate-500">{users.length} записей</span>
        </div>

        <div className="mt-5 space-y-3">
          {users.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  @{entry.username} <span className="text-slate-500">({entry.email})</span>
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {formatRole(entry.role)} • с {formatDate(entry.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={entry.role}
                  disabled={isWorking || entry.id === user?.id}
                  onChange={(event) => updateRole(entry.id, event.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  type="button"
                  disabled={isWorking || entry.id === user?.id}
                  onClick={() => deleteUser(entry.id)}
                  className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Рецепты</h2>
          <span className="text-sm text-slate-500">{recipes.length} записей</span>
        </div>

        <div className="mt-5 space-y-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0">
                <Link to={`/recipe/${recipe.id}`} className="font-semibold text-slate-900 hover:text-primary">
                  {recipe.title}
                </Link>
                <p className="mt-1 text-sm text-slate-500">
                  {formatCategory(recipe.category)} • @{recipe.author.username} • {formatDate(recipe.createdAt)}
                </p>
              </div>

              <button
                type="button"
                disabled={isWorking}
                onClick={() => deleteRecipe(recipe.id)}
                className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Admin;
