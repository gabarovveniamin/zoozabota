import { useState, useEffect } from 'react';
import { useLang } from '../i18n/LangContext';
import { authApi } from '../db/api';

export function AgreementModal() {
  const { t } = useLang();
  const { agreement, auth } = t;
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'agreement' | 'registration' | 'login'>('agreement');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if the user has already accepted the terms and registered
    const accepted = localStorage.getItem('agreement_accepted');
    const registered = localStorage.getItem('user_registered') === 'true';

    // Show modal if either agreement is not accepted or user is not registered
    if (!accepted || !registered) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
      // If agreement is accepted but not registered, skip to registration step
      if (accepted && !registered) {
        setStep('registration');
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const dispatchAuthChange = () => {
    window.dispatchEvent(new Event('user_auth_change'));
  };

  const handleAccept = () => {
    const registered = localStorage.getItem('user_registered') === 'true';
    if (registered) {
      localStorage.setItem('agreement_accepted', 'true');
      localStorage.setItem('user_logged_in', 'true');
      dispatchAuthChange();
      setIsOpen(false);
      document.body.style.overflow = '';
    } else {
      setStep('registration');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!input) {
      setPhone('');
      return;
    }
    if (phone.startsWith('+7 (') && input.length < 4) {
      setPhone('');
      return;
    }
    const digits = input.replace(/\D/g, '');
    if (digits.length === 0) {
      setPhone('');
      return;
    }
    let rest = digits;
    if (digits[0] === '7' || digits[0] === '8') {
      rest = digits.slice(1);
    }
    rest = rest.slice(0, 10);
    let formatted = '+7 (';
    if (rest.length > 0) {
      formatted += rest.slice(0, 3);
    }
    if (rest.length >= 3) {
      formatted += ') ';
    }
    if (rest.length > 3) {
      formatted += rest.slice(3, 6);
    }
    if (rest.length >= 6) {
      formatted += ' ';
    }
    if (rest.length > 6) {
      formatted += rest.slice(6, 8);
    }
    if (rest.length >= 8) {
      formatted += ' ';
    }
    if (rest.length > 8) {
      formatted += rest.slice(8, 10);
    }
    setPhone(formatted);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !password.trim()) {
      setError(auth.errorFields);
      return;
    }

    try {
      const profile = await authApi.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        password: password.trim(),
      });

      localStorage.setItem('user_profile', JSON.stringify(profile));
      localStorage.setItem('user_registered', 'true');
      localStorage.setItem('user_logged_in', 'true');
      localStorage.setItem('agreement_accepted', 'true');

      dispatchAuthChange();
      setIsOpen(false);
      document.body.style.overflow = '';
    } catch (err: any) {
      console.error('Registration failed:', err);
      const msg = err.message || 'Ошибка регистрации';
      const cleanMsg = msg.replace(/^API error \d+: /, '');
      setError(cleanMsg);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone.trim() || !password.trim()) {
      setError(auth.errorFields);
      return;
    }

    try {
      const profile = await authApi.login({
        phone: phone.trim(),
        password: password.trim(),
      });

      localStorage.setItem('user_profile', JSON.stringify(profile));
      localStorage.setItem('user_registered', 'true');
      localStorage.setItem('user_logged_in', 'true');
      localStorage.setItem('agreement_accepted', 'true');

      dispatchAuthChange();
      setIsOpen(false);
      document.body.style.overflow = '';
    } catch (err) {
      console.error('Login failed:', err);
      setError(auth.errorIncorrect);
    }
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
        {/* Agreement Step */}
        {step === 'agreement' && (
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
        )}

        {/* Registration Step */}
        {step === 'registration' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                👤
              </div>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#222719',
                  margin: 0,
                }}
              >
                {auth.regTitle}
              </h2>
            </div>

            {/* Content Body */}
            <div
              style={{
                padding: '28px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxHeight: '50vh',
              }}
            >
              {error && (
                <div style={{ color: '#e53e3e', fontSize: '13px', fontWeight: 500, backgroundColor: '#fde8e8', padding: '10px 14px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#556042' }}>{auth.firstNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #E2EBD5',
                      fontSize: '14.5px',
                      outline: 'none',
                      color: '#222719',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#c8dfa0'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E2EBD5'; }}
                  />
                </div>
                <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#556042' }}>{auth.lastNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #E2EBD5',
                      fontSize: '14.5px',
                      outline: 'none',
                      color: '#222719',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#c8dfa0'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E2EBD5'; }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#556042' }}>{auth.phoneLabel}</label>
                <input
                  type="tel"
                  placeholder="+7 (747) 545 08 07"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #E2EBD5',
                    fontSize: '14.5px',
                    outline: 'none',
                    color: '#222719',
                    backgroundColor: 'white',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#c8dfa0'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E2EBD5'; }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#556042' }}>{auth.passwordLabel}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #E2EBD5',
                    fontSize: '14.5px',
                    outline: 'none',
                    color: '#222719',
                    backgroundColor: 'white',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#c8dfa0'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E2EBD5'; }}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div
              style={{
                padding: '16px 28px',
                backgroundColor: 'white',
                borderTop: '1px solid #E2EBD5',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <button
                type="button"
                onClick={() => { setStep('login'); setError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#556042',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  outline: 'none',
                }}
              >
                {auth.hasAccount}
              </button>
              <button
                type="submit"
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
                {auth.btnRegister}
              </button>
            </div>
          </form>
        )}

        {/* Login Step */}
        {step === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                🔐
              </div>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#222719',
                  margin: 0,
                }}
              >
                {auth.loginTitle}
              </h2>
            </div>

            {/* Content Body */}
            <div
              style={{
                padding: '28px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxHeight: '50vh',
              }}
            >
              {error && (
                <div style={{ color: '#e53e3e', fontSize: '13px', fontWeight: 500, backgroundColor: '#fde8e8', padding: '10px 14px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#556042' }}>{auth.phoneLabel}</label>
                <input
                  type="tel"
                  placeholder="+7 (747) 545 08 07"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #E2EBD5',
                    fontSize: '14.5px',
                    outline: 'none',
                    color: '#222719',
                    backgroundColor: 'white',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#c8dfa0'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E2EBD5'; }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#556042' }}>{auth.passwordLabel}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #E2EBD5',
                    fontSize: '14.5px',
                    outline: 'none',
                    color: '#222719',
                    backgroundColor: 'white',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#c8dfa0'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E2EBD5'; }}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div
              style={{
                padding: '16px 28px',
                backgroundColor: 'white',
                borderTop: '1px solid #E2EBD5',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <button
                type="button"
                onClick={() => { setStep('registration'); setError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#556042',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  outline: 'none',
                }}
              >
                {auth.noAccount}
              </button>
              <button
                type="submit"
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
                {auth.btnLogin}
              </button>
            </div>
          </form>
        )}
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
