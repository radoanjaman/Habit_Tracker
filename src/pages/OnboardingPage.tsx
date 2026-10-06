import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracker } from '../store/tracker';
import { Button } from '../components/ui/Button';
import { inputClass } from '../lib/cn';
import type { UserProfile } from '../types';
import { Check } from 'lucide-react';

const GOALS = [
  'Get healthier',
  'Lose weight',
  'Gain weight',
  'Build muscle',
  'Improve fitness',
  'Sleep better',
  'Study consistently',
  'Build better habits',
  'Improve productivity',
  'Reduce screen time',
  'Other',
];

const HABITS = [
  'Eat & drink healthy',
  'Drink more water',
  'Workout regularly',
  'Walk 8,000 steps',
  'Sleep 8 hours',
  'Read every day',
  'Study consistently',
  'Meditate',
  'Limit screen time',
  'Wake up early',
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const profile = useTracker((s) => s.profile);
  const updateProfile = useTracker((s) => s.updateProfile);
  const addGoal = useTracker((s) => s.addGoal);
  const clearGoals = useTracker((s) => s.clearGoals);

  // Edge case: if somehow user arrives here while already onboarded
  useEffect(() => {
    if (profile.onboardingCompleted) {
      navigate('/dashboard', { replace: true });
    }
  }, [profile.onboardingCompleted, navigate]);

  const [step, setStep] = useState(1);
  const totalSteps = 8;

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: profile.name || '',
    age: profile.age,
    height: profile.height || { value: 170, unit: 'cm' },
    weight: profile.weight || { value: 70, unit: 'kg' },
    primaryGoal: profile.primaryGoal || '',
    target: profile.target || { type: 'general' },
    preferredTime: profile.preferredTime || 'morning',
    daysPerWeek: profile.daysPerWeek || 5,
    selectedHabits: profile.selectedHabits || [],
  });

  const updateForm = (patch: Partial<UserProfile>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const skipOnboarding = () => {
    if (profile.onboardingCompleted) {
      navigate('/dashboard', { replace: true });
      return;
    }

    clearGoals();

    updateProfile({
      name: "Radoan",
      age: 20,
      height: {
        value: 177,
        unit: "cm"
      },
      primaryGoal: "Build muscle",
      onboardingCompleted: true,
      xp: 0,
      level: 1,
      streak: 0,
      longestStreak: 0,
      achievementsUnlocked: []
    });

    addGoal({
      title: "Build muscle",
      category: "Fitness",
      icon: "dumbbell",
      frequency: { type: "days", days: [1, 3, 5] },
      startDate: new Date().toISOString().split('T')[0],
    });

    addGoal({
      title: "Drink more water",
      category: "Health",
      icon: "droplets",
      frequency: { type: "daily", days: [] },
      startDate: new Date().toISOString().split('T')[0],
    });

    navigate('/dashboard', { replace: true });
  };

  const handleComplete = () => {
    updateProfile({
      ...formData,
      onboardingCompleted: true,
      xp: 0,
      level: 1,
      streak: 0,
      longestStreak: 0,
      achievementsUnlocked: []
    });
    
    // Clear out any previous seed data
    clearGoals();

    if (formData.selectedHabits && formData.selectedHabits.length > 0) {
      formData.selectedHabits.forEach(habitTitle => {
        addGoal({
          title: habitTitle,
          category: 'Personal',
          icon: 'target',
          frequency: { type: 'days', days: Array.from({length: formData.daysPerWeek || 5}, (_, i) => i) },
          startDate: new Date().toISOString().split('T')[0],
        });
      });
    }

    navigate('/dashboard', { replace: true });
  };

  const renderProgress = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i + 1 === step ? 'w-8 bg-accent' : i + 1 < step ? 'w-2 bg-accent/50' : 'w-2 bg-line'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        {step > 1 && step < totalSteps && renderProgress()}
        {step > 1 && step < totalSteps && (
          <p className="text-center text-sub text-sm mb-6">Step {step} of {totalSteps}</p>
        )}

        <div className="bg-card border border-line rounded-card p-6 sm:p-8 shadow-soft">
          {step === 1 && (
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome to your<br/>better routine.</h1>
              <p className="text-sub mb-8">Let's personalize your experience and build goals that fit your lifestyle.</p>
              <div className="flex flex-col gap-3">
                <Button fullWidth onClick={nextStep}>Get Started →</Button>
                <button className="text-sm text-sub hover:text-accent transition-colors" onClick={skipOnboarding}>
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">What's your name?</label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">How old are you?</label>
                <input
                  type="number"
                  className={inputClass}
                  value={formData.age || ''}
                  onChange={(e) => updateForm({ age: parseInt(e.target.value) || undefined })}
                  placeholder="Age"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={prevStep} fullWidth>Back</Button>
                <Button onClick={nextStep} fullWidth disabled={!formData.name || !formData.age}>Continue →</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-2">Tell us a little about yourself.</h2>
              <p className="text-center text-sm text-sub mb-6">For personalization and progress tracking.</p>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Height</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    value={formData.height?.value || ''}
                    onChange={(e) => updateForm({ height: { ...formData.height!, value: parseFloat(e.target.value) || 0 } })}
                  />
                  <select
                    className={inputClass + ' w-24'}
                    value={formData.height?.unit || 'cm'}
                    onChange={(e) => updateForm({ height: { ...formData.height!, unit: e.target.value as 'cm' | 'ft' } })}
                  >
                    <option value="cm">cm</option>
                    <option value="ft">ft + in</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Weight</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    value={formData.weight?.value || ''}
                    onChange={(e) => updateForm({ weight: { ...formData.weight!, value: parseFloat(e.target.value) || 0 } })}
                  />
                  <select
                    className={inputClass + ' w-24'}
                    value={formData.weight?.unit || 'kg'}
                    onChange={(e) => updateForm({ weight: { ...formData.weight!, unit: e.target.value as 'kg' | 'lb' } })}
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={prevStep} fullWidth>Back</Button>
                <Button onClick={nextStep} fullWidth>Continue →</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">What is your main goal?</h2>
              <div className="grid gap-3 max-h-[50vh] overflow-y-auto pr-2">
                {GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => updateForm({ primaryGoal: goal })}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                      formData.primaryGoal === goal
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-line bg-surface hover:bg-surface2'
                    }`}
                  >
                    <span className="font-medium">{goal}</span>
                    {formData.primaryGoal === goal && <Check size={18} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={prevStep} fullWidth>Back</Button>
                <Button onClick={nextStep} fullWidth disabled={!formData.primaryGoal}>Continue →</Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Let's set a target</h2>
              {/* Adapts based on goal */}
              {['Lose weight', 'Gain weight'].includes(formData.primaryGoal || '') ? (
                <div>
                  <label className="block text-sm font-medium mb-1.5">What's your target weight?</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className={inputClass}
                      value={formData.target?.value || ''}
                      onChange={(e) => updateForm({ target: { type: 'weight', value: parseFloat(e.target.value) || 0, unit: formData.weight?.unit || 'kg' } })}
                    />
                    <span className="flex items-center px-3 text-sub">{formData.weight?.unit || 'kg'}</span>
                  </div>
                </div>
              ) : formData.primaryGoal === 'Build muscle' || formData.primaryGoal === 'Improve fitness' ? (
                <div>
                  <label className="block text-sm font-medium mb-1.5">How many days per week do you want to train?</label>
                  <select
                    className={inputClass}
                    value={formData.target?.value || ''}
                    onChange={(e) => updateForm({ target: { type: 'days', value: parseInt(e.target.value) || 0 } })}
                  >
                    <option value="">Select...</option>
                    {[2,3,4,5,6].map(d => <option key={d} value={d}>{d} days</option>)}
                  </select>
                </div>
              ) : formData.primaryGoal === 'Sleep better' ? (
                <div>
                  <label className="block text-sm font-medium mb-1.5">What's your target sleep duration?</label>
                  <select
                    className={inputClass}
                    value={formData.target?.value || ''}
                    onChange={(e) => updateForm({ target: { type: 'hours', value: parseInt(e.target.value) || 0 } })}
                  >
                    <option value="">Select...</option>
                    {[6,7,8,9,10].map(h => <option key={h} value={h}>{h} hours</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1.5">What is your specific target?</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={formData.target?.type || ''}
                    onChange={(e) => updateForm({ target: { type: e.target.value } })}
                    placeholder="e.g. Read 10 pages"
                  />
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={prevStep} fullWidth>Back</Button>
                <Button onClick={nextStep} fullWidth>Continue →</Button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Daily Routine</h2>
              <div>
                <label className="block text-sm font-medium mb-3">When do you usually have time for yourself?</label>
                <div className="grid grid-cols-2 gap-3">
                  {['morning', 'afternoon', 'evening', 'flexible'].map(time => (
                    <button
                      key={time}
                      onClick={() => updateForm({ preferredTime: time as any })}
                      className={`py-3 px-4 rounded-xl border capitalize transition-colors ${
                        formData.preferredTime === time
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-line bg-surface hover:bg-surface2'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <label className="block text-sm font-medium mb-3">How many days per week do you want to focus on your goals?</label>
                <div className="flex justify-between gap-2">
                  {[3,4,5,6,7].map(day => (
                    <button
                      key={day}
                      onClick={() => updateForm({ daysPerWeek: day })}
                      className={`flex-1 py-3 rounded-xl border transition-colors ${
                        formData.daysPerWeek === day
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-line bg-surface hover:bg-surface2'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={prevStep} fullWidth>Back</Button>
                <Button onClick={nextStep} fullWidth>Continue →</Button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-2">Habit Selection</h2>
              <p className="text-center text-sm text-sub mb-6">Which habits would you like to build?</p>
              
              <div className="grid gap-2 max-h-[45vh] overflow-y-auto pr-2">
                {HABITS.map(habit => {
                  const isSelected = formData.selectedHabits?.includes(habit);
                  return (
                    <button
                      key={habit}
                      onClick={() => {
                        const current = formData.selectedHabits || [];
                        if (isSelected) {
                          updateForm({ selectedHabits: current.filter(h => h !== habit) });
                        } else if (current.length < 5) {
                          updateForm({ selectedHabits: [...current, habit] });
                        }
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        isSelected
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-line bg-surface hover:bg-surface2'
                      } ${!isSelected && (formData.selectedHabits?.length || 0) >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-sm font-medium">{habit}</span>
                      {isSelected && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-center text-sub">{formData.selectedHabits?.length || 0} of 5 selected (recommended)</p>
              
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={prevStep} fullWidth>Back</Button>
                <Button onClick={nextStep} fullWidth disabled={(formData.selectedHabits?.length || 0) === 0}>Continue →</Button>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Your plan is ready.</h2>
              </div>
              
              <div className="bg-surface rounded-xl p-6 space-y-6">
                <div>
                  <p className="text-sm text-sub mb-1">Main goal:</p>
                  <p className="text-lg font-bold">{formData.primaryGoal}</p>
                </div>
                
                <div>
                  <p className="text-sm text-sub mb-2">Your focus:</p>
                  <ul className="space-y-2">
                    {formData.selectedHabits?.map(habit => (
                      <li key={habit} className="flex items-center gap-2">
                        <Check size={16} className="text-accent" />
                        <span className="text-sm font-medium">{habit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line">
                  <div>
                    <p className="text-xs text-sub mb-1">Schedule:</p>
                    <p className="text-sm font-medium">{formData.daysPerWeek} days / week</p>
                  </div>
                  <div>
                    <p className="text-xs text-sub mb-1">Preferred time:</p>
                    <p className="text-sm font-medium capitalize">{formData.preferredTime}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={prevStep} fullWidth>Back</Button>
                <Button onClick={handleComplete} fullWidth>Start My Journey →</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
