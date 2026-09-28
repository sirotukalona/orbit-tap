import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LogOut, Play} from 'lucide-react-native';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import {C} from '../constants/theme';

interface Props {
  onResume: () => void;
  onQuit: () => void;
}

export default function PauseOverlay({onResume, onQuit}: Props) {
  return (
    <View style={styles.veil}>
      <View style={styles.panel}>
        <Text style={styles.title}>PAUSED</Text>
        <Text style={styles.hint}>THE ORBIT IS FROZEN</Text>
        <View style={styles.actions}>
          <PrimaryButton label="RESUME" onPress={onResume} Icon={Play} />
          <View style={styles.gap} />
          <SecondaryButton label="QUIT" onPress={onQuit} Icon={LogOut} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  veil: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,8,22,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  panel: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 26,
    paddingHorizontal: 22,
    paddingVertical: 26,
    backgroundColor: 'rgba(16,24,54,0.95)',
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: 5,
    color: C.text,
  },
  hint: {
    marginTop: 8,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: C.textFaint,
  },
  actions: {marginTop: 22, width: '100%'},
  gap: {height: 12},
});
