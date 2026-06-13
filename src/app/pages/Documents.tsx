import { PageHero } from '../components/PageHero';
import { useLang } from '../i18n/LangContext';

export function Documents() {
  const { t } = useLang();
  const { agreement } = t;

  const documentList = [
    {
      title: t.lang === 'ru' ? 'Публичный договор-оферта' : t.lang === 'kz' ? 'Жария оферта шарты' : 'Public Offer Agreement',
      description: t.lang === 'ru' ? 'Регулирует порядок оказания услуг мемориального комплекса.' : t.lang === 'kz' ? 'Мемориалды кешеннің қызмет көрсету тәртібін реттейді.' : 'Regulates the procedure for rendering services of the memorial complex.',
      fileName: 'public_offer_zoozabota.pdf'
    },
    {
      title: t.lang === 'ru' ? 'Правила посещения комплекса' : t.lang === 'kz' ? 'Кешенге келу ережелері' : 'Rules of Visiting the Complex',
      description: t.lang === 'ru' ? 'Правила поведения на территории колумбария и мемориала.' : t.lang === 'kz' ? 'Колумбарий мен мемориал аумағындағы мінез-құлық ережелері.' : 'Rules of conduct on the territory of the columbarium and memorial.',
      fileName: 'rules_and_regulations.pdf'
    },
    {
      title: t.lang === 'ru' ? 'Политика конфиденциальности' : t.lang === 'kz' ? 'Құпиялылық саясаты' : 'Privacy Policy',
      description: t.lang === 'ru' ? 'Правила сбора, обработки и защиты персональных данных.' : t.lang === 'kz' ? 'Жеке деректерді жинау, өңдеу және қорғау ережелері.' : 'Rules for collection, processing, and protection of personal data.',
      fileName: 'privacy_policy_zoozabota.pdf'
    },
    {
      title: t.lang === 'ru' ? 'Устав фонда «Өмірге Үміт Бер»' : t.lang === 'kz' ? '«Өмірге Үміт Бер» қорының жағымдамасы' : 'Charter of the Foundation «Ömirge Ümit Ber»',
      description: t.lang === 'ru' ? 'Учредительный документ общественного фонда.' : t.lang === 'kz' ? 'Қоғамдық қордың құрылтай құжаты.' : 'Founding document of the public fund.',
      fileName: 'charter_omirge_umit_ber.pdf'
    }
  ];

  return (
    <div>
      <PageHero title={agreement.title} />

      <div className="container-responsive" style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Introductory Section */}
          <div 
            style={{ 
              backgroundColor: '#fff',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              border: '1px solid rgba(208, 224, 189, 0.4)',
              lineHeight: 1.8,
              color: '#556042',
              fontSize: '16px'
            }}
          >
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#222719', marginBottom: '20px' }}>{agreement.p1}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0 }}>{agreement.p2}</p>
              <p style={{ margin: 0 }}>{agreement.p3}</p>
              <p style={{ margin: 0 }}>{agreement.p4}</p>
              <p style={{ margin: 0 }}>{agreement.p5}</p>
            </div>
          </div>

          {/* Documents Download Section */}
          <div>
            <h2 
              style={{ 
                fontSize: '22px', 
                fontWeight: 700, 
                color: '#222719', 
                marginBottom: '24px' 
              }}
            >
              {t.lang === 'ru' ? 'Официальные документы для ознакомления' : t.lang === 'kz' ? 'Танысу үшін ресми құжаттар' : 'Official Documents for Review'}
            </h2>

            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '24px' 
              }}
            >
              {documentList.map((doc, idx) => (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
                  }}
                  onClick={() => alert(t.lang === 'ru' ? 'Файл подготавливается к загрузке' : t.lang === 'kz' ? 'Файл жүктеуге дайындалуда' : 'File is preparing for download')}
                >
                  <div>
                    <div 
                      style={{ 
                        fontSize: '36px', 
                        marginBottom: '16px',
                        display: 'inline-block',
                        color: '#6E8B51' 
                      }}
                    >
                      📄
                    </div>
                    <h3 
                      style={{ 
                        fontSize: '16px', 
                        fontWeight: 700, 
                        color: '#222719', 
                        margin: '0 0 8px 0',
                        lineHeight: 1.4
                      }}
                    >
                      {doc.title}
                    </h3>
                    <p 
                      style={{ 
                        fontSize: '13px', 
                        color: '#777', 
                        margin: '0 0 20px 0',
                        lineHeight: 1.5 
                      }}
                    >
                      {doc.description}
                    </p>
                  </div>
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      borderTop: '1px solid #f0f0f0',
                      paddingTop: '12px',
                      fontSize: '12px',
                      color: '#6E8B51',
                      fontWeight: 600
                    }}
                  >
                    <span>{doc.fileName}</span>
                    <span>⬇️</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
