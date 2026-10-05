import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, AlarmClock, Download, Globe, Info, Moon, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import { PageHeader, iconButtonClass } from '../components/ui/PageHeader';
import { SettingsSection } from '../components/settings/SettingsSection';
import { SettingsRow } from '../components/settings/SettingsRow';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useTracker } from '../store/tracker';
import { downloadJson } from '../lib/storage';
import type { ReminderMode } from '../types';

const REMINDER_CYCLE: ReminderMode[] = ['Daily', 'Weekdays', 'Off'];

export default function SettingsPage() {
  const navigate = useNavigate();
  const settings = useTracker((s) => s.settings);
  const updateSettings = useTracker((s) => s.updateSettings);
  const resetData = useTracker((s) => s.resetData);
  const loadDemoData = useTracker((s) => s.loadDemoData);
  const [confirmClear, setConfirmClear] = useState(false);
  const [notice, setNotice] = useState('');

  const exportData = () => {
    const { profile, goals, completions, settings: s } = useTracker.getState();
    downloadJson(`habit-tracker-export-${new Date().toISOString().slice(0, 10)}.json`, {
      exportedAt: new Date().toISOString(),
      profile,
      goals,
      completions,
      settings: s,
    });
    setNotice('Data exported.');
  };

  const nextReminder = () =>
    updateSettings({ reminders: REMINDER_CYCLE[(REMINDER_CYCLE.indexOf(settings.reminders) + 1) % REMINDER_CYCLE.length] });

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Settings"
        left={
          <button type="button" aria-label="Go back" onClick={() => navigate(-1)} className={iconButtonClass}>
            <ArrowLeft size={18} />
          </button>
        }
      />

      <SettingsSection title="App Preferences">
        <SettingsRow icon={Moon} label="Theme" value="Dark" />
        <SettingsRow
          icon={Bell}
          label="Notifications"
          toggle={{ checked: settings.notifications, onChange: (v) => updateSettings({ notifications: v }) }}
        />
        <SettingsRow icon={AlarmClock} label="Reminders" value={settings.reminders} onClick={nextReminder} />
        <SettingsRow icon={Globe} label="Language" value={settings.language} />
      </SettingsSection>

      <SettingsSection title="Data & Privacy">
        <SettingsRow icon={Download} label="Export Data" onClick={exportData} />
        <SettingsRow
          icon={Sparkles}
          label="Load Demo Data"
          onClick={() => {
            loadDemoData();
            setNotice('Demo data loaded.');
          }}
        />
        <SettingsRow icon={Trash2} label="Clear All Data" onClick={() => setConfirmClear(true)} />
      </SettingsSection>

      <SettingsSection title="About">
        <SettingsRow icon={Info} label="Version" value="1.0.0" />
        <SettingsRow icon={RotateCcw} label="Storage" value="This device only" />
      </SettingsSection>

      <p role="status" className="mt-4 h-5 text-center text-xs text-accent">
        {notice}
      </p>

      <ConfirmDialog
        open={confirmClear}
        title="Clear all data?"
        message="This permanently deletes your goals, history, and profile from this device. This can’t be undone."
        confirmLabel="Clear Everything"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          resetData();
          setConfirmClear(false);
          setNotice('All data cleared.');
        }}
      />
    </div>
  );
}
