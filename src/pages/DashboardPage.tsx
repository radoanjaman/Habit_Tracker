import { GreetingHeader } from '../components/dashboard/GreetingHeader';
import { MainGoalCard } from '../components/dashboard/MainGoalCard';
import { WeeklyGoalCard } from '../components/dashboard/WeeklyGoalCard';
import { PopularGoals } from '../components/dashboard/PopularGoals';

export default function DashboardPage() {
  return (
    <>
      <GreetingHeader />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <MainGoalCard />
        <WeeklyGoalCard />
      </div>
      <PopularGoals />
    </>
  );
}
