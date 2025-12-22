import useAuth from '../hooks/useAuth';

const SubscriptionButton = ({ authorId }) => {
    const { user, updateUser } = useAuth()
    if (!user || user.id === authorId) return null;

    const isSubscribed = user.subscriptions.includes(authorId);

    const handleSubscribe = () => {
        const updatedSubscriptions = isSubscribed
            ? user.subscriptions.filter((id) => id !== authorId)
            : [...user.subscriptions, authorId];
        updateUser({ subscriptions: updatedSubscriptions });
    };

    return (
        <button onClick={handleSubscribe}
                className="mr-2 px-3 py-1 rounded bg-green-100 text-green-500 hover:bg-green-200 transition">
            {isSubscribed ? 'Отписаться' : 'Подписаться'}
        </button>
    );
};

export default SubscriptionButton;