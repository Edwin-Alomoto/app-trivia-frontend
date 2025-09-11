import { useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { registerUser, verifyEmail } from '../../store/slices/authSlice';
import { registerSchema, RegisterForm } from '../../validators/auth';

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

export function useRegisterViewModel() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    acceptedTerms: false,
    acceptedPrivacy: false,
  });
  const [formErrors, setFormErrors] = useState<RegisterErrors>({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const setField = useCallback(<K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) => {
    setForm((prev: RegisterForm) => ({ ...prev, [key]: value }));
    setFormErrors((prev: RegisterErrors) => ({ ...prev, [key]: '' }));
  }, []);

  const validate = useCallback(() => {
    const parsed = registerSchema.safeParse(form);
    if (parsed.success) {
      setFormErrors({});
      return true;
    }
    const errors: RegisterErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RegisterForm;
      if (!errors[key]) errors[key] = issue.message;
    }
    setFormErrors(errors);
    return false;
  }, [form]);

  const submit = useCallback(async (): Promise<{ ok: true } | { ok: false; error?: string }> => {
    if (!validate()) return { ok: false };
    try {
      await dispatch(registerUser({ email: form.email, password: form.password })).unwrap();
      setShowVerificationModal(true);
      setResendTimer(60);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? 'Error' };
    }
  }, [dispatch, form.email, form.password, validate]);

  const verify = useCallback(async (): Promise<{ ok: true } | { ok: false }> => {
    try {
      setShowVerificationModal(false);
      await dispatch(verifyEmail('mock_verification_token')).unwrap();
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }, [dispatch]);

  const resendVerification = useCallback(() => {
    setResendTimer(60);
  }, []);

  return {
    form,
    setField,
    formErrors,
    isLoading,
    error,
    submit,
    verify,
    showVerificationModal,
    setShowVerificationModal,
    resendTimer,
    setResendTimer,
    resendVerification,
  };
}


