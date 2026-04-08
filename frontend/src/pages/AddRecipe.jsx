import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import RecipeForm from '../components/RecipeForm';
import useAuth from '../hooks/useAuth';
import { api } from '../lib/api';

function AddRecipe() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createRecipe = async (payload) => {
    try {
      setIsSubmitting(true);

      let photoUrl = null;

      if (payload.photoFile) {
        const uploadedPhoto = await api.uploadRecipePhoto(payload.photoFile, token);
        photoUrl = uploadedPhoto.url;
      }

      const steps = await Promise.all(
        payload.steps.map(async (step) => {
          let imageUrl = null;

          if (step.photoFile) {
            const uploadedStepPhoto = await api.uploadRecipePhoto(step.photoFile, token);
            imageUrl = uploadedStepPhoto.url;
          }

          return {
            description: step.description,
            position: step.position,
            imageUrl,
          };
        }),
      );

      const recipe = await api.createRecipe(
        {
          title: payload.title,
          description: payload.description,
          category: payload.category,
          photoUrl,
          ingredients: payload.ingredients,
          steps,
        },
        token,
      );

      navigate(`/recipe/${recipe.id}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <RecipeForm onSubmitSuccess={createRecipe} isSubmitting={isSubmitting} />;
}

export default AddRecipe;
