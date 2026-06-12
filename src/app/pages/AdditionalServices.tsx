import { PageHero } from '../components/PageHero';
import { useLang } from '../i18n/LangContext';

const EMOJIS = ['🏪', '🤝', '🏠', '🐾'];

export function AdditionalServices() {
  const { t } = useLang();
  const { extra } = t;

  return (
    <div>
      <PageHero title={extra.pageTitle} />

      <div className="container-responsive" style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 100px' }}>
        <div
          className="additional-services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 620px)',
            gap: '28px',
            justifyContent: 'center',
          }}
        >
          {extra.services.map((service, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '28px 32px',
                borderLeft: '6px solid #d0e0bd',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ fontSize: '52px', flexShrink: 0 }}>{EMOJIS[i]}</div>

              <div style={{ flex: 1 }}>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#d0e0bd',
                    color: '#222719',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '10px',
                    marginBottom: '8px',
                  }}
                >
                  {service.tag}
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#222719', margin: '0 0 8px' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#556042', margin: 0, lineHeight: 1.6 }}>
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
