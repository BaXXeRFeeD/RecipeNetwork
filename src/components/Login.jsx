import {useForm} from 'react-hook-form';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const {login} = useAuth();

    const onSubmit = (data) => {
        login(data.username, data.password);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
            <h2 className="text-2xl mb-4">Вход</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Логин</label>
                <input
                    {...register('username', {required: true})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary"
                />
                {errors.username && <p className="text-red-500 text-xs">Обязательно</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Пароль</label>
                <input
                    type="password"
                    {...register('password', {required: true})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary"
                />
                {errors.password && <p className="text-red-500 text-xs">Обязательно</p>}
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600 transition">Войти</button>
        </form>
    );
};

export default Login;