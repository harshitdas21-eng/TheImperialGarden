import React from 'react'
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
const BASE_URL =  import.meta.env.VITE_BACKEND_URL

const Dash = () => {
  const [plants, setPlants] = useState([]);
  const [filterplant, setfilterPlants] = useState([]);
  const [search, setsearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
const navigate = useNavigate();
  const fetchPlants = async () => {
    const res = await fetch(`${BASE_URL}/api/plant`);
    const data = await res.json();
    setPlants(data.data);
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plant?")) return;

    await fetch(`${BASE_URL}/api/plant/${id}`, {
  method: 'DELETE',
  headers: {
    token: localStorage.getItem('token'),  // ✅ add this
  },})
  fetchPlants()
  }
     const handleLogout = () => {
  localStorage.removeItem('token');
  navigate('/plant/login');
};
  const handleRegenerateQR = async (id) => {
    try {
      if (!window.confirm("Create New QR?")) return;
      const res = await fetch(`${BASE_URL}/api/plant/${id}/qr`);
      const data = await res.json();
      if (data.success) {
        setPlants((prev) =>
          prev.map((p) => (p._id === id ? { ...p, qrCodeUrl: data.qrCodeUrl } : p))
        );
      }
    } catch (err) {
      console.error("QR generation failed", err);
    }
  };

  const filter = () => {
    let copy = plants.slice();
    copy = copy.filter((e) =>
      e.name?.toLowerCase().includes(search.toLowerCase())
    );
    setfilterPlants(copy);
  };

  useEffect(() => {
    filter();
  }, [search, plants]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&family=Noto+Serif:ital,wght@0,400;0,600;1,400&family=Manrope:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --forest: #162D24;
          --forest-mid: #1a3d2b;
          --forest-deep: #0f1f18;
          --cream: #d1c4a1;
          --cream-dim: rgba(209,196,161,0.6);
          --cream-faint: rgba(209,196,161,0.15);
          --cream-ghost: rgba(209,196,161,0.06);
          --border: rgba(209,196,161,0.2);
          --border-hover: rgba(209,196,161,0.5);
          --red: #c0392b;
          --red-dim: rgba(192,57,43,0.15);
          --blue: #5b9bd5;
          --blue-dim: rgba(91,155,213,0.12);
          --sidebar-w: 260px;
        }

        .dash-root {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--forest) 0%, #1B4732 100%);
          font-family: 'Manrope', sans-serif;
          color: var(--cream);
          position: relative;
        }

        /* ─── OVERLAY ─────────────────────────────────────── */
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 40;
        }
        .sidebar-overlay.open { display: block; }

        /* ─── SIDEBAR ─────────────────────────────────────── */
        .sidebar {
          position: fixed;
          left: 0; top: 0;
          width: var(--sidebar-w);
          height: 100vh;
          background: var(--forest-deep);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          z-index: 50;
          transition: transform 0.3s ease;
        }

        .sidebar-brand h1 {
          font-family: 'Dancing Script', cursive;
          font-size: 1.5rem;
          color: var(--cream);
          letter-spacing: 0.02em;
          line-height: 1.2;
        }
        .sidebar-brand p {
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--cream-dim);
          margin-top: 0.25rem;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: var(--border);
          margin: 1.5rem 0;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--cream);
          background: var(--cream-faint);
          border-left: 2px solid var(--cream);
          text-decoration: none;
          font-weight: 600;
        }

        .sidebar-footer {
         /* ✅ proper CSS */
  margin-top: auto;
        }
        .curator {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .curator-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: var(--cream-faint);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Dancing Script', cursive;
          font-size: 1.1rem;
          color: var(--cream);
          flex-shrink: 0;
        }
        .curator-name { font-size: 0.8rem; font-weight: 600; color: var(--cream); }
        .curator-title { font-size: 0.65rem; color: var(--cream-dim); letter-spacing: 0.1em; }

        .add-btn {
          display: block;
          width: 100%;
          padding: 0.875rem 1rem;
          background: var(--cream);
          color: var(--forest);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          transition: background 0.2s, transform 0.1s;
          border: none; cursor: pointer;
        }
        .add-btn:hover { background: #c4b48e; transform: translateY(-1px); }

        /* ─── HEADER ──────────────────────────────────────── */
        .header {
          position: sticky; top: 0; z-index: 30;
          background: rgba(22,45,36,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 0 1.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-left: var(--sidebar-w);
        }

        .hamburger {
          display: none;
          background: none; border: none;
          cursor: pointer;
          padding: 0.25rem;
          color: var(--cream);
          flex-shrink: 0;
        }
        .hamburger svg { display: block; }

        .search-wrap {
          position: relative;
          flex: 1;
          max-width: 400px;
        }
        .search-icon {
          position: absolute;
          left: 0.875rem; top: 50%;
          transform: translateY(-50%);
          color: var(--cream-dim);
          font-size: 0.9rem;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: var(--cream-ghost);
          border: 1px solid var(--border);
          color: var(--cream);
          padding: 0.6rem 1rem 0.6rem 2.5rem;
          font-size: 0.8rem;
          font-family: 'Manrope', sans-serif;
          border-radius: 100px;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input::placeholder { color: rgba(209,196,161,0.3); }
        .search-input:focus { border-color: var(--border-hover); }

        .header-title {
          font-family: 'Dancing Script', cursive;
          font-size: 1.4rem;
          color: var(--cream);
          white-space: nowrap;
        }

        /* ─── MAIN ────────────────────────────────────────── */
        .main {
          margin-left: var(--sidebar-w);
          padding: 2rem 1.5rem 4rem;
          min-height: 100vh;
        }

        /* ─── STATS ───────────────────────────────────────── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          max-width: 480px;
          margin: 0 auto 2.5rem;
        }
        .stat-card {
          background: var(--cream-ghost);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.25rem 1rem;
          text-align: center;
          transition: border-color 0.2s, background 0.2s;
        }
        .stat-card:hover { border-color: var(--border-hover); background: var(--cream-faint); }
        .stat-label {
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--cream-dim);
          margin-bottom: 0.4rem;
        }
        .stat-value {
          font-family: 'Dancing Script', cursive;
          font-size: 2rem;
          color: var(--cream);
          line-height: 1;
        }
        .stat-sub {
          font-size: 0.65rem;
          color: var(--cream-dim);
          letter-spacing: 0.1em;
          margin-top: 0.3rem;
        }

        /* ─── TABLE SECTION ───────────────────────────────── */
        .table-section {
          background: var(--cream-ghost);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }
        .table-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .table-header h4 {
          font-family: 'Dancing Script', cursive;
          font-size: 1.5rem;
          color: var(--cream);
        }
        .table-header p {
          font-size: 0.7rem;
          color: var(--cream-dim);
          letter-spacing: 0.05em;
          margin-top: 0.1rem;
        }
        .filter-btn {
          background: none;
          border: 1px solid var(--border);
          color: var(--cream-dim);
          padding: 0.5rem 1rem;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          transition: all 0.2s;
          border-radius: 3px;
        }
        .filter-btn:hover { border-color: var(--border-hover); color: var(--cream); }

        .table-scroll { overflow-x: auto; }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 500px;
        }
        thead tr {
          background: rgba(209,196,161,0.04);
        }
        th {
          padding: 0.875rem 1.25rem;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--cream-dim);
          font-weight: 600;
        }
        tbody tr {
          border-top: 1px solid var(--border);
          transition: background 0.15s;
        }
        tbody tr:hover { background: var(--cream-faint); }
        td { padding: 1rem 1.25rem; vertical-align: middle; }

        .plant-thumb {
          width: 52px; height: 52px;
          object-fit: cover;
          border: 1px solid var(--border);
          border-radius: 4px;
          flex-shrink: 0;
        }
        .plant-info { display: flex; align-items: center; gap: 0.875rem; }
        .plant-name {
          font-family: 'Noto Serif', serif;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--cream);
        }
        .plant-id {
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: var(--cream-dim);
          margin-top: 0.2rem;
          font-family: 'Manrope', monospace;
        }
        .price {
          font-family: 'Noto Serif', serif;
          font-size: 0.9rem;
          color: var(--cream);
        }
        .qr-thumb {
          width: 48px; height: 48px;
          border: 1px solid var(--border);
          padding: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 3px;
        }
        .qr-thumb img { width: 100%; height: 100%; object-fit: contain; }

        /* ─── ACTION BUTTONS ──────────────────────────────── */
        .actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.25rem; flex-wrap: wrap; }

        .action-btn {
          display: inline-flex; align-items: center; gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          text-decoration: none;
          white-space: nowrap;
          background: none;
        }
        .btn-edit {
          color: var(--cream-dim);
          border-color: var(--border);
        }
        .btn-edit:hover {
          color: var(--cream);
          border-color: var(--border-hover);
          background: var(--cream-faint);
        }
        .btn-delete {
          color: rgba(192,57,43,0.8);
          border-color: rgba(192,57,43,0.2);
        }
        .btn-delete:hover {
          color: #e74c3c;
          background: var(--red-dim);
          border-color: rgba(192,57,43,0.4);
        }
        .btn-qr {
          color: rgba(91,155,213,0.8);
          border-color: rgba(91,155,213,0.2);
        }
        .btn-qr:hover {
          color: var(--blue);
          background: var(--blue-dim);
          border-color: rgba(91,155,213,0.4);
        }

        /* ─── EMPTY STATE ─────────────────────────────────── */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }
        .empty-state p {
          font-family: 'Dancing Script', cursive;
          font-size: 1.5rem;
          color: var(--cream-dim);
        }
        .empty-state span {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(209,196,161,0.25);
          margin-top: 0.5rem;
        }

        /* ─── FOOTER ──────────────────────────────────────── */
        footer {
          margin-top: 3rem;
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
          text-align: center;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(209,196,161,0.25);
        }

        /* ─── RESPONSIVE ──────────────────────────────────── */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .header {
            margin-left: 0;
            padding: 0 1rem;
          }
          .hamburger { display: block; }
          .header-title { font-size: 1.1rem; }
          .main { margin-left: 0; padding: 1.25rem 1rem 3rem; }
          .stats-grid { max-width: 100%; }
          th:nth-child(3) { display: none; }
          td:nth-child(3) { display: none; }
          .action-btn span { display: none; }
          .action-btn { padding: 0.4rem 0.5rem; }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
          .table-header { padding: 1rem; }
          .plant-thumb { width: 40px; height: 40px; }
          .plant-name { font-size: 0.82rem; }
        }
      `}</style>

      <div className="dash-root">

        {/* Overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ─── SIDEBAR ─────────────────────────────────── */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-brand">
            <h1>The Imperial Garden</h1>
            <p>Admin Terminal</p>
          </div>

          <div className="divider" />

          <nav>
            <a className="nav-link" href="#">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              Dashboard
            </a>
          </nav>

          <div className="divider" />

          <div className="sidebar-footer flex flex-col ">
            <div className="curator">
              <div className="curator-avatar">S</div>
              <div>
                <p className="curator-name">Suchismita Das</p>
                <p className="curator-title">Managing Director</p>
              </div>
            </div>
            <Link to="add" className="add-btn ">+ Add New Specimen</Link>
     

<div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(209,196,161,0.1)' }}>
  <button
    onClick={handleLogout}
    className="text-[#d1c4a1]/50 text-xs uppercase  hover:text-[#d1c4a1]"
  >
    Sign Out
  </button>
</div>
    </div>
        </aside>

        {/* ─── HEADER ──────────────────────────────────── */}
        <header className="header">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div className="search-wrap">
            <span className="search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search specimens…"
              onChange={(e) => setsearch(e.target.value)}
            />
          </div>

          <span className="header-title">Archive</span>
        </header>

        {/* ─── MAIN ────────────────────────────────────── */}
        <main className="main">

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Specimens</p>
              <p className="stat-value">{filterplant.length}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Health Status</p>
              <p className="stat-value">92%</p>
              <p className="stat-sub">Optimal</p>
            </div>
          </div>

          {/* Table */}
          <div className="table-section">
            <div className="table-header">
              <div>
                <h4>Biological Archive</h4>
                <p>Catalogued flora &amp; identification tokens</p>
              </div>
              <button className="filter-btn">⊞ Filter</button>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Specimen</th>
                    <th>Price</th>
                    <th>QR Token</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterplant.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <div className="empty-state">
                          <p>No specimens found</p>
                          <span>Try adjusting your search</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filterplant.map((plant) => (
                      <tr key={plant._id}>

                        {/* Specimen */}
                        <td>
                          <div className="plant-info">
                            {plant.imageUrl && (
                              <img src={plant.imageUrl} alt={plant.name} className="plant-thumb" />
                            )}
                            <div>
                              <p className="plant-name">{plant.name}</p>
                              <p className="plant-id">ID — {plant._id.slice(-6).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td>
                          <span className="price">
                            {plant.variants?.length > 0
                              ? `From ₹${Math.min(...plant.variants.map(v => Number(v.price)))}`
                              : `₹${plant.price}`}
                          </span>
                        </td>

                        {/* QR */}
                        <td>
                          {plant.qrCodeUrl && (
                            <div className="qr-thumb">
                              <img src={plant.qrCodeUrl} alt="QR" />
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="actions">
                            <Link to={`edit/${plant._id}`} className="action-btn btn-edit">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              <span>Edit</span>
                            </Link>

                            <button
                              className="action-btn btn-delete"
                              onClick={() => handleDelete(plant._id)}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6M14 11v6"/>
                              </svg>
                              <span>Delete</span>
                            </button>

                            <button
                              className="action-btn btn-qr"
                              onClick={() => handleRegenerateQR(plant._id)}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="3" width="5" height="5"/><rect x="16" y="3" width="5" height="5"/>
                                <rect x="3" y="16" width="5" height="5"/>
                                <path d="M16 16h2v2h-2zM19 16h2v5h-5v-2h3zM16 19h-1v2h1z"/>
                              </svg>
                              <span>New QR</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <footer>
            System v2.4.0 &nbsp;·&nbsp; Imperial Garden Archive Admin &nbsp;·&nbsp; Est. 2026
          </footer>
        </main>

      </div>
    </>
  );
};

export default Dash;

