import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../context/ThemeContext';

type HeaderProps = {
  title?: string;
  subtitle?: string;
  showThemeToggle?: boolean;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
};

export const Header = ({
  title = 'Welcome back,',
  subtitle = 'John Doe',
  showThemeToggle = true,
  rightAction,
}: HeaderProps) => {
  const { theme, isDark, toggleTheme } = useThemeContext();
  const { colors } = theme;

  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>{title}</Text>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{subtitle}</Text>
      </View>
      
      <View style={styles.actions}>
        {rightAction && (
          <TouchableOpacity 
            style={[styles.actionButton, { marginRight: 12 }]}
            onPress={rightAction.onPress}
          >
            <Ionicons 
              name={rightAction.icon} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        )}
        
        {showThemeToggle && (
          <TouchableOpacity 
            style={[styles.avatar, { backgroundColor: colors.primary }]}
            onPress={toggleTheme}
          >
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
