import useAuth from '../hooks/useAuth';

const FavoriteButton = ({ recipeId }) => {
    const { user, updateUser, setUsers, users } = useAuth();
    if (!user) return null;
    const isFavorite = user.favorites.includes(recipeId);
    const handleFavorite = () => {
        const updatedFavorites = isFavorite
            ? user.favorites.filter((id) => id !== recipeId)
            : [...user.favorites, recipeId];
        updateUser({ favorites: updatedFavorites });
    };
    return (
        <button
            onClick={handleFavorite}
            className={`mr-2 ${isFavorite ? 'text-orange-500' : 'text-yellow-500'}`}
        >
            {isFavorite ? 'Удалить из избранного' : 'В избранное'}
        </button>
    );
};

export default FavoriteButton;