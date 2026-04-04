import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);
const ConsoleContext = createContext(null);

export function AppProviders({ children }) {
  const [toast, setToast] = useState({ msg: '', type: 'success', show: false });
  const [logs, setLogs] = useState([
    { type: 'welcome', msg: 'FastAPI Terminal ready. Waiting for commands...' },
  ]);
  const timerRef = useRef(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, show: true });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }, []);

  const logConsole = useCallback((type, msg, data = null) => {
    setLogs(prev => [...prev, { type, msg, data }]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([{ type: 'info', msg: 'Console cleared.' }]);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      <ConsoleContext.Provider value={{ logs, logConsole, clearLogs }}>
        {children}
        {/* Toast */}
        <div className={`toast ${toast.show ? 'show' : ''} ${toast.type === 'error' ? 'error-toast' : 'success-toast'}`}>
          {toast.msg}
        </div>
      </ConsoleContext.Provider>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
export const useConsole = () => useContext(ConsoleContext);
