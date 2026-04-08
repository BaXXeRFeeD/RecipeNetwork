import { Link, NavLink, useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

const navClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-white text-primary' : 'text-white hover:bg-white/10'
  }`;

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold">
            RecipeHub
          </Link>
          {user ? (
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
              @{user.username}
            </span>
          ) : null}
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={navClass}>
            Лента
          </NavLink>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <NavLink to="/admin" className={navClass}>
                  Админ
                </NavLink>
              ) : null}
              <NavLink to="/my-recipes" className={navClass}>
                Мои рецепты
              </NavLink>
              <NavLink to="/favorites" className={navClass}>
                Избранное
              </NavLink>
              <NavLink to="/add-recipe" className={navClass}>
                Добавить рецепт
              </NavLink>
              <NavLink to="/profile" className={navClass}>
                Профиль
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="rounded-md border border-white/40 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              Выйти
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md border border-white/40 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-primary transition hover:bg-slate-100"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
