import { useState, useEffect } from 'react';
import { db, type Service } from '../db/memorialDB';
import { useLang } from '../i18n/LangContext';

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const { t, lang } = useLang();
  const m = t.modal;

  const [form, setForm] = useState({ name: '', phone: '', email: '', comment: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const getServiceTitle = (s: Service) => {
    if (typeof s.title === 'string') return s.title;
    return s.title[lang] || s.title['ru'] || '';
  };

  const getServiceDescription = (s: Service) => {
    if (typeof s.description === 'string') return s.description;
    return s.description[lang] || s.description['ru'] || '';
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { alert(m.alertFields); return; }
    setLoading(true);
    await db.serviceRequests.add({
      serviceId: service.id!,
      serviceTitle: getServiceTitle(service),
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      comment: form.comment || undefined,
      status: 'pending',
      createdAt: new Date(),
    });
    setLoading(false);
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #D8E8C8',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#222719',
    backgroundColor: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(34, 39, 25, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#F8F9F5',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* Top: image + info */}
        <div className="modal-top-container" style={{ display: 'flex', flex: '0 0 auto', overflow: 'hidden' }}>
          {/* Image */}
          <div
            className="modal-top-image"
            style={{
              width: '340px',
              minHeight: '300px',
              flexShrink: 0,
              backgroundColor: '#E2EBD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '72px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {service.image ? (
              <img src={service.image} alt={getServiceTitle(service)} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            ) : (
              <span style={{ position: 'relative', zIndex: 1 }}>🐾</span>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(69,99,50,0.15) 0%, transparent 60%)', zIndex: 2 }} />
          </div>

          {/* Info */}
          <div className="modal-top-info" style={{ flex: 1, padding: '36px 36px 28px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'white', position: 'relative' }}>
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                width: '36px', height: '36px', borderRadius: '50%',
                border: 'none', backgroundColor: '#d0e0bd', color: '#222719',
                fontSize: '18px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transition: 'background-color 0.2s', lineHeight: 1,
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = '#C8DFA0'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.backgroundColor = '#E2EBD5'; }}
            >✕</button>

            <span style={{ display: 'inline-block', backgroundColor: '#d0e0bd', color: '#222719', fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '14px', width: 'fit-content' }}>
              {service.tag}
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#222719', margin: 0, lineHeight: 1.2 }}>{getServiceTitle(service)}</h2>
            <p style={{ fontSize: '14px', color: '#556042', margin: 0, lineHeight: 1.7 }}>{getServiceDescription(service)}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              {m.features.map((feat) => (
                <div key={feat} style={{ fontSize: '13px', color: '#6E8B51', fontWeight: 500 }}>{feat}</div>
              ))}
            </div>

            {service.price && (
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #E2EBD5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#888' }}>{m.priceLabel}</span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#222719' }}>{service.price}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: '#E2EBD5', flexShrink: 0 }} />

        {/* Bottom: form */}
        <div className="modal-bottom-form-container" style={{ overflowY: 'auto', padding: '28px 36px 36px', backgroundColor: '#F8F9F5' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 20px', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#222719', margin: '0 0 10px' }}>{m.successTitle}</h3>
              <p style={{ color: '#556042', fontSize: '14px', margin: '0 0 28px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{m.successText}</p>
              <button
                onClick={onClose}
                style={{ backgroundColor: '#d0e0bd', color: '#222719', border: 'none', padding: '12px 36px', borderRadius: '26px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
              >
                {m.btnClose}
              </button>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#222719', margin: '0 0 20px' }}>{m.formTitle}</h3>
              <form onSubmit={handleSubmit} className="modal-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042' }}>{m.nameLabel}</label>
                  <input type="text" placeholder={m.namePlaceholder} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#6E8B51'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#D8E8C8'; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042' }}>{m.phoneLabel}</label>
                  <input type="tel" placeholder={m.phonePlaceholder} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#6E8B51'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#D8E8C8'; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042' }}>{m.emailLabel}</label>
                  <input type="email" placeholder="example@mail.ru" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#6E8B51'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#D8E8C8'; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042' }}>{m.commentLabel}</label>
                  <textarea placeholder={m.commentPlaceholder} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#6E8B51'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#D8E8C8'; }} />
                </div>
                <div className="modal-submit-row" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{m.consent}</p>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: loading ? '#E2EBD5' : '#d0e0bd',
                      color: '#222719', border: 'none', padding: '13px 36px',
                      borderRadius: '26px', fontSize: '15px', fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap', transition: 'background-color 0.2s', flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { if (!loading) (e.currentTarget).style.backgroundColor = '#b8cba3'; }}
                    onMouseLeave={(e) => { if (!loading) (e.currentTarget).style.backgroundColor = '#d0e0bd'; }}
                  >
                    {loading ? m.btnSending : m.btnSend}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(32px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
