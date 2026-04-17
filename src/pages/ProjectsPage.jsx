import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageLayout from '../components/PageLayout';
import { useContent } from '../hooks/useContent';

function ProjectList({ projects, onSelect }) {
  return (
    <div className="list-view">
      <h1 className="page-title">Projects</h1>
      <ul className="project-list">
        {projects.map((p, i) => (
          <li key={p.id} className="project-item" onClick={() => onSelect(p)}>
            <span className="item-index">{String(i + 1).padStart(2, '0')}</span>
            <div className="item-body">
              <div className="item-title-row">
                <span className="item-title">{p.title}</span>
                <span className="item-year">{p.year}</span>
              </div>
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

function ProjectDetail({ project, onBack }) {
  return (
    <div className="detail-view">
      <button className="inline-back" onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Projects
      </button>
      {project.thumbnail && (
        <div className="detail-thumbnail">
          <img src={project.thumbnail} alt={project.title} />
        </div>
      )}
      <div className="detail-meta">
        <span className="detail-year">{project.year}</span>
        <div className="item-tags">
          {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
      <article className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.content}</ReactMarkdown>
      </article>
    </div>
  );
}

export default function ProjectsPage({ section }) {
  const [selected, setSelected] = useState(null);
  const storeKey = section === 'design' ? 'designProjects' : 'engineeringProjects';
  const { data: projects, loading } = useContent(storeKey);

  return (
    <PageLayout section={section} category="Projects" backTo="/">
      {loading ? (
        <div className="page-loading">loading…</div>
      ) : selected ? (
        <ProjectDetail project={selected} onBack={() => setSelected(null)} />
      ) : (
        <ProjectList projects={projects} onSelect={setSelected} />
      )}
    </PageLayout>
  );
}
