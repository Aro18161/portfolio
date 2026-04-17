import PageLayout from '../components/PageLayout';
import { useContent } from '../hooks/useContent';

export default function CompanyPage() {
  const { data: companies, loading } = useContent('companies');

  return (
    <PageLayout section="engineering" category="Company" backTo="/">
      {loading ? (
        <div className="page-loading">loading…</div>
      ) : (
        <div className="list-view">
          <h1 className="page-title">Company</h1>
          <ul className="company-list">
            {companies.map((c, i) => (
              <li key={c.id} className="company-item">
                <div className="company-header">
                  <div>
                    <h2 className="company-name">{c.name}</h2>
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
