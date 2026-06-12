interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div
      style={{
        backgroundColor: '#d0e0bd',
        width: '100%',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="container-responsive"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '40px 100px',
          width: '100%',
        }}
      >
        <h1
          style={{
            color: '#222719',
            fontSize: '44px',
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              color: '#3d4730',
              fontSize: '18px',
              fontWeight: 400,
              margin: '12px 0 0',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
