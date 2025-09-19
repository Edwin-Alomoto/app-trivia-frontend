import { useCallback, useRef } from 'react';

/**
 * Hook personalizado para manejar actualizaciones de estado de forma segura
 * Evita el error "useInsertionEffect must not schedule updates"
 */
export function useSafeStateUpdate() {
  const updateQueue = useRef<(() => void)[]>([]);
  const isProcessing = useRef(false);

  const safeUpdate = useCallback((updateFn: () => void) => {
    updateQueue.current.push(updateFn);
    
    if (!isProcessing.current) {
      isProcessing.current = true;
      
      // Usar setTimeout para evitar updates durante render
      setTimeout(() => {
        const updates = updateQueue.current;
        updateQueue.current = [];
        isProcessing.current = false;
        
        updates.forEach(update => {
          try {
            update();
          } catch (error) {
            console.error('Error en safe update:', error);
          }
        });
      }, 0);
    }
  }, []);

  const batchUpdates = useCallback((updates: (() => void)[]) => {
    updates.forEach(update => updateQueue.current.push(update));
    
    if (!isProcessing.current) {
      isProcessing.current = true;
      
      setTimeout(() => {
        const queuedUpdates = updateQueue.current;
        updateQueue.current = [];
        isProcessing.current = false;
        
        queuedUpdates.forEach(update => {
          try {
            update();
          } catch (error) {
            console.error('Error en batch update:', error);
          }
        });
      }, 0);
    }
  }, []);

  return { safeUpdate, batchUpdates };
}
