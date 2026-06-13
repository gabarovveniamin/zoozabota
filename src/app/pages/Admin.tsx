import { useState, useEffect } from 'react';
import { petsApi, petRequestsApi, servicesApi, serviceRequestsApi, documentsApi, type PetRequest, type Service, type ServiceRequest, type DocumentItem } from '../db/api';

const ADMIN_PASSWORD = 'admin123'; // Простой пароль для демо

const CATEGORIES = ['Гранитные', 'Мраморные', 'Деревянные', 'Индивидуальные', 'Другое'];

type ServiceFormData = {
  tag: string;
  title: { ru: string; kz: string; en: string };
  description: { ru: string; kz: string; en: string };
  image: string;
  price: string;
  category: string;
};

type DocumentFormData = {
  title: string;
  description: string;
  fileName: string;
  fileData: string;
  fileType: string;
};

const emptyDocForm: DocumentFormData = {
  title: '',
  description: '',
  fileName: '',
  fileData: '',
  fileType: '',
};

const emptyForm: ServiceFormData = {
  tag: '',
  title: { ru: '', kz: '', en: '' },
  description: { ru: '', kz: '', en: '' },
  image: '',
  price: '',
  category: 'Гранитные',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1.5px solid #D8E8C8',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  color: '#222719',
  transition: 'border-color 0.2s',
};

const btnPrimary: React.CSSProperties = {
  backgroundColor: '#d0e0bd',
  color: '#222719',
  border: 'none',
  padding: '10px 24px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  transition: 'background-color 0.15s',
};

const btnSecondary: React.CSSProperties = {
  backgroundColor: '#E2EBD5',
  color: '#222719',
  border: 'none',
  padding: '10px 24px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
};

const btnDanger: React.CSSProperties = {
  backgroundColor: '#fff0f0',
  color: '#cc2222',
  border: '1.5px solid #ffcccc',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 600,
};

const handleImageChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPreview: (s: string) => void,
  setForm: (fn: (prev: ServiceFormData) => ServiceFormData) => void
) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreview(base64);
      setForm((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  }
};

