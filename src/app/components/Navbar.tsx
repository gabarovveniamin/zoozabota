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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
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
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = 'rgba(0, 0, 0, 0.12)'; }}
              onMouseLeave={(e) => { if (!langOpen) (e.currentTarget).style.backgroundColor = 'rgba(0, 0, 0, 0.06)'; }}
            >
              {/* Globe icon */}
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

      <style>{`
        @keyframes langDropdown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
