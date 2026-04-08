import useAuth from '../hooks/useAuth';
import useRecipes from '../hooks/useRecipes';
import {useNavigate} from 'react-router-dom';

const DeleteButton = ({recipe, redirectTo = null, onDeleted = null}) => {
    const {user} = useAuth();
    const {deleteRecipe} = useRecipes();
    const navigate = useNavigate();

    const canDelete = user && recipe && user.id === recipe.author;
    if (!canDelete) return null;

    const handleDelete = () => {
        if (!confirm('Удалить рецепт?')) return;

        deleteRecipe(recipe.id);

        if (typeof onDeleted === 'function') onDeleted(recipe.id);
        if (redirectTo) navigate(redirectTo);
    };

    return (
        <button
            onClick={handleDelete}
            className="mr-2 px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition flex items-center"
        >
            Удалить
        </button>
    );
};

export default DeleteButton;
