import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import AddRecipe from './pages/AddRecipe';
import RecipeDetail from './pages/RecipeDetail';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import MyRecipes from './pages/MyRecipes';

function App() {
    return (
        <HashRouter>
            <Header />
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/add-recipe" element={<AddRecipe />} />
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/my-recipes" element={<MyRecipes />} />
                </Routes>
            </main>
        </HashRouter>
    );
}

export default App;