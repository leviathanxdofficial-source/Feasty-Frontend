import { api } from './client';

export type RecipeIngredient = {
  foodId?: string | null;
  name: string;
  servings: number;
  unit: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Recipe = {
  _id: string;
  name: string;
  description?: string;
  servings: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
};

export const recipeApi = {
  async list() {
    const { data } = await api.get('/recipe');
    return data as Recipe[];
  },
  async byId(id: string) {
    const { data } = await api.get(`/recipe/${id}`);
    return data as Recipe;
  },
  async create(payload: any) {
    const { data } = await api.post('/recipe', payload);
    return data as Recipe;
  },
  async patch(id: string, payload: any) {
    const { data } = await api.patch(`/recipe/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/recipe/${id}`);
    return data;
  },
  async duplicate(id: string) {
    const { data } = await api.post(`/recipe/${id}/duplicate`);
    return data;
  },
};
