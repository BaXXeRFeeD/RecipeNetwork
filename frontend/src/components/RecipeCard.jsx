import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import FavoriteButton from './FavoriteButton';
import SubscriptionButton from './SubscriptionButton';
import DeleteButton from './DeleteButton';
import useAuth from '../hooks/useAuth';

const RecipeCard = ({ recipe }) => {
    const { users } = useAuth();
    const author = users.find((u) => u.id === recipe.author);
    const authorUsername = author ? author.username : 'Неизвестный';

    return (
        <div className="border rounded p-4 shadow">
            {recipe.photo && (
                <img
                    src={recipe.photo}
                    alt={recipe.title}
                    className="w-full h-48 object-cover mb-2"
                />
            )}
            <p className="text-gray-600 mb-1">Автор: {authorUsername}</p>
            <h3 className="font-bold">{recipe.title}</h3>
            <p>{recipe.category}</p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
                <LikeButton recipeId={recipe.id} likes={recipe.likes} />
                <FavoriteButton recipeId={recipe.id} />
                <SubscriptionButton authorId={recipe.author} />
                <DeleteButton recipe={recipe} />
            </div>

            <Link to={`/recipe/${recipe.id}`} className="text-blue-500 block mt-2">
                Подробнее
            </Link>
        </div>
    );
};

export default RecipeCard;