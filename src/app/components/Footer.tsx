import { useLang } from '../i18n/LangContext';

export function Footer() {
  const { t } = useLang();
  return (
    <footer
      style={{
        backgroundColor: '#d0e0bd',
        padding: '40px 0',
        color: '#222719',
      }}
    >
      <div
        className="container-responsive"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 100px',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '32px',
        }}
      >
        {/* Left section: copyright & address */}
        <div style={{ flex: '1 1 300px', minWidth: '240px' }}>
          <span style={{ fontWeight: 700, fontSize: '18px', display: 'block', marginBottom: '12px' }}>ZooZabota</span>
          <p style={{ fontSize: '14px', margin: '0 0 8px', lineHeight: 1.5 }}>
            {t.footer.copy}
          </p>
          <p style={{ color: '#556042', fontSize: '13px', margin: 0 }}>
            {t.footer.address}
          </p>
        </div>

        {/* Middle section: Director */}
        <div style={{ flex: '1 1 250px', minWidth: '200px' }}>
          <span style={{ fontWeight: 600, fontSize: '12px', color: '#556042', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '12px' }}>
            {t.footer.directorTitle}
          </span>
          <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
            Ювашева Лилия Вениаминовна
          </p>
        </div>

        {/* Right section: Contacts */}
        <div style={{ flex: '1 1 250px', minWidth: '200px' }}>
          <span style={{ fontWeight: 600, fontSize: '12px', color: '#556042', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '12px' }}>
            {t.footer.contactsTitle}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <a href="tel:+77088152038" style={{ color: '#222719', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📞 +7 (708) 815-20-38
            </a>
            <a href="tel:+77082996975" style={{ color: '#222719', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📞 +7 (708) 299-69-75
            </a>
          </div>
        </div>

        {/* Far right: Socials */}
        <div style={{ flex: '1 1 200px', minWidth: '160px' }}>
          <span style={{ fontWeight: 600, fontSize: '12px', color: '#556042', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '12px' }}>
            {t.footer.socialsTitle}
          </span>
          <a 
            href="https://instagram.com/zoo_zabota.kz" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#222719', 
              textDecoration: 'none', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: 'rgba(255,255,255,0.4)',
              padding: '8px 16px',
              borderRadius: '20px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)'; }}
          >
            📸 @zoo_zabota.kz
          </a>
        </div>
      </div>
    </footer>
  );
}