interface ServiceFormFieldsProps {
  form: ServiceFormData;
  setForm: React.Dispatch<React.SetStateAction<ServiceFormData>> | ((fn: (prev: ServiceFormData) => ServiceFormData) => void);
  preview: string;
  setPreview: (s: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  title: string;
}

const ServiceFormFields = ({
  form,
  setForm,
  preview,
  setPreview,
  onSubmit,
  onCancel,
  title,
}: ServiceFormFieldsProps) => {
  const [activeLang, setActiveLang] = useState<'ru' | 'kz' | 'en'>('ru');

  return (
    <div
      style={{
        backgroundColor: '#f7faf3',
        padding: '24px',
        borderRadius: '14px',
        border: '2px solid #D8E8C8',
        marginBottom: '24px',
      }}
    >
      <h3 style={{ margin: '0 0 20px', color: '#222719', fontSize: '17px' }}>{title}</h3>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Language selector tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', borderBottom: '1px solid #E2EBD5', paddingBottom: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#556042', marginRight: '6px' }}>Язык полей:</span>
          {(['ru', 'kz', 'en'] as const).map((l) => {
            const labels = { ru: '🇷🇺 Русский (RU)', kz: '🇰🇿 Казахский (KZ)', en: '🇬🇧 Английский (EN)' };
            const isFilled = !!(form.title[l] && form.description[l]);
            const isActive = activeLang === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setActiveLang(l)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: isActive ? '#d0e0bd' : '#E2EBD5',
                  color: isActive ? '#222719' : '#556042',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {labels[l]} {isFilled && '✓'}
              </button>
            );
          })}
        </div>

        {/* Row 1: tag + title */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>Тег *</label>
            <input
              type="text"
              placeholder="Гранит"
              value={form.tag}
              onChange={(e) => setForm((prev) => ({ ...prev, tag: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>
              Название ({activeLang.toUpperCase()}) *
            </label>
            <input
              type="text"
              placeholder={`Название на ${activeLang === 'ru' ? 'русском' : activeLang === 'kz' ? 'казахском' : 'английском'}`}
              value={form.title[activeLang]}
              onChange={(e) => {
                const val = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  title: { ...prev.title, [activeLang]: val }
                }));
              }}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Row 2: price + category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>Цена</label>
            <input
              type="text"
              placeholder="от 45 000 ₸"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>Категория фильтра</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Описание */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>
            Описание ({activeLang.toUpperCase()}) *
          </label>
          <textarea
            placeholder={`Опишите услугу на ${activeLang === 'ru' ? 'русском' : activeLang === 'kz' ? 'казахском' : 'английском'}...`}
            value={form.description[activeLang]}
            onChange={(e) => {
              const val = e.target.value;
              setForm((prev) => ({
                ...prev,
                description: { ...prev.description, [activeLang]: val }
              }));
            }}
            style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
          />
        </div>

        {/* Image upload */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>Изображение</label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '2px dashed #C8DFA0',
              borderRadius: '10px',
              padding: '16px 20px',
              cursor: 'pointer',
              backgroundColor: preview ? '#f0f8e8' : 'white',
              transition: 'background-color 0.2s',
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setPreview, setForm)}
              style={{ display: 'none' }}
            />
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                   <div style={{ fontSize: '14px', color: '#222719', fontWeight: 600 }}>✓ Изображение загружено</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Нажмите, чтобы заменить</div>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '32px' }}>🖼️</div>
                <div>
                  <div style={{ fontSize: '14px', color: '#556042', fontWeight: 500 }}>Нажмите для загрузки изображения</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>JPG, PNG, WebP</div>
                </div>
              </>
            )}
          </label>
          {preview && (
            <button
              type="button"
              onClick={() => { setPreview(''); setForm((prev) => ({ ...prev, image: '' })); }}
              style={{ marginTop: '8px', fontSize: '12px', color: '#cc2222', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              ✕ Удалить изображение
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
          <button type="submit" style={btnPrimary}>Сохранить</button>
          <button type="button" onClick={onCancel} style={btnSecondary}>Отмена</button>
        </div>
      </form>
    </div>
  );
};

interface DocumentFormFieldsProps {
  form: DocumentFormData;
  setForm: React.Dispatch<React.SetStateAction<DocumentFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  title: string;
  isEdit: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentFormFields = ({
  form,
  setForm,
  onSubmit,
  onCancel,
  title,
  isEdit,
  onFileChange,
}: DocumentFormFieldsProps) => {
  return (
    <div
      style={{
        backgroundColor: '#f7faf3',
        padding: '24px',
        borderRadius: '14px',
        border: '2px solid #D8E8C8',
        marginBottom: '24px',
      }}
    >
      <h3 style={{ margin: '0 0 20px', color: '#222719', fontSize: '17px' }}>{title}</h3>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>
            Название документа *
          </label>
          <input
            type="text"
            placeholder="Публичная оферта"
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>
            Описание документа
          </label>
          <textarea
            placeholder="Краткое описание содержимого..."
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>
            {isEdit ? 'Заменить PDF-файл (необязательно)' : 'Выберите PDF-файл *'}
          </label>
          <input
            type="file"
            accept="application/pdf"
            required={!isEdit}
            onChange={onFileChange}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid #D8E8C8',
              backgroundColor: '#fff',
              fontSize: '13px',
            }}
          />
          {form.fileName && (
            <div style={{ fontSize: '12px', color: '#6E8B51', marginTop: '6px', fontWeight: 500 }}>
              Выбранный файл: {form.fileName}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
          <button type="submit" style={btnPrimary}>
            {isEdit ? 'Сохранить' : 'Добавить'}
          </button>
          <button type="button" onClick={onCancel} style={btnSecondary}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'requests' | 'service-requests' | 'services' | 'documents'>('requests');

  // Pet Requests
  const [requests, setRequests] = useState<PetRequest[]>([]);

  // Service Requests
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  // Services
  const [services, setServices] = useState<Service[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<ServiceFormData>(emptyForm);
  const [addPreview, setAddPreview] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ServiceFormData>(emptyForm);
  const [editPreview, setEditPreview] = useState('');

  // Documents
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [showAddDocForm, setShowAddDocForm] = useState(false);
  const [addDocForm, setAddDocForm] = useState<DocumentFormData>(emptyDocForm);
  const [editingDocId, setEditingDocId] = useState<number | null>(null);
  const [editDocForm, setEditDocForm] = useState<DocumentFormData>(emptyDocForm);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadRequests();
      loadServices();
      loadServiceRequests();
      loadDocuments();
    }
  }, [isAuthenticated]);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Неверный пароль');
    }
  };

  // ===== PET REQUESTS =====
  const loadRequests = async () => {
    try {
      const allRequests = await petRequestsApi.getAll();
      setRequests(allRequests);
    } catch (err) {
      console.error('Failed to load pet requests:', err);
    }
  };

  // ===== SERVICE REQUESTS =====
  const loadServiceRequests = async () => {
    try {
      const all = await serviceRequestsApi.getAll();
      setServiceRequests(all.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()));
    } catch (err) {
      console.error('Failed to load service requests:', err);
    }
  };

  const updateServiceRequestStatus = async (id: number | undefined, status: 'done' | 'rejected') => {
    if (!id) return;
    try {
      await serviceRequestsApi.update(id, { status });
      loadServiceRequests();
    } catch (err) {
      console.error('Failed to update service request:', err);
    }
  };



  const approvePetRequest = async (id: number | undefined) => {
    if (!id) return;
    try {
      const request = await petRequestsApi.get(id);
      if (request) {
        await petsApi.add({
          name: request.name,
          breed: request.breed,
          years: request.years,
          emoji: request.emoji,
          description: request.description,
          photo: request.photo,
          createdAt: new Date().toISOString(),
        });
        await petRequestsApi.update(id, { status: 'approved' });
        loadRequests();
      }
    } catch (err) {
      console.error('Failed to approve pet request:', err);
    }
  };

  const rejectPetRequest = async (id: number | undefined) => {
    if (!id) return;
    try {
      await petRequestsApi.update(id, { status: 'rejected' });
      loadRequests();
    } catch (err) {
      console.error('Failed to reject pet request:', err);
    }
  };

  // ===== SERVICES =====
  const loadServices = async () => {
    try {
      const allServices = await servicesApi.getAll();
      setServices(allServices.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  };

  // ===== DOCUMENTS =====
  const loadDocuments = async () => {
    try {
      const allDocs = await documentsApi.getAll();
      setDocuments(allDocs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const handleDocFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setForm: React.Dispatch<React.SetStateAction<DocumentFormData>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setForm((prev) => ({
          ...prev,
          fileName: file.name,
          fileType: file.type || 'application/pdf',
          fileData: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addDocForm.title || !addDocForm.fileData) {
      alert('Пожалуйста, заполните название и выберите PDF-файл');
      return;
    }
    try {
      await documentsApi.add({
        title: addDocForm.title,
        description: addDocForm.description,
        fileName: addDocForm.fileName,
        fileData: addDocForm.fileData,
        fileType: addDocForm.fileType,
        uploadedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to add document:', err);
    }
    setShowAddDocForm(false);
    setAddDocForm(emptyDocForm);
    loadDocuments();
  };

  const startEditDoc = (doc: DocumentItem) => {
    if (!doc.id) return;
    setEditingDocId(doc.id);
    setEditDocForm({
      title: doc.title,
      description: doc.description,
      fileName: doc.fileName,
      fileData: doc.fileData,
      fileType: doc.fileType,
    });
  };

  const handleSaveEditDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDocId) return;
    if (!editDocForm.title) {
      alert('Пожалуйста, заполните название');
      return;
    }
    try {
      await documentsApi.update(editingDocId, {
        title: editDocForm.title,
        description: editDocForm.description,
        fileName: editDocForm.fileName,
        fileData: editDocForm.fileData,
        fileType: editDocForm.fileType,
      });
    } catch (err) {
      console.error('Failed to update document:', err);
    }
    setEditingDocId(null);
    setEditDocForm(emptyDocForm);
    loadDocuments();
  };

  const deleteDoc = async (id: number | undefined) => {
    if (!id) return;
    if (confirm('Вы уверены, что хотите удалить этот документ?')) {
      try {
        await documentsApi.delete(id);
      } catch (err) {
        console.error('Failed to delete document:', err);
      }
      loadDocuments();
    }
  };

  const handleDocDownload = (doc: DocumentItem, e: React.MouseEvent) => {
    e.stopPropagation();
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


  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (s: string) => void,
    setForm: (fn: (prev: ServiceFormData) => ServiceFormData) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPreview(base64);
        setForm((prev) => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const normalizeField = (field: any) => {
    if (!field) return { ru: '', kz: '', en: '' };
    if (typeof field === 'string') {
      return { ru: field, kz: '', en: '' };
    }
    return {
      ru: field.ru || '',
      kz: field.kz || '',
      en: field.en || '',
    };
  };

  const getServiceTitle = (service: Service) => {
    if (typeof service.title === 'string') return service.title;
    return service.title?.ru || service.title?.kz || service.title?.en || '';
  };

  const getServiceDescription = (service: Service) => {
    if (typeof service.description === 'string') return service.description;
    return service.description?.ru || service.description?.kz || service.description?.en || '';
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.tag || !addForm.title.ru || !addForm.description.ru) {
      alert('Заполните обязательные поля (Тег, Название и Описание на русском языке обязательно)');
      return;
    }
    const maxOrder = Math.max(...services.map((s) => s.order), 0);
    try {
      await servicesApi.add({
        tag: addForm.tag,
        title: addForm.title,
        description: addForm.description,
        image: addForm.image || undefined,
        price: addForm.price || undefined,
        category: addForm.category || undefined,
        order: maxOrder + 1,
      });
    } catch (err) {
      console.error('Failed to add service:', err);
    }
    setAddForm(emptyForm);
    setAddPreview('');
    setShowAddForm(false);
    loadServices();
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id!);
    setEditForm({
      tag: service.tag,
      title: normalizeField(service.title),
      description: normalizeField(service.description),
      image: service.image || '',
      price: service.price || '',
      category: service.category || 'Гранитные',
    });
    setEditPreview(service.image || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
    setEditPreview('');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    if (!editForm.tag || !editForm.title.ru || !editForm.description.ru) {
      alert('Заполните обязательные поля (Тег, Название и Описание на русском языке обязательно)');
      return;
    }
    try {
      await servicesApi.update(editingId, {
        tag: editForm.tag,
        title: editForm.title,
        description: editForm.description,
        image: editForm.image || undefined,
        price: editForm.price || undefined,
        category: editForm.category || undefined,
      });
    } catch (err) {
      console.error('Failed to update service:', err);
    }
    cancelEdit();
    loadServices();
  };

  const deleteService = async (id: number | undefined) => {
    if (!id) return;
    if (confirm('Удалить услугу?')) {
      try {
        await servicesApi.delete(id);
      } catch (err) {
        console.error('Failed to delete service:', err);
      }
      loadServices();
    }
  };

  // Styles and helper component moved outside Admin to prevent re-creation on render (fixes focus loss bug)


  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7f2' }}>
        <div
          style={{
            maxWidth: '400px',
            width: '100%',
            margin: '0 20px',
            padding: '48px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔐</div>
            <h1 style={{ color: '#222719', fontSize: '24px', margin: 0 }}>Админка ZooZabota</h1>
            <p style={{ color: '#888', marginTop: '8px', fontSize: '14px' }}>Введите пароль для входа</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={{ ...btnPrimary, padding: '14px', fontSize: '16px', borderRadius: '10px' }}>
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#222719', margin: 0, fontSize: '26px' }}>🐾 Админка ZooZabota</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          style={btnSecondary}
        >
          Выйти
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', backgroundColor: '#E2EBD5', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        <button
          onClick={() => setTab('requests')}
          style={{
            backgroundColor: tab === 'requests' ? '#d0e0bd' : 'transparent',
            color: tab === 'requests' ? '#222719' : '#556042',
            border: 'none',
            padding: '10px 24px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '8px',
            transition: 'all 0.2s',
          }}
        >
          Заявки питомцев
          {requests.filter((r) => r.status === 'pending').length > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#ff4444',
                color: 'white',
                fontSize: '11px',
                marginLeft: '8px',
              }}
            >
              {requests.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('service-requests')}
          style={{
            backgroundColor: tab === 'service-requests' ? '#d0e0bd' : 'transparent',
            color: tab === 'service-requests' ? '#222719' : '#556042',
            border: 'none',
            padding: '10px 24px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '8px',
            transition: 'all 0.2s',
          }}
        >
          Заявки на памятники
          {serviceRequests.filter((r) => r.status === 'pending').length > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#ff4444',
                color: 'white',
                fontSize: '11px',
                marginLeft: '8px',
              }}
            >
              {serviceRequests.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('services')}
          style={{
            backgroundColor: tab === 'services' ? '#d0e0bd' : 'transparent',
            color: tab === 'services' ? '#222719' : '#556042',
            border: 'none',
            padding: '10px 24px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '8px',
            transition: 'all 0.2s',
          }}
        >
          Памятники ({services.length})
        </button>
        <button
          onClick={() => setTab('documents')}
          style={{
            backgroundColor: tab === 'documents' ? '#d0e0bd' : 'transparent',
            color: tab === 'documents' ? '#222719' : '#556042',
            border: 'none',
            padding: '10px 24px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '8px',
            transition: 'all 0.2s',
          }}
        >
          Документы ({documents.length})
        </button>
      </div>

      {/* ===== REQUESTS TAB ===== */}
      {tab === 'requests' && (
        <div>
          <h2 style={{ color: '#222719', marginBottom: '20px', fontSize: '20px' }}>Новые заявки</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {requests.filter((r) => r.status === 'pending').map((request) => (
              <div
                key={request.id}
                style={{
                  backgroundColor: 'white',
                  border: '2px solid #E2EBD5',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#E2EBD5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  {request.photo ? (
                    <img src={request.photo} alt={request.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    request.emoji
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px', color: '#222719' }}>{request.name}</h3>
                  <p style={{ margin: '0 0 4px', color: '#556042', fontSize: '14px' }}><strong>Порода:</strong> {request.breed}</p>
                  <p style={{ margin: '0 0 4px', color: '#556042', fontSize: '14px' }}><strong>Годы:</strong> {request.years}</p>
                  {request.description && (
                    <p style={{ margin: '0 0 4px', color: '#556042', fontSize: '14px' }}><strong>Описание:</strong> {request.description}</p>
                  )}
                  {request.email && (
                    <p style={{ margin: '8px 0 0', color: '#999', fontSize: '13px' }}>Email: {request.email}</p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => approvePetRequest(request.id)} style={btnPrimary}>✓ Одобрить</button>
                  <button onClick={() => rejectPetRequest(request.id)} style={btnSecondary}>✕ Отклонить</button>
                </div>
              </div>
            ))}
            {requests.filter((r) => r.status === 'pending').length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: '#999', backgroundColor: 'white', borderRadius: '14px', border: '2px dashed #E2EBD5' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                <p style={{ margin: 0, fontSize: '16px' }}>Нет новых заявок</p>
              </div>
            )}
          </div>

          {requests.filter((r) => r.status !== 'pending').length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ color: '#222719', marginBottom: '16px', fontSize: '18px' }}>История</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                {requests.filter((r) => r.status !== 'pending').map((request) => (
                  <div
                    key={request.id}
                    style={{
                      backgroundColor: request.status === 'approved' ? '#f0f8e8' : '#fff0f0',
                      border: `2px solid ${request.status === 'approved' ? '#C8DFA0' : '#ffcccc'}`,
                      borderRadius: '10px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#222719' }}>{request.name}</p>
                      <p style={{ margin: '4px 0 0', color: '#556042', fontSize: '13px' }}>
                        {request.status === 'approved' ? '✓ Одобрено' : '✕ Отклонено'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== SERVICE REQUESTS TAB ===== */}
      {tab === 'service-requests' && (
        <div>
          <h2 style={{ color: '#222719', marginBottom: '20px', fontSize: '20px' }}>Заявки на памятники</h2>

          {/* Pending */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
            {serviceRequests.filter((r) => r.status === 'pending').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#999', backgroundColor: 'white', borderRadius: '14px', border: '2px dashed #E2EBD5' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                <p style={{ margin: 0, fontSize: '16px' }}>Нет новых заявок на памятники</p>
              </div>
            ) : (
              serviceRequests.filter((r) => r.status === 'pending').map((req) => (
                <div
                  key={req.id}
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid #E2EBD5',
                    borderRadius: '14px',
                    padding: '20px 24px',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      backgroundColor: '#E2EBD5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    📦
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, color: '#222719', fontSize: '15px' }}>{req.name}</h3>
                      <span
                        style={{
                          backgroundColor: '#fff9e6',
                          color: '#b07800',
                          border: '1px solid #ffe082',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 10px',
                          borderRadius: '10px',
                        }}
                      >
                        Новая
                      </span>
                    </div>
                    <p style={{ margin: '0 0 4px', color: '#222719', fontSize: '13px', fontWeight: 600 }}>
                      Памятник: {req.serviceTitle}
                    </p>
                    <p style={{ margin: '0 0 4px', color: '#556042', fontSize: '13px' }}>
                      📞 {req.phone}
                      {req.email && <span style={{ marginLeft: '16px' }}>✉️ {req.email}</span>}
                    </p>
                    {req.comment && (
                      <p style={{ margin: '6px 0 0', color: '#666', fontSize: '13px', fontStyle: 'italic', backgroundColor: '#f8f9f5', padding: '8px 12px', borderRadius: '8px' }}>
                        «{req.comment}»
                      </p>
                    )}
                    {req.createdAt && (
                      <p style={{ margin: '6px 0 0', color: '#bbb', fontSize: '11px' }}>
                        {new Date(req.createdAt).toLocaleString('ru-RU')}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => updateServiceRequestStatus(req.id, 'done')}
                      style={btnPrimary}
                    >
                      ✓ Выполнено
                    </button>
                    <button
                      onClick={() => updateServiceRequestStatus(req.id, 'rejected')}
                      style={btnSecondary}
                    >
                      ✕ Отклонить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* History */}
          {serviceRequests.filter((r) => r.status !== 'pending').length > 0 && (
            <div>
              <h3 style={{ color: '#222719', marginBottom: '12px', fontSize: '16px' }}>История</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {serviceRequests.filter((r) => r.status !== 'pending').map((req) => (
                  <div
                    key={req.id}
                    style={{
                      backgroundColor: req.status === 'done' ? '#f0f8e8' : '#fff0f0',
                      border: `1.5px solid ${req.status === 'done' ? '#C8DFA0' : '#ffcccc'}`,
                      borderRadius: '10px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#222719', fontSize: '14px' }}>
                        {req.name} — {req.serviceTitle}
                      </p>
                      <p style={{ margin: '3px 0 0', color: '#556042', fontSize: '12px' }}>
                        {req.phone}{req.email && ` · ${req.email}`}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: req.status === 'done' ? '#222719' : '#cc2222',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {req.status === 'done' ? '✓ Выполнено' : '✕ Отклонено'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== SERVICES TAB ===== */}
      {tab === 'services' && (

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: '#222719', margin: 0, fontSize: '20px' }}>Управление памятниками</h2>
            <button
              onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}
              style={{
                ...btnPrimary,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
              }}
            >
              {showAddForm ? '✕ Отмена' : '+ Добавить памятник'}
            </button>
          </div>

          {/* Add form */}
          {showAddForm && (
            <ServiceFormFields
              form={addForm}
              setForm={setAddForm}
              preview={addPreview}
              setPreview={setAddPreview}
              onSubmit={handleAddService}
              onCancel={() => { setShowAddForm(false); setAddForm(emptyForm); setAddPreview(''); }}
              title="Новый памятник"
            />
          )}

          {/* Services list */}
          {services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#999', backgroundColor: 'white', borderRadius: '14px', border: '2px dashed #E2EBD5' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
              <p style={{ margin: 0, fontSize: '16px' }}>Памятники не добавлены</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {services.map((service) => (
                <div key={service.id}>
                  {/* Edit form inline */}
                  {editingId === service.id ? (
                    <ServiceFormFields
                      form={editForm}
                      setForm={setEditForm}
                      preview={editPreview}
                      setPreview={setEditPreview}
                      onSubmit={handleSaveEdit}
                      onCancel={cancelEdit}
                      title={`Редактирование: ${getServiceTitle(service)}`}
                    />
                  ) : (
                    <div
                      style={{
                        backgroundColor: 'white',
                        border: '2px solid #E2EBD5',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        display: 'flex',
                        gap: '0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'box-shadow 0.2s',
                      }}
                    >
                      {/* Thumbnail */}
                      <div
                        style={{
                          width: '160px',
                          minHeight: '130px',
                          flexShrink: 0,
                          backgroundColor: '#E2EBD5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '40px',
                          overflow: 'hidden',
                        }}
                      >
                        {service.image ? (
                          <img src={service.image} alt={getServiceTitle(service)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : '🐾'}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              backgroundColor: '#d0e0bd',
                              color: '#222719',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '10px',
                            }}
                          >
                            {service.tag}
                          </span>
                          {service.category && (
                            <span style={{ fontSize: '12px', color: '#888' }}>#{service.category}</span>
                          )}
                        </div>
                        <h3 style={{ margin: 0, color: '#222719', fontSize: '16px' }}>{getServiceTitle(service)}</h3>
                        <p style={{ margin: 0, color: '#556042', fontSize: '13px', lineHeight: 1.5 }}>{getServiceDescription(service)}</p>
                        {service.price && (
                          <p style={{ margin: 0, color: '#222719', fontWeight: 700, fontSize: '15px' }}>{service.price}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          padding: '16px',
                          justifyContent: 'center',
                          borderLeft: '1px solid #E2EBD5',
                          flexShrink: 0,
                        }}
                      >
                        <button
                          onClick={() => startEdit(service)}
                          style={{
                            ...btnSecondary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ✏️ Редактировать
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          style={{ ...btnDanger, whiteSpace: 'nowrap' }}
                        >
                          🗑️ Удалить
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== DOCUMENTS TAB ===== */}
      {tab === 'documents' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#222719', margin: 0, fontSize: '20px' }}>Управление документами</h2>
            <button
              onClick={() => { setShowAddDocForm(!showAddDocForm); setAddDocForm(emptyDocForm); }}
              style={btnPrimary}
            >
              {showAddDocForm ? '✕ Отмена' : '+ Добавить документ'}
            </button>
          </div>

          {/* Add Form */}
          {showAddDocForm && (
            <DocumentFormFields
              form={addDocForm}
              setForm={setAddDocForm}
              onSubmit={handleAddDoc}
              onCancel={() => { setShowAddDocForm(false); setAddDocForm(emptyDocForm); }}
              title="Новый документ"
              isEdit={false}
              onFileChange={(e) => handleDocFileChange(e, setAddDocForm)}
            />
          )}

          {/* Documents List */}
          {documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#999', backgroundColor: 'white', borderRadius: '14px', border: '2px dashed #E2EBD5' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
              <p style={{ margin: 0, fontSize: '16px' }}>Документы не загружены</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {documents.map((doc) => (
                <div key={doc.id}>
                  {/* Edit Form */}
                  {editingDocId === doc.id ? (
                    <DocumentFormFields
                      form={editDocForm}
                      setForm={setEditDocForm}
                      onSubmit={handleSaveEditDoc}
                      onCancel={() => { setEditingDocId(null); setEditDocForm(emptyDocForm); }}
                      title={`Редактирование: ${doc.title}`}
                      isEdit={true}
                      onFileChange={(e) => handleDocFileChange(e, setEditDocForm)}
                    />
                  ) : (
                    <div
                      style={{
                        backgroundColor: 'white',
                        border: '2px solid #E2EBD5',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        display: 'flex',
                        gap: '0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'box-shadow 0.2s',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedDoc(doc)}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                    >
                      {/* PDF Icon/Thumbnail */}
                      <div
                        style={{
                          width: '120px',
                          backgroundColor: '#E2EBD5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '40px',
                          userSelect: 'none',
                        }}
                      >
                        📄
                      </div>

                      {/* Doc Info */}
                      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
                        <h3 style={{ margin: 0, color: '#222719', fontSize: '16px', fontWeight: 700 }}>
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p style={{ margin: 0, color: '#556042', fontSize: '13px', lineHeight: 1.5 }}>
                            {doc.description}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#888', marginTop: '4px' }}>
                          <span>Имя файла: {doc.fileName}</span>
                          <span>Загружен: {doc.uploadedAt?.toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Doc Actions */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          padding: '16px',
                          justifyContent: 'center',
                          borderLeft: '1px solid #E2EBD5',
                          flexShrink: 0,
                        }}
                        onClick={(e) => e.stopPropagation()} // prevent opening pdf view when clicking action buttons
                      >
                        <button
                          onClick={(e) => handleDocDownload(doc, e)}
                          style={{
                            ...btnSecondary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ⬇️ Скачать
                        </button>
                        <button
                          onClick={() => startEditDoc(doc)}
                          style={{
                            ...btnSecondary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ✏️ Редактировать
                        </button>
                        <button
                          onClick={() => deleteDoc(doc.id)}
                          style={{ ...btnDanger, whiteSpace: 'nowrap' }}
                        >
                          🗑️ Удалить
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
              animation: 'adminDocFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
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
        @keyframes adminDocFadeIn {
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
