import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';

import { CATEGORY_OPTIONS } from '../lib/constants';

function RecipeForm({ onSubmitSuccess, isSubmitting }) {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'desserts',
      photoFile: null,
      ingredients: [{ name: '', quantity: '', unit: '', position: 1 }],
      steps: [{ description: '', photoFile: null, position: 1 }],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } =
    useFieldArray({
      control,
      name: 'ingredients',
    });
  const { fields: stepFields, append: appendStep, remove: removeStep } =
    useFieldArray({
      control,
      name: 'steps',
    });
  const [preview, setPreview] = useState('');

  const onSubmit = async (data) => {
    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      photoFile: data.photoFile?.[0] ?? null,
      ingredients: data.ingredients.map((ingredient, index) => ({
        name: ingredient.name.trim(),
        quantity: ingredient.quantity.trim(),
        unit: ingredient.unit.trim(),
        position: index + 1,
      })),
      steps: data.steps.map((step, index) => ({
        description: step.description.trim(),
        photoFile: step.photoFile?.[0] ?? null,
        position: index + 1,
      })),
    };

    await onSubmitSuccess(payload);
    reset();
    setPreview('');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="glass-panel rounded-xl p-6">
        <h2 className="text-3xl font-bold text-slate-900">Новый рецепт</h2>
        <p className="mt-2 text-sm text-slate-600">
          Заполни основные поля, затем добавь ингредиенты и шаги приготовления.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Название</label>
              <input
                {...register('title', { required: 'Название обязательно' })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Название рецепта"
              />
              {errors.title ? <p className="text-sm text-red-500">{errors.title.message}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Описание</label>
              <textarea
                {...register('description', {
                  required: 'Описание обязательно',
                })}
                rows={5}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Описание рецепта"
              />
              {errors.description ? (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:max-w-xs">
              <label className="text-sm font-medium text-slate-700">Категория</label>
              <select
                {...register('category')}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORY_OPTIONS.filter((item) => item.value).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiImage />
                Загрузи изображение рецепта
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('photoFile')}
                onChange={(event) => {
                  if (event.target.files?.[0]) {
                    setPreview(URL.createObjectURL(event.target.files[0]));
                  } else {
                    setPreview('');
                  }
                }}
                className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-blue-600"
              />
              <p className="mt-3 text-sm text-slate-500">
                Фото будет загружено и сохранено на сервере.
              </p>
            </div>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              {preview ? (
                <img src={preview} alt="Превью рецепта" className="h-64 w-full object-cover" />
              ) : (
                <div className="flex h-64 items-center justify-center text-center text-sm text-slate-500">
                  Превью рецепта появится здесь
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-900">Ингредиенты</h3>
            <button
              type="button"
              onClick={() =>
                appendIngredient({
                  name: '',
                  quantity: '',
                  unit: '',
                  position: ingredientFields.length + 1,
                })
              }
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              <FiPlus />
              Добавить
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {ingredientFields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <input
                  {...register(`ingredients.${index}.name`, {
                    required: true,
                  })}
                  placeholder="ingredient"
                  className="min-w-0 flex-[2_1_220px] rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  {...register(`ingredients.${index}.quantity`, {
                    required: true,
                  })}
                  placeholder="quantity"
                  className="min-w-[120px] flex-1 rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  {...register(`ingredients.${index}.unit`, {
                    required: true,
                  })}
                  placeholder="unit"
                  className="min-w-[110px] flex-1 rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="inline-flex w-full items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600 transition hover:bg-red-100 sm:w-auto"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-900">Шаги</h3>
            <button
              type="button"
              onClick={() =>
                appendStep({
                  description: '',
                  photoFile: null,
                  position: stepFields.length + 1,
                })
              }
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              <FiPlus />
              Добавить
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {stepFields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900">Шаг {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                  >
                    <FiTrash2 />
                    Удалить
                  </button>
                </div>

                <textarea
                  {...register(`steps.${index}.description`, { required: true })}
                  rows={3}
                  placeholder="Описание шага"
                  className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-white p-3">
                  <label className="text-sm font-medium text-slate-700">Фото шага</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register(`steps.${index}.photoFile`)}
                    className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-blue-600"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Необязательно. Если выберешь фото, оно тоже загрузится на сервер.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-primary px-6 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Публикуем...' : 'Опубликовать рецепт'}
      </button>
    </form>
  );
}

export default RecipeForm;
