import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { PageHero } from '../components/PageHero';
import { useLang } from '../i18n/LangContext';
import { shopItemsApi, shopOrdersApi, type ShopItem } from '../db/api';
import { toast } from 'sonner';

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
    addToCart: 'В корзину',
    addedToCart: 'В корзине ✓',
    loading: 'Загрузка товаров...',
    cartTitle: 'Корзина',
    cartEmpty: 'Ваша корзина пуста',
    cartTotal: 'Итого к оплате:',
    checkoutBtn: 'Оформить заказ',
    close: 'Закрыть',
    orderFormTitle: 'Оформление заказа',
    fullName: 'Имя и Фамилия *',
    phone: 'Номер телефона *',
    email: 'Email (необязательно)',
    address: 'Адрес доставки *',
    submitOrder: 'Подтвердить заказ',
    orderSuccess: 'Заказ успешно оформлен!',
    orderSuccessText: 'Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время для подтверждения и обсуждения деталей доставки.',
    orderNumber: 'Номер заказа:',
    continueShop: 'Продолжить покупки',
    submitting: 'Оформление...',
    emptyCartAlert: 'Ваша корзина пуста!',
    fillRequiredAlert: 'Пожалуйста, заполните все обязательные поля'
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
    addToCart: 'Себетке салу',
    addedToCart: 'Себетте ✓',
    loading: 'Тауарлар жүктелуде...',
    cartTitle: 'Себет',
    cartEmpty: 'Себетіңіз бос',
    cartTotal: 'Жиынтық төлем:',
    checkoutBtn: 'Тапсырысты рәсімдеу',
    close: 'Жабу',
    orderFormTitle: 'Тапсырысты ресімдеу',
    fullName: 'Аты-жөні *',
    phone: 'Телефон нөмірі *',
    email: 'Email (міндетті емес)',
    address: 'Жеткізу мекенжайы *',
    submitOrder: 'Тапсырысты растау',
    orderSuccess: 'Тапсырыс сәтті ресімделді!',
    orderSuccessText: 'Тапсырысыңызға рақмет! Жақын арада менеджеріміз хабарласып, тапсырысты растайды және жеткізу мәселелерін талқылайды.',
    orderNumber: 'Тапсырыс нөмірі:',
    continueShop: 'Сауданы жалғастыру',
    submitting: 'Жіберілуде...',
    emptyCartAlert: 'Себетіңіз бос!',
    fillRequiredAlert: 'Барлық міндетті өрістерді толтырыңыз'
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
    addToCart: 'Add to Cart',
    addedToCart: 'In Cart ✓',
    loading: 'Loading items...',
    cartTitle: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    cartTotal: 'Subtotal:',
    checkoutBtn: 'Checkout',
    close: 'Close',
    orderFormTitle: 'Order Details',
    fullName: 'Full Name *',
    phone: 'Phone Number *',
    email: 'Email (optional)',
    address: 'Delivery Address *',
    submitOrder: 'Confirm Order',
    orderSuccess: 'Order placed successfully!',
    orderSuccessText: 'Thank you for your order! Our manager will contact you shortly to confirm your order and discuss shipping details.',
    orderNumber: 'Order Number:',
    continueShop: 'Continue Shopping',
    submitting: 'Submitting...',
    emptyCartAlert: 'Your cart is empty!',
    fillRequiredAlert: 'Please fill in all required fields'
  }
};

interface CartItem {
  item: ShopItem;
  quantity: number;
}

