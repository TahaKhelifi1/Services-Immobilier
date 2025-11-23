import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'fr' | 'en' | 'es';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useTheme = () => useContext(ThemeContext);

// Traductions
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    home: 'Accueil',
    search: 'Recherche',
    publish: 'Publier',
    favorites: 'Favoris',
    profile: 'Profil',
    
    // Settings
    settings: 'Paramètres',
    preferences: 'Préférences',
    darkMode: 'Mode sombre',
    language: 'Langue',
    privacy: 'Confidentialité',
    notifications: 'Notifications',
    locationServices: 'Services de localisation',
    security: 'Sécurité',
    changePassword: 'Changer le mot de passe',
    biometricAuth: 'Authentification biométrique',
    data: 'Données',
    downloadData: 'Télécharger mes données',
    clearCache: 'Vider le cache',
    deleteAccount: 'Supprimer mon compte',
    
    // Change Password
    oldPassword: 'Ancien mot de passe',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    updatePassword: 'Mettre à jour',
    passwordUpdated: 'Mot de passe mis à jour',
    passwordError: 'Erreur lors de la mise à jour',
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
    incorrectPassword: 'Mot de passe incorrect',
    
    // Common
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Enregistrer',
    back: 'Retour',
  },
  en: {
    // Navigation
    home: 'Home',
    search: 'Search',
    publish: 'Publish',
    favorites: 'Favorites',
    profile: 'Profile',
    
    // Settings
    settings: 'Settings',
    preferences: 'Preferences',
    darkMode: 'Dark Mode',
    language: 'Language',
    privacy: 'Privacy',
    notifications: 'Notifications',
    locationServices: 'Location Services',
    security: 'Security',
    changePassword: 'Change Password',
    biometricAuth: 'Biometric Authentication',
    data: 'Data',
    downloadData: 'Download My Data',
    clearCache: 'Clear Cache',
    deleteAccount: 'Delete My Account',
    
    // Change Password
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    updatePassword: 'Update',
    passwordUpdated: 'Password Updated',
    passwordError: 'Error updating password',
    passwordsDoNotMatch: 'Passwords do not match',
    incorrectPassword: 'Incorrect password',
    
    // Common
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    back: 'Back',
  },
  es: {
    // Navigation
    home: 'Inicio',
    search: 'Buscar',
    publish: 'Publicar',
    favorites: 'Favoritos',
    profile: 'Perfil',
    
    // Settings
    settings: 'Configuración',
    preferences: 'Preferencias',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    privacy: 'Privacidad',
    notifications: 'Notificaciones',
    locationServices: 'Servicios de Ubicación',
    security: 'Seguridad',
    changePassword: 'Cambiar Contraseña',
    biometricAuth: 'Autenticación Biométrica',
    data: 'Datos',
    downloadData: 'Descargar Mis Datos',
    clearCache: 'Limpiar Caché',
    deleteAccount: 'Eliminar Mi Cuenta',
    
    // Change Password
    oldPassword: 'Contraseña Antigua',
    newPassword: 'Nueva Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    updatePassword: 'Actualizar',
    passwordUpdated: 'Contraseña Actualizada',
    passwordError: 'Error al actualizar',
    passwordsDoNotMatch: 'Las contraseñas no coinciden',
    incorrectPassword: 'Contraseña incorrecta',
    
    // Common
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    back: 'Volver',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const darkMode = await AsyncStorage.getItem('darkMode');
      const lang = await AsyncStorage.getItem('language');
      
      if (darkMode !== null) {
        setIsDarkMode(darkMode === 'true');
      }
      if (lang !== null) {
        setLanguageState(lang as Language);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    try {
      await AsyncStorage.setItem('darkMode', newValue.toString());
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    language,
    setLanguage,
    t,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
