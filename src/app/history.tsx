import { useApp } from '@/context/AppContext';
import AttendanceRecapScreen from '@/screens/AttendanceRecapScreen';
import AttendanceHistoryScreen from '@/screens/AttendanceHistoryScreen';

export default function HistoryRoute() {
  const { state } = useApp();
  return state.role === 'Asisten' ? <AttendanceRecapScreen /> : <AttendanceHistoryScreen />;
}
