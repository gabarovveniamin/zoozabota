import { Link, useRouteError } from 'react-router';
import { useLang } from '../i18n/LangContext';

export function NotFound() {
  const error = useRouteError() as { status?: number; statusText?: string } | undefined;
  const is404 = !error || error?.status === 404;

  // Try to use language context, fallback to Russian if not available
  let nf = {
    title404: '404', titleError: 'Ошибка',
    subtitle404: 'Страница не найдена', subtitleError: 'Что-то пошло не так',
    text404: 'Такой страницы не существует. Возможно, ссылка устарела или была введена с ошибкой.',
    textError: 'Произошла непредвиденная ошибка. Попробуйте обновить страницу.',
    btnHome: '← На главную',
  };

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = useLang();
    nf = t.notFound;
  } catch {
    // Context not available (e.g., error boundary outside provider)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9F5',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ fontSize: '80px', marginBottom: '16px' }}>🐾</div>
      <h1 style={{ fontSize: '80px', fontWeight: 800, color: '#222719', margin: '0 0 8px', lineHeight: 1 }}>
        {is404 ? nf.title404 : nf.titleError}
      </h1>
      <h2 style={{ fontSize: '24px', color: '#222719', margin: '0 0 16px', fontWeight: 600 }}>
        {is404 ? nf.subtitle404 : nf.subtitleError}
      </h2>
      <p style={{ color: '#556042', fontSize: '16px', maxWidth: '400px', lineHeight: 1.6, margin: '0 0 40px' }}>
        {is404 ? nf.text404 : nf.textError}
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          backgroundColor: '#d0e0bd',
          color: '#222719',
          textDecoration: 'none',
          padding: '14px 36px',
          borderRadius: '26px',
          fontSize: '16px',
          fontWeight: 600,
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#b8cba3'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#d0e0bd'; }}
      >
        {nf.btnHome}
      </Link>
    </div>
  );
}
