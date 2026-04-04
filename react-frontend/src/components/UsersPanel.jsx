import { useState, useCallback } from 'react';
import { apiFetch } from '../api';
import { useToast, useConsole } from '../context';
import {
  Card, CardHeader, CardBody,
  MethodBadge, EndpointLabel,
  FieldLabel, RetroInput,
  RetroButton,
} from './ui';

export default function UsersPanel() {
  const showToast = useToast();
  const { logConsole } = useConsole();

  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [email,   setEmail]   = useState('');
  const [password, setPassword] = useState('');

  const log    = (method, path, body = null) =>
    logConsole('request', `${method} http://localhost:8000${path}${body ? ' ' + JSON.stringify(body) : ''}`);
  const logRes = (ok, status, data) =>
    logConsole(ok ? 'response' : 'error', `${status}`, data);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    log('GET', '/users');
    try {
      const { ok, status, data } = await apiFetch('GET', '/users');
      logRes(ok, status, data);
      if (ok) { setUsers(data); showToast(`Loaded ${data.length} user(s)`); }
      else     { showToast(data?.detail || 'Failed to load users', 'error'); }
    } catch { showToast('Network error', 'error'); }
    finally  { setLoading(false); }
  }, []);

  const handleCreate = async () => {
    if (!email || !password) { showToast('Email and Password are required', 'error'); return; }
    const body = { email, password };
    log('POST', '/users', { email, password: '***' });
    try {
      const { ok, status, data } = await apiFetch('POST', '/users', body);
      logRes(ok, status, data);
      if (ok) {
        showToast(`User created: #${data.id}`);
        setEmail(''); setPassword('');
        fetchAllUsers();
      } else { showToast(data?.detail || 'Registration failed', 'error'); }
    } catch { showToast('Network error', 'error'); }
  };

  return (
    <div className="flex flex-col gap-6 panel-enter">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">

        {/* Create User */}
        <Card>
          <CardHeader>
            <MethodBadge method="POST" />
            <EndpointLabel>/users</EndpointLabel>
          </CardHeader>
          <CardBody>
            <FieldLabel htmlFor="userEmail">EMAIL</FieldLabel>
            <RetroInput
              id="userEmail"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <FieldLabel htmlFor="userPassword">PASSWORD</FieldLabel>
            <RetroInput
              id="userPassword"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <RetroButton onClick={handleCreate}>
              <span className="text-[#4a7a4a]">$</span> REGISTER
            </RetroButton>
          </CardBody>
        </Card>

        {/* Users Table */}
        <Card wide>
          <CardHeader>
            <MethodBadge method="GET" />
            <EndpointLabel>/users</EndpointLabel>
            <RetroButton variant="blue" small onClick={fetchAllUsers}>
              <span className="text-[#4a7a4a]">$</span> LOAD
            </RetroButton>
          </CardHeader>
          <CardBody>
            {loading && (
              <p className="text-[#4a7a4a] text-xs">
                <span className="spinner mr-2 inline-block" /> Loading users...
              </p>
            )}
            {!loading && users.length === 0 && (
              <p className="text-[#4a7a4a] text-xs">// Click LOAD to fetch users from the database</p>
            )}
            {!loading && users.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      {['ID', 'EMAIL', 'CREATED AT'].map(h => (
                        <th key={h} className="font-[family-name:var(--font-pixel)] text-[8px] text-[#4a7a4a] px-3.5 py-2.5 border-b border-[rgba(0,255,65,0.27)] text-left tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="hover:[&>td]:bg-[rgba(0,255,65,0.04)]">
                        <td className="px-3.5 py-2.5 border-b border-[#1a3a1a] text-[#ffb000]">#{u.id}</td>
                        <td className="px-3.5 py-2.5 border-b border-[#1a3a1a] text-[#00d4ff]">{u.email}</td>
                        <td className="px-3.5 py-2.5 border-b border-[#1a3a1a] text-[#c8ffc8]">{new Date(u.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
