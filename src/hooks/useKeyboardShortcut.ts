// src/hooks/useKeyboardShortcut.ts
import { useEffect, useCallback } from 'react';

type KeyCombo = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
};

export function useKeyboardShortcut(
  keyCombo: string | KeyCombo,
  callback: () => void,
  enabled: boolean = true
) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const combo = typeof keyCombo === 'string' ? { key: keyCombo } : keyCombo;

      const keyMatch = event.key.toLowerCase() === combo.key.toLowerCase();
      const ctrlMatch = !!combo.ctrl === event.ctrlKey;
      const altMatch = !!combo.alt === event.altKey;
      const shiftMatch = !!combo.shift === event.shiftKey;
      const metaMatch = !!combo.meta === event.metaKey;

      if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
        event.preventDefault();
        callback();
      }
    },
    [keyCombo, callback]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [enabled, handleKeyPress]);
}

// Example usage:
// useKeyboardShortcut('k', () => {}, true); // Simple key
// useKeyboardShortcut({ key: 'k', ctrl: true }, () => {}); // Ctrl + K
// useKeyboardShortcut({ key: 's', ctrl: true, shift: true }, () => {}); // Ctrl + Shift + S
