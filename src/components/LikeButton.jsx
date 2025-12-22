import useRecipes from '../hooks/useRecipes';
import useAuth from '../hooks/useAuth';

const LikeButton = ({ recipeId, likedBy }) => {
    const { user } = useAuth();
    const { updateRecipe } = useRecipes();
    const likes = likedBy.length;

    const isLiked = likedBy.includes(user?.id);

    const handleLike = () => {
        if (!user) {
            alert('Нужно войти');
            return;
        }

        let updatedLikedBy;
        if (isLiked) {
            updatedLikedBy = likedBy.filter((userId) => userId !== user.id);
        } else {
            updatedLikedBy = [...likedBy, user.id];
        }

        updateRecipe(recipeId, { likedBy: updatedLikedBy });
    };

    return <button onClick={handleLike} className="mr-2 px-3 py-1 rounded bg-blue-100 text-blue-500 hover:bg-blue-200 transition">Лайк ({likes})</button>;
};

export default LikeButton;