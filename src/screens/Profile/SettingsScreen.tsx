import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, SPACING } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

const SettingsScreen = ({ navigation }: any) => {
  const { isDarkMode, toggleDarkMode, language, setLanguage, t } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const colors = isDarkMode ? {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textLight: '#B0B0B0',
    border: '#333333',
  } : {
    background: COLORS.background,
    card: COLORS.white,
    text: COLORS.text,
    textLight: COLORS.textLight,
    border: COLORS.border,
  };

  const languageOptions = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            // TODO: Implémenter la suppression du compte
            Alert.alert('Info', 'Fonction en développement');
          },
        },
      ]
    );
  };

  const getCurrentLanguageName = () => {
    const current = languageOptions.find(l => l.code === language);
    return current ? `${current.flag} ${current.name}` : 'Français';
  };

  const settingsSections = [
    {
      title: t('preferences'),
      items: [
        {
          icon: 'moon-outline',
          title: t('darkMode'),
          type: 'switch',
          value: isDarkMode,
          onValueChange: toggleDarkMode,
        },
        {
          icon: 'language-outline',
          title: t('language'),
          type: 'navigation',
          value: getCurrentLanguageName(),
          onPress: () => setShowLanguageModal(true),
        },
      ],
    },
    {
      title: t('privacy'),
      items: [
        {
          icon: 'notifications-outline',
          title: t('notifications'),
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: 'location-outline',
          title: t('locationServices'),
          type: 'switch',
          value: locationServices,
          onValueChange: setLocationServices,
        },
        {
          icon: 'shield-checkmark-outline',
          title: t('privacy'),
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Paramètres de confidentialité'),
        },
      ],
    },
    {
      title: t('security'),
      items: [
        {
          icon: 'lock-closed-outline',
          title: t('changePassword'),
          type: 'navigation',
          onPress: () => navigation.navigate('ChangePassword'),
        },
        {
          icon: 'finger-print-outline',
          title: t('biometricAuth'),
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Fonction bientôt disponible'),
        },
      ],
    },
    {
      title: t('data'),
      items: [
        {
          icon: 'cloud-download-outline',
          title: t('downloadData'),
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Téléchargement des données en cours...'),
        },
        {
          icon: 'trash-outline',
          title: t('clearCache'),
          type: 'navigation',
          onPress: () => Alert.alert('Succès', 'Cache vidé avec succès'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    if (item.type === 'switch') {
      return (
        <View key={index} style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#2A2A2A' : COLORS.background }]}>
              <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
            </View>
            <Text style={[styles.settingText, { color: colors.text }]}>{item.title}</Text>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onValueChange}
            trackColor={{ false: colors.border, true: COLORS.primary }}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={[styles.settingItem, { borderBottomColor: colors.border }]}
        onPress={item.onPress}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#2A2A2A' : COLORS.background }]}>
            <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
          </View>
          <View>
            <Text style={[styles.settingText, { color: colors.text }]}>{item.title}</Text>
            {item.value && (
              <Text style={[styles.settingValue, { color: colors.textLight }]}>{item.value}</Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textLight }]}>{section.title}</Text>
            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              {section.items.map((item, itemIndex) =>
                renderSettingItem(item, itemIndex)
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.dangerButton, { backgroundColor: colors.card }]}
          onPress={handleDeleteAccount}
        >
          <Ionicons name="warning-outline" size={24} color={COLORS.accent} />
          <Text style={styles.dangerButtonText}>{t('deleteAccount')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('language')}</Text>
            {languageOptions.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  { borderColor: colors.border },
                  language === lang.code && styles.languageOptionActive,
                ]}
                onPress={() => {
                  setLanguage(lang.code as any);
                  setShowLanguageModal(false);
                }}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[styles.languageName, { color: colors.text }]}>{lang.name}</Text>
                {language === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    marginLeft: SIZES.padding,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: COLORS.white,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    marginTop: 24,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    gap: 12,
    ...SHADOWS.small,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  version: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 14,
    marginTop: 24,
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  languageOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  languageFlag: {
    fontSize: 28,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
});

export default SettingsScreen;
