import { useState, useEffect } from 'react';
import { PageHero } from '../components/PageHero';
import { useLang } from '../i18n/LangContext';
import { db, DEFAULT_DOCUMENTS, type DocumentItem } from '../db/memorialDB';

export function Documents() {
  const { t } = useLang();
  const { agreement } = t;
  
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    if (selectedDoc) {
      const byteCharacters = atob(selectedDoc.fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: selectedDoc.fileType });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);

      return () => {
        URL.revokeObjectURL(url);
        setPdfBlobUrl(null);
      };
    }
  }, [selectedDoc]);

  const loadDocuments = async () => {
    let count = await db.documents.count();
    if (count === 0) {
      // Seed default documents
      await db.documents.bulkAdd(DEFAULT_DOCUMENTS);
    }
    const allDocs = await db.documents.toArray();
    setDocuments(allDocs);
  };

  const handleDownload = (doc: DocumentItem, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent modal popup on download click
    
    const byteCharacters = atob(doc.fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: doc.fileType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHero title={agreement.title} />

      <div className="container-responsive" style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Introductory Section */}
          <div 
            style={{ 
              backgroundColor: '#fff',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              border: '1px solid rgba(208, 224, 189, 0.4)',
              lineHeight: 1.8,
              color: '#556042',
              fontSize: '16px'
            }}
          >
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#222719', marginBottom: '20px' }}>{agreement.p1}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0 }}>{agreement.p2}</p>
              <p style={{ margin: 0 }}>{agreement.p3}</p>
              <p style={{ margin: 0 }}>{agreement.p4}</p>
              <p style={{ margin: 0 }}>{agreement.p5}</p>
            </div>
          </div>

          {/* Documents Download Section */}
          <div>
            <h2 
              style={{ 
                fontSize: '22px', 
                fontWeight: 700, 
                color: '#222719', 
                marginBottom: '24px' 
              }}
            >
              {t.lang === 'ru' ? 'Официальные документы для ознакомления' : t.lang === 'kz' ? 'Танысу үшін ресми құжаттар' : 'Official Documents for Review'}
            </h2>

            {documents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                {t.lang === 'ru' ? 'Нет доступных документов' : t.lang === 'kz' ? 'Құжаттар қолжетімсіз' : 'No documents available'}
              </div>
            ) : (
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '24px' 
                }}
              >
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '20px',
                      padding: '24px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
                    }}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div>
                      <div 
                        style={{ 
                          fontSize: '36px', 
                          marginBottom: '16px',
                          display: 'inline-block',
                          color: '#6E8B51' 
                        }}
                      >
                        📄
                      </div>
                      <h3 
                        style={{ 
                          fontSize: '16px', 
                          fontWeight: 700, 
                          color: '#222719', 
                          margin: '0 0 8px 0',
                          lineHeight: 1.4
                        }}
                      >
                        {doc.title}
                      </h3>
                      <p 
                        style={{ 
                          fontSize: '13px', 
                          color: '#777', 
                          margin: '0 0 20px 0',
                          lineHeight: 1.5 
                        }}
                      >
                        {doc.description}
                      </p>
                    </div>
                    <div 
                      onClick={(e) => handleDownload(doc, e)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        borderTop: '1px solid #f0f0f0',
                        paddingTop: '12px',
                        fontSize: '12px',
                        color: '#6E8B51',
                        fontWeight: 600,
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#222719'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#6E8B51'; }}
                    >
                      <span>{doc.fileName}</span>
                      <span>⬇️</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* PDF View Modal */}
      {selectedDoc && pdfBlobUrl && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            padding: '24px',
          }}
          onClick={() => setSelectedDoc(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '1000px',
              height: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              animation: 'documentsFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 28px',
                borderBottom: '1px solid #E2EBD5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'white',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#222719' }}>
                  {selectedDoc.title}
                </h3>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {selectedDoc.fileName}
                </span>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                style={{
                  border: 'none',
                  backgroundColor: '#E2EBD5',
                  color: '#222719',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d0e0bd'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#E2EBD5'; }}
              >
                ✕
              </button>
            </div>

            {/* PDF Render Body */}
            <div style={{ flex: 1, backgroundColor: '#f5f5f5', position: 'relative' }}>
              <iframe
                src={pdfBlobUrl}
                title={selectedDoc.title}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes documentsFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
