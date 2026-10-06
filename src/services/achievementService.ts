import { UserProfile } from '../types';
import { ACHIEVEMENTS } from './achievementDefinitions';
import type { Achievement } from '../types';

export const achievementService = {
  calculateLevel(xp: number): number {
    // Level 1: 0-99, Level 2: 100-249
    let level = 1;
    let required = 100;
    let currentXp = xp;
    while (currentXp >= required) {
      currentXp -= required;
      level++;
      required = 100 + (level - 1) * 50;
    }
    return level;
  },

  checkAchievements(
    profile: UserProfile,
    stats: {
      totalCompleted: number;
      streak: number;
      perfectWeeks: number;
      strongWeeks: number;
      consistentWeeks: number;
      activeDays: number;
      activeGoals30Days: number;
      morningGoals: number;
      specificGoalCounts: Record<string, number>;
      specificCategoryCounts: Record<string, number>;
    }
  ): { unlocked: Achievement[], updatedProfile: UserProfile } {
    const unlocked: Achievement[] = [];
    const unlockedIds = new Set(profile.achievementsUnlocked || []);
    let newXp = profile.xp || 0;
    
    for (const achievement of ACHIEVEMENTS) {
      if (unlockedIds.has(achievement.id)) continue;
      
      let isMet = false;
      switch (achievement.requirement.type) {
        case 'total_completed':
          isMet = stats.totalCompleted >= (achievement.requirement.value || 0);
          break;
        case 'streak':
          isMet = stats.streak >= (achievement.requirement.value || 0);
          break;
        case 'perfect_weeks':
          isMet = stats.perfectWeeks >= (achievement.requirement.value || 0);
          break;
        case 'strong_weeks':
          isMet = stats.strongWeeks >= (achievement.requirement.value || 0);
          break;
        case 'consistent_weeks':
          isMet = stats.consistentWeeks >= (achievement.requirement.value || 0);
          break;
        case 'active_days':
          isMet = stats.activeDays >= (achievement.requirement.value || 0);
          break;
        case 'active_goals_30_days':
          isMet = stats.activeGoals30Days >= (achievement.requirement.value || 0);
          break;
        case 'morning_goals':
          isMet = stats.morningGoals >= (achievement.requirement.value || 0);
          break;
        case 'specific_goal':
          isMet = (stats.specificGoalCounts[achievement.requirement.title || ''] || 0) >= (achievement.requirement.value || 0);
          break;
        case 'specific_goal_category':
          isMet = (stats.specificCategoryCounts[achievement.requirement.category || ''] || 0) >= (achievement.requirement.value || 0);
          break;
      }

      if (isMet) {
        unlocked.push({ ...achievement, unlocked: true, unlockedAt: new Date().toISOString() });
        unlockedIds.add(achievement.id);
        newXp += achievement.xpReward;
      }
    }

    let newLevel = this.calculateLevel(newXp);

    return {
      unlocked,
      updatedProfile: {
        ...profile,
        xp: newXp,
        level: newLevel,
        streak: stats.streak,
        longestStreak: Math.max(profile.longestStreak || 0, stats.streak),
        achievementsUnlocked: Array.from(unlockedIds)
      }
    };
  },

  awardXP(profile: UserProfile, amount: number): UserProfile {
    const newXp = (profile.xp || 0) + amount;
    return {
      ...profile,
      xp: newXp,
      level: this.calculateLevel(newXp)
    };
  }
};
