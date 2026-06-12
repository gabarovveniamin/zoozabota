import { PageHero } from '../components/PageHero';
import { useLang } from '../i18n/LangContext';

export function Donate() {
  const { t } = useLang();
  const { donate } = t;

  return (
    <div>
      <PageHero title={donate.pageTitle} subtitle={donate.pageSubtitle} />

      <div className="container-responsive" style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 100px' }}>
        {/* Donation cards */}
        <div
          className="donate-flex-row"
          style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {/* Kaspi Card */}
          <div
            className="donate-card-responsive"
            style={{
              width: '560px',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: '#ED1B24',
                padding: '20px 28px',
                color: 'white',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {donate.kaspiTitle}
            </div>

            <div style={{ padding: '28px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                {donate.kaspiRows.map((row) => (
                  <div key={row.label} style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', color: '#556042', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#222719', fontFamily: 'monospace' }}>
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* QR */}
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: '#E2EBD5',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ fontSize: '32px' }}>📱</div>
                <div style={{ fontSize: '10px', color: '#556042', textAlign: 'center' }}>QR-код</div>
              </div>
            </div>
          </div>

          {/* Bank Transfer Card */}
          <div
            className="donate-card-responsive"
            style={{
              width: '560px',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: '#d0e0bd',
                padding: '20px 28px',
                color: '#222719',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {donate.bankTitle}
            </div>

            <div style={{ padding: '28px' }}>
              {donate.bankRows.map((row) => (
                <div key={row.label} style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#556042', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#222719', fontFamily: 'monospace' }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar card */}
        <div
          className="donate-card-responsive"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            padding: '36px 48px',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#222719', margin: '0 0 24px' }}>
            {donate.progressTitle}
          </h3>

          <div
            style={{
              width: '100%',
              height: '16px',
              backgroundColor: '#E2EBD5',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '42%',
                height: '100%',
                backgroundColor: '#d0e0bd',
                borderRadius: '8px',
                transition: 'width 1s ease',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#222719' }}>{donate.progressText}</span>
            <span style={{ fontSize: '13px', color: '#556042' }}>{donate.progressGoal}</span>
          </div>
        </div>

        {/* Plan Image */}
        <div
          style={{
            marginTop: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="/image/plan.jpg"
            alt="Construction Plan"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '700px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  );
}
