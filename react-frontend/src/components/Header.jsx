import { useState, useEffect } from 'react';
import { apiFetch, BASE_URL } from '../api';
import { useConsole } from '../context';

export default function Header() {
  const [online, setOnline] = useState(false);
  const [statusMsg, setStatusMsg] = useState('CONNECTING...');
  const [time, setTime] = useState('');
  const { logConsole } = useConsole();

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const t = now.toLocaleTimeString('en-US', { hour12: false });
      const d = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      setTime(`${d} ${t}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // API status check
  useEffect(() => {
    (async () => {
      try {
        const { ok, data } = await apiFetch('GET', '/');
        if (ok) {
          setOnline(true);
          setStatusMsg('API ONLINE — ' + (data?.message || 'OK'));
          logConsole('success', `API reachable: ${JSON.stringify(data)}`);
        } else {
          setOnline(false);
          setStatusMsg('API OFFLINE');
          logConsole('error', `API returned error status`);
        }
      } catch {
        setOnline(false);
        setStatusMsg('API OFFLINE');
        logConsole('error', `Cannot reach API at ${BASE_URL}`);
      }
    })();
  }, [logConsole]);

  return (
    <header className="border-b border-[rgba(0,255,65,0.27)] bg-[rgba(0,20,0,0.95)] backdrop-blur sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-pixel)] text-[11px] text-[#4a7a4a]">[</span>
          <span className="font-[family-name:var(--font-pixel)] text-[13px] text-[#00ff41] [text-shadow:0_0_8px_#00ff4188,0_0_20px_#00ff4133] tracking-widest">
            FAST<span className="text-[#ffb000]">API</span>
          </span>
          <span className="font-[family-name:var(--font-pixel)] text-[11px] text-[#4a7a4a]">]</span>
          <span className="font-[family-name:var(--font-pixel)] text-[9px] text-[#4a7a4a] ml-2 hidden sm:inline">TERMINAL v1.0</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${online ? 'dot-online' : 'bg-[#ff3c3c]'}`} />
          <span className="text-[#c8ffc8]">{statusMsg}</span>
          <span className="text-[#4a7a4a] ml-4 text-[11px]">{time}</span>
        </div>
      </div>
    </header>
  );
}
