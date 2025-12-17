import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimationState } from '../types';
import { clampSpeed } from '../utils/validation';

const DEFAULT_SPEED = 500;

const initialAnimationState: AnimationState = {
  isPlaying: false,
  isPaused: false,
  currentStepIndex: 0,
  totalSteps: 0,
  speed: DEFAULT_SPEED
};

export function useAnimation(totalSteps: number, onStepChange?: (step: number) => void) {
  const [state, setState] = useState<AnimationState>({
    ...initialAnimationState,
    totalSteps
  });
  
  const timerRef = useRef<number | null>(null);

  // Update total steps when it changes
  useEffect(() => {
    setState(prev => ({ ...prev, totalSteps }));
  }, [totalSteps]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const play = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false
    }));

    timerRef.current = window.setInterval(() => {
      setState(prev => {
        if (prev.currentStepIndex >= prev.totalSteps - 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return { ...prev, isPlaying: false };
        }
        
        const newIndex = prev.currentStepIndex + 1;
        onStepChange?.(newIndex);
        return { ...prev, currentStepIndex: newIndex };
      });
    }, state.speed);
  }, [state.speed, onStepChange]);

  const pause = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: true
    }));
  }, []);

  const stepForward = useCallback(() => {
    setState(prev => {
      if (prev.currentStepIndex >= prev.totalSteps - 1) {
        return prev;
      }
      const newIndex = prev.currentStepIndex + 1;
      onStepChange?.(newIndex);
      return { ...prev, currentStepIndex: newIndex };
    });
  }, [onStepChange]);

  const stepBackward = useCallback(() => {
    setState(prev => {
      if (prev.currentStepIndex <= 0) {
        return prev;
      }
      const newIndex = prev.currentStepIndex - 1;
      onStepChange?.(newIndex);
      return { ...prev, currentStepIndex: newIndex };
    });
  }, [onStepChange]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setState(prev => ({
      ...initialAnimationState,
      totalSteps: prev.totalSteps,
      speed: prev.speed
    }));
    onStepChange?.(0);
  }, [onStepChange]);

  const setSpeed = useCallback((speed: number) => {
    const clampedSpeed = clampSpeed(speed);
    setState(prev => ({ ...prev, speed: clampedSpeed }));
    
    // If playing, restart with new speed
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setState(prev => {
          if (prev.currentStepIndex >= prev.totalSteps - 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return { ...prev, isPlaying: false };
          }
          const newIndex = prev.currentStepIndex + 1;
          onStepChange?.(newIndex);
          return { ...prev, currentStepIndex: newIndex };
        });
      }, clampedSpeed);
    }
  }, [onStepChange]);

  const goToStep = useCallback((stepIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(stepIndex, totalSteps - 1));
    setState(prev => ({ ...prev, currentStepIndex: clampedIndex }));
    onStepChange?.(clampedIndex);
  }, [totalSteps, onStepChange]);

  return {
    ...state,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    setSpeed,
    goToStep,
    isAtEnd: state.currentStepIndex >= state.totalSteps - 1,
    isAtStart: state.currentStepIndex <= 0
  };
}

/**
 * Pure function to advance step by 1 (for testing).
 */
export function advanceStep(currentIndex: number, totalSteps: number): number {
  if (currentIndex >= totalSteps - 1) {
    return currentIndex;
  }
  return currentIndex + 1;
}

/**
 * Pure function to reset animation state (for testing).
 */
export function resetAnimationState(totalSteps: number, speed: number = DEFAULT_SPEED): AnimationState {
  return {
    ...initialAnimationState,
    totalSteps,
    speed
  };
}
