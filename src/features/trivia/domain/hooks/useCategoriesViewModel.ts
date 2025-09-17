import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { fetchCategories, selectCategories, selectTriviaError, selectTriviaLoading } from '../../../../store/slices/triviaSlice';
import { Category, DifficultyFilter } from '../types/trivia';

export function useCategoriesViewModel() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectTriviaLoading);
  const error = useAppSelector(selectTriviaError);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all');

  const refresh = useCallback(async () => {
    await dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredCategories = selectedDifficulty === 'all'
    ? categories
    : categories.filter((c: Category) => c.difficulty === selectedDifficulty);

  return {
    categories,
    isLoading,
    error,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredCategories,
    refresh,
  };
}
