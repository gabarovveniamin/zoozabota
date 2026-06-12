import { useState, useEffect } from 'react';
import { PageHero } from '../components/PageHero';
import { ServiceModal } from '../components/ServiceModal';
import { db, DEFAULT_SERVICES, type Service } from '../db/memorialDB';
import { useLang } from '../i18n/LangContext';

export function Services() {
  const { t, lang } = useLang();
  const { services: srv } = t;

  const [activeFilter, setActiveFilter] = useState(srv.filters[0]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const getServiceTitle = (s: Service) => {
    if (typeof s.title === 'string') return s.title;
    return s.title[lang] || s.title['ru'] || '';
  };

  const getServiceDescription = (s: Service) => {
    if (typeof s.description === 'string') return s.description;
    return s.description[lang] || s.description['ru'] || '';
  };

  // Reset filter when language changes
  useEffect(() => {
    setActiveFilter(srv.filters[0]);
  }, [srv.filters[0]]);

  useEffect(() => {
    const loadServices = async () => {
      let allServices = await db.services.toArray();
      if (allServices.length === 0) {
        await db.services.bulkAdd(DEFAULT_SERVICES);
        allServices = await db.services.toArray();
      }
      setServices(allServices.sort((a, b) => a.order - b.order));
      setLoading(false);
    };
    loadServices();
  }, []);

  // Map translated filter names to DB category values
  const filterMap: Record<string, string | null> = {
    [srv.filters[0]]: null,
    [srv.filters[1]]: 'Гранитные',
    [srv.filters[2]]: 'Мраморные',
    [srv.filters[3]]: 'Деревянные',
    [srv.filters[4]]: 'Индивидуальные',
  };

  const filtered = filterMap[activeFilter] === null
    ? services
    : services.filter((s) => s.category === filterMap[activeFilter]);

  return (
    <div>
      <PageHero title={srv.pageTitle} />

      <div className="container-responsive" style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 100px' }}>
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
          {srv.filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
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
                {filter}{isActive && ' ✓'}
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
            {srv.empty}
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
                    height: '200px',
                    backgroundColor: '#E2EBD5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '56px',
                    overflow: 'hidden',
                  }}
                >
                  {service.image ? (
                    <img src={service.image} alt={getServiceTitle(service)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    {service.tag}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#222719', margin: 0 }}>{getServiceTitle(service)}</h3>
                  <p style={{ fontSize: '13px', color: '#556042', margin: 0, lineHeight: 1.5, flex: 1 }}>{getServiceDescription(service)}</p>
                  {service.price && (
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#222719', margin: 0 }}>{service.price}</p>
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
