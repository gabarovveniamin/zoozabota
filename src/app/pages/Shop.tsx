import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { PageHero } from '../components/PageHero';
import { useLang } from '../i18n/LangContext';
import { shopItemsApi, type ShopItem } from '../db/api';

const LOCALIZED = {
  ru: {
    back: '← Назад к услугам',
    statusTitle: 'Витрина наполняется',
    statusDesc: 'В данный момент мы настраиваем каталог товаров. Совсем скоро здесь появится возможность приобрести качественные корма, аксессуары и памятные вещи для ваших питомцев.',
    adminNotice: 'Управление ассортиментом товаров осуществляется через панель администратора.',
    categories: [
      { emoji: '🍖', title: 'Корма и лакомства', desc: 'Премиальные рационы для собак и кошек' },
      { emoji: '🧶', title: 'Игрушки и аксессуары', desc: 'Развивающие игрушки, поводки и ошейники' },
      { emoji: '💊', title: 'Уход и гигиена', desc: 'Шампуни, щетки и средства для здоровья' }
    ],
    soon: 'Скоро в продаже',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
    buyBtn: 'Заказать через WhatsApp',
    contactText: 'Здравствуйте! Меня интересует товар: ',
    loading: 'Загрузка товаров...'
  },
  kz: {
    back: '← Қызметтерге қайту',
    statusTitle: 'Витрина толтырылуда',
    statusDesc: 'Қазіргі уақытта біз тауарлар каталогын реттеп жатырмыз. Жақын арада мұнда үй жануарларыңызға арналған сапалы жем-шөптерді, аксессуарларды және естелік заттарды сатып алу мүмкіндігі пайда болады.',
    adminNotice: 'Тауарлар ассортиментін басқару әкімшілік панель арқылы жүзеге асырылады.',
    categories: [
      { emoji: '🍖', title: 'Жем мен тәттілер', desc: 'Иттер мен мысықтарға арналған премиум рациондар' },
      { emoji: '🧶', title: 'Ойыншықтар мен аксессуарлар', desc: 'Дамытушы ойыншықтар, қарғыбаулар мен мойын жіптер' },
      { emoji: '💊', title: 'Күтім және гигиена', desc: 'Сусабындар, қылшақтар және денсаулыққа арналған құралдар' }
    ],
    soon: 'Жақында сатылымда',
    inStock: 'Қоймада бар',
    outOfStock: 'Қоймада жоқ',
    buyBtn: 'WhatsApp арқылы тапсырыс беру',
    contactText: 'Сәлеметсіз бе! Мені мына тауар қызықтырады: ',
    loading: 'Тауарлар жүктелуде...'
  },
  en: {
    back: '← Back to services',
    statusTitle: 'Showcase is being stocked',
    statusDesc: 'We are currently setting up the product catalog. Soon you will be able to purchase high-quality food, accessories, and memorial items for your pets here.',
    adminNotice: 'Product inventory management is handled through the administration panel.',
    categories: [
      { emoji: '🍖', title: 'Food & Treats', desc: 'Premium diets for dogs and cats' },
      { emoji: '🧶', title: 'Toys & Accessories', desc: 'Educational toys, leashes, and collars' },
      { emoji: '💊', title: 'Care & Hygiene', desc: 'Shampoos, brushes, and wellness products' }
    ],
    soon: 'Coming Soon',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    buyBtn: 'Order via WhatsApp',
    contactText: 'Hello! I am interested in the product: ',
    loading: 'Loading items...'
  }
};

export function Shop() {
  const { lang, t } = useLang();
  const text = LOCALIZED[lang as 'ru' | 'kz' | 'en'] || LOCALIZED.ru;

  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shopItemsApi.getAll()
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        console.error('Failed to load shop items:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getLocalizedValue = (val: any) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || val.ru || '';
  };

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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#556042', fontSize: '18px', fontWeight: 500 }}>
            <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #d0e0bd', borderTopColor: '#222719', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '10px', verticalAlign: 'middle' }} />
            {text.loading}
          </div>
        ) : items.length === 0 ? (
          <>
            {/* Status Section (Placeholder if shop is empty) */}
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
          </>
        ) : (
          /* Active Store Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '32px',
              marginBottom: '40px'
            }}
          >
            {items.map((item) => {
              const title = getLocalizedValue(item.title);
              const desc = getLocalizedValue(item.description);
              const price = getLocalizedValue(item.price);
              const isInStock = item.status === 'in_stock';
              
              const whatsappUrl = `https://wa.me/77088152038?text=${encodeURIComponent(text.contactText + title + ' (' + price + ')')}`;

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isInStock ? 1 : 0.75
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
                  }}
                >
                  {/* Product Image Container */}
                  <div
                    style={{
                      height: '220px',
                      backgroundColor: '#F8F9F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '60px',
                      overflow: 'hidden',
                      position: 'relative',
                      borderBottom: '1px solid rgba(0,0,0,0.03)'
                    }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      '🐈'
                    )}

                    {/* Stock Status Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        backgroundColor: isInStock ? '#E2F0D9' : '#FCE4D6',
                        color: isInStock ? '#385723' : '#C65911',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    >
                      {isInStock ? text.inStock : text.outOfStock}
                    </span>

                    {/* Category Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        color: '#556042',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    >
                      {item.category || 'Разное'}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#222719', margin: 0 }}>
                      {title}
                    </h3>
                    
                    <p style={{ fontSize: '13px', color: '#556042', margin: 0, lineHeight: 1.5, flex: 1 }}>
                      {desc}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: '#222719' }}>
                        {price}
                      </span>
                    </div>

                    <a
                      href={isInStock ? whatsappUrl : '#'}
                      target={isInStock ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isInStock ? '#25D366' : '#d1d8c9',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        cursor: isInStock ? 'pointer' : 'not-allowed',
                        marginTop: '8px',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        if (isInStock) e.currentTarget.style.backgroundColor = '#128C7E';
                      }}
                      onMouseLeave={(e) => {
                        if (isInStock) e.currentTarget.style.backgroundColor = '#25D366';
                      }}
                    >
                      💬 {text.buyBtn}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
