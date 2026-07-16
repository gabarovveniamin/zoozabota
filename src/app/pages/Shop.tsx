import { Link } from 'react-router';
import { PageHero } from '../components/PageHero';
import { useLang } from '../i18n/LangContext';

const LOCALIZED = {
  ru: {
    back: '← Назад к услугам',
    statusTitle: 'Витрина наполняется',
    statusDesc: 'В данный момент мы настраиваем каталог товаров. Совсем скоро здесь появится возможность приобрести качественные корма, аксессуары и памятные вещи для ваших питомцев.',
    adminNotice: 'Управление ассортиментом товаров будет осуществляться через панель администратора.',
    categories: [
      { emoji: '🍖', title: 'Корма и лакомства', desc: 'Премиальные рационы для собак и кошек' },
      { emoji: '🧶', title: 'Игрушки и аксессуары', desc: 'Развивающие игрушки, поводки и ошейники' },
      { emoji: '💊', title: 'Уход и гигиена', desc: 'Шампуни, щетки и средства для здоровья' }
    ],
    soon: 'Скоро в продаже'
  },
  kz: {
    back: '← Қызметтерге қайту',
    statusTitle: 'Витрина толтырылуда',
    statusDesc: 'Қазіргі уақытта біз тауарлар каталогын реттеп жатырмыз. Жақын арада мұнда үй жануарларыңызға арналған сапалы жем-шөптерді, аксессуарларды және естелік заттарды сатып алу мүмкіндігі пайда болады.',
    adminNotice: 'Тауарлар ассортиментін басқару әкімшілік панель арқылы жүзеге асырылатын болады.',
    categories: [
      { emoji: '🍖', title: 'Жем мен тәттілер', desc: 'Иттер мен мысықтарға арналған премиум рациондар' },
      { emoji: '🧶', title: 'Ойыншықтар мен аксессуарлар', desc: 'Дамытушы ойыншықтар, қарғыбаулар мен мойын жіптер' },
      { emoji: '💊', title: 'Күтім және гигиена', desc: 'Сусабындар, қылшақтар және денсаулыққа арналған құралдар' }
    ],
    soon: 'Жақында сатылымда'
  },
  en: {
    back: '← Back to services',
    statusTitle: 'Showcase is being stocked',
    statusDesc: 'We are currently setting up the product catalog. Soon you will be able to purchase high-quality food, accessories, and memorial items for your pets here.',
    adminNotice: 'Product inventory management will be handled through the administration panel.',
    categories: [
      { emoji: '🍖', title: 'Food & Treats', desc: 'Premium diets for dogs and cats' },
      { emoji: '🧶', title: 'Toys & Accessories', desc: 'Educational toys, leashes, and collars' },
      { emoji: '💊', title: 'Care & Hygiene', desc: 'Shampoos, brushes, and wellness products' }
    ],
    soon: 'Coming Soon'
  }
};

export function Shop() {
  const { lang, t } = useLang();
  const text = LOCALIZED[lang as 'ru' | 'kz' | 'en'] || LOCALIZED.ru;

  return (
    <div>
      <PageHero title={t.extra.services[0].title} />

      <div className="container-responsive" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 100px' }}>
        
        {/* Back Link */}
        <Link
          to="/extra"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#556042',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '15px',
            marginBottom: '32px',
            gap: '8px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#222719')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#556042')}
        >
          {text.back}
        </Link>

        {/* Status Section */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '48px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.04)',
            textAlign: 'center',
            marginBottom: '48px'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#f7faf3',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              margin: '0 auto 24px',
              border: '2px dashed #d0e0bd'
            }}
          >
            🛍️
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#222719', margin: '0 0 16px' }}>
            {text.statusTitle}
          </h2>

          <p style={{ fontSize: '16px', color: '#556042', maxWidth: '640px', margin: '0 auto 16px', lineHeight: 1.6 }}>
            {text.statusDesc}
          </p>

          <p style={{ fontSize: '14px', color: '#8c9c72', fontStyle: 'italic', margin: 0 }}>
            ℹ️ {text.adminNotice}
          </p>
        </div>

        {/* Skeleton Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}
        >
          {text.categories.map((cat, i) => (
            <div
              key={i}
              style={{
                border: '2px dashed #D8E8C8',
                borderRadius: '20px',
                padding: '32px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d0e0bd';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#D8E8C8';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Badge */}
              <span
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: '#E2EBD5',
                  color: '#556042',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {text.soon}
              </span>

              <div style={{ fontSize: '48px', marginBottom: '16px', marginTop: '12px' }}>
                {cat.emoji}
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#222719', margin: '0 0 8px' }}>
                {cat.title}
              </h3>

              <p style={{ fontSize: '13px', color: '#556042', margin: 0, lineHeight: 1.5 }}>
                {cat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
