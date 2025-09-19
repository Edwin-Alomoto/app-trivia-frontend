import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../shared/domain/hooks';
import { fetchSurveys, selectSurveys, selectSurveysError, selectSurveysLoading } from '../../app/store/slices/surveysSlice';

export function useSurveysViewModel() {
  const dispatch = useAppDispatch();
  const surveys = useAppSelector(selectSurveys);
  const isLoading = useAppSelector(selectSurveysLoading);
  const error = useAppSelector(selectSurveysError);

  const refresh = useCallback(async () => {
    await dispatch(fetchSurveys());
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    surveys,
    isLoading,
    error,
    refresh,
  };
}


