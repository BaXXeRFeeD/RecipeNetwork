import useLocalStorage from './useLocalStorage';
import { initialRecipes } from '../data/mockData';

function useRecipes() {
    const [recipes, setRecipes] = useLocalStorage('recipes', initialRecipes);

    const addRecipe = (newRecipe) => {
        setRecipes((prev) => [...prev, { ...newRecipe, id: Date.now() }]);
    };

    const updateRecipe = (id, updatedFields) => {
        setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r)));
    };

    const deleteRecipe = (id) => {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
    };

    return { recipes, addRecipe, updateRecipe, deleteRecipe };
}

export default useRecipes;
