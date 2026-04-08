import { HashRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AddRecipe from './pages/AddRecipe';
import Admin from './pages/Admin';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import MyRecipes from './pages/MyRecipes';
import Profile from './pages/Profile';
import RecipeDetail from './pages/RecipeDetail';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-recipe"
              element={
                <ProtectedRoute>
                  <AddRecipe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-recipes"
              element={
                <ProtectedRoute>
                  <MyRecipes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
