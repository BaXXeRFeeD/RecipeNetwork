import { useState } from 'react';
import useRecipes from '../hooks/useRecipes';
import useAuth from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

const Home = () => {
    const { recipes } = useRecipes();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const filteredRecipes = recipes.filter((r) => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category ? r.category === category : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <SearchBar onSearch={setSearch} />
            <CategoryFilter onFilter={setCategory} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
                ) : (
                    <p>Нет рецептов</p>
                )}
            </div>
        </div>
    );
};

export default Home;