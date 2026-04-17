import { Link } from 'react-router-dom';
import PixelSidebar from './PixelSidebar';

export default function PageLayout({ section, category, backTo, children }) {
  const isDesign = section === 'design';
  const sectionLabel = isDesign ? 'Design' : 'Engineering';

  return (
    <div className="subpage-root">
      {/* Left: Pixel Mountain Sidebar */}
      <aside className="subpage-sidebar">
        <PixelSidebar />
        <div className="sidebar-label">
          <span className={`sidebar-section-name ${isDesign ? 'font-garamond' : 'font-mono'}`}>
            {sectionLabel}
          </span>
        </div>
      </aside>

      {/* Right: Content */}
      <div className="subpage-content">
        {/* Header */}
        <header className="subpage-header">
          <Link to={backTo || '/'} className="back-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>
          <span className="subpage-breadcrumb">
            <span>{sectionLabel}</span>
            <span className="breadcrumb-sep">/</span>
            <span>{category}</span>
          </span>
        </header>

        {/* Page Body */}
        <main className="subpage-body">
          {children}
        </main>
      </div>
    </div>
  );
}
