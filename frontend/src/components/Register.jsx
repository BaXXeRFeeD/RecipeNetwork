import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: reg } = useAuth();

    const onSubmit = (data) => {
        reg(data.username, data.password);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
            <h2 className="text-2xl mb-4">Регистрация</h2>
            <div className="mb-4">
                <label>Логин</label>
                <input {...register('username', { required: true })} className="w-full border p-2" />
                {errors.username && <p className="text-red-500">Обязательно</p>}
            </div>
            <div className="mb-4">
                <label>Пароль</label>
                <input type="password" {...register('password', { required: true })} className="w-full border p-2" />
                {errors.password && <p className="text-red-500">Обязательно</p>}
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2">Зарегистрироваться</button>
        </form>
    );
};

export default Register;