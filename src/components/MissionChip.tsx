import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {C, GRADIENTS} from '../constants/theme';

interface Props {
  name: string;
  active: boolean;
  onPress: () => void;
}

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

export default function MissionChip({name, active, onPress}: Props) {
  return (
    <Pressable
      style={styles.press}
      onPress={onPress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{selected: active}}
      accessibilityLabel={name}>
      <View style={[styles.skin, active ? styles.on : styles.off]}>
        {active ? (
          <LinearGradient
            colors={GRADIENTS.primary}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <Text style={[styles.label, active ? styles.labelOn : styles.labelOff]}>
          {name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {flex: 1, height: 48},
  skin: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  on: {borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)'},
  off: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: C.glassLine,
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  labelOn: {color: C.text},
  labelOff: {color: C.textFaint},
});
