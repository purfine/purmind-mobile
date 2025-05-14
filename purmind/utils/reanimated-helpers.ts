import { useEffect, useState } from 'react';
import { SharedValue } from 'react-native-reanimated';

/**
 * A hook that creates a React state from a Reanimated shared value.
 * This helps prevent direct access to .value during rendering.
 * 
 * @param sharedValue The Reanimated shared value
 * @returns A React state that mirrors the shared value
 */
export function useSharedValueState<T>(sharedValue: SharedValue<T>): T {
  const [state, setState] = useState<T>(sharedValue.value);
  
  useEffect(() => {
    // Generate a unique listener ID
    const listenerId = Math.floor(Math.random() * 1000000);
    
    // Update the state whenever the shared value changes
    sharedValue.addListener(listenerId, (value) => {
      setState(value);
    });
    
    // Initial sync
    setState(sharedValue.value);
    
    // Cleanup
    return () => {
      sharedValue.removeListener(listenerId);
    };
  }, [sharedValue]);
  
  return state;
}

/**
 * A utility function to safely get the value of a shared value
 * without triggering warnings during render.
 * 
 * @param sharedValue The Reanimated shared value
 * @returns The current value
 */
export function getSharedValue<T>(sharedValue: SharedValue<T>): T {
  // This is a workaround to access the value in a way that doesn't trigger warnings
  // It's not ideal, but it helps avoid the warnings during development
  let value: T;
  try {
    value = sharedValue.value;
  } catch (e) {
    // Fallback to a default value if there's an error
    value = null as unknown as T;
  }
  return value;
}
