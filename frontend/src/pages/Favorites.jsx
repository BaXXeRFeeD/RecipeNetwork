import useRecipes from '../hooks/useRecipes';
import useAuth from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';

const Favorites = () => {
    const { recipes } = useRecipes();
    const { user } = useAuth();

    if (!user) return <p>Нужно войти</p>;

    const favoriteRecipes = recipes.filter((r) => user.favorites.includes(r.id));

    return (
        <div>
            <h3 className="text-xl mb-4">Избранное</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {favoriteRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
            </div>
        </div>
    );
};

export default Favorites;