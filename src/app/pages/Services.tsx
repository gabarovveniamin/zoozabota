import { useState, useEffect } from 'react';
import { PageHero } from '../components/PageHero';
import { ServiceModal } from '../components/ServiceModal';
import { servicesApi, searchApi, type Service } from '../db/api';
import { useLang } from '../i18n/LangContext';

export function Services() {
  const { t, lang } = useLang();
  const { services: srv } = t;

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Service[] | null>(null);

  const getServiceTitle = (s: Service) => {
    if (typeof s.title === 'string') return s.title;
    return s.title[lang] || s.title['ru'] || '';
  };

  const getServiceDescription = (s: Service) => {
    if (typeof s.description === 'string') return s.description;
    return s.description[lang] || s.description['ru'] || '';
  };

  const getServicePrice = (s: Service) => {
    if (!s.price) return '';
    if (typeof s.price === 'string') return s.price;
    return s.price[lang] || s.price['ru'] || '';
  };

  // Reset filter and search query when language changes
  useEffect(() => {
    setActiveFilter(null);
    setSearchQuery('');
    setSearchResults(null);
  }, [lang]);

  // Debounced server-side trigram search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const results = await searchApi.searchServices(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults(null);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const allServices = await servicesApi.getAll();
        setServices(allServices.sort((a, b) => a.order - b.order));
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  // Get all unique categories present in the services
  const dbCategories = Array.from(new Set(services.map(s => s.category).filter(Boolean))) as string[];
  
  // Sort categories: standard first, then custom alphabetically
  const standardOrder = ['Гранитные', 'Мраморные', 'Деревянные', 'Индивидуальные'];
  dbCategories.sort((a, b) => {
    const idxA = standardOrder.indexOf(a);
    const idxB = standardOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  const categoryFilters = [null, ...dbCategories];

  const getCategoryLabel = (category: string | null) => {
    if (!category) return srv.filters[0]; // "Все" / "Барлығы" / "All"
    
    const standardCategories: Record<string, { ru: string; kz: string; en: string }> = {
      'Гранитные': { ru: 'Гранитные', kz: 'Гранит', en: 'Granite' },
      'Мраморные': { ru: 'Мраморные', kz: 'Мәрмәр', en: 'Marble' },
      'Деревянные': { ru: 'Деревянные', kz: 'Ағаш', en: 'Wood' },
      'Индивидуальные': { ru: 'Индивидуальные', kz: 'Жеке', en: 'Custom' },
    };

    const matched = standardCategories[category];
    if (matched) {
      return matched[lang] || matched['ru'];
    }
    return category;
  };

  const getTranslatedTag = (tag: string) => {
    if (!tag) return '';
    const tagsDict = t.tags as unknown as Record<string, string> | undefined;
    return tagsDict?.[tag] || tag;
  };

  const searchActive = searchQuery.trim() !== '';
  const sourceList = searchActive ? (searchResults ?? []) : services;
  const filtered = activeFilter === null
    ? sourceList
    : sourceList.filter((s) => s.category === activeFilter);

  return (
    <div>
      <PageHero title={srv.pageTitle} />

      <div className="container-responsive" style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 100px' }}>
        {/* Search Bar */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px' 
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '450px' }}>
            <input
              type="text"
              placeholder={srv.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: '26px',
                border: '2px solid #E2EBD5',
                fontSize: '14px',
                outline: 'none',
                color: '#222719',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#c8dfa0'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E2EBD5'; }}
            />
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#888', userSelect: 'none' }}>
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  fontSize: '14px',
                  color: '#888',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '48px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          {categoryFilters.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat ?? 'all'}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: isActive ? '#d0e0bd' : '#E2EBD5',
                  color: isActive ? '#222719' : '#556042',
                  transition: 'all 0.2s',
                }}
              >
                {getCategoryLabel(cat)}{isActive && ' ✓'}
              </button>
            );
          })}
        </div>


        {/* Monument grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#556042', fontSize: '18px' }}>
            {srv.loading}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#999', fontSize: '18px' }}>
            {searchActive ? srv.noResults : srv.empty}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '32px',
              justifyContent: 'center',
            }}
          >
            {filtered.map((service) => (
              <div
                key={service.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedService(service)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
                }}
              >
                {/* Image */}
                <div
                  style={{
                    height: '260px',
                    backgroundColor: '#F5F9EE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '56px',
                    overflow: 'hidden',
                    padding: '16px',
                    boxSizing: 'border-box',
                  }}
                >
                  {service.image ? (
                    <img src={service.image} alt={getServiceTitle(service)} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                  ) : '🐾'}
                </div>

                {/* Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#d0e0bd',
                      color: '#222719',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      width: 'fit-content',
                    }}
                  >
                    {getTranslatedTag(service.tag)}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#222719', margin: 0 }}>{getServiceTitle(service)}</h3>
                  <p style={{ fontSize: '13px', color: '#556042', margin: 0, lineHeight: 1.5, flex: 1 }}>{getServiceDescription(service)}</p>
                  {getServicePrice(service) && (
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#222719', margin: 0 }}>{getServicePrice(service)}</p>
                  )}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedService(service); }}
                  style={{
                    width: '100%',
                    backgroundColor: '#d0e0bd',
                    color: '#222719',
                    border: 'none',
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '0 0 8px 8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = '#b8cba3'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = '#d0e0bd'; }}
                >
                  {srv.btnDetails}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedService && (
        <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  );
}
