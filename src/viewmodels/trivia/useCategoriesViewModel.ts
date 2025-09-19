import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../shared/domain/hooks';
import { fetchCategories, selectCategories, selectTriviaError, selectTriviaLoading } from '../../app/store/slices/triviaSlice';

export function useCategoriesViewModel() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectTriviaLoading);
  const error = useAppSelector(selectTriviaError);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const refresh = useCallback(async () => {
    await dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredCategories = selectedDifficulty === 'all'
    ? categories
    : categories.filter((c: any) => c.difficulty === selectedDifficulty);

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


