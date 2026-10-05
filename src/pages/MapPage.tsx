import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader, iconButtonClass } from '../components/ui/PageHeader';
import { Segmented } from '../components/ui/Segmented';
import { MonthCalendar } from '../components/calendar/MonthCalendar';
import { WeekCalendar } from '../components/calendar/WeekCalendar';
import { DayGoals } from '../components/calendar/DayGoals';
import { GoalPerformance } from '../components/history/GoalPerformance';
import { useTracker } from '../store/tracker';
import { fmt, shiftKey, weekDays } from '../lib/dates';
import { addMonths } from 'date-fns';
import { fromKey, toKey } from '../lib/dates';

type View = 'week' | 'month';

export default function MapPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('month');
  const { selectedDate, selectedMonth, selectedWeek, setSelectedDate, setSelectedMonth, setSelectedWeek } = useTracker();

  return (
    <>
      <PageHeader
        title="Map"
        left={
          <button type="button" aria-label="Back to dashboard" onClick={() => navigate('/dashboard')} className={iconButtonClass}>
            <ArrowLeft size={18} />
          </button>
        }
        right={
          <Segmented
            ariaLabel="Calendar view"
            value={view}
            onChange={setView}
            options={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
            ]}
          />
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {view === 'month' ? (
          <MonthCalendar
            month={selectedMonth}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            onMonthChange={(d) => setSelectedMonth(toKey(addMonths(fromKey(selectedMonth), d)))}
          />
        ) : (
          <WeekCalendar
            week={selectedWeek}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            onWeekChange={(d) => setSelectedWeek(shiftKey(selectedWeek, d * 7))}
          />
        )}
        <div className="space-y-4">
          <DayGoals date={selectedDate} />
          <GoalPerformance
            title={view === 'week' ? 'This Week' : 'Goals this week'}
            caption={`Week of ${fmt(weekDays(selectedWeek)[0], 'MMM d')}`}
            dates={weekDays(selectedWeek)}
          />
        </div>
      </div>
    </>
  );
}
