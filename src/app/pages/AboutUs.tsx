import { PageHero } from '../components/PageHero';
import { useLang } from '../i18n/LangContext';

export function AboutUs() {
  const { t } = useLang();
  const { about } = t;

  return (
    <div>
      <PageHero title={about.subtitle} />
      
      <div className="container-responsive" style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 100px' }}>
        <div 
          className="aboutus-flex"
          style={{ 
            display: 'flex', 
            gap: '60px', 
            alignItems: 'center', 
            justifyContent: 'space-between'
          }}
        >
          {/* Text block */}
          <div style={{ flex: 1, minWidth: '320px' }}>
            <div 
              style={{ 
                fontSize: '16px', 
                color: '#556042', 
                lineHeight: 1.8, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '18px' 
              }}
            >
              <p style={{ fontSize: '18px', fontWeight: 500, color: '#222719', margin: 0 }}>{about.p1}</p>
              <p style={{ margin: 0 }}>{about.p2}</p>
              <p style={{ margin: 0 }}>{about.p3}</p>
              <p style={{ margin: 0 }}>{about.p4}</p>
              <p style={{ margin: 0 }}>{about.p5}</p>
            </div>
            
            <div 
              style={{ 
                marginTop: '36px', 
                padding: '20px 24px', 
                borderLeft: '4px solid #6E8B51', 
                backgroundColor: 'rgba(208, 224, 189, 0.25)', 
                borderRadius: '0 16px 16px 0',
                fontStyle: 'italic',
                fontWeight: 600,
                color: '#222719',
                fontSize: '16px',
                lineHeight: 1.5
              }}
            >
              {about.slogan}
            </div>
          </div>
          
          {/* Image block */}
          <div 
            className="aboutus-img-container"
            style={{ 
              flex: 1, 
              maxWidth: '560px', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            <img 
              src="/image/aboutus.PNG" 
              alt="ZooZabota About Us" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                display: 'block',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
