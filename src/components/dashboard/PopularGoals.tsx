import { PopularGoalCard } from './PopularGoalCard';
import { POPULAR_GOALS } from '../../data/popularGoals';
import { useUiStore } from '../../store/ui';

export function PopularGoals() {
  const openGoalModal = useUiStore((s) => s.openGoalModal);
  return (
    <section aria-labelledby="popular-goals" className="mt-8">
      <h2 id="popular-goals" className="mb-4 text-lg font-semibold">
        Most Used Goals
      </h2>
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0">
        {POPULAR_GOALS.map((g) => (
          <PopularGoalCard key={g.id} goal={g} onSelect={(goal) => openGoalModal(goal.prefill)} />
        ))}
      </div>
    </section>
  );
}
