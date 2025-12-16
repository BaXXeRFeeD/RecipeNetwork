import {useForm} from 'react-hook-form';
import useRecipes from '../hooks/useRecipes';
import useAuth from '../hooks/useAuth';

const CommentSection = ({recipeId, comments}) => {
    const {register, handleSubmit, reset} = useForm();
    const {updateRecipe} = useRecipes();
    const {user} = useAuth();

    const onSubmit = (data) => {
        if (user) {
            updateRecipe(recipeId, {
                comments: [...comments, {text: data.text, author: user.username}],
            });
            reset();
        } else {
            alert('Нужно войти');
        }
    };

    return (
        <div className="mt-4">
            <h4 className="font-bold">Комментарии</h4>
            {comments.map((c, i) => (
                <p key={i} className="border-b py-2">
                    <strong>{c.author}:</strong> {c.text}
                </p>
            ))}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
                <input {...register('text', {required: true})} placeholder="Комментарий" className="w-full border p-2"/>
                <button type="submit" className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">Добавить</button>
            </form>
        </div>
    );
};

export default CommentSection;