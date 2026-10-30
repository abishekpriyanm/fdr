import Link from "next/link";
import { RefreshStatus } from "@/components/refresh-status";
import { checkDatabase } from "@/server/db/health";
import { DEMO_POLICY } from "@/server/policy";
import { applicationDate, formatCalendarDate } from "@/server/policy/dates";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  const database = await checkDatabase();
  const today = applicationDate();

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Portal context">
        <Link className="brand" href="/" aria-label="FDR portal home">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>FDR portal<span className="brand-caption">Deposit case management</span></span>
        </Link>
        <nav aria-label="Main navigation">
          <Link className="nav-item" href="/" aria-current="page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
            Overview
          </Link>
        </nav>
        <div className="sidebar-note">
          <span className="eyebrow">Local prototype</span>
          <p>Synthetic records only.<br />No live bank connection.</p>
          <span className="badge">Phase 0</span>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <span>Workspace <span className="breadcrumb-separator">/</span> <strong>Overview</strong></span>
          <span className="badge">Synthetic demo</span>
        </header>

        <main id="main-content" className="main-content">
          <div className="demo-notice" role="note">
            <span className="notice-symbol" aria-hidden="true">i</span>
            <p><strong>Synthetic demonstration.</strong> All future verification results are simulated. Demo controls do not establish AICTE compliance.</p>
          </div>

          <div className="page-heading">
            <div><p className="eyebrow">FDR workspace</p><h1>Deposit overview</h1><p className="supporting">The foundation for a traceable deposit lifecycle.</p></div>
            <RefreshStatus />
          </div>

          <section className="foundation-panel" aria-labelledby="foundation-heading">
            <div className="panel-heading"><span className="badge">Foundation</span><span className="muted">Phase 0 of 8</span></div>
            <h2 id="foundation-heading">A clear starting point.</h2>
            <p className="panel-description">This workspace is being prepared for FDR submissions, independent review, renewals and release evidence.</p>
            <div className="connection-status" role="status">
              <span className={`status-dot ${database.connected ? "connected" : "unavailable"}`} aria-hidden="true" />
              <div><strong>{database.connected ? "Database connected" : "Database unavailable"}</strong><p>{database.connected ? "The application can reach PostgreSQL. Case records arrive in the next phases." : database.message}</p></div>
            </div>
            <div className="foundation-footer"><span>As of <time dateTime={today}>{formatCalendarDate(today)}</time></span><span>{DEMO_POLICY.timeZone}</span></div>
          </section>

          <section className="policy-section" aria-labelledby="policy-heading">
            <div className="section-heading"><h2 id="policy-heading">Fixed demo policy</h2><code>{DEMO_POLICY.version}</code></div>
            <dl className="policy-grid">
              <div><dt>Currency</dt><dd>{DEMO_POLICY.currency}<span>Indian rupee</span></dd></div>
              <div><dt>Maturity window</dt><dd>{DEMO_POLICY.approachingMaturityWindowDays} days<span>Calendar days, including today</span></dd></div>
              <div><dt>Evidence limit</dt><dd>{DEMO_POLICY.maxPdfBytes / 1024 / 1024} MiB<span>Synthetic PDF documents</span></dd></div>
              <div><dt>Verification</dt><dd className="verification-value">{DEMO_POLICY.verificationMode}<span>Fixture results only</span></dd></div>
            </dl>
          </section>

          <section className="next-section" aria-labelledby="next-heading">
            <div><h2 id="next-heading">Next: secure access & case records</h2><p>Institution accounts, officer and approver access, and persistent case records are planned for Phase 1.</p></div>
            <span className="badge">Not implemented</span>
          </section>
          <footer className="page-footer"><span>FDR portal · Local prototype</span><span>No bank, email, AI or cloud credentials required</span></footer>
        </main>
      </div>
    </div>
  );
}
