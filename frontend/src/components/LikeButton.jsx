import useRecipes from '../hooks/useRecipes';
import useAuth from '../hooks/useAuth';

const LikeButton = ({recipeId, likes}) => {
    const {user} = useAuth();
    const {updateRecipe} = useRecipes();

    const handleLike = () => {
        if (user) {
            updateRecipe(recipeId, {likes: likes + 1});
        } else {
            alert('Нужно войти');
        }
    };

    return <button onClick={handleLike} className="mr-2 text-blue-500">Лайк ({likes})</button>;
};

export default LikeButton;