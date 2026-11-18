import { Redirect } from 'expo-router';
import { Text } from 'react-native';
import { Card, Screen } from '@/components/UI';
import { useApp } from '@/context/AppContext';
import { ds } from '@/styles/dashboard';

export default function RoleScreen() {
  const { profile, ready } = useApp();
  if (ready && !profile) return <Redirect href="/" />;
  return <Screen title="Akun saya" subtitle="Identitas dan hak akses akun.">
    <Card>
      <Text style={ds.cardTitle}>{profile?.name}</Text>
      <Text style={ds.small}>NIM: {profile?.nim}</Text>
      <Text style={ds.small}>Email: {profile?.email}</Text>
      <Text style={ds.subtitle}>Peran: {profile?.role}</Text>
      <Text selectable style={ds.small}>UID: {profile?.uid}</Text>
      <Text style={ds.subtitle}>Berikan UID ini kepada Asisten untuk didaftarkan ke sesi praktikum. Peran hanya dapat diubah oleh pengelola.</Text>
    </Card>
  </Screen>;
}
