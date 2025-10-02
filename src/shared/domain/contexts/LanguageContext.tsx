import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traducciones
const translations = {
  es: {
    // Navegación
    'nav.home': 'Inicio',
    'nav.profile': 'Perfil',
    'nav.trivia': 'Trivia',
    'nav.rewards': 'Premios',
    'nav.raffles': 'Sorteos',
    
    // Autenticación
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.backToLogin': 'Volver al login',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar contraseña',
    'auth.firstName': 'Nombre',
    'auth.lastName': 'Apellido',
    'auth.birthdate': 'Fecha de nacimiento',
    'auth.gender': 'Género',
    'auth.username': 'Nombre de usuario',
    'auth.phone': 'Teléfono',
    'auth.address': 'Dirección',
    'auth.rememberMe': 'Recordarme',
    'auth.dontHaveAccount': '¿No tienes cuenta?',
    'auth.alreadyHaveAccount': '¿Ya tienes cuenta?',
    'auth.createAccount': 'Crear cuenta',
    'auth.loginButton': 'Iniciar Sesión',
    'auth.registerButton': 'Registrarse',
    'auth.sendResetEmail': 'Enviar correo de recuperación',
    'auth.resetPassword': 'Restablecer contraseña',
    'auth.resetEmailSent': 'Hemos enviado un correo de recuperación',
    'auth.resetEmailInstructions': 'Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña',
    'auth.rememberPassword': '¿Recordaste tu contraseña?',
    
    // Errores de autenticación
    'auth.error.invalidCredentials': 'Credenciales incorrectas',
    'auth.error.emailRequired': 'El correo electrónico es requerido',
    'auth.error.passwordRequired': 'La contraseña es requerida',
    'auth.error.invalidEmail': 'Correo electrónico inválido',
    'auth.error.passwordTooShort': 'La contraseña debe tener al menos 6 caracteres',
    'auth.error.passwordsDoNotMatch': 'Las contraseñas no coinciden',
    'auth.error.registrationFailed': 'No pudimos crear tu cuenta. Inténtalo nuevamente',
    'auth.error.resetEmailFailed': 'No se pudo enviar el correo de recuperación. Inténtalo nuevamente',
    'auth.error.firstNameRequired': 'El nombre es requerido',
    'auth.error.lastNameRequired': 'El apellido es requerido',
    'auth.error.usernameRequired': 'El nombre de usuario es requerido',
    
    // Configuración
    'settings.title': 'Configuración',
    'settings.subtitle': 'Ajustes de la app',
    'settings.notifications': 'Notificaciones',
    'settings.preferences': 'Preferencias',
    'settings.account': 'Cuenta',
    'settings.information': 'Información',
    
    // Items de configuración
    'settings.notifications.push': 'Notificaciones Push',
    'settings.notifications.subtitle': 'Recibe notificaciones de nuevos sorteos y premios',
    'settings.sound': 'Efectos de Sonido',
    'settings.sound.subtitle': 'Reproducir sonidos en la aplicación',
    'settings.haptics': 'Vibración',
    'settings.haptics.subtitle': 'Vibración al tocar botones',
    'settings.language': 'Idioma',
    'settings.language.subtitle': 'Seleccionar idioma de la aplicación',
    'settings.editProfile': 'Editar Perfil',
    'settings.editProfile.subtitle': 'Cambiar información personal',
    'settings.changePassword': 'Cambiar Contraseña',
    'settings.changePassword.subtitle': 'Actualizar contraseña de seguridad',
    'settings.privacy': 'Privacidad',
    'settings.privacy.subtitle': 'Configurar privacidad de datos',
    'settings.about': 'Acerca de',
    'settings.about.subtitle': 'Información de la aplicación',
    'settings.terms': 'Términos y Condiciones',
    'settings.terms.subtitle': 'Leer términos de uso',
    'settings.privacyPolicy': 'Política de Privacidad',
    'settings.privacyPolicy.subtitle': 'Leer política de privacidad',
    
    // Modal de idioma
    'language.title': 'Seleccionar Idioma',
    'language.spanish': 'Español',
    'language.english': 'English',
    'language.cancel': 'Cancelar',
    
    // Botones
    'button.deleteAccount': 'Eliminar Cuenta',
    'button.save': 'Guardar',
    'button.cancel': 'Cancelar',
    'button.confirm': 'Confirmar',
    
    // Home
    'home.welcome': '¡Bienvenido a WinUp!',
    'home.subtitle': 'Acumula puntos y gana premios',
    'home.points': 'Mis puntos acumulados',
    'home.whatToDo': '¿Qué te gustaría hacer ahora?',
    'home.playTrivia': 'Jugar Trivia',
    'home.playTriviaSubtitle': 'Responde preguntas y gana puntos',
    'home.raffles': 'Sorteos',
    'home.rafflesSubtitle': 'Participa en sorteos y gana premios',
    'home.rewards': 'Premios',
    'home.rewardsSubtitle': 'Canjea tus puntos por premios',
    'home.surveys': 'Encuestas',
    'home.surveysSubtitle': 'Completa encuestas y gana puntos',
    'home.activeUsers': 'Usuarios Activos',
    'home.activeUsersSubtitle': 'Únete a nuestra comunidad',
    'home.testimonials': 'Testimonios',
    'home.testimonialsSubtitle': 'Lo que dicen nuestros usuarios',
    
    // Mensajes
    'message.comingSoon': 'Función próximamente',
    'message.accountDeleted': 'Tu cuenta ha sido eliminada exitosamente',
    'message.deleteConfirm': '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es permanente y no se puede deshacer.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.profile': 'Profile',
    'nav.trivia': 'Trivia',
    'nav.rewards': 'Rewards',
    'nav.raffles': 'Raffles',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.forgotPassword': 'Forgot your password?',
    'auth.backToLogin': 'Back to login',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm password',
    'auth.firstName': 'First name',
    'auth.lastName': 'Last name',
    'auth.birthdate': 'Birthdate',
    'auth.gender': 'Gender',
    'auth.username': 'Username',
    'auth.phone': 'Phone',
    'auth.address': 'Address',
    'auth.rememberMe': 'Remember me',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.createAccount': 'Create account',
    'auth.loginButton': 'Login',
    'auth.registerButton': 'Register',
    'auth.sendResetEmail': 'Send recovery email',
    'auth.resetPassword': 'Reset password',
    'auth.resetEmailSent': 'We have sent a recovery email',
    'auth.resetEmailInstructions': 'Check your inbox and follow the instructions to reset your password',
    'auth.rememberPassword': 'Remember your password?',
    
    // Authentication errors
    'auth.error.invalidCredentials': 'Invalid credentials',
    'auth.error.emailRequired': 'Email is required',
    'auth.error.passwordRequired': 'Password is required',
    'auth.error.invalidEmail': 'Invalid email',
    'auth.error.passwordTooShort': 'Password must be at least 6 characters',
    'auth.error.passwordsDoNotMatch': 'Passwords do not match',
    'auth.error.registrationFailed': 'We could not create your account. Try again',
    'auth.error.resetEmailFailed': 'Could not send recovery email. Try again',
    'auth.error.firstNameRequired': 'First name is required',
    'auth.error.lastNameRequired': 'Last name is required',
    'auth.error.usernameRequired': 'Username is required',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'App settings',
    'settings.notifications': 'Notifications',
    'settings.preferences': 'Preferences',
    'settings.account': 'Account',
    'settings.information': 'Information',
    
    // Settings items
    'settings.notifications.push': 'Push Notifications',
    'settings.notifications.subtitle': 'Receive notifications about new raffles and prizes',
    'settings.sound': 'Sound Effects',
    'settings.sound.subtitle': 'Play sounds in the app',
    'settings.haptics': 'Vibration',
    'settings.haptics.subtitle': 'Vibration when touching buttons',
    'settings.language': 'Language',
    'settings.language.subtitle': 'Select app language',
    'settings.editProfile': 'Edit Profile',
    'settings.editProfile.subtitle': 'Change personal information',
    'settings.changePassword': 'Change Password',
    'settings.changePassword.subtitle': 'Update security password',
    'settings.privacy': 'Privacy',
    'settings.privacy.subtitle': 'Configure data privacy',
    'settings.about': 'About',
    'settings.about.subtitle': 'App information',
    'settings.terms': 'Terms and Conditions',
    'settings.terms.subtitle': 'Read terms of use',
    'settings.privacyPolicy': 'Privacy Policy',
    'settings.privacyPolicy.subtitle': 'Read privacy policy',
    
    // Language modal
    'language.title': 'Select Language',
    'language.spanish': 'Español',
    'language.english': 'English',
    'language.cancel': 'Cancel',
    
    // Buttons
    'button.deleteAccount': 'Delete Account',
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.confirm': 'Confirm',
    
    // Home
    'home.welcome': 'Welcome to WinUp!',
    'home.subtitle': 'Accumulate points and win prizes',
    'home.points': 'My accumulated points',
    'home.whatToDo': 'What would you like to do now?',
    'home.playTrivia': 'Play Trivia',
    'home.playTriviaSubtitle': 'Answer questions and earn points',
    'home.raffles': 'Raffles',
    'home.rafflesSubtitle': 'Participate in raffles and win prizes',
    'home.rewards': 'Rewards',
    'home.rewardsSubtitle': 'Redeem your points for rewards',
    'home.surveys': 'Surveys',
    'home.surveysSubtitle': 'Complete surveys and earn points',
    'home.activeUsers': 'Active Users',
    'home.activeUsersSubtitle': 'Join our community',
    'home.testimonials': 'Testimonials',
    'home.testimonialsSubtitle': 'What our users say',
    
    // Messages
    'message.comingSoon': 'Feature coming soon',
    'message.accountDeleted': 'Your account has been successfully deleted',
    'message.deleteConfirm': 'Are you sure you want to delete your account? This action is permanent and cannot be undone.',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('app_language');
      if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
        setLanguageState(savedLang as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      await AsyncStorage.setItem('app_language', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
