import { useState } from 'react';
import { addMonths } from 'date-fns';
import { CalendarDays, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader, iconButtonClass } from '../components/ui/PageHeader';
import { Segmented } from '../components/ui/Segmented';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { WeeklyOverview } from '../components/history/WeeklyOverview';
import { MonthlyOverview } from '../components/history/MonthlyOverview';
import { StreakCard } from '../components/history/StreakCard';
import { GoalPerformance } from '../components/history/GoalPerformance';
import { DailyHistory } from '../components/history/DailyHistory';
import { useTracker } from '../store/tracker';
import { fmt, fromKey, monthDays, shiftKey, toKey, todayKey, weekDays } from '../lib/dates';

type View = 'weekly' | 'monthly';

export default function HistoryPage() {
  const [view, setView] = useState<View>('weekly');
  const { goals, selectedDate, selectedMonth, selectedWeek, setSelectedDate, setSelectedMonth, setSelectedWeek } = useTracker();

  const header = (
    <PageHeader
      title="History"
      right={
        <button type="button" aria-label="Jump to today" onClick={() => setSelectedDate(todayKey())} className={iconButtonClass}>
          <CalendarDays size={18} />
        </button>
      }
    />
  );

  if (goals.length === 0) {
    return (
      <>
        {header}
        <EmptyState
          icon={History}
          title="No history yet"
          description="Create a goal and check it off. Your progress will show up here."
          action={
            <Link to="/dashboard">
              <Button size="sm">Go to Dashboard</Button>
            </Link>
          }
        />
      </>
    );
  }

  const dates = view === 'weekly' ? weekDays(selectedWeek) : monthDays(selectedMonth);

  return (
    <>
      {header}
      <div className="mb-4">
        <Segmented
          ariaLabel="History range"
          value={view}
          onChange={setView}
          options={[
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          {view === 'weekly' ? (
            <WeeklyOverview
              week={selectedWeek}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              onWeekChange={(d) => setSelectedWeek(shiftKey(selectedWeek, d * 7))}
            />
          ) : (
            <MonthlyOverview
              month={selectedMonth}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              onMonthChange={(d) => setSelectedMonth(toKey(addMonths(fromKey(selectedMonth), d)))}
            />
          )}
          <StreakCard />
        </div>
        <div className="space-y-4">
          <GoalPerformance
            title="Goal Performance"
            caption={view === 'weekly' ? `Week of ${fmt(dates[0], 'MMM d')}` : fmt(selectedMonth, 'MMMM yyyy')}
            dates={dates}
          />
          <DailyHistory date={selectedDate} />
        </div>
      </div>
    </>
  );
}
