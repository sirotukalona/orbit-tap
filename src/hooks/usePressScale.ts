import {useCallback, useRef} from 'react';
import {Animated} from 'react-native';

/**
 * Press feedback for a Pressable PARENT: the Animated.View carrying the
 * transform lives INSIDE the Pressable, the handlers live on the Pressable.
 * Only `transform` is animated, so the native driver is safe.
 */
export function usePressScale(to: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return {scale, onPressIn, onPressOut};
}

export default usePressScale;
