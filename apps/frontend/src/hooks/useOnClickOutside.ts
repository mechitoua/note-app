import { RefObject, useEffect } from 'react';

type Handler = (event: PointerEvent | TouchEvent) => void;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
): void {
  useEffect(() => {
    const listener = (event: PointerEvent) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('pointerdown', listener);

    return () => {
      document.removeEventListener('pointerdown', listener);
    };
  }, [ref, handler]);
}
