const BASE_URL = 'http://localhost:8000';

export async function apiFetch(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);
  let data = null;
  const contentType = res.headers.get('content-type') || '';

  if (res.status !== 204 && contentType.includes('application/json')) {
    data = await res.json();
  }

  return { ok: res.ok, status: res.status, statusText: res.statusText, data };
}

export function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export { BASE_URL };
