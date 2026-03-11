import { useParams } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';
import useAuth from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';
import SubscriptionButton from '../components/SubscriptionButton';

const UserProfile = () => {
    const { userId } = useParams();
    const parsedUserId = Number(userId);
    const { recipes } = useRecipes();
    const { users } = useAuth();

    const profileUser = users.find((u) => u.id === parsedUserId);
    if (!profileUser) return <p>Пользователь не найден</p>;

    const userRecipes = recipes.filter((r) => r.author === parsedUserId);

    return (
        <div>
            <h2 className="text-2xl mb-4">Профиль {profileUser.username}</h2>
            <SubscriptionButton authorId={parsedUserId} />
            <h3 className="text-xl mb-4">Рецепты пользователя</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userRecipes.length > 0 ? (
                    userRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
                ) : (
                    <p>Нет рецептов</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;