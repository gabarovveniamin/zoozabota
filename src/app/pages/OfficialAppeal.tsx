import { PageHero } from '../components/PageHero';

export function OfficialAppeal() {
  return (
    <div>
      <PageHero title="Официальное обращение" />

      <div className="container-responsive" style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 100px' }}>
        <div
          className="appeal-card"
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Header strip */}
          <div style={{ backgroundColor: '#d0e0bd', padding: '20px 32px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#222719' }}>
              ОФ «ФОНД ЗАЩИТЫ ЖИВОТНЫХ «ӨМІРГЕ ҮМІТ БЕР»
            </div>
            <div style={{ fontSize: '12px', color: '#556042', marginTop: '4px' }}>
              БИН: 200640028131 · 050054, г. Алматы, район Турксибский, ул. Пограничная, д. 1/1
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(34, 39, 25, 0.15)' }} />

          {/* Content */}
          <div style={{ padding: '40px 48px' }}>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#222719',
                textAlign: 'center',
                marginBottom: '32px',
                letterSpacing: '0.5px',
              }}
            >
              ОБРАЩЕНИЕ К ГРАЖДАНАМ И ОРГАНИЗАЦИЯМ
            </h2>

            <div style={{ fontSize: '15px', color: '#333', lineHeight: 1.8 }}>
              <p style={{ marginBottom: '18px' }}>
                Уважаемые граждане и организации Республики Казахстан!
              </p>
              <p style={{ marginBottom: '18px' }}>
                Общественный фонд «Фонд защиты животных «Өмірге Үміт Бер»» обращается к вам с просьбой поддержать уникальный социальный проект — создание первого в Казахстане мемориального комплекса для домашних животных «ZooZabota».
              </p>
              <p style={{ marginBottom: '18px' }}>
                Ежегодно тысячи казахстанских семей переживают потерю своих питомцев. До сегодняшнего дня в нашей стране не существовало специализированного места, где можно было бы достойно проститься с любимым животным, установить памятник и сохранить о нём светлую память.
              </p>
              <p style={{ marginBottom: '18px' }}>
                Мемориальный комплекс «ZooZabota» призван восполнить этот пробел. Мы планируем создать пространство, в котором каждый питомец найдёт своё последнее пристанище с любовью и достоинством. Комплекс включает зону захоронений, галерею памяти, площадку для прощаний и центр психологической поддержки.
              </p>
              <p style={{ marginBottom: '18px' }}>
                Реализация проекта требует значительных финансовых вложений. Мы обращаемся к неравнодушным гражданам, бизнес-структурам и государственным организациям с просьбой оказать финансовую или иную помощь в строительстве комплекса.
              </p>
              <p style={{ marginBottom: '18px' }}>
                Любая поддержка — денежные пожертвования, строительные материалы, волонтёрский труд или экспертная помощь — будет принята с глубокой благодарностью. Вместе мы можем создать достойное место памяти для наших питомцев.
              </p>
              <p style={{ marginBottom: '32px' }}>
                Наши контактные данные, реквизиты для пожертвований и подробная информация о проекте доступны на сайте zoozabota.kz. Мы открыты для диалога и готовы ответить на все ваши вопросы.
              </p>

              <p style={{ fontWeight: 600, color: '#222719' }}>
                С уважением,<br />
                Фонд защиты животных «Өмірге Үміт Бер»
              </p>
            </div>

            {/* Download button */}
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <button
                style={{
                  backgroundColor: '#d0e0bd',
                  color: '#222719',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '26px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = '#b8cba3'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = '#d0e0bd'; }}
              >
                📄 Скачать PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
