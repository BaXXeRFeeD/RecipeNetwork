import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

const RecipeForm = ({ onSubmitSuccess }) => {
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            category: '',
            ingredients: [{ name: '', quantity: '' }],
            steps: [{ description: '' }],
            photo: null,
        },
    });

    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
        control,
        name: 'ingredients',
    });

    const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
        control,
        name: 'steps',
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    const onSubmit = (data) => {
        if (data.photo && data.photo[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newRecipe = {
                    title: data.title,
                    category: data.category,
                    ingredients: data.ingredients,
                    steps: data.steps,
                    photo: reader.result,
                    likedBy: [],
                    comments: [],
                };
                reset();
                setPhotoPreview(null);
                onSubmitSuccess(newRecipe);
            };
            reader.readAsDataURL(data.photo[0]);
        } else {
            const newRecipe = {
                title: data.title,
                category: data.category,
                ingredients: data.ingredients,
                steps: data.steps,
                photo: '',
                likedBy: [],
                comments: [],
            };
            reset();
            setPhotoPreview(null);
            onSubmitSuccess(newRecipe);
        }
    };

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setPhotoPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">Добавить рецепт</h2>

            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Название</label>
                <input
                    id="title"
                    {...register('title', { required: 'Название обязательно' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary"
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Категория</label>
                <select
                    id="category"
                    {...register('category', { required: 'Категория обязательна' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary focus:ring-primary"
                >
                    <option value="">Выберите категорию</option>
                    <option value="десерты">Десерты</option>
                    <option value="мясо">Мясо</option>
                    <option value="напитки">Напитки</option>
                    <option value="веган">Веган</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ингредиенты</label>
                {ingredientFields.map((field, index) => (
                    <div key={field.id} className="flex mb-2">
                        <input
                            {...register(`ingredients.${index}.name`, { required: true })}
                            placeholder="Ингредиент"
                            className="mr-2 flex-1 border border-gray-300 rounded-md p-2 focus:border-primary focus:ring-primary"
                        />
                        <input
                            {...register(`ingredients.${index}.quantity`, { required: true })}
                            placeholder="Количество"
                            className="mr-2 flex-1 border border-gray-300 rounded-md p-2 focus:border-primary focus:ring-primary"
                        />
                        <button type="button" onClick={() => removeIngredient(index)} className="text-red-500 hover:text-red-700">Удалить</button>
                    </div>
                ))}
                <button type="button" onClick={() => appendIngredient({ name: '', quantity: '' })} className="text-blue-500 hover:text-blue-700">Добавить ингредиент</button>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Шаги</label>
                {stepFields.map((field, index) => (
                    <div key={field.id} className="flex mb-2">
                        <input
                            {...register(`steps.${index}.description`, { required: true })}
                            placeholder={`Шаг ${index + 1}`}
                            className="flex-1 border border-gray-300 rounded-md p-2 focus:border-primary focus:ring-primary"
                        />
                        <button type="button" onClick={() => removeStep(index)} className="ml-2 text-red-500 hover:text-red-700">Удалить</button>
                    </div>
                ))}
                <button type="button" onClick={() => appendStep({ description: '' })} className="text-blue-500 hover:text-blue-700">Добавить шаг</button>
            </div>

            <div className="mb-4">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Фото</label>
                <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    {...register('photo')}
                    onChange={handlePhotoChange}
                    className="mt-1 block w-full"
                />
                {photoPreview && <img src={photoPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}
            </div>

            <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600 transition">Опубликовать</button>
        </form>
    );
};

export default RecipeForm;