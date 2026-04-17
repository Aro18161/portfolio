import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageLayout from '../components/PageLayout';
import { useContent } from '../hooks/useContent';

const META = {
  blog:    { storeKey: 'blogPosts', label: 'Blog',    section: 'engineering' },
  essay:   { storeKey: 'essays',    label: 'Essay',   section: 'design' },
  article: { storeKey: 'articles',  label: 'Article', section: 'design' },
};

function PostList({ posts, label, onSelect }) {
  return (
    <div className="list-view">
      <h1 className="page-title">{label}</h1>
      <ul className="blog-list">
        {posts.map((p) => (
          <li key={p.id} className="blog-item" onClick={() => onSelect(p)}>
            <span className="blog-date">{p.date}</span>
            <div className="blog-item-body">
              <span className="item-title">{p.title}</span>
              <div className="item-tags">
                {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <svg className="item-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 3L11 8L5 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PostDetail({ post, label, onBack }) {
  return (
    <div className="detail-view">
      <button className="inline-back" onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {label}
      </button>
      <div className="detail-meta">
        <span className="detail-year">{post.date}</span>
        <div className="item-tags">
          {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
      <article className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
}

export default function BlogPage({ type }) {
  const [selected, setSelected] = useState(null);
  const { storeKey, label, section } = META[type] || META.blog;
  const { data: posts, loading } = useContent(storeKey);

  return (
    <PageLayout section={section} category={label} backTo="/">
      {loading ? (
        <div className="page-loading">loading…</div>
      ) : selected ? (
        <PostDetail post={selected} label={label} onBack={() => setSelected(null)} />
      ) : (
        <PostList posts={posts} label={label} onSelect={setSelected} />
      )}
    </PageLayout>
  );
}
