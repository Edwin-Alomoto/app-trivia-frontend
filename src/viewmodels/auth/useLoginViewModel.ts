import { useCallback, useMemo, useState } from 'react';

import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { loginUser } from '../../store/slices/authSlice';
import { getServices } from '../../services/container';
import { User } from '../../types';
import { loginSchema, LoginForm } from '../../validators/auth';

export type LoginFormState = LoginForm;

export function useLoginViewModel() {
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector((s) => s.auth);
  const { authService } = useMemo(() => getServices(), []);

  const [form, setForm] = useState<LoginFormState>({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LoginFormState, string>>>({});

  const setField = useCallback(<K extends keyof LoginFormState>(key: K, value: LoginFormState[K]) => {
    setForm((prev: LoginFormState) => ({ ...prev, [key]: value }));
    setFormErrors((prev: Partial<Record<keyof LoginFormState, string>>) => ({ ...prev, [key]: '' }));
  }, []);

  const validate = useCallback(() => {
    const parsed = loginSchema.safeParse(form);
    if (parsed.success) {
      setFormErrors({});
      return true;
    }
    const errors: Partial<Record<keyof LoginFormState, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LoginFormState;
      if (!errors[key]) errors[key] = issue.message;
    }
    setFormErrors(errors);
    return false;
  }, [form]);

  const submit = useCallback(async (): Promise<{ ok: true; user: User } | { ok: false; error?: string }> => {
    if (!validate()) return { ok: false };
    try {
      // Mantener compatibilidad: usamos thunk actual
      const result = await dispatch(loginUser({ email: form.email, password: form.password })).unwrap();
      return { ok: true, user: result.user as User };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? 'Error' };
    }
  }, [dispatch, form.email, form.password, validate]);

  return {
    form,
    setField,
    formErrors,
    submit,
    isLoading,
    error,
    user,
  };
}


