import { useState, useEffect } from 'react';
import { useLang } from '../i18n/LangContext';

export function AgreementModal() {
  const { t } = useLang();
  const { agreement } = t;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted the terms
    const accepted = localStorage.getItem('agreement_accepted');

    // Show modal if agreement is not accepted
    if (!accepted) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const dispatchAuthChange = () => {
    window.dispatchEvent(new Event('user_auth_change'));
  };

  const handleAccept = () => {
    localStorage.setItem('agreement_accepted', 'true');
    // Set registered to true for backward compatibility with other checks
    localStorage.setItem('user_registered', 'true');
    dispatchAuthChange();
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  if (!isOpen) return null;

  return (
    <div
      className="agreement-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(34, 39, 25, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'agreementFadeIn 0.2s ease',
      }}
    >
      <div
        className="agreement-modal"
        style={{
          backgroundColor: '#F8F9F5',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          animation: 'agreementSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <div
            style={{
              padding: '20px 28px',
              backgroundColor: 'white',
              borderBottom: '1px solid #E2EBD5',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#d0e0bd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#222719',
              }}
            >
              📄
            </div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#222719',
                margin: 0,
              }}
            >
              {agreement.title}
            </h2>
          </div>

          {/* Content Body */}
          <div
            style={{
              padding: '28px 28px 20px',
              overflowY: 'auto',
              fontSize: '14.5px',
              color: '#556042',
              lineHeight: 1.65,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              maxHeight: '50vh',
            }}
          >
            <p style={{ margin: 0, fontWeight: 500, color: '#222719' }}>{agreement.p1}</p>
            <p style={{ margin: 0 }}>{agreement.p2}</p>
            <p style={{ margin: 0 }}>{agreement.p3}</p>
            <p style={{ margin: 0 }}>{agreement.p4}</p>
            <p style={{ margin: 0 }}>{agreement.p5}</p>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: '16px 28px',
              backgroundColor: 'white',
              borderTop: '1px solid #E2EBD5',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={handleAccept}
              style={{
                backgroundColor: '#d0e0bd',
                color: '#222719',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '20px',
                fontSize: '14.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = '#b8cba3'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.backgroundColor = '#d0e0bd'; }}
            >
              {agreement.btnAccept}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes agreementFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes agreementSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
