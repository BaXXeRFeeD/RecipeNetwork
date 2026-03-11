import useRecipes from '../hooks/useRecipes';
import useAuth from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';

const MyRecipes = () => {
    const { recipes } = useRecipes();
    const { user } = useAuth();

    if (!user) return <p>Нужно войти</p>;

    const myRecipes = recipes.filter((r) => r.author === user.id);

    return (
        <div>
            <h3 className="text-xl mb-4">Мои рецепты</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {myRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
            </div>
        </div>
    );
};

export default MyRecipes;