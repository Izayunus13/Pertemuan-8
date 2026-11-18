import { useApp } from '@/context/AppContext';
import AssistantSessionScreen from '@/screens/AssistantSessionScreen';
import ScheduleScreen from '@/screens/ScheduleScreen';

export default function ScheduleRoute() {
  const { state } = useApp();
  return state.role === 'Asisten' ? <AssistantSessionScreen /> : <ScheduleScreen />;
}
