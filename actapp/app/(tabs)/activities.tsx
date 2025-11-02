import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/context/ThemeContext";
import { Header } from "@/components/Header";

interface Activity {
  id: string;
  type: "file" | "meeting" | "message" | "update" | "reminder" | "document";
  title: string;
  description: string;
  time: string;
  user: {
    name: string;
    avatar: string;
  };
  category: string;
  isNew?: boolean;
}

// Category filter types
type Category = {
  id: string;
  name: string;
  count: number;
  icon: string;
};

// Activity item component
const ActivityItem = ({
  item,
  textTertiary,
}: {
  item: Activity;
  textTertiary: string;
}) => {
  const { theme } = useThemeContext();
  const { colors } = theme;

  const getIcon = () => {
    switch (item.type) {
      case "file":
        return "document-text-outline";
      case "meeting":
        return "people-outline";
      case "message":
        return "chatbubble-ellipses-outline";
      case "update":
        return "refresh-outline";
      case "reminder":
        return "alarm-outline";
      case "document":
        return "document-outline";
      default:
        return "document-outline";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "design":
        return "#6366F1"; // Indigo
      case "development":
        return "#10B981"; // Emerald
      case "marketing":
        return "#F59E0B"; // Amber
      case "meeting":
        return "#3B82F6"; // Blue
      default:
        return colors.primary;
    }
  };

  return (
    <View style={[styles.activityItem, { borderBottomColor: colors.border }]}>
      <View
        style={[
          styles.activityIcon,
          { backgroundColor: `${getCategoryColor(item.category)}15` },
        ]}
      >
        <Ionicons
          name={getIcon()}
          size={20}
          color={getCategoryColor(item.category)}
        />
      </View>
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text
            style={[styles.activityTitle, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New</Text>
            </View>
          )}
        </View>
        <Text
          style={[styles.activityDescription, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {item.description}
        </Text>
        <View style={styles.activityMeta}>
          <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
            {item.time} • {item.user.name} • {item.category}
          </Text>
        </View>
      </View>
      <Ionicons name="ellipsis-vertical" size={18} color={textTertiary} />
    </View>
  );
};

// Categories data
const categories: Category[] = [
  { id: "all", name: "All Activity", count: 42, icon: "grid-outline" },
  { id: "mentions", name: "Mentions", count: 12, icon: "at-outline" },
  { id: "assigned", name: "Assigned", count: 8, icon: "person-outline" },
  { id: "following", name: "Following", count: 5, icon: "eye-outline" },
  { id: "archived", name: "Archived", count: 0, icon: "archive-outline" },
];

// Mock activities data
const activities: Activity[] = [
  {
    id: "1",
    type: "file",
    title: "Documentation.pdf",
    description: "Updated the API documentation with new endpoints",
    time: "2 hours ago",
    user: { name: "John Doe", avatar: "JD" },
    category: "Development",
    isNew: true,
  },
  {
    id: "2",
    type: "meeting",
    title: "Weekly Sync",
    description: "Discuss project timeline and deliverables",
    time: "5 hours ago",
    user: { name: "Jane Smith", avatar: "JS" },
    category: "Meeting",
    isNew: true,
  },
  {
    id: "3",
    type: "message",
    title: "New Comment",
    description: 'Sarah: "Can we review the latest design mockups?"',
    time: "1 day ago",
    user: { name: "Alex Johnson", avatar: "AJ" },
    category: "Design",
  },
  {
    id: "4",
    type: "update",
    title: "Status Update",
    description: "Project milestone 2 completed",
    time: "2 days ago",
    user: { name: "Sarah Wilson", avatar: "SW" },
    category: "Update",
  },
  {
    id: "5",
    type: "reminder",
    title: "Deadline Reminder",
    description: "Submit project proposal by EOD",
    time: "3 days ago",
    user: { name: "System", avatar: "S" },
    category: "Reminder",
  },
];

export default function ActivitiesScreen() {
  const { theme } = useThemeContext();
  const { colors, spacing } = theme;
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = activities.filter((activity) => {
    const matchesCategory =
      selectedCategory === "all" ||
      activity.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Fallback colors if not defined in theme
  const textTertiary = colors.textSecondary || "#9CA3AF";
  const cardColor = colors.surface || "#FFFFFF";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Recent updates" showThemeToggle={true} />
      <View style={[styles.searchContainer, { backgroundColor: cardColor }]}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search activity..."
          placeholderTextColor={textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={18} color={textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && [
                styles.categoryButtonActive,
                { backgroundColor: colors.primary },
              ],
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={16}
              color={
                selectedCategory === category.id
                  ? "white"
                  : colors.textSecondary
              }
              style={styles.categoryIcon}
            />
            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    selectedCategory === category.id
                      ? "white"
                      : colors.textSecondary,
                },
              ]}
            >
              {category.name}
            </Text>
            {category.count > 0 && (
              <View
                style={[
                  styles.categoryBadge,
                  selectedCategory === category.id
                    ? { backgroundColor: "rgba(255, 255, 255, 0.2)" }
                    : { backgroundColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.categoryBadgeText,
                    {
                      color:
                        selectedCategory === category.id
                          ? "white"
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {category.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Activity List */}
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityItem item={item} textTertiary={textTertiary} />
        )}
        style={styles.activityList}
        contentContainerStyle={styles.activityListContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color={textTertiary}
            />
            <Text
              style={[styles.emptyStateText, { color: colors.textSecondary }]}
            >
              No activities found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    height: 48, // Fixed height to match the category buttons
    marginBottom: 8,
  },
  categoriesContent: {
    paddingRight: 16,
    alignItems: 'center',
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    height:40
  },
  categoryButtonActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryBadge: {
    marginLeft: 6,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activityList: {
    flex: 1,
  },
  activityListContent: {
    paddingBottom: 24,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
    marginRight: 12,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 8,
  },
  activityDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.8,
  },
  newBadge: {
    backgroundColor: "#F43F5E",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
});
