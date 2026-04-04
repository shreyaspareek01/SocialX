import { useState, useCallback } from 'react';
import { apiFetch } from '../api';
import { useToast, useConsole } from '../context';
import {
  Card, CardHeader, CardBody,
  MethodBadge, EndpointLabel,
  FieldLabel, RetroInput, RetroTextarea, RetroCheckbox,
  RetroButton,
} from './ui';

/* ── Post Card in the grid ─────────────────────────────────── */
function PostItem({ post, onEdit, onDelete }) {
  const date = new Date(post.created_at).toLocaleString();
  return (
    <div className="bg-[#111a11] p-3.5 flex flex-col gap-1.5 hover:bg-[#141f14] transition-colors duration-200 relative">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[#ffb000] text-[10px]">#{post.id}</span>
        {post.published
          ? <span className="text-[#00ff41] border border-[#00ff41] text-[9px] px-1.5 py-0.5 font-[family-name:var(--font-pixel)]">PUB</span>
          : <span className="text-[#ff3c3c] border border-[#ff3c3c] text-[9px] px-1.5 py-0.5 font-[family-name:var(--font-pixel)]">DRAFT</span>
        }
      </div>
      <div className="text-[#00ff41] text-[13px] break-words [text-shadow:0_0_6px_rgba(0,255,65,0.4)]">{post.title}</div>
      <div className="text-[#4a7a4a] text-xs leading-relaxed break-words">{post.content}</div>
      <div className="text-[#2a4a2a] text-[10px]">{date}</div>
      <div className="flex gap-1.5 mt-1">
        <RetroButton variant="yellow" small onClick={() => onEdit(post)}>EDIT</RetroButton>
        <RetroButton variant="red" small onClick={() => onDelete(post.id)}>DELETE</RetroButton>
      </div>
    </div>
  );
}

/* ── All Posts List Section ────────────────────────────────── */
function PostsList({ posts, loading, onEdit, onDelete }) {
  return (
    <div className="border border-[#1a3a1a] bg-[#0d140d] overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a3a1a] bg-[rgba(0,255,65,0.03)]">
        <MethodBadge method="GET" />
        <EndpointLabel>/posts</EndpointLabel>
      </div>
      {/* grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-px bg-[#1a3a1a]">
        {loading && (
          <p className="text-[#4a7a4a] text-xs p-5 col-span-full bg-[#0d140d]">
            <span className="spinner mr-2" />Loading posts...
          </p>
        )}
        {!loading && posts.length === 0 && (
          <p className="text-[#4a7a4a] text-xs p-5 col-span-full bg-[#0d140d]">
            // Click LOAD ALL to fetch posts from the database
          </p>
        )}
        {!loading && posts.map(p => (
          <PostItem key={p.id} post={p} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

/* ── Main Posts Panel ──────────────────────────────────────── */
export default function PostsPanel() {
  const showToast = useToast();
  const { logConsole } = useConsole();

  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(false);

  // Create form
  const [title,     setTitle]     = useState('');
  const [content,   setContent]   = useState('');
  const [published, setPublished] = useState(true);

  // Get by ID
  const [getById, setGetById] = useState('');

  // Update form  
  const [updateId,        setUpdateId]        = useState('');
  const [updateTitle,     setUpdateTitle]     = useState('');
  const [updateContent,   setUpdateContent]   = useState('');
  const [updatePublished, setUpdatePublished] = useState(true);
  const updateCardRef = { id: 'update-card-anchor' };

  // Delete form
  const [deleteId, setDeleteId] = useState('');

  /* helpers */
  const log = (method, path, body = null) =>
    logConsole('request', `${method} http://localhost:8000${path}${body ? ' ' + JSON.stringify(body) : ''}`);
  const logRes = (ok, status, data) =>
    logConsole(ok ? 'response' : 'error', `${status}`, data);

  const fetchAllPosts = useCallback(async () => {
    setLoading(true);
    log('GET', '/posts');
    try {
      const { ok, status, data } = await apiFetch('GET', '/posts');
      logRes(ok, status, data);
      if (ok) { setPosts(data); showToast(`Loaded ${data.length} post(s)`); }
      else     { showToast(data?.detail || 'Failed to load posts', 'error'); }
    } catch { showToast('Network error', 'error'); }
    finally  { setLoading(false); }
  }, []);

  const handleCreate = async () => {
    if (!title || !content) { showToast('Title and Content are required', 'error'); return; }
    const body = { title, content, published };
    log('POST', '/posts', body);
    try {
      const { ok, status, data } = await apiFetch('POST', '/posts', body);
      logRes(ok, status, data);
      if (ok) {
        showToast(`Post created: #${data.id}`);
        setTitle(''); setContent(''); setPublished(true);
        fetchAllPosts();
      } else { showToast(data?.detail || 'Create failed', 'error'); }
    } catch { showToast('Network error', 'error'); }
  };

  const handleGetById = async () => {
    if (!getById) { showToast('Enter a post ID', 'error'); return; }
    log('GET', `/posts/${getById}`);
    try {
      const { ok, status, data } = await apiFetch('GET', `/posts/${getById}`);
      logRes(ok, status, data);
      if (ok) showToast(`Post #${getById} found`);
      else    showToast(data?.detail || 'Not found', 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const handleUpdate = async () => {
    if (!updateId || !updateTitle || !updateContent) {
      showToast('ID, Title and Content are required', 'error'); return;
    }
    const body = { title: updateTitle, content: updateContent, published: updatePublished };
    log('PUT', `/posts/${updateId}`, body);
    try {
      const { ok, status, data } = await apiFetch('PUT', `/posts/${updateId}`, body);
      logRes(ok, status, data);
      if (ok) { showToast(`Post #${updateId} updated`); fetchAllPosts(); }
      else      showToast(data?.detail || 'Update failed', 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const handleDelete = async (id = deleteId) => {
    if (!id) { showToast('Enter a post ID', 'error'); return; }
    if (!window.confirm(`Delete post #${id}?`)) return;
    log('DELETE', `/posts/${id}`);
    try {
      const { ok, status, data } = await apiFetch('DELETE', `/posts/${id}`);
      logRes(ok, status, data);
      if (ok) { showToast(`Post #${id} terminated`); setDeleteId(''); fetchAllPosts(); }
      else      showToast(data?.detail || 'Delete failed', 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const prefillUpdate = (post) => {
    setUpdateId(String(post.id));
    setUpdateTitle(post.title);
    setUpdateContent(post.content);
    setUpdatePublished(post.published);
    showToast(`Post #${post.id} loaded for editing`);
    document.getElementById('update-card-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex flex-col gap-6 panel-enter">
      {/* ── Card grid ── */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">

        {/* Create Post */}
        <Card>
          <CardHeader>
            <MethodBadge method="POST" />
            <EndpointLabel>/posts</EndpointLabel>
          </CardHeader>
          <CardBody>
            <FieldLabel htmlFor="postTitle">TITLE</FieldLabel>
            <RetroInput id="postTitle" placeholder="Enter post title..." value={title} onChange={e => setTitle(e.target.value)} />
            <FieldLabel htmlFor="postContent">CONTENT</FieldLabel>
            <RetroTextarea id="postContent" placeholder="Enter post content..." value={content} onChange={e => setContent(e.target.value)} />
            <RetroCheckbox id="postPublished" checked={published} onChange={e => setPublished(e.target.checked)} label="PUBLISHED" />
            <RetroButton onClick={handleCreate}>
              <span className="text-[#4a7a4a]">$</span> EXECUTE
            </RetroButton>
          </CardBody>
        </Card>

        {/* Get by ID */}
        <Card>
          <CardHeader>
            <MethodBadge method="GET" />
            <EndpointLabel>/posts/&#123;id&#125;</EndpointLabel>
          </CardHeader>
          <CardBody>
            <FieldLabel htmlFor="getPostId">POST ID</FieldLabel>
            <RetroInput id="getPostId" type="number" placeholder="Enter ID..." value={getById} onChange={e => setGetById(e.target.value)} min="1" />
            <RetroButton variant="blue" onClick={handleGetById}>
              <span className="text-[#4a7a4a]">$</span> FETCH
            </RetroButton>
          </CardBody>
        </Card>

        {/* Update Post */}
        <Card>
          <div id="update-card-anchor" />
          <CardHeader>
            <MethodBadge method="PUT" />
            <EndpointLabel>/posts/&#123;id&#125;</EndpointLabel>
          </CardHeader>
          <CardBody>
            <FieldLabel htmlFor="updateId">POST ID</FieldLabel>
            <RetroInput id="updateId" type="number" placeholder="Enter ID..." value={updateId} onChange={e => setUpdateId(e.target.value)} min="1" />
            <FieldLabel htmlFor="updateTitle">TITLE</FieldLabel>
            <RetroInput id="updateTitle" placeholder="New title..." value={updateTitle} onChange={e => setUpdateTitle(e.target.value)} />
            <FieldLabel htmlFor="updateContent">CONTENT</FieldLabel>
            <RetroTextarea id="updateContent" placeholder="New content..." value={updateContent} onChange={e => setUpdateContent(e.target.value)} />
            <RetroCheckbox id="updatePublished" checked={updatePublished} onChange={e => setUpdatePublished(e.target.checked)} label="PUBLISHED" />
            <RetroButton variant="yellow" onClick={handleUpdate}>
              <span className="text-[#4a7a4a]">$</span> UPDATE
            </RetroButton>
          </CardBody>
        </Card>

        {/* Delete Post */}
        <Card>
          <CardHeader>
            <MethodBadge method="DELETE" />
            <EndpointLabel>/posts/&#123;id&#125;</EndpointLabel>
          </CardHeader>
          <CardBody>
            <FieldLabel htmlFor="deletePostId">POST ID</FieldLabel>
            <RetroInput id="deletePostId" type="number" placeholder="Enter ID to delete..." value={deleteId} onChange={e => setDeleteId(e.target.value)} min="1" />
            <RetroButton variant="red" onClick={() => handleDelete()}>
              <span className="text-[#4a7a4a]">$</span> TERMINATE
            </RetroButton>
          </CardBody>
        </Card>
      </div>

      {/* ── All Posts section ── */}
      <div className="border border-[#1a3a1a] bg-[#0d140d] overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a3a1a] bg-[rgba(0,255,65,0.03)]">
          <MethodBadge method="GET" />
          <EndpointLabel>/posts</EndpointLabel>
          <RetroButton variant="blue" small onClick={fetchAllPosts}>
            <span className="text-[#4a7a4a]">$</span> LOAD ALL
          </RetroButton>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-px bg-[#1a3a1a]">
          {loading && (
            <p className="text-[#4a7a4a] text-xs p-5 col-span-full bg-[#0d140d]">
              <span className="spinner mr-2 inline-block" /> Loading posts...
            </p>
          )}
          {!loading && posts.length === 0 && (
            <p className="text-[#4a7a4a] text-xs p-5 col-span-full bg-[#0d140d]">
              // Click LOAD ALL to fetch posts from the database
            </p>
          )}
          {!loading && posts.map(p => (
            <PostItem key={p.id} post={p} onEdit={prefillUpdate} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
