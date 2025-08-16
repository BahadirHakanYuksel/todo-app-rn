import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { useTodos } from '@/contexts/TodoContext';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import CategoryPill from '@/components/todo/CategoryPill';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, getTodoStats } = useTodos();
  
  if (state.loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={50} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading analytics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const stats = getTodoStats();
  const completionPercentage = Math.round(stats.completionRate);

  const renderStatsCard = (title: string, value: string | number, icon: string, gradient: string[], delay: number) => (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(600)}
      style={styles.statsCard}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsCardGradient}
      >
        <View style={styles.statsCardContent}>
          <View style={styles.statsCardIcon}>
            <IconSymbol name={icon} size={24} color="#ffffff" />
          </View>
          <Text style={styles.statsCardTitle}>{title}</Text>
          <Text style={styles.statsCardValue}>{value}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderProgressRing = () => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

    return (
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        style={styles.progressContainer}
      >
        <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.progressTitle, { color: colors.text }]}>Overall Progress</Text>
          <View style={styles.progressRing}>
            <Text style={[styles.progressPercentage, { color: colors.primary }]}>
              {completionPercentage}%
            </Text>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Complete</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderCategoryBreakdown = () => (
    <Animated.View
      entering={FadeInDown.delay(400).duration(600)}
      style={[styles.categoryCard, { backgroundColor: colors.surface }]}
    >
      <Text style={[styles.cardTitle, { color: colors.text }]}>Category Breakdown</Text>
      {Object.entries(stats.categoryStats).map(([category, data], index) => {
        if (data.total === 0) return null;
        const progress = data.total > 0 ? (data.completed / data.total) * 100 : 0;
        
        return (
          <View key={category} style={styles.categoryRow}>
            <View style={styles.categoryInfo}>
              <CategoryPill 
                category={category as any} 
                size="small" 
                showIcon={true} 
              />
              <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                {data.completed}/{data.total}
              </Text>
            </View>
            <View style={styles.categoryProgress}>
              <View style={[styles.categoryProgressBar, { backgroundColor: colors.borderLight }]}>
                <View 
                  style={[
                    styles.categoryProgressFill,
                    { 
                      width: `${progress}%`,
                      backgroundColor: colors.categories[category as any],
                    }
                  ]}
                />
              </View>
              <Text style={[styles.categoryPercentage, { color: colors.textSecondary }]}>
                {Math.round(progress)}%
              </Text>
            </View>
          </View>
        );
      })}
    </Animated.View>
  );

  const renderPriorityBreakdown = () => (
    <Animated.View
      entering={FadeInDown.delay(600).duration(600)}
      style={[styles.priorityCard, { backgroundColor: colors.surface }]}
    >
      <Text style={[styles.cardTitle, { color: colors.text }]}>Priority Distribution</Text>
      {Object.entries(stats.priorityStats).map(([priority, data]) => {
        if (data.total === 0) return null;
        const progress = data.total > 0 ? (data.completed / data.total) * 100 : 0;
        
        return (
          <View key={priority} style={styles.priorityRow}>
            <View style={styles.priorityInfo}>
              <View style={[
                styles.priorityIndicator,
                { backgroundColor: colors.priority[priority as any] }
              ]} />
              <Text style={[styles.priorityLabel, { color: colors.text }]}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </View>
            <View style={styles.priorityStats}>
              <Text style={[styles.priorityCount, { color: colors.textSecondary }]}>
                {data.completed}/{data.total}
              </Text>
              <Text style={[styles.priorityPercentage, { color: colors.textSecondary }]}>
                {Math.round(progress)}%
              </Text>
            </View>
          </View>
        );
      })}
    </Animated.View>
  );

  const renderWeeklyProgress = () => (
    <Animated.View
      entering={FadeInDown.delay(800).duration(600)}
      style={[styles.weeklyCard, { backgroundColor: colors.surface }]}
    >
      <Text style={[styles.cardTitle, { color: colors.text }]}>Weekly Progress</Text>
      <View style={styles.weeklyChart}>
        {stats.weeklyProgress.map((week, index) => {
          const maxValue = Math.max(...stats.weeklyProgress.map(w => Math.max(w.completed, w.created)));
          const completedHeight = maxValue > 0 ? (week.completed / maxValue) * 80 : 0;
          const createdHeight = maxValue > 0 ? (week.created / maxValue) * 80 : 0;
          
          return (
            <View key={index} style={styles.weeklyBar}>
              <View style={styles.weeklyBars}>
                <View 
                  style={[
                    styles.weeklyBarCreated,
                    { 
                      height: createdHeight,
                      backgroundColor: colors.textMuted + '40',
                    }
                  ]}
                />
                <View 
                  style={[
                    styles.weeklyBarCompleted,
                    { 
                      height: completedHeight,
                      backgroundColor: colors.primary,
                    }
                  ]}
                />
              </View>
              <Text style={[styles.weeklyLabel, { color: colors.textSecondary }]}>
                {week.week}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.weeklyLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.textMuted + '40' }]} />
          <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>Created</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>Completed</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={Gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Animated.View entering={FadeInUp.duration(600)} style={styles.headerContent}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Track your productivity</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          {renderStatsCard(
            'Total Tasks', 
            stats.total, 
            'list.bullet', 
            Gradients.primary,
            0
          )}
          {renderStatsCard(
            'Completed', 
            stats.completed, 
            'checkmark.circle.fill', 
            Gradients.success,
            100
          )}
          {renderStatsCard(
            'Pending', 
            stats.pending, 
            'clock.fill', 
            Gradients.warning,
            200
          )}
          {renderStatsCard(
            'Overdue', 
            stats.overdue, 
            'exclamationmark.triangle.fill', 
            Gradients.error,
            300
          )}
        </View>

        {/* Progress Ring */}
        {renderProgressRing()}

        {/* Category Breakdown */}
        {renderCategoryBreakdown()}

        {/* Priority Distribution */}
        {renderPriorityBreakdown()}

        {/* Weekly Progress */}
        {renderWeeklyProgress()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    width: (width - 50) / 2,
    marginBottom: 16,
  },
  statsCardGradient: {
    borderRadius: 16,
    ...Shadows.medium,
  },
  statsCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  statsCardIcon: {
    marginBottom: 8,
  },
  statsCardTitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 4,
    textAlign: 'center',
  },
  statsCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    ...Shadows.small,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  progressRing: {
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...Shadows.small,
  },
  priorityCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...Shadows.small,
  },
  weeklyCard: {
    borderRadius: 16,
    padding: 20,
    ...Shadows.small,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryCount: {
    fontSize: 12,
    marginLeft: 12,
    fontWeight: '500',
  },
  categoryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  categoryProgressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'right',
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priorityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  priorityStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityCount: {
    fontSize: 14,
    marginRight: 16,
    fontWeight: '500',
  },
  priorityPercentage: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'right',
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  weeklyBar: {
    alignItems: 'center',
  },
  weeklyBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  weeklyBarCreated: {
    width: 12,
    borderRadius: 6,
    marginRight: 2,
  },
  weeklyBarCompleted: {
    width: 12,
    borderRadius: 6,
  },
  weeklyLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  weeklyLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
