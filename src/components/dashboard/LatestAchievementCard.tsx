import { useTracker } from '../../store/tracker';
import { ACHIEVEMENTS } from '../../services/achievementDefinitions';
import { AchievementCard } from '../achievements/AchievementCard';

export function LatestAchievementCard() {
  const profile = useTracker((s) => s.profile);
  const unlockedIds = profile.achievementsUnlocked || [];

  if (unlockedIds.length === 0) return null;

  const latestId = unlockedIds[unlockedIds.length - 1];
  const achievement = ACHIEVEMENTS.find(a => a.id === latestId);

  if (!achievement) return null;

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-bold text-text">Latest Achievement</h3>
      <AchievementCard 
        achievement={{ ...achievement, unlockedAt: profile.updatedAt }} 
        isUnlocked={true} 
      />
    </div>
  );
}
