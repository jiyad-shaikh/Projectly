import Sidebar from "../Sidebar/Sidebar";
import "./PageShell.scss";

function PageShell({
  children,
  sidebarOpen,
  onSidebarOpen,
  onSidebarClose
}) {
  return (
    <div className="page-shell">

      <div className="page-shell__glow page-shell__glow--one"></div>
      <div className="page-shell__glow page-shell__glow--two"></div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={onSidebarClose}
      />

      <main className="page-shell__main">

        <div className="page-shell__mobile-header">
          <button
            className="page-shell__menu-btn"
            onClick={onSidebarOpen}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="page-shell__mobile-logo">
            <div className="page-shell__mobile-logo-mark">
              P
            </div>

            <strong>Projectly</strong>
          </div>
        </div>

        <div className="page-shell__content">
          {children}
        </div>

      </main>
    </div>
  );
}

export default PageShell;