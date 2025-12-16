import { useNavigate } from 'react-router-dom';
import useLocalStorage from './useLocalStorage';
import { initialUsers } from '../data/mockData';

function useAuth() {
    const [user, setUser] = useLocalStorage('user', null);
    const [users, setUsers] = useLocalStorage('users', initialUsers);
    const navigate = useNavigate();

    const login = (username, password) => {
        const foundUser = users.find((u) => u.username === username && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            navigate('/');
        } else {
            alert('Неверные данные');
        }
    };

    const register = (username, password) => {
        const existing = users.find((u) => u.username === username);
        if (existing) {
            alert('Пользователь уже существует');
            return;
        }
        const newUser = { id: Date.now(), username, password, favorites: [], subscriptions: [] };
        setUsers([...users, newUser]);
        setUser(newUser);
        navigate('/');
    };

    const logout = () => {
        setUser(null);
        navigate('/login');
    };

    return { user, users, setUsers, login, register, logout };
}

export default useAuth;