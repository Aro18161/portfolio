import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { store } from '../data/store';
import '../styles/admin.css';

/* ── password ──────────────────────────────────────────────── */
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'portfolio2025';

/* ── section config ────────────────────────────────────────── */
const SECTIONS = [
  { key: 'engineeringProjects', label: 'Engineering Projects', group: 'Engineering', type: 'project', nameField: 'title', metaField: 'year' },
  { key: 'blogPosts',           label: 'Blog Posts',           group: 'Engineering', type: 'post',    nameField: 'title', metaField: 'date' },
  { key: 'companies',           label: 'Career',               group: 'Engineering', type: 'company', nameField: 'name',  metaField: 'period' },
  { key: 'designProjects',      label: 'Design Projects',      group: 'Design',      type: 'project', nameField: 'title', metaField: 'year' },
  { key: 'essays',              label: 'Ideas',                group: 'Design',      type: 'post',    nameField: 'title', metaField: 'date' },
  { key: 'articles',            label: 'Articles',             group: 'Design',      type: 'post',    nameField: 'title', metaField: 'date' },
];

function makeId(title = '') {
  return title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-+|-+$/g, '') || `item-${Date.now()}`;
}

/* ── Toast ─────────────────────────────────────────────────── */
function Toast({ msg }) {
  if (!msg) return null;
  return <div className="admin-toast">{msg}</div>;
}

