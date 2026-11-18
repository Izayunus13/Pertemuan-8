import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { ds } from '@/styles/dashboard';

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={{ gap: 8 }}>
    <Text style={ds.loginLabel}>{label}</Text>
    <View style={ds.passwordRow}><TextInput accessibilityLabel={label} placeholderTextColor="#CCD5E5" autoCapitalize="none" autoCorrect={false} {...props} style={[ds.loginInput, props.multiline && { minHeight: 110, textAlignVertical: 'top' }, props.style]} /></View>
  </View>;
}