export function Shop() {
  const { lang, t } = useLang();
  const text = LOCALIZED[lang as 'ru' | 'kz' | 'en'] || LOCALIZED.ru;

  // DB Items
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zz_shop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Selected Product Detail Modal
  const [selectedProduct, setSelectedProduct] = useState<ShopItem | null>(null);

  // Cart Drawer Visibility
  const [cartOpen, setCartOpen] = useState(false);

  // Checkout Modal State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<number | null>(null);

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('zz_shop_cart', JSON.stringify(cart));
  }, [cart]);

  // Load items from DB
  useEffect(() => {
    shopItemsApi.getAll()
      .then(setItems)
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

  // Helper to parse price string ("4 500 ₸" -> 4500)
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 0 : num;
  };

  // Format price (4500 -> "4 500 ₸")
  const formatPrice = (num: number): string => {
    return num.toLocaleString('ru-RU') + ' ₸';
  };

  // Cart actions
  const addToCart = (item: ShopItem, event?: React.MouseEvent) => {
    if (event) event.stopPropagation(); // prevent modal opening
    if (item.status === 'out_of_stock') return;
    
    setCart((prev) => {
      const idx = prev.findIndex(ci => ci.item.id === item.id);
      if (idx > -1) {
        const newCart = [...prev];
        newCart[idx].quantity += 1;
        return newCart;
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast.success(`${getLocalizedValue(item.title)} добавлен в корзину`);
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart((prev) => {
      return prev.map(ci => {
        if (ci.item.id === itemId) {
          const newQty = ci.quantity + delta;
          return { ...ci, quantity: Math.max(1, newQty) };
        }
        return ci;
      });
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => prev.filter(ci => ci.item.id !== itemId));
  };

  // Compute Cart Summary
  const totalItemCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartSubtotal = cart.reduce((sum, ci) => {
    const itemPrice = parsePrice(getLocalizedValue(ci.item.price));
    return sum + (itemPrice * ci.quantity);
  }, 0);

  // Submit Order Form
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error(text.emptyCartAlert);
      return;
    }
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      toast.error(text.fillRequiredAlert);
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const orderItems = cart.map(ci => ({
        itemId: ci.item.id!,
        title: getLocalizedValue(ci.item.title),
        price: getLocalizedValue(ci.item.price),
        quantity: ci.quantity,
        image: ci.item.image || undefined
      }));

      const newOrder = await shopOrdersApi.add({
        items: orderItems,
        customerName: checkoutForm.name,
        customerPhone: checkoutForm.phone,
        customerEmail: checkoutForm.email || undefined,
        deliveryAddress: checkoutForm.address,
        totalPrice: formatPrice(cartSubtotal),
        status: 'pending'
      });

      setCreatedOrderNumber(newOrder.id!);
      setCart([]); // Clear cart
      setCheckoutForm({ name: '', phone: '', email: '', address: '' });
    } catch (err: any) {
      console.error('Failed to submit order:', err);
      toast.error('Ошибка при оформлении заказа: ' + (err.message || String(err)));
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '80vh' }}>
      <PageHero title={t.extra.services[0].title} />

      <div className="container-responsive" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 100px' }}>
        
        {/* Top bar with back link and Cart count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <Link
            to="/extra"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#556042',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '15px',
              gap: '8px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#222719')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#556042')}
          >
            {text.back}
          </Link>

          {/* Floating/Fixed Cart Indicator */}
          {!loading && items.length > 0 && (
            <button
              onClick={() => setCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#d0e0bd',
                color: '#222719',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(110,139,81,0.2)',
                transition: 'transform 0.2s, background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = '#c2d6ad';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#d0e0bd';
              }}
            >
              🛒 {text.cartTitle} {totalItemCount > 0 ? `(${totalItemCount})` : ''}
            </button>
          )}
        </div>

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
              const isInCart = cart.some(ci => ci.item.id === item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedProduct(item)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isInStock ? 1 : 0.75,
                    cursor: 'pointer'
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
                    
                    <p style={{ fontSize: '13px', color: '#556042', margin: 0, lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {desc}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: '#222719' }}>
                        {price}
                      </span>
                    </div>

                    <button
                      onClick={(e) => addToCart(item, e)}
                      disabled={!isInStock}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: !isInStock ? '#d1d8c9' : (isInCart ? '#556042' : '#222719'),
                        color: 'white',
                        border: 'none',
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
                        if (isInStock && !isInCart) e.currentTarget.style.backgroundColor = '#383e2e';
                      }}
                      onMouseLeave={(e) => {
                        if (isInStock) e.currentTarget.style.backgroundColor = isInCart ? '#556042' : '#222719';
                      }}
                    >
                      {isInCart ? text.addedToCart : `🛒 ${text.addToCart}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ===== PRODUCT DETAIL MODAL ===== */}
      {selectedProduct && (() => {
        const title = getLocalizedValue(selectedProduct.title);
        const desc = getLocalizedValue(selectedProduct.description);
        const price = getLocalizedValue(selectedProduct.price);
        const isInStock = selectedProduct.status === 'in_stock';
        const isInCart = cart.some(ci => ci.item.id === selectedProduct.id);

        return (
          <div className="product-modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="product-modal-content" onClick={(e) => e.stopPropagation()} style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              maxWidth: '850px'
            }}>
              {/* Left Column: Image */}
              <div style={{
                flex: '1 1 380px',
                backgroundColor: '#F8F9F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '90px',
                minHeight: '380px',
                position: 'relative'
              }}>
                {selectedProduct.image ? (
                  <img src={selectedProduct.image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '🐈'}

                <span style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  backgroundColor: isInStock ? '#E2F0D9' : '#FCE4D6',
                  color: isInStock ? '#385723' : '#C65911',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: '12px'
                }}>
                  {isInStock ? text.inStock : text.outOfStock}
                </span>
              </div>

              {/* Right Column: Details */}
              <div style={{
                flex: '1 1 380px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                      backgroundColor: '#E2EBD5',
                      color: '#556042',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '12px',
                      display: 'inline-block'
                    }}>
                      {selectedProduct.category || 'Разное'}
                    </span>
                    <button onClick={() => setSelectedProduct(null)} style={{
                      border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#888'
                    }}>✕</button>
                  </div>

                  <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#222719', margin: '0 0 16px' }}>{title}</h2>
                  
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#222719', marginBottom: '20px' }}>{price}</div>
                  
                  <h4 style={{ fontSize: '13px', color: '#888', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Описание</h4>
                  <p style={{ fontSize: '15px', color: '#556042', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    disabled={!isInStock}
                    style={{
                      flex: 1,
                      backgroundColor: !isInStock ? '#d1d8c9' : (isInCart ? '#556042' : '#222719'),
                      color: 'white',
                      border: 'none',
                      padding: '16px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '16px',
                      cursor: isInStock ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isInCart ? text.addedToCart : `🛒 ${text.addToCart}`}
                  </button>
                  <button onClick={() => setSelectedProduct(null)} style={{
                    backgroundColor: '#E2EBD5', color: '#222719', border: 'none', padding: '16px 20px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer'
                  }}>
                    {text.close}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== SHOPPING CART DRAWER ===== */}
      {cartOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end'
        }} onClick={() => setCartOpen(false)}>
          
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div style={{
              padding: '24px', borderBottom: '1px solid #E2EBD5', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#222719' }}>🛒 {text.cartTitle}</h2>
              <button onClick={() => setCartOpen(false)} style={{
                border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', color: '#222719'
              }}>✕</button>
            </div>

            {/* Drawer Body (Items List) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
                  <p>{text.cartEmpty}</p>
                </div>
              ) : (
                cart.map(ci => {
                  const title = getLocalizedValue(ci.item.title);
                  const price = getLocalizedValue(ci.item.price);
                  const unitPrice = parsePrice(price);

                  return (
                    <div key={ci.item.id} style={{
                      display: 'flex', gap: '14px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px', alignItems: 'center'
                    }}>
                      {/* Thumbnail */}
                      <div style={{
                        width: '70px', height: '70px', borderRadius: '10px', backgroundColor: '#F8F9F5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', flexShrink: 0
                      }}>
                        {ci.item.image ? (
                          <img src={ci.item.image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : '🐈'}
                      </div>

                      {/* Detail & Controls */}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: '#222719' }}>{title}</h4>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#556042', marginBottom: '8px' }}>{price}</div>
                        
                        {/* Qty Selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => updateQuantity(ci.item.id!, -1)} style={{
                            width: '24px', height: '24px', border: '1px solid #d1d8c9', borderRadius: '4px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>-</button>
                          <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{ci.quantity}</span>
                          <button onClick={() => updateQuantity(ci.item.id!, 1)} style={{
                            width: '24px', height: '24px', border: '1px solid #d1d8c9', borderRadius: '4px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>+</button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button onClick={() => removeFromCart(ci.item.id!)} style={{
                        border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', color: '#ff6b6b'
                      }}>✕</button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div style={{
                padding: '24px', borderTop: '1px solid #E2EBD5', backgroundColor: '#fdfdfd'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '15px', color: '#556042', fontWeight: 600 }}>{text.cartTotal}</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#222719' }}>{formatPrice(cartSubtotal)}</span>
                </div>

                <button
                  onClick={() => {
                    setCheckoutOpen(true);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#222719',
                    color: 'white',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#383e2e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222719'}
                >
                  {text.checkoutBtn}
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ===== CHECKOUT FORM MODAL ===== */}
      {checkoutOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1010, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => { if (!createdOrderNumber) setCheckoutOpen(false); }}>
          
          <div style={{
            backgroundColor: 'white', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '36px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            {createdOrderNumber === null ? (
              // Stage 1: Fill form
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#222719' }}>📝 {text.orderFormTitle}</h3>
                  <button onClick={() => setCheckoutOpen(false)} style={{
                    border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#888'
                  }}>✕</button>
                </div>

                <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#556042', marginBottom: '6px' }}>{text.fullName}</label>
                    <input
                      type="text"
                      required
                      placeholder="Иван Иванов"
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #D8E8C8', width: '100%', boxSizing: 'border-box', outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#556042', marginBottom: '6px' }}>{text.phone}</label>
                    <input
                      type="text"
                      required
                      placeholder="+7 (777) 123-45-67"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, phone: e.target.value }))}
                      style={{
                        padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #D8E8C8', width: '100%', boxSizing: 'border-box', outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#556042', marginBottom: '6px' }}>{text.email}</label>
                    <input
                      type="email"
                      placeholder="ivan@example.com"
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #D8E8C8', width: '100%', boxSizing: 'border-box', outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#556042', marginBottom: '6px' }}>{text.address}</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Город, улица, дом, квартира"
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                      style={{
                        padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #D8E8C8', width: '100%', boxSizing: 'border-box', outline: 'none', resize: 'vertical', fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button
                      type="submit"
                      disabled={isSubmittingOrder}
                      style={{
                        flex: 1,
                        backgroundColor: '#222719',
                        color: 'white',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        opacity: isSubmittingOrder ? 0.7 : 1
                      }}
                    >
                      {isSubmittingOrder ? text.submitting : text.submitOrder}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutOpen(false)}
                      style={{
                        backgroundColor: '#E2EBD5',
                        color: '#222719',
                        border: 'none',
                        padding: '14px 20px',
                        borderRadius: '10px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {text.close}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              // Stage 2: Success Notice
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#222719', margin: '0 0 12px' }}>{text.orderSuccess}</h3>
                
                <div style={{
                  backgroundColor: '#f7faf3', border: '1.5px solid #D8E8C8', padding: '12px', borderRadius: '10px', display: 'inline-block', fontWeight: 700, fontSize: '18px', color: '#222719', marginBottom: '20px'
                }}>
                  {text.orderNumber} #{createdOrderNumber}
                </div>

                <p style={{ fontSize: '15px', color: '#556042', lineHeight: 1.6, margin: '0 0 28px' }}>
                  {text.orderSuccessText}
                </p>

                <button
                  onClick={() => {
                    setCheckoutOpen(false);
                    setCartOpen(false);
                    setSelectedProduct(null);
                    setCreatedOrderNumber(null);
                  }}
                  style={{
                    backgroundColor: '#222719',
                    color: 'white',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  {text.continueShop}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Styling */}
      <style>{`
        .product-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .product-modal-content {
          background: white;
          border-radius: 24px;
          max-width: 850px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          display: flex;
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 420px;
          max-width: 100%;
          height: 100vh;
          background: white;
          box-shadow: -8px 0 32px rgba(0,0,0,0.15);
          z-index: 1020;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
