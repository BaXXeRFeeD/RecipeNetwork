import useAuth from '../hooks/useAuth';

const SubscriptionButton = ({ authorId }) => {
  const { user, setUser, setUsers, users } = useAuth();
  if (!user || user.id === authorId) return null;

  const isSubscribed = user.subscriptions.includes(authorId);

  const handleSubscribe = () => {
    const updatedSubscriptions = isSubscribed
      ? user.subscriptions.filter((id) => id !== authorId)
      : [...user.subscriptions, authorId];
    const updatedUser = { ...user, subscriptions: updatedSubscriptions };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
    setUser(updatedUser);
  };

  return (
    <button onClick={handleSubscribe} className="text-green-500">
      {isSubscribed ? 'Отписаться' : 'Подписаться'}
    </button>
  );
};

export default SubscriptionButton;