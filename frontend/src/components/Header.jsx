import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-blue-500 text-white p-4">
            <nav className="flex justify-between items-center max-w-6xl mx-auto">
                <Link to="/" className="text-xl font-bold">RecipeHub</Link>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <Link to="/profile">Профиль</Link>
                            <Link to="/add-recipe">Добавить рецепт</Link>
                            <button onClick={logout}>Выйти</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Войти</Link>
                            <Link to="/register">Регистрация</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;