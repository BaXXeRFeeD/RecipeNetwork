import useAuth from '../hooks/useAuth';

const FavoriteButton = ({ recipeId }) => {
  const { user, setUser, setUsers, users } = useAuth();
  if (!user) return null;

  const isFavorite = user.favorites.includes(recipeId);

  const handleFavorite = () => {
    const updatedFavorites = isFavorite
      ? user.favorites.filter((id) => id !== recipeId)
      : [...user.favorites, recipeId];
    const updatedUser = { ...user, favorites: updatedFavorites };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
    setUser(updatedUser);
  };

  return (
    <button onClick={handleFavorite} className="mr-2 text-yellow-500">
      {isFavorite ? 'Удалить из избранного' : 'В избранное'}
    </button>
  );
};

export default FavoriteButton;