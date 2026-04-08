import useAuth from '../hooks/useAuth';

const FavoriteButton = ({ recipeId }) => {
    const { user, updateUser } = useAuth();
    if (!user) return null;

    const isFavorite = user.favorites.includes(recipeId);

    const handleFavorite = () => {
        const updatedFavorites = isFavorite
            ? user.favorites.filter((id) => id !== recipeId)
            : [...user.favorites, recipeId];
        updateUser({ favorites: updatedFavorites })
    };

    return (
        <button onClick={handleFavorite} className="mr-2 px-3 py-1 rounded bg-yellow-100 text-yellow-500 hover:bg-yellow-200 transition">
            {isFavorite ? 'Удалить из избранного' : 'В избранное'}
        </button>
    );
};

export default FavoriteButton;