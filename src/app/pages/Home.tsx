import { Link } from 'react-router';
import { ServiceCard } from '../components/ServiceCard';
import { useLang } from '../i18n/LangContext';

export function Home() {
  const { t } = useLang();
  const { home } = t;

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(to right, #d0e0bd, #b8cba3)',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="hero-flex-responsive container-responsive"
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 100px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '60px',
          }}
        >
          {/* Left text */}
          <div style={{ flex: 1, maxWidth: '580px' }}>
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 700,
                color: '#222719',
                margin: '0 0 20px',
                lineHeight: 1.15,
                whiteSpace: 'pre-line',
              }}
            >
              {home.heroTitle}
            </h1>
            <p
              style={{
                fontSize: '20px',
                color: '#3d4730',
                margin: '0 0 36px',
                lineHeight: 1.6,
              }}
            >
              {home.heroSubtitle}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                to="/services"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'white',
                  color: '#222719',
                  padding: '14px 32px',
                  borderRadius: '26px',
                  fontSize: '16px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                {home.btnServices}
              </Link>
              <Link
                to="/donate"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'transparent',
                  color: '#222719',
                  padding: '14px 32px',
                  borderRadius: '26px',
                  fontSize: '16px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '2px solid #222719',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(34,39,25,0.08)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              >
                {home.btnDonate}
              </Link>
            </div>
          </div>

          {/* Right decorative logo */}
          <div
            style={{
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 39, 25, 0.08)',
              border: '2px solid rgba(34, 39, 25, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <img
              src="/image/LogoOrig.svg"
              alt="ZooZabota Logo"
              style={{ width: '200px', height: '200px', transform: 'scale(3.2)' }}
            />
          </div>
        </div>
      </section>
      {/* Stats Strip */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '40px 0',
        }}
      >
        <div
          className="stats-container-responsive container-responsive"
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 100px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: '160px',
            alignItems: 'center',
          }}
        >
          {home.stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#222719' }}>{stat.number}</div>
              <div style={{ fontSize: '13px', color: '#556042' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Welcome Image Section */}
      <section className="flyer-section-responsive container-responsive" style={{ maxWidth: '1440px', margin: '60px auto 0', padding: '0 100px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="/image/welcome.jpg"
            alt="Welcome Flyer"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '650px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </section>

      {/* О проекте Section */}
      <section className="about-section-responsive container-responsive" style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 100px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#222719', margin: '0 0 20px' }}>
          {home.aboutTitle}
        </h2>
        <p style={{ fontSize: '16px', color: '#556042', lineHeight: 1.7, maxWidth: '800px', margin: '0 0 16px' }}>
          {home.aboutP1}
        </p>
        <p style={{ fontSize: '16px', color: '#556042', lineHeight: 1.7, maxWidth: '800px', margin: '0 0 48px' }}>
          {home.aboutP2}
        </p>

        {/* Preview cards */}
        <div className="preview-cards-responsive" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {home.previewCards.map((card, i) => (
            <ServiceCard key={i} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
