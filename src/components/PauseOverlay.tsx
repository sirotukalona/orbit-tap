import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {House, Rocket} from 'lucide-react-native';

import theme from '../constants/theme';
import GradientButton from './GradientButton';

interface Props {
  visible: boolean;
  onResume: () => void;
  onQuit: () => void;
}

/**
 * In-screen overlay, not a route. Deliberately free of launch and retry
 * verbs — those labels belong to the Menu and Result CTAs only.
 */
function PauseOverlay({visible, onResume, onQuit}: Props) {
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>PAUSED</Text>
        <Text style={styles.hint}>THE ORBIT IS HOLDING ITS BREATH</Text>
        <View style={styles.actions}>
          <GradientButton label="RESUME" Icon={Rocket} onPress={onResume} />
          <View style={styles.gap} />
          <GradientButton
            label="QUIT MISSION"
            Icon={House}
            onPress={onQuit}
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,7,15,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: 300,
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(20,27,61,0.95)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 22,
    paddingVertical: 26,
    alignItems: 'center',
    shadowColor: theme.colors.secondary,
    shadowOpacity: 0.5,
    shadowRadius: 26,
    shadowOffset: {width: 0, height: 10},
    elevation: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 3,
    color: theme.colors.text,
  },
  hint: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textAlign: 'center',
    color: theme.colors.textMute,
  },
  actions: {
    marginTop: 22,
    width: '100%',
  },
  gap: {
    height: 12,
  },
});

export default React.memo(PauseOverlay);
