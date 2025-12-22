import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRecipes from '../hooks/useRecipes';
import RecipeCard from '../components/RecipeCard';

const Profile = () => {
    const { user, users } = useAuth();
    const { recipes } = useRecipes();
    const [selectedTab, setSelectedTab] = useState(0);

    if (!user) return <p>Войдите в аккаунт</p>;

    const myRecipes = recipes.filter(r => r.author === user.id);
    const favorites = recipes.filter(r => user.favorites.includes(r.id));

    const subscribedAuthors = users.filter(u => user.subscriptions.includes(u.id));

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Профиль: {user.username}</h1>
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                    <Tab
                        className={({ selected }) =>
                            selected
                                ? 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 bg-white shadow'
                                : 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-100 hover:bg-white/[0.12] hover:text-white'
                        }
                    >
                        Мои рецепты
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            selected
                                ? 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 bg-white shadow'
                                : 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-100 hover:bg-white/[0.12] hover:text-white'
                        }
                    >
                        Избранное
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            selected
                                ? 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 bg-white shadow'
                                : 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-100 hover:bg-white/[0.12] hover:text-white'
                        }
                    >
                        Подписки
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                    <Tab.Panel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {myRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {favorites.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {subscribedAuthors.map(author => (
                                <div key={author.id} className="border rounded p-4 shadow hover:shadow-lg transition-shadow duration-200 bg-white">
                                    <h3 className="font-bold">{author.username}</h3>
                                    <Link to={`/profile/${author.id}`} className="text-blue-500 hover:underline">
                                        Просмотреть профиль
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default Profile;