/* ── Loading ───────────────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'Courier New, monospace', fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.2)' }}>
      loading…
    </div>
  );
}

/* ── Login Gate ─────────────────────────────────────────────── */
function LoginGate({ onAuth }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      onAuth();
    } else {
      setError(true);
      setPw('');
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-box" onSubmit={submit}>
        <p className="admin-login-title">Admin Access</p>
        <div>
          <p className="admin-login-label">Password</p>
          <input
            className={`admin-input${error ? ' error' : ''}`}
            type="password"
            value={pw}
            autoFocus
            autoComplete="current-password"
            onChange={(e) => { setPw(e.target.value); setError(false); }}
            placeholder="············"
          />
        </div>
        {error && <p className="admin-error-msg">incorrect password</p>}
        <button className="admin-btn primary" type="submit">Enter</button>
        <Link to="/" style={{ textAlign: 'center', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', textDecoration: 'none' }}>
          ← Back to portfolio
        </Link>
      </form>
    </div>
  );
}

/* ── Dashboard ─────────────────────────────────────────────── */
function Dashboard({ onSelect }) {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    Promise.all(SECTIONS.map(async (s) => {
      const items = await store.get(s.key);
      return [s.key, items.length];
    })).then((pairs) => setCounts(Object.fromEntries(pairs)));
  }, []);

  return (
    <>
      {['Engineering', 'Design'].map((group) => (
        <div key={group}>
          <p className="admin-section-label">{group}</p>
          <div className="admin-grid">
            {SECTIONS.filter((s) => s.group === group).map((s) => (
              <div key={s.key} className="admin-card" onClick={() => onSelect(s)}>
                <p className="admin-card-label">{s.group}</p>
                <p className="admin-card-title">{s.label}</p>
                <p className="admin-card-count">{counts[s.key] ?? '…'} items</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Item List ─────────────────────────────────────────────── */
function ItemList({ section, onEdit, onNew }) {
  const [items, setItems] = useState(null);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    store.get(section.key).then(setItems);
  }, [section.key]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 1800); };

  const persist = async (next) => {
    setSaving(true);
    try {
      await store.set(section.key, next);
      setItems(next);
    } catch (e) {
      showToast('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await persist(items.filter((it) => it.id !== id));
    showToast('Deleted');
  };

  const moveItem = async (idx, dir) => {
    const next = [...items];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    await persist(next);
  };

  if (!items) return <Spinner />;

  return (
    <>
      <div className="admin-list-header">
        <h2 className="admin-list-title">{section.label}</h2>
        <button className="admin-btn small" onClick={onNew} disabled={saving}>+ New</button>
      </div>
      <ul className="admin-item-list">
        {items.map((item, i) => (
          <li key={item.id} className="admin-item-row">
            <span className="admin-item-idx">{String(i + 1).padStart(2, '0')}</span>
            <div className="admin-item-info">
              <div className="admin-item-name">{item[section.nameField] || item.id}</div>
              <div className="admin-item-meta">{item[section.metaField] || ''}</div>
            </div>
            <div className="admin-item-actions">
              <button className="admin-btn small" onClick={() => moveItem(i, -1)} disabled={saving || i === 0}>↑</button>
              <button className="admin-btn small" onClick={() => moveItem(i, 1)}  disabled={saving || i === items.length - 1}>↓</button>
              <button className="admin-btn small" onClick={() => onEdit(item)} disabled={saving}>Edit</button>
              <button className="admin-btn small danger" onClick={() => deleteItem(item.id)} disabled={saving}>Del</button>
            </div>
          </li>
        ))}
      </ul>
      <Toast msg={toast} />
    </>
  );
}

/* ── Project / Post Editor ─────────────────────────────────── */
function ContentEditor({ section, item, onSave, onCancel, saving }) {
  const isNew = !item;
  const [fields, setFields] = useState(() => {
    if (item) return { ...item, tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags };
    if (section.type === 'project') return { id: '', title: '', year: '', tags: '', thumbnail: '', content: '' };
    return { id: '', title: '', date: '', tags: '', content: '' };
  });

  const set = (k, v) => setFields((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    const tagArr = fields.tags.split(',').map((t) => t.trim()).filter(Boolean);
    onSave({ ...fields, id: fields.id || makeId(fields.title), tags: tagArr });
  };

  return (
    <>
      <div className="admin-editor-header">
        <h2 className="admin-editor-title">{isNew ? `New ${section.label}` : `Edit: ${item[section.nameField]}`}</h2>
      </div>

      <div className="admin-fields">
        <div className="admin-field">
          <label>Title</label>
          <input className="admin-input" value={fields.title || ''} onChange={(e) => set('title', e.target.value)} />
        </div>
        {section.type === 'project' ? (
          <div className="admin-field">
            <label>Year</label>
            <input className="admin-input" value={fields.year || ''} onChange={(e) => set('year', e.target.value)} placeholder="2025" />
          </div>
        ) : (
          <div className="admin-field">
            <label>Date</label>
            <input className="admin-input" value={fields.date || ''} onChange={(e) => set('date', e.target.value)} placeholder="2025.01.01" />
          </div>
        )}
        <div className="admin-field">
          <label>Tags (comma-separated)</label>
          <input className="admin-input" value={fields.tags || ''} onChange={(e) => set('tags', e.target.value)} placeholder="React, Canvas" />
        </div>
        {section.type === 'project' && (
          <div className="admin-field">
            <label>Thumbnail URL</label>
            <input className="admin-input" value={fields.thumbnail || ''} onChange={(e) => set('thumbnail', e.target.value)} placeholder="https://…" />
          </div>
        )}
      </div>

      <p className="admin-split-label" style={{ marginBottom: 8 }}>Content (Markdown) — live preview</p>
      <div className="admin-split">
        <div className="admin-editor-pane">
          <textarea className="admin-textarea" value={fields.content || ''} onChange={(e) => set('content', e.target.value)} spellCheck={false} />
        </div>
        <div className="admin-preview-pane">
          <div className="admin-preview-scroll">
            <article className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{fields.content || ''}</ReactMarkdown>
            </article>
          </div>
        </div>
      </div>

      <div className="admin-editor-footer">
        <button className="admin-btn small" onClick={onCancel} disabled={saving}>Cancel</button>
        <button className="admin-btn small primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </>
  );
}

/* ── Company Editor ────────────────────────────────────────── */
function CompanyEditor({ item, onSave, onCancel, saving }) {
  const isNew = !item;
  const [fields, setFields] = useState(() =>
    item
      ? { ...item, tasksText: (item.tasks || []).join('\n') }
      : { id: '', name: '', role: '', period: '', type: 'work', tasksText: '' }
  );

  const set = (k, v) => setFields((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    const tasks = fields.tasksText.split('\n').map((t) => t.trim()).filter(Boolean);
    onSave({ id: fields.id || makeId(fields.name), name: fields.name, role: fields.role, period: fields.period, type: fields.type, tasks });
  };

  return (
    <>
      <div className="admin-editor-header">
        <h2 className="admin-editor-title">{isNew ? 'New Career' : `Edit: ${item.name}`}</h2>
      </div>
      <div className="admin-fields">
        <div className="admin-field">
          <label>Name</label>
          <input className="admin-input" value={fields.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Type</label>
          <select className="admin-input" value={fields.type} onChange={(e) => set('type', e.target.value)}>
            <option value="work">Work</option>
            <option value="lab">Lab</option>
            <option value="club">Club</option>
          </select>
        </div>
        <div className="admin-field">
          <label>Role</label>
          <input className="admin-input" value={fields.role} onChange={(e) => set('role', e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Period</label>
          <input className="admin-input" value={fields.period} onChange={(e) => set('period', e.target.value)} placeholder="2024.03 – Present" />
        </div>
      </div>
      <div className="admin-tasks-field">
        <label>Tasks (one per line)</label>
        <textarea className="admin-tasks-textarea" value={fields.tasksText} onChange={(e) => set('tasksText', e.target.value)} />
      </div>
      <div className="admin-editor-footer">
        <button className="admin-btn small" onClick={onCancel} disabled={saving}>Cancel</button>
        <button className="admin-btn small primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </>
  );
}

/* ── Admin Shell ───────────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed]           = useState(() => sessionStorage.getItem('admin_auth') === '1');
  const [view, setView]               = useState('dashboard');
  const [activeSection, setSection]   = useState(null);
  const [editItem, setEditItem]       = useState(null);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }, []);

  const logout = () => { sessionStorage.removeItem('admin_auth'); setAuthed(false); };

  const openSection = (s) => { setSection(s); setView('list'); };
  const openEdit    = (item) => { setEditItem(item); setView('edit'); };
  const openNew     = () => { setEditItem(null); setView('new'); };
  const backToDash  = () => { setView('dashboard'); setSection(null); setEditItem(null); };
  const backToList  = () => { setEditItem(null); setView('list'); };

  const saveItem = async (saved) => {
    setSaving(true);
    try {
      const items = await store.get(activeSection.key);
      const idx = items.findIndex((it) => it.id === saved.id);
      const next = idx >= 0 ? items.map((it) => (it.id === saved.id ? saved : it)) : [...items, saved];
      await store.set(activeSection.key, next);
      showToast('Saved');
      backToList();
    } catch (e) {
      showToast('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  /* breadcrumb */
  const crumbs = (() => {
    if (view === 'dashboard') return null;
    const parts = [{ label: 'Dashboard', action: backToDash }];
    if (activeSection) parts.push({ label: activeSection.label, action: backToList });
    if (view === 'edit') parts.push({ label: 'Edit' });
    if (view === 'new')  parts.push({ label: 'New' });
    return parts;
  })();

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  return (
    <div className="admin-root">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-header-title">Admin</span>
          {crumbs && (
            <div className="admin-breadcrumb">
              {crumbs.map((c, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {i > 0 && <span className="sep">/</span>}
                  {c.action
                    ? <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.35)' }} onClick={c.action}>{c.label}</span>
                    : <span>{c.label}</span>}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', textTransform: 'uppercase' }}>
            ← Portfolio
          </Link>
          <button className="admin-btn small" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Body */}
      <div className="admin-body">
        {view === 'dashboard' && (
          <>
            <Dashboard onSelect={openSection} />
            <div className="admin-danger-zone">
              <p className="admin-danger-title">Danger Zone</p>
              <button
                className="admin-btn danger small"
                onClick={async () => {
                  if (!window.confirm('Reset ALL content to defaults? This cannot be undone.')) return;
                  try {
                    await store.resetAll();
                    showToast('All data reset to defaults');
                  } catch (e) {
                    showToast('Error: ' + e.message);
                  }
                }}
              >
                Reset all to defaults
              </button>
            </div>
          </>
        )}

        {view === 'list' && activeSection && (
          <ItemList section={activeSection} onEdit={openEdit} onNew={openNew} />
        )}

        {(view === 'edit' || view === 'new') && activeSection && (
          activeSection.type === 'company' ? (
            <CompanyEditor
              item={view === 'edit' ? editItem : null}
              onSave={saveItem}
              onCancel={backToList}
              saving={saving}
            />
          ) : (
            <ContentEditor
              section={activeSection}
              item={view === 'edit' ? editItem : null}
              onSave={saveItem}
              onCancel={backToList}
              saving={saving}
            />
          )
        )}
      </div>

      <Toast msg={toast} />
    </div>
  );
}
