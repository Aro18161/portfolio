import PageLayout from '../components/PageLayout';
import { useContent } from '../hooks/useContent';

const TYPE_LABEL = { work: 'Work', lab: 'Lab', club: 'Club' };

export default function CompanyPage() {
  const { data: companies, loading } = useContent('companies');

  return (
    <PageLayout section="engineering" category="Career" backTo="/">
      {loading ? (
        <div className="page-loading">loading…</div>
      ) : (
        <div className="list-view">
          <h1 className="page-title">Career</h1>
          <ul className="company-list">
            {companies.map((c, i) => (
              <li key={c.id} className="company-item">
                <div className="company-header">
                  <div>
                    <div className="company-name-row">
                      <h2 className="company-name">{c.name}</h2>
                      {c.type && (
                        <span className={`career-type-badge ${c.type}`}>
                          {TYPE_LABEL[c.type] ?? c.type}
                        </span>
                      )}
                    </div>
                    <p className="company-role">
                      <span>{c.role}</span>
                      <span className="role-sep">·</span>
                      <span className="company-period">{c.period}</span>
                    </p>
                  </div>
                  <span className="company-index">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <ul className="task-list">
                  {c.tasks.map((task, ti) => (
                    <li key={ti} className="task-item">
                      <span className="task-dash">—</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageLayout>
  );
}
