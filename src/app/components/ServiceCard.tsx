interface ServiceCardProps {
  tag: string;
  title: string;
  description: string;
  price?: string;
  image?: string;
  onClick?: () => void;
}

export function ServiceCard({ tag, title, description, price, image, onClick }: ServiceCardProps) {
  return (
    <div
      className="service-card-responsive"
      style={{
        width: '280px',
        minHeight: '340px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
      }}
    >
      {/* Image container */}
      <div
        style={{
          height: '180px',
          backgroundColor: '#F5F9EE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          overflow: 'hidden',
          padding: '12px',
          boxSizing: 'border-box',
        }}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '6px',
            }}
          />
        ) : (
          '🐾'
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Tag */}
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
          {tag}
        </span>

        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#222719', margin: 0 }}>{title}</h3>
        <p style={{ fontSize: '13px', color: '#556042', margin: 0, lineHeight: 1.5, flex: 1 }}>{description}</p>
        {price && (
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#222719', margin: 0 }}>{price}</p>
        )}
      </div>

      {/* Button */}
      <div style={{ padding: '0 0 0 0' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          style={{
            width: '100%',
            backgroundColor: '#d0e0bd',
            color: '#222719',
            border: 'none',
            padding: '12px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '0 0 8px 8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = '#b8cba3'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = '#d0e0bd'; }}
        >
          Подробнее
        </button>
      </div>
    </div>
  );
}
