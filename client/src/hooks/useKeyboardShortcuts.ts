import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useKeyboardShortcuts() {
  const [, navigate] = useLocation();

  useEffect(() => {
    let lastKey = '';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (lastKey === 'g') {
        switch (key) {
          case 'm':
            navigate('/marketplace');
            lastKey = '';
            e.preventDefault();
            break;
          case 'd':
            navigate('/dashboard');
            lastKey = '';
            e.preventDefault();
            break;
          case 'a':
            navigate('/analytics');
            lastKey = '';
            e.preventDefault();
            break;
          default:
            lastKey = '';
        }
      } else if (key === 'n' && !e.ctrlKey && !e.metaKey) {
        navigate('/create-listing');
        e.preventDefault();
      } else if (key === 'g') {
        lastKey = 'g';
        setTimeout(() => {
          lastKey = '';
        }, 1000);
      } else {
        lastKey = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
}
