import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import MyRecipes from './MyRecipes';
import Favorites from './Favorites';

const Profile = () => {
    const { user, users } = useAuth();

    if (!user) return <p>Нужно войти</p>;

    const subscriptions = user.subscriptions.map((id) => {
        const subUser = users.find((u) => u.id === id);
        return { id, name: subUser?.username || 'Неизвестный' };
    });

    return (
        <div>
            <h2 className="text-2xl mb-4">Профиль {user.username}</h2>
            <h3 className="font-bold mb-2">Подписки:</h3>
            <ul className="list-disc pl-6 mb-4">
                {subscriptions.map(({ id, name }) => (
                    <li key={id}>
                        <Link to={`/profile/${id}`} className="text-blue-500 hover:underline">{name}</Link>
                    </li>
                ))}
            </ul>
            <MyRecipes />
            <Favorites />
        </div>
    );
};

export default Profile;