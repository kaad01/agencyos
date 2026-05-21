import './../../../styles/tokens.css';

/**
 * /tokens — Design system swatch board.
 * Server component. No client JS, no extra deps.
 */

const neutralSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const semantic = ['success', 'warning', 'danger', 'info'] as const;
const spacingSteps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const typeSteps = ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
const shadowSteps = [1, 2, 3, 4] as const;

const sectionStyle: React.CSSProperties = {
  padding: 'var(--space-7) var(--space-6)',
  borderBottom: '1px solid var(--color-border)',
};

const h2Style: React.CSSProperties = {
  fontSize: 'var(--text-xl)',
  lineHeight: 'var(--leading-xl)',
  margin: '0 0 var(--space-5) 0',
  color: 'var(--color-text)',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: 'var(--space-3)',
};

function Swatch({ name, value, fg }: { name: string; value: string; fg?: string }) {
  return (
    <div style={{
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      boxShadow: 'var(--shadow-1)',
    }}>
      <div style={{
        height: 64,
        background: value,
        color: fg ?? 'var(--color-neutral-50)',
        display: 'flex',
        alignItems: 'flex-end',
        padding: 'var(--space-2)',
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-mono)',
      }}>{name}</div>
      <div style={{
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-mono)',
      }}>{value}</div>
    </div>
  );
}

export default function TokensPage() {
  return (
    <main style={{
      background: 'var(--color-bg)',
      color: 'var(--color-text)',
      fontFamily: 'var(--font-sans)',
      minHeight: '100vh',
    }}>
      <header style={{ ...sectionStyle, padding: 'var(--space-9) var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', lineHeight: 'var(--leading-3xl)', margin: 0 }}>
          Design Tokens
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
          Tier 1 swatch board. Toggle theme by setting{' '}
          <code style={{ fontFamily: 'var(--font-mono)' }}>data-theme=&quot;dark&quot;</code> on{' '}
          <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;html&gt;</code>.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Neutral</h2>
        <div style={gridStyle}>
          {neutralSteps.map((step) => (
            <Swatch
              key={step}
              name={`neutral-${step}`}
              value={`var(--color-neutral-${step})`}
              fg={step >= 400 ? 'var(--color-neutral-50)' : 'var(--color-neutral-900)'}
            />
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Brand</h2>
        <div style={gridStyle}>
          <Swatch name="brand-primary" value="var(--color-brand-primary)" />
          <Swatch name="brand-primary-hover" value="var(--color-brand-primary-hover)" />
          <Swatch name="brand-accent" value="var(--color-brand-accent)" />
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Semantic</h2>
        <div style={gridStyle}>
          {semantic.map((s) => (
            <Swatch key={s} name={s} value={`var(--color-${s})`} />
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Spacing (4px grid)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {spacingSteps.map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 80, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                --space-{s}
              </div>
              <div style={{
                height: 16,
                width: `var(--space-${s})`,
                background: 'var(--color-brand-primary)',
                borderRadius: 'var(--radius-sm)',
              }} />
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Type scale</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {typeSteps.map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-5)' }}>
              <div style={{ width: 60, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {t}
              </div>
              <div style={{ fontSize: `var(--text-${t})`, lineHeight: `var(--leading-${t})` }}>
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Shadows</h2>
        <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          {shadowSteps.map((s) => (
            <div key={s} style={{
              height: 110,
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: `var(--shadow-${s})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
            }}>
              shadow-{s}
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...sectionStyle, borderBottom: 'none' }}>
        <h2 style={h2Style}>Radii</h2>
        <div style={gridStyle}>
          {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((r) => (
            <div key={r} style={{
              height: 80,
              background: 'var(--color-surface-muted)',
              border: '1px solid var(--color-border)',
              borderRadius: `var(--radius-${r})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
            }}>
              radius-{r}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
