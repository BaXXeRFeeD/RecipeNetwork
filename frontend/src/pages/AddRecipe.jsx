import RecipeForm from '../components/RecipeForm';
import useRecipes from '../hooks/useRecipes';
import useAuth from '../hooks/useAuth';

const AddRecipe = () => {
    const { addRecipe } = useRecipes();
    const { user } = useAuth();

    if (!user) return <p>Нужно войти</p>;

    const handleSuccess = (newRecipe) => {
        addRecipe({ ...newRecipe, author: user.id });
    };

    return <RecipeForm onSubmitSuccess={handleSuccess} />;
};

export default AddRecipe;