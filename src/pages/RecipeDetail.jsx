import { useParams } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';
import CommentSection from '../components/CommentSection';
import LikeButton from '../components/LikeButton';
import FavoriteButton from '../components/FavoriteButton';
import SubscriptionButton from '../components/SubscriptionButton';
import DeleteButton from '../components/DeleteButton';

const RecipeDetail = () => {
    const { id } = useParams();
    const { recipes } = useRecipes();
    const recipe = recipes.find((r) => r.id === Number(id));

    if (!recipe) return <p>Рецепт не найден</p>;

    return (
        <div className="max-w-2xl mx-auto">
            {recipe.photo && (
                <img
                    src={recipe.photo}
                    alt={recipe.title}
                    className="w-full h-64 object-cover mb-4"
                />
            )}

            <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>
            <p className="mb-4">Категория: {recipe.category}</p>

            <h3 className="font-bold mb-2">Ингредиенты:</h3>
            <ul className="list-disc pl-6 mb-4">
                {recipe.ingredients.map((ing, idx) => (
                    <li key={idx}>
                        {ing.name} - {ing.quantity}
                    </li>
                ))}
            </ul>

            <h3 className="font-bold mb-2">Шаги:</h3>
            <ol className="list-decimal pl-6 mb-4">
                {recipe.steps.map((step, idx) => (
                    <li key={idx}>{step.description}</li>
                ))}
            </ol>

            <div className="flex flex-wrap gap-2 items-center mb-4">
                <LikeButton recipeId={recipe.id} likedBy={recipe.likedBy} />
                <FavoriteButton recipeId={recipe.id} />
                <SubscriptionButton authorId={recipe.author} />
                <DeleteButton recipe={recipe} redirectTo="/my-recipes" />
            </div>

            <CommentSection recipeId={recipe.id} comments={recipe.comments} />
        </div>
    );
};

export default RecipeDetail;
