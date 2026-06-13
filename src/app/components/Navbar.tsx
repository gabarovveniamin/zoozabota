import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useLang, type Lang } from '../i18n/LangContext';

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'kz', label: 'Қазақша', flag: '🇰🇿' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export function Navbar() {
  const location = useLocation();
  const { lang, setLang, t } = useLang();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // User Authentication States
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ firstName: string; lastName: string; phone: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const checkUserAuth = () => {
    const loggedIn = localStorage.getItem('user_logged_in') === 'true';
    setIsUserLoggedIn(loggedIn);
    if (loggedIn) {
      try {
        const profileStr = localStorage.getItem('user_profile');
        if (profileStr) {
          setUserProfile(JSON.parse(profileStr));
        }
      } catch (err) {
        console.error('Failed to parse user profile:', err);
      }
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    checkUserAuth();
    window.addEventListener('user_auth_change', checkUserAuth);
    return () => {
      window.removeEventListener('user_auth_change', checkUserAuth);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.services, path: '/services' },
    { label: t.nav.memorial, path: '/memorial' },
    { label: t.nav.extra, path: '/extra' },
    { label: t.nav.donate, path: '/donate' },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <nav
      style={{
        backgroundColor: '#d0e0bd',
        height: '72px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
      }}
    >
      <div
        className="nav-container-responsive"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 100px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/image/LogoOrig.svg"
            alt="ZooZabota"
            style={{ width: '100px', height: '100px', flexShrink: 0 }}
          />
          <span style={{ color: '#000000', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.3px' }}>
            ZooZabota
          </span>
        </Link>

        {/* Nav links + Language switcher */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: isActive ? '#000000' : 'rgba(0, 0, 0, 0.65)',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.2s',
                  borderBottom: isActive ? '2px solid #000000' : '2px solid transparent',
                  paddingBottom: '2px',
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#000000'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = isActive ? '#000000' : 'rgba(0, 0, 0, 0.65)'; }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* User profile / Login button */}
          {isUserLoggedIn && userProfile ? (
            <div ref={profileDropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: profileOpen ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.06)',
                  border: '1.5px solid rgba(0, 0, 0, 0.25)',
                  borderRadius: '20px',
                  padding: '6px 12px 6px 10px',
                  cursor: 'pointer',
                  color: '#222719',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'background-color 0.2s',
                  outline: 'none',
                }}
                onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = 'rgba(0, 0, 0, 0.12)'; }}
                onMouseLeave={(e) => { if (!profileOpen) (e.currentTarget).style.backgroundColor = 'rgba(0, 0, 0, 0.06)'; }}
              >
                <span>👤 {userProfile.firstName}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{
                    transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: '14px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    padding: '16px',
                    minWidth: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    animation: 'langDropdown 0.18s ease',
                    zIndex: 200,
                  }}
                >
                  <div style={{ borderBottom: '1px solid #E2EBD5', paddingBottom: '10px' }}>
                    <div style={{ fontWeight: 700, color: '#222719', fontSize: '15px' }}>{userProfile.firstName} {userProfile.lastName}</div>
                    <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{userProfile.phone}</div>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem('user_logged_in', 'false');
                      setProfileOpen(false);
                      window.dispatchEvent(new Event('user_auth_change'));
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#fde8e8',
                      color: '#e53e3e',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = '#fecaca'; }}
                    onMouseLeave={(e) => { (e.currentTarget).style.backgroundColor = '#fde8e8'; }}
                  >
                    {t.auth.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              style={{
                backgroundColor: 'transparent',
                color: '#222719',
                border: '1.5px solid rgba(0, 0, 0, 0.25)',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget).style.backgroundColor = 'rgba(0, 0, 0, 0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget).style.backgroundColor = 'transparent';
              }}
            >
              {t.auth.btnLogin}
            </button>
          )}

          {/* Language switcher */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              title="Выбрать язык / Тілді таңдаңыз / Select language"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: langOpen ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.06)',
                border: '1.5px solid rgba(0, 0, 0, 0.25)',
                borderRadius: '20px',
                padding: '6px 12px 6px 10px',
                cursor: 'pointer',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'background-color 0.2s',
                outline: 'none',
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = 'rgba(0, 0, 0, 0.12)'; }}
              onMouseLeave={(e) => { if (!langOpen) (e.currentTarget).style.backgroundColor = 'rgba(0, 0, 0, 0.06)'; }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{currentLang.flag} {currentLang.label}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{
                  transform: langOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown */}
            {langOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                  overflow: 'hidden',
                  minWidth: '160px',
                  animation: 'langDropdown 0.18s ease',
                  zIndex: 200,
                }}
              >
                {LANGUAGES.map((l) => {
                  const isSelected = l.code === lang;
                  return (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        backgroundColor: isSelected ? '#f0f8e8' : 'white',
                        color: isSelected ? '#000000' : 'rgba(0, 0, 0, 0.8)',
                        fontSize: '14px',
                        fontWeight: isSelected ? 700 : 400,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s',
                        borderLeft: isSelected ? '3px solid #6E8B51' : '3px solid transparent',
                      }}
                      onMouseEnter={(e) => { if (!isSelected) (e.currentTarget).style.backgroundColor = '#f8f9f5'; }}
                      onMouseLeave={(e) => { if (!isSelected) (e.currentTarget).style.backgroundColor = 'white'; }}
                    >
                      <span style={{ fontSize: '20px' }}>{l.flag}</span>
                      <span>{l.label}</span>
                      {isSelected && (
                        <span style={{ marginLeft: 'auto', color: '#6E8B51', fontSize: '16px' }}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav dropdown overlay */}
      {mobileOpen && (
        <div
          className="mobile-nav-menu"
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            width: '100%',
            backgroundColor: '#d0e0bd',
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 99,
          }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: isActive ? '#000000' : 'rgba(0, 0, 0, 0.7)',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: isActive ? 700 : 500,
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              >
                {link.label}
              </Link>
            );
          })}
          
          {/* Mobile User Profile Section */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isUserLoggedIn && userProfile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#222719' }}>👤 {userProfile.firstName} {userProfile.lastName}</div>
                <div style={{ fontSize: '13px', color: '#556042' }}>{userProfile.phone}</div>
                <button
                  onClick={() => {
                    localStorage.setItem('user_logged_in', 'false');
                    setMobileOpen(false);
                    window.dispatchEvent(new Event('user_auth_change'));
                  }}
                  style={{
                    padding: '10px',
                    backgroundColor: '#fde8e8',
                    color: '#e53e3e',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {t.auth.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setLoginModalOpen(true); setMobileOpen(false); }}
                style={{
                  padding: '10px',
                  backgroundColor: 'white',
                  color: '#222719',
                  border: '1.5px solid rgba(0,0,0,0.15)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {t.auth.btnLogin}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
            {LANGUAGES.map((l) => {
              const isSelected = l.code === lang;
              return (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setMobileOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '16px',
                    border: isSelected ? '1.5px solid #222719' : '1.5px solid transparent',
                    backgroundColor: isSelected ? 'white' : 'rgba(0, 0, 0, 0.05)',
                    color: '#222719',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}

      <style>{`
        @keyframes langDropdown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes agreementFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes agreementSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </nav>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const { auth } = t;
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const profileStr = localStorage.getItem('user_profile');
      if (!profileStr) {
        setError(auth.errorIncorrect);
        return;
      }

      const profile = JSON.parse(profileStr);
      const cleanInputPhone = phone.replace(/\D/g, '');
      const cleanStoredPhone = profile.phone.replace(/\D/g, '');

      if (cleanInputPhone === cleanStoredPhone && password === profile.password) {
        localStorage.setItem('user_logged_in', 'true');
        window.dispatchEvent(new Event('user_auth_change'));
        onClose();
      } else {
        setError(auth.errorIncorrect);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(auth.errorIncorrect);
    }
  };

  return (
    <div
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
        style={{
          backgroundColor: '#F8F9F5',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          animation: 'agreementSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            backgroundColor: 'white',
            borderBottom: '1px solid #E2EBD5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#222719', margin: 0 }}>
              {auth.loginTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: '#888',
              cursor: 'pointer',
              padding: '4px',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ color: '#e53e3e', fontSize: '13px', fontWeight: 500, backgroundColor: '#fde8e8', padding: '10px 14px', borderRadius: '10px', border: '1px solid #fecaca' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#556042' }}>{auth.phoneLabel}</label>
            <input
              type="tel"
              placeholder="+7 (777) 123-45-67"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                color: '#556042',
                border: '1.5px solid #E2EBD5',
                padding: '10px 24px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = 'rgba(0,0,0,0.02)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.backgroundColor = 'transparent'; }}
            >
              {auth.btnCancel}
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#d0e0bd',
                color: '#222719',
                border: 'none',
                padding: '10px 28px',
                borderRadius: '20px',
                fontSize: '14px',
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
      </div>
    </div>
  );
}
