import { useCallback, useMemo, useState } from 'react';
import { Modal } from '../ui/Modal';
import { GoalForm } from './GoalForm';
import { useUiStore } from '../../store/ui';
import { useTracker } from '../../store/tracker';
import { emptyGoalForm, formValuesToGoalInput, goalToFormValues, type GoalFormValues } from '../../lib/schema';

export function AddGoalModal() {
  const { open, prefill, goal } = useUiStore((s) => s.goalModal);
  const close = useUiStore((s) => s.closeGoalModal);
  const addGoal = useTracker((s) => s.addGoal);
  const updateGoal = useTracker((s) => s.updateGoal);
  const [dirty, setDirty] = useState(false);

  const defaults = useMemo<GoalFormValues>(
    () => (goal ? goalToFormValues(goal) : { ...emptyGoalForm(), ...prefill }),
    [goal, prefill],
  );

  const handleClose = useCallback(() => {
    setDirty(false);
    close();
  }, [close]);

  const handleSubmit = (values: GoalFormValues) => {
    const input = formValuesToGoalInput(values);
    if (goal) updateGoal(goal.id, input);
    else addGoal(input);
    handleClose();
  };

  return (
    <Modal
      open={open}
      title={goal ? 'Edit Goal' : 'Add New Goal'}
      onClose={handleClose}
      dismissOnBackdrop={!dirty}
    >
      <GoalForm
        // remount per open so defaults/dirty state reset
        key={goal?.id ?? JSON.stringify(prefill ?? {})}
        defaultValues={defaults}
        submitLabel={goal ? 'Save Changes' : 'Create Goal'}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        onDirtyChange={setDirty}
      />
    </Modal>
  );
}
