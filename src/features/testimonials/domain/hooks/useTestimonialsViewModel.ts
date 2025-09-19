import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../shared/domain/hooks';
import { fetchTestimonials, selectTestimonials, selectTestimonialsError, selectTestimonialsLoading, selectWinners, selectCredibilityContent } from '../../app/store/slices/testimonialsSlice';

export function useTestimonialsViewModel() {
  const dispatch = useAppDispatch();
  const testimonials = useAppSelector(selectTestimonials);
  const winners = useAppSelector(selectWinners);
  const credibilityContent = useAppSelector(selectCredibilityContent);
  const isLoading = useAppSelector(selectTestimonialsLoading);
  const error = useAppSelector(selectTestimonialsError);

  const refresh = useCallback(async () => {
    await dispatch(fetchTestimonials());
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    testimonials,
    winners,
    credibilityContent,
    isLoading,
    error,
    refresh,
  };
}


