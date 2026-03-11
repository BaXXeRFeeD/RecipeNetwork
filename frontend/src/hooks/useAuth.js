import { useNavigate } from 'react-router-dom';
import useLocalStorage from './useLocalStorage';
import { initialUsers } from '../data/mockData';

function useAuth() {
    const [users, setUsers] = useLocalStorage('users', initialUsers);
    const [currentUserId, setCurrentUserId] = useLocalStorage('currentUserId', null);
    const navigate = useNavigate();

    const user = users.find((u) => u.id === currentUserId) || null;

    const login = (username, password) => {
        const foundUser = users.find((u) => u.username === username && u.password === password);
        if (foundUser) {
            setCurrentUserId(foundUser.id);
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
        setCurrentUserId(newUser.id);
        navigate('/');
    };

    const logout = () => {
        setCurrentUserId(null);
        navigate('/login');
    };

    const updateUser = (updatedFields) => {
        if (!user) return;
        setUsers(users.map((u) => (u.id === user.id ? { ...u, ...updatedFields } : u)));
    };

    return { user, users, setUsers, updateUser, login, register, logout };
}

export default useAuth;