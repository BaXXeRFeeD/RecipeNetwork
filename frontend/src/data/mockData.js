const tortUrl = new URL('./tort.jpg', import.meta.url).href;

export const initialRecipes = [
    {
        id: 1,
        title: 'Шоколадный торт',
        category: 'десерты',
        ingredients: [{ name: 'Шоколад', quantity: '200г' }],
        steps: [{ description: 'Смешать ингредиенты' }],
        photo: tortUrl,
        likes: 0,
        comments: [],
        author: 1,
    },
];

export const initialUsers = [
    { id: 1, username: 'admin', password: 'admin', favorites: [], subscriptions: [] },
    { id: 2, username: 'admin2', password: 'admin', favorites: [], subscriptions: [] },
];

export const categories = ['десерты', 'мясо', 'напитки', 'веган'];
