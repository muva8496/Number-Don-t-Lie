import React from 'react';
import { ArrowRight, LayoutDashboard, Database, TrendingUp, ShieldCheck } from 'lucide-react';

interface DashboardRoomViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardRoomView: React.FC<DashboardRoomViewProps> = ({ onNavigate }) => {
  return (
    <article className="reading-container">
      <header className="author-header">
        <h1 className="author-title">The Dashboard Room</h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--gold-light)', fontStyle: 'italic', marginTop: '0.35rem' }}>
          Curated Power BI business intelligence: Star schemas, DAX context modeling, and decision-grade reporting.
        </p>
      </header>

      <div className="chapter-content drop-cap-p">
        <p>
          Most corporate dashboards resemble pinball machines: flickering neon KPIs, decorative 3D gauges, and dozens of disconnected charts vying for attention. They are designed to look impressive in boardroom presentations rather than provide unambiguous operational guidance.
        </p>

        <p>
          In this room, I showcase my <strong>Power BI</strong> production artifacts. Each dashboard is designed following three non-negotiable principles:
        </p>

        <ol>
          <li>
            <strong>Strict Star Schema:</strong> Kimballed dimensional modeling with dedicated fact tables, single-direction one-to-many filtering, and zero bi-directional relationships.
          </li>
          <li>
            <strong>Context-Rich DAX:</strong> Measures that account for calendar seasonality, working-day shifts, and non-additive grains rather than simple <code>SUM()</code> shortcuts.
          </li>
          <li>
            <strong>High Data-to-Ink Ratio:</strong> High contrast, muted neutral canvas, zero ornamental clutter, and contextual micro-trends next to every variance figure.
          </li>
        </ol>

        <h2>01. East African FMCG Distributor Liquidity &amp; Route Engine</h2>

        {/* High-Fidelity Styled Wireframe Container */}
        <div className="book-figure">
          <div className="book-figure-img-wrap" style={{ flexDirection: 'column', padding: '2rem 1.5rem', background: '#06150e', border: '1px dashed var(--gold-border)' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold-primary)', fontWeight: 700 }}>
                FMCG ROUTE LIQUIDITY MONITOR · POWER BI MODEL v3.2
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                [PROD_SEMANTIC_MODEL: 1.4M Rows]
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%', marginBottom: '1.25rem' }}>
              <div style={{ background: '#092016', padding: '1rem', borderLeft: '3px solid var(--gold-primary)', borderRadius: '2px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Days Sales Outstanding (DSO)</span>
                <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>14.2 Days</div>
                <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>▼ -2.4d vs Target (16.6d)</span>
              </div>
              <div style={{ background: '#092016', padding: '1rem', borderLeft: '3px solid #b8933b', borderRadius: '2px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stockout Risk Index</span>
                <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>6.8%</div>
                <span style={{ fontSize: '0.75rem', color: '#f87171' }}>▲ +1.1% in Cooking Oil</span>
              </div>
              <div style={{ background: '#092016', padding: '1rem', borderLeft: '3px solid var(--gold-primary)', borderRadius: '2px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>M-Pesa Till vs Cash Ratio</span>
                <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>71.4%</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>Digital settlement dominant</span>
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              [AUTHOR PLACEHOLDER: Replace this structured CSS wireframe with your full-bleed dashboard screenshot: <code>assets/images/dashboards/fmcg-liquidity-overview.png</code>]
            </span>
          </div>
          <figcaption className="book-figcaption">
            <p className="figure-caption-text">
              Figure D.1: Production dashboard tracking cash collections, delivery lorry reconciliation, and stockouts across 42 urban retail distribution corridors in Nairobi.
            </p>
            <div className="figure-takeaway">
              <span className="takeaway-label">Operational Walkthrough:</span>
              <span>Replaced 14 static end-of-day Excel sheets with a unified semantic model refreshed hourly via automated Power Query endpoints.</span>
            </div>
          </figcaption>
        </div>

        <h3>Architectural Walkthrough</h3>
        <ul>
          <li><strong>The Core Problem:</strong> Delivery vans left the depot at 5:00 AM loaded with inventory. Shopkeepers paid via a chaotic mix of M-Pesa merchant paybills, post-dated cheques, and cash. Management had no visibility into end-of-day cash reconciliation until 48 hours later.</li>
          <li><strong>Data Engineering:</strong> Power Query (M) scripts extract API payloads from the distributor ERP and Safaricom Daraja C2B webhook databases into an Azure SQL staging lake.</li>
          <li><strong>DAX Pattern:</strong> Semi-additive inventory snapshotting measuring closing warehouse balances without cross-row cartesian multiplication:
            <pre className="my-4"><code>{`Closing Stock Value = 
CALCULATE(
    SUM('FactInventorySnapshot'[StockValueKES]),
    LASTDATE('DimDate'[Date])
)`}</code></pre>
          </li>
        </ul>

        <h2>02. Nairobi Paratransit SACCO Fleet Dispatch &amp; Variance</h2>

        <div className="book-figure">
          <div className="book-figure-img-wrap" style={{ flexDirection: 'column', padding: '2rem 1.5rem', background: '#06150e', border: '1px dashed var(--gold-border)' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold-primary)', fontWeight: 700 }}>
                MATATU FLEET DISPATCH &amp; STAGE MARGIN MONITOR
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                [PROD_SEMANTIC_MODEL: 85 Vehicles]
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%', marginBottom: '1.25rem' }}>
              <div style={{ background: '#092016', padding: '1rem', borderLeft: '3px solid var(--gold-primary)', borderRadius: '2px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vehicle Utilization Rate</span>
                <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>88.2%</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>14.4 operating hrs/day</span>
              </div>
              <div style={{ background: '#092016', padding: '1rem', borderLeft: '3px solid #b8933b', borderRadius: '2px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fuel Burn / Trip Ratio</span>
                <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>KES 2,450</div>
                <span style={{ fontSize: '0.75rem', color: '#f87171' }}>▲ +12% during peak jams</span>
              </div>
              <div style={{ background: '#092016', padding: '1rem', borderLeft: '3px solid var(--gold-primary)', borderRadius: '2px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SACCO Stage Levy Recovery</span>
                <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700 }}>99.1%</div>
                <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>Zero uncollected trips</span>
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              [AUTHOR PLACEHOLDER: Replace this structured CSS wireframe with your dashboard screenshot: <code>assets/images/dashboards/sacco-fleet-dispatch.png</code>]
            </span>
          </div>
          <figcaption className="book-figcaption">
            <p className="figure-caption-text">
              Figure D.2: Executive reporting view built for matatu cooperative executives to balance route frequencies against driver daily remittances.
            </p>
            <div className="figure-takeaway">
              <span className="takeaway-label">Operational Walkthrough:</span>
              <span>Introduced dynamic drill-through from route overview into individual vehicle trip logs, cutting unrecorded staging idling by 22%.</span>
            </div>
          </figcaption>
        </div>

        <div className="mt-12 p-6 rounded-sm bg-[#0d221a] border border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-lg text-[#f5f2ea]">Need a Custom Semantic Architecture?</h4>
            <p className="text-xs text-[#c9c3b4] mt-1">
              I build Kimball-compliant Star Schemas and high-performance DAX models for East African enterprises.
            </p>
          </div>
          <button
            onClick={() => onNavigate('work-with-me')}
            className="btn-book-toc whitespace-nowrap cursor-pointer"
          >
            Work with Me &rarr;
          </button>
        </div>
      </div>
    </article>
  );
};
