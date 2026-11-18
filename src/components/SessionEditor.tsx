import { useState } from 'react';
import { Text } from 'react-native';
import { Button, Card } from './UI';
import { Field } from './Field';
import { useApp } from '@/context/AppContext';
import type { CloudSession } from '@/types/cloud';
import { ds } from '@/styles/dashboard';

export function SessionEditor({ session, onClose }: { session?: CloudSession; onClose: () => void }) {
  const { saveSession, busy, offline } = useApp();
  const [practicalName, setName] = useState(session?.practicalName ?? '');
  const [className, setClass] = useState(session?.className ?? '');
  const [date, setDate] = useState(session?.date ?? '');
  const [startTime, setStart] = useState(session?.startTime ?? '');
  const [endTime, setEnd] = useState(session?.endTime ?? '');
  const [participants, setParticipants] = useState(session?.participantIds.join('\n') ?? '');
  return <Card>
    <Text style={ds.cardTitle}>{session ? 'Ubah sesi' : 'Tambah sesi'}</Text>
    <Field label="Nama praktikum" value={practicalName} onChangeText={setName} maxLength={120} />
    <Field label="Kelas" value={className} onChangeText={setClass} maxLength={60} />
    <Field label="Tanggal (YYYY-MM-DD)" placeholder="2026-11-20" value={date} onChangeText={setDate} maxLength={10} />
    <Field label="Mulai (HH:mm WIB)" placeholder="08:00" value={startTime} onChangeText={setStart} maxLength={5} />
    <Field label="Selesai (HH:mm WIB)" placeholder="10:00" value={endTime} onChangeText={setEnd} maxLength={5} />
    <Field label="UID peserta (pisahkan dengan koma atau baris baru)" multiline value={participants} onChangeText={setParticipants} maxLength={13000} />
    <Text style={ds.small}>Peserta dapat menyalin UID dari menu Akun saya. Maksimal 100 peserta per sesi. Detail dan peserta hanya dapat diubah sebelum sesi dibuka.</Text>
    <Button label={busy ? 'Menyimpan…' : 'Simpan sesi'} disabled={busy || offline} onPress={async () => {
      const participantIds = [...new Set(participants.split(/[\s,;]+/).filter(Boolean))];
      if (await saveSession({ practicalName, className, date, startTime, endTime, participantIds }, session?.id)) onClose();
    }} />
    <Button label="Batal" variant="secondary" disabled={busy} onPress={onClose} />
  </Card>;
}
