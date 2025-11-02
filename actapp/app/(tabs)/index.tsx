import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useThemeContext } from "../../context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';

// Types
type StatsCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string | number;
  change: number;
  color: string;
};

type ActivityItemProps = {
  title: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const StatsCard = ({ icon, title, value, change, color }: StatsCardProps) => {
  const { theme } = useThemeContext();
  const { colors, spacing, borderRadius } = theme;
  
  return (
    <View style={[styles.statCard, { 
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      flex: 1,
      minWidth: 150,
      marginRight: spacing.sm,
    }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.textPrimary, marginTop: spacing.sm }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={styles.statChange}>
        <Ionicons 
          name={change >= 0 ? 'trending-up' : 'trending-down'} 
          size={14} 
          color={change >= 0 ? '#10B981' : '#EF4444'}
          style={{ marginRight: 4 }}
        />
        <Text style={{ 
          color: change >= 0 ? '#10B981' : '#EF4444',
          fontSize: 12,
          fontWeight: '600',
        }}>
          {Math.abs(change)}% {change >= 0 ? 'up' : 'down'}
        </Text>
      </View>
    </View>
  );
};

const ActivityItem = ({ title, time, icon, color }: ActivityItemProps) => {
  const { theme } = useThemeContext();
  const { colors, spacing } = theme;
  
  return (
    <View style={[styles.activityItem, { 
      backgroundColor: colors.surface,
      borderColor: colors.border,
      marginBottom: spacing.sm,
    }]}>
      <View style={[styles.activityIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.activityTime, { color: colors.textSecondary }]}>{time} ago</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </View>
  );
};

export default function OverviewScreen() {
  const { theme, isDark, toggleTheme } = useThemeContext();
  const { colors, spacing, borderRadius } = theme;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ padding: spacing.md }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.name, { color: colors.textPrimary }]}>John Doe</Text>
        </View>
        <TouchableOpacity 
          style={[styles.avatar, { backgroundColor: colors.primary }]}
          onPress={toggleTheme}
        >
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: spacing.lg }}
        contentContainerStyle={{ paddingBottom: spacing.sm }}
      >
        <StatsCard 
          icon="analytics-outline" 
          title="Total Tasks" 
          value="128" 
          change={12.5} 
          color="#6366F1"
        />
        <StatsCard 
          icon="checkmark-done-outline" 
          title="Completed" 
          value="86" 
          change={8.2} 
          color="#10B981"
        />
        <StatsCard 
          icon="time-outline" 
          title="In Progress" 
          value="24" 
          change={-3.5} 
          color="#F59E0B"
        />
        <StatsCard 
          icon="alert-circle-outline" 
          title="Overdue" 
          value="18" 
          change={5.1} 
          color="#EF4444"
        />
      </ScrollView>

      {/* Recent Activity */}
      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.activitiesList}>
          <ActivityItem 
            title="Project Kickoff Meeting" 
            time="2 hours" 
            icon="people-outline"
            color="#6366F1"
          />
          <ActivityItem 
            title="Design Review" 
            time="5 hours" 
            icon="color-palette-outline"
            color="#8B5CF6"
          />
          <ActivityItem 
            title="Sprint Planning" 
            time="1 day" 
            icon="git-merge-outline"
            color="#10B981"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: spacing.md }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary, marginTop: spacing.xs }]}>
              New Task
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B98115' }]}>
            <Ionicons name="document-text-outline" size={24} color="#10B981" />
            <Text style={[styles.actionText, { color: '#10B981', marginTop: spacing.xs }]}>
              Report
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#8B5CF615' }]}>
            <Ionicons name="settings-outline" size={24} color="#8B5CF6" />
            <Text style={[styles.actionText, { color: '#8B5CF6', marginTop: spacing.xs }]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statTitle: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  activitiesList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});