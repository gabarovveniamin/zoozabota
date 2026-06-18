import { useState, useEffect } from 'react';
import { petsApi, petRequestsApi, servicesApi, serviceRequestsApi, documentsApi, adminApi, settingsApi, type PetRequest, type Service, type ServiceRequest, type DocumentItem } from '../db/api';
import { toast } from 'sonner';
import { compressImage } from '../utils/image';

const CATEGORIES = ['Гранитные', 'Мраморные', 'Деревянные', 'Индивидуальные', 'Другое'];

type ServiceFormData = {
  tag: string;
  title: { ru: string; kz: string; en: string };
  description: { ru: string; kz: string; en: string };
  image: string;
  price: { ru: string; kz: string; en: string };
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
  price: { ru: '', kz: '', en: '' },
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

const handleImageChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setPreview: (s: string) => void,
  setForm: (fn: (prev: ServiceFormData) => ServiceFormData) => void
) => {
  const file = e.target.files?.[0];
  if (file) {
    try {
      const base64 = await compressImage(file);
      setPreview(base64);
      setForm((prev) => ({ ...prev, image: base64 }));
    } catch (err) {
      console.error('Failed to compress image:', err);
    }
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
  isSaving?: boolean;
}

const ServiceFormFields = ({
  form,
  setForm,
  preview,
  setPreview,
  onSubmit,
  onCancel,
  title,
  isSaving = false,
}: ServiceFormFieldsProps) => {

  const [activeLang, setActiveLang] = useState<'ru' | 'kz' | 'en'>('ru');

  const standardCategories = ['Гранитные', 'Мраморные', 'Деревянные', 'Индивидуальные'];
  const [isCustomCategory, setIsCustomCategory] = useState(() => {
    return form.category !== '' && !standardCategories.includes(form.category);
  });
  const [customCategoryVal, setCustomCategoryVal] = useState(() => {
    return !standardCategories.includes(form.category) ? form.category : '';
  });

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
              onChange={(e) => setForm((prev: any) => ({ ...prev, tag: e.target.value }))}
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
                setForm((prev: any) => ({
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
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>
              Цена ({activeLang.toUpperCase()})
            </label>
            <input
              type="text"
              placeholder="от 45 000 ₸"
              value={form.price[activeLang] || ''}
              onChange={(e) => {
                const val = e.target.value;
                setForm((prev: any) => ({
                  ...prev,
                  price: { ...prev.price, [activeLang]: val }
                }));
              }}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>Категория фильтра</label>
            <select
              value={isCustomCategory ? 'custom' : form.category || 'Гранитные'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'custom') {
                  setIsCustomCategory(true);
                  setForm((prev: any) => ({ ...prev, category: customCategoryVal }));
                } else {
                  setIsCustomCategory(false);
                  setForm((prev: any) => ({ ...prev, category: val }));
                }
              }}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {standardCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="custom">✏️ Своя категория...</option>
            </select>
            {isCustomCategory && (
              <input
                type="text"
                placeholder="Название вашей категории"
                value={customCategoryVal}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomCategoryVal(val);
                  setForm((prev: any) => ({ ...prev, category: val }));
                }}
                style={{ ...inputStyle, marginTop: '8px' }}
              />
            )}
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
          <button type="submit" disabled={isSaving} style={{ ...btnPrimary, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" disabled={isSaving} onClick={onCancel} style={{ ...btnSecondary, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
            Отмена
          </button>
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
  isSaving?: boolean;
}

const DocumentFormFields = ({
  form,
  setForm,
  onSubmit,
  onCancel,
  title,
  isEdit,
  onFileChange,
  isSaving = false,
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
          <button type="submit" disabled={isSaving} style={{ ...btnPrimary, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
            {isSaving ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Добавить')}
          </button>
          <button type="button" disabled={isSaving} onClick={onCancel} style={{ ...btnSecondary, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
            Отмена
          </button>
        </div>

      </form>
    </div>
  );
};

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState<'requests' | 'service-requests' | 'services' | 'documents' | 'settings'>('requests');

  // Pet Requests
  const [requests, setRequests] = useState<PetRequest[]>([]);
  const [showAddPetDirect, setShowAddPetDirect] = useState(false);
  const [showAddPetRequest, setShowAddPetRequest] = useState(false);
  
  // Direct Add Pet Form
  const emptyPetForm = { name: '', breed: '', years: '', description: '', emoji: '🐱', photo: '' };
  const [newPetForm, setNewPetForm] = useState(emptyPetForm);
  const [newPetPhotoPreview, setNewPetPhotoPreview] = useState('');

  // Pet Request Form
  const emptyPetRequestForm = { name: '', breed: '', years: '', description: '', emoji: '🐱', photo: '', email: '' };
  const [newPetRequestForm, setNewPetRequestForm] = useState(emptyPetRequestForm);
  const [newPetRequestPhotoPreview, setNewPetRequestPhotoPreview] = useState('');

  // Service Requests
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [showAddServiceRequest, setShowAddServiceRequest] = useState(false);
  const [newServiceRequestForm, setNewServiceRequestForm] = useState({
    serviceId: '', name: '', phone: '', email: '', comment: ''
  });

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
  const [dbError, setDbError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // App Settings
  const [constructionCollected, setConstructionCollected] = useState('');
  const [constructionGoal, setConstructionGoal] = useState('');
  const [donationsCollected, setDonationsCollected] = useState('');
  const [donationsGoal, setDonationsGoal] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadRequests();
      loadServices();
      loadServiceRequests();
      loadDocuments();
      loadSettings();
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

  const handleFormPhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setForm: any,
    setPreview: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        setPreview(base64);
        setForm((prev: any) => ({ ...prev, photo: base64 }));
      } catch (err) {
        console.error('Failed to compress image:', err);
      }
    }
  };


  const handleDirectAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetForm.name || !newPetForm.breed || !newPetForm.years) {
      toast.error('Пожалуйста, заполните Имя, Породу и Годы');
      return;
    }
    setIsSaving(true);
    try {
      await petsApi.add({
        name: newPetForm.name,
        breed: newPetForm.breed,
        years: newPetForm.years,
        description: newPetForm.description || undefined,
        emoji: newPetForm.emoji,
        photo: newPetForm.photo || undefined,
        createdAt: new Date().toISOString(),
      });
      toast.success('Питомец успешно добавлен напрямую на Стену Памяти!');
      setNewPetForm(emptyPetForm);
      setNewPetPhotoPreview('');
      setShowAddPetDirect(false);
    } catch (err: any) {
      console.error('Failed to direct add pet:', err);
      toast.error('Ошибка добавления питомца: ' + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetRequestForm.name || !newPetRequestForm.breed || !newPetRequestForm.years) {
      toast.error('Пожалуйста, заполните Имя, Породу и Годы');
      return;
    }
    setIsSaving(true);
    try {
      await petRequestsApi.add({
        name: newPetRequestForm.name,
        breed: newPetRequestForm.breed,
        years: newPetRequestForm.years,
        description: newPetRequestForm.description || undefined,
        emoji: newPetRequestForm.emoji,
        photo: newPetRequestForm.photo || undefined,
        email: newPetRequestForm.email || undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      toast.success('Заявка на добавление питомца успешно создана!');
      setNewPetRequestForm(emptyPetRequestForm);
      setNewPetRequestPhotoPreview('');
      setShowAddPetRequest(false);
      loadRequests();
    } catch (err: any) {
      console.error('Failed to create pet request:', err);
      toast.error('Ошибка создания заявки: ' + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateServiceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceRequestForm.serviceId || !newServiceRequestForm.name || !newServiceRequestForm.phone) {
      toast.error('Пожалуйста, выберите Памятник и укажите Имя и Телефон клиента');
      return;
    }
    const matchedService = services.find(s => s.id === Number(newServiceRequestForm.serviceId));
    if (!matchedService) return;

    setIsSaving(true);
    try {
      await serviceRequestsApi.add({
        serviceId: matchedService.id!,
        serviceTitle: getServiceTitle(matchedService),
        name: newServiceRequestForm.name,
        phone: newServiceRequestForm.phone,
        email: newServiceRequestForm.email || undefined,
        comment: newServiceRequestForm.comment || undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      toast.success('Заявка на памятник успешно добавлена!');
      setNewServiceRequestForm({ serviceId: '', name: '', phone: '', email: '', comment: '' });
      setShowAddServiceRequest(false);
      loadServiceRequests();
    } catch (err: any) {
      console.error('Failed to create service request:', err);
      toast.error('Ошибка добавления заявки: ' + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loggingIn) return;
    setLoggingIn(true);
    try {
      const res = await adminApi.login(password);
      if (res.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        setPassword('');
      } else {
        alert(res.error || 'Неверный пароль');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      alert('Неверный пароль или ошибка сервера');
    } finally {
      setLoggingIn(false);
    }
  };

  // ===== PET REQUESTS =====
  const loadRequests = async () => {
    try {
      const allRequests = await petRequestsApi.getAll();
      setRequests(allRequests);
      setDbError(null);
    } catch (err: any) {
      console.error('Failed to load pet requests:', err);
      setDbError(err.message || String(err));
    }
  };

  // ===== SERVICE REQUESTS =====
  const loadServiceRequests = async () => {
    try {
      const all = await serviceRequestsApi.getAll();
      setServiceRequests(all.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()));
      setDbError(null);
    } catch (err: any) {
      console.error('Failed to load service requests:', err);
      setDbError(err.message || String(err));
    }
  };

  const updateServiceRequestStatus = async (id: number | undefined, status: 'done' | 'rejected') => {
    if (!id) return;
    try {
      await serviceRequestsApi.update(id, { status });
      toast.success(status === 'done' ? 'Заявка отмечена как выполненная!' : 'Заявка отклонена.');
      loadServiceRequests();
    } catch (err: any) {
      console.error('Failed to update service request:', err);
      toast.error('Ошибка при обновлении статуса заявки: ' + (err.message || String(err)));
    }
  };



  const approvePetRequest = async (id: number | undefined) => {
    if (!id) return;
    setIsSaving(true);
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
        toast.success('Заявка одобрена, питомец добавлен на Стену Памяти!');
        loadRequests();
      }
    } catch (err: any) {
      console.error('Failed to approve pet request:', err);
      toast.error('Ошибка при одобрении заявки: ' + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const rejectPetRequest = async (id: number | undefined) => {
    if (!id) return;
    setIsSaving(true);
    try {
      await petRequestsApi.update(id, { status: 'rejected' });
      toast.success('Заявка отклонена.');
      loadRequests();
    } catch (err: any) {
      console.error('Failed to reject pet request:', err);
      toast.error('Ошибка при отклонении заявки: ' + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  // ===== SERVICES =====
  const loadServices = async () => {
    try {
      const allServices = await servicesApi.getAll();
      setServices(allServices.sort((a, b) => a.order - b.order));
      setDbError(null);
    } catch (err: any) {
      console.error('Failed to load services:', err);
      setDbError(err.message || String(err));
    }
  };

  // ===== DOCUMENTS =====
  const loadDocuments = async () => {
    try {
      const allDocs = await documentsApi.getAll();
      setDocuments(allDocs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
      setDbError(null);
    } catch (err: any) {
      console.error('Failed to load documents:', err);
      setDbError(err.message || String(err));
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
      toast.error('Пожалуйста, заполните название и выберите PDF-файл');
      return;
    }
    setIsSaving(true);
    try {
      await documentsApi.add({
        title: addDocForm.title,
        description: addDocForm.description,
        fileName: addDocForm.fileName,
        fileData: addDocForm.fileData,
        fileType: addDocForm.fileType,
        uploadedAt: new Date().toISOString(),
      });
      toast.success('Документ успешно добавлен!');
      setShowAddDocForm(false);
      setAddDocForm(emptyDocForm);
      loadDocuments();
    } catch (err: any) {
      console.error('Failed to add document:', err);
      toast.error('Ошибка добавления документа: ' + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
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
      toast.error('Пожалуйста, заполните название');
      return;
    }
    setIsSaving(true);
    try {
      await documentsApi.update(editingDocId, {
        title: editDocForm.title,
        description: editDocForm.description,
        fileName: editDocForm.fileName,
        fileData: editDocForm.fileData,
        fileType: editDocForm.fileType,
      });
      toast.success('Изменения в документе сохранены!');
      setEditingDocId(null);
      setEditDocForm(emptyDocForm);
      loadDocuments();
    } catch (err: any) {
      console.error('Failed to update document:', err);
      toast.error('Ошибка сохранения документа: ' + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteDoc = async (id: number | undefined) => {
    if (!id) return;
    if (confirm('Вы уверены, что хотите удалить этот документ?')) {
      try {
        await documentsApi.delete(id);
        toast.success('Документ успешно удален.');
        loadDocuments();
      } catch (err: any) {
        console.error('Failed to delete document:', err);
        toast.error('Ошибка удаления: ' + (err.message || String(err)));
      }
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

  // ===== SETTINGS =====
  const loadSettings = async () => {
    try {
      const current = await settingsApi.get();
      setConstructionCollected(current.construction_collected || '4200000');
      setConstructionGoal(current.construction_goal || '10000000');
      setDonationsCollected(current.donations_collected || '1500000');
      setDonationsGoal(current.donations_goal || '5000000');
    } catch (err: any) {
      console.error('Failed to load settings:', err);
      toast.error('Ошибка при загрузке настроек сборов');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsApi.update({
        construction_collected: constructionCollected,
        construction_goal: constructionGoal,
        donations_collected: donationsCollected,
        donations_goal: donationsGoal,
      });
      toast.success('Настройки сборов успешно сохранены!');
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      toast.error('Ошибка при сохранении настроек: ' + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };


  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (s: string) => void,
    setForm: (fn: (prev: ServiceFormData) => ServiceFormData) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        setPreview(base64);
        setForm((prev) => ({ ...prev, image: base64 }));
      } catch (err) {
        console.error('Failed to compress image:', err);
      }
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

  const getServicePrice = (service: Service) => {
    if (!service.price) return '';
    if (typeof service.price === 'string') return service.price;
    return service.price.ru || service.price.kz || service.price.en || '';
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.tag || !addForm.title.ru || !addForm.description.ru) {
      toast.error('Заполните обязательные поля (Тег, Название и Описание на русском языке обязательно)');
      return;
    }
    const maxOrder = Math.max(...services.map((s) => s.order), 0);
    setIsSaving(true);
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
      toast.success('Памятник успешно добавлен!');
      setAddForm(emptyForm);
      setAddPreview('');
      setShowAddForm(false);
      loadServices();
    } catch (err: any) {
      console.error('Failed to add service:', err);
      toast.error('Ошибка при добавлении памятника: ' + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id!);
    setEditForm({
      tag: service.tag,
      title: normalizeField(service.title),
      description: normalizeField(service.description),
      image: service.image || '',
      price: normalizeField(service.price),
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
      toast.error('Заполните обязательные поля (Тег, Название и Описание на русском языке обязательно)');
      return;
    }
    setIsSaving(true);
    try {
      await servicesApi.update(editingId, {
        tag: editForm.tag,
        title: editForm.title,
        description: editForm.description,
        image: editForm.image || undefined,
        price: editForm.price || undefined,
        category: editForm.category || undefined,
      });
      toast.success('Изменения в памятнике сохранены!');
      cancelEdit();
      loadServices();
    } catch (err: any) {
      console.error('Failed to update service:', err);
      toast.error('Ошибка при сохранении памятника: ' + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteService = async (id: number | undefined) => {
    if (!id) return;
    if (confirm('Удалить услугу?')) {
      try {
        await servicesApi.delete(id);
        toast.success('Памятник успешно удален.');
        loadServices();
      } catch (err: any) {
        console.error('Failed to delete service:', err);
        toast.error('Ошибка при удалении памятника: ' + (err.message || String(err)));
      }
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
            <button
              type="submit"
              disabled={loggingIn}
              style={{
                ...btnPrimary,
                padding: '14px',
                fontSize: '16px',
                borderRadius: '10px',
                opacity: loggingIn ? 0.7 : 1,
                cursor: loggingIn ? 'not-allowed' : 'pointer'
              }}
            >
              {loggingIn ? 'Проверка...' : 'Войти'}
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
          onClick={() => {
            setIsAuthenticated(false);
            sessionStorage.removeItem('admin_authenticated');
          }}
          style={btnSecondary}
        >
          Выйти
        </button>
      </div>

      {/* DB Connection Error Alert */}
      {dbError && (
        <div style={{ backgroundColor: '#fde8e8', color: '#e53e3e', padding: '16px', borderRadius: '12px', marginBottom: '32px', border: '1px solid #fecaca', fontWeight: 500 }}>
          ⚠️ Ошибка подключения к базе данных: {dbError}
          <br />
          <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#c53030' }}>
            Пожалуйста, убедитесь, что переменная окружения DATABASE_URL настроена на Vercel или в .env.local, и проект запущен через vercel dev (для локальной разработки).
          </span>
        </div>
      )}

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
        <button
          onClick={() => setTab('settings')}
          style={{
            backgroundColor: tab === 'settings' ? '#d0e0bd' : 'transparent',
            color: tab === 'settings' ? '#222719' : '#556042',
            border: 'none',
            padding: '10px 24px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '8px',
            transition: 'all 0.2s',
          }}
        >
          ⚙️ Настройки сборов
        </button>
      </div>

      {/* ===== REQUESTS TAB ===== */}
      {tab === 'requests' && (
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setShowAddPetDirect(!showAddPetDirect); setShowAddPetRequest(false); }}
              style={btnPrimary}
            >
              {showAddPetDirect ? '✕ Отмена' : '🐾 Добавить питомца напрямую'}
            </button>
            <button
              onClick={() => { setShowAddPetRequest(!showAddPetRequest); setShowAddPetDirect(false); }}
              style={btnSecondary}
            >
              {showAddPetRequest ? '✕ Отмена' : '📝 Создать заявку питомца'}
            </button>
          </div>

          {/* Form for Direct Add Pet */}
          {showAddPetDirect && (
            <form onSubmit={handleDirectAddPet} style={{ backgroundColor: '#f7faf3', padding: '24px', borderRadius: '14px', border: '2px solid #D8E8C8', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ margin: '0 0 10px', color: '#222719', fontSize: '16px' }}>Новый питомец на Стене Памяти</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Имя питомца *</label>
                  <input type="text" required placeholder="Шарик" value={newPetForm.name} onChange={(e) => setNewPetForm(prev => ({ ...prev, name: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Порода *</label>
                  <input type="text" required placeholder="Овчарка" value={newPetForm.breed} onChange={(e) => setNewPetForm(prev => ({ ...prev, breed: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Годы жизни *</label>
                  <input type="text" required placeholder="2010 — 2024" value={newPetForm.years} onChange={(e) => setNewPetForm(prev => ({ ...prev, years: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Эмодзи *</label>
                  <select value={newPetForm.emoji} onChange={(e) => setNewPetForm(prev => ({ ...prev, emoji: e.target.value }))} style={inputStyle}>
                    <option value="🐱">🐱 Кот</option>
                    <option value="🐶">🐶 Собака</option>
                    <option value="🐹">🐹 Хомяк</option>
                    <option value="🐰">🐰 Кролик</option>
                    <option value="🐦">🐦 Птица</option>
                    <option value="🦎">🦎 Рептилия</option>
                    <option value="🐾">🐾 Лапки</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Эпитафия / Описание</label>
                <textarea placeholder="Помним, любим, скорбим..." value={newPetForm.description} onChange={(e) => setNewPetForm(prev => ({ ...prev, description: e.target.value }))} style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Фото питомца</label>
                <input type="file" accept="image/*" onChange={(e) => handleFormPhotoChange(e, setNewPetForm, setNewPetPhotoPreview)} style={inputStyle} />
                {newPetPhotoPreview && <img src={newPetPhotoPreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', marginTop: '10px' }} />}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" disabled={isSaving} style={{ ...btnPrimary, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                  {isSaving ? 'Сохранение...' : 'Добавить питомца'}
                </button>
                <button type="button" disabled={isSaving} onClick={() => { setShowAddPetDirect(false); setNewPetForm(emptyPetForm); setNewPetPhotoPreview(''); }} style={{ ...btnSecondary, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                  Отмена
                </button>
              </div>
            </form>
          )}

          {/* Form for Creating Pet Request */}
          {showAddPetRequest && (
            <form onSubmit={handleCreatePetRequest} style={{ backgroundColor: '#f7faf3', padding: '24px', borderRadius: '14px', border: '2px solid #D8E8C8', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ margin: '0 0 10px', color: '#222719', fontSize: '16px' }}>Новая заявка на добавление питомца</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Имя питомца *</label>
                  <input type="text" required placeholder="Шарик" value={newPetRequestForm.name} onChange={(e) => setNewPetRequestForm(prev => ({ ...prev, name: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Порода *</label>
                  <input type="text" required placeholder="Овчарка" value={newPetRequestForm.breed} onChange={(e) => setNewPetRequestForm(prev => ({ ...prev, breed: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Годы жизни *</label>
                  <input type="text" required placeholder="2010 — 2024" value={newPetRequestForm.years} onChange={(e) => setNewPetRequestForm(prev => ({ ...prev, years: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Эмодзи *</label>
                  <select value={newPetRequestForm.emoji} onChange={(e) => setNewPetRequestForm(prev => ({ ...prev, emoji: e.target.value }))} style={inputStyle}>
                    <option value="🐱">🐱 Кот</option>
                    <option value="🐶">🐶 Собака</option>
                    <option value="🐹">🐹 Хомяк</option>
                    <option value="🐰">🐰 Кролик</option>
                    <option value="🐦">🐦 Птица</option>
                    <option value="🦎">🦎 Рептилия</option>
                    <option value="🐾">🐾 Лапки</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Email хозяина (для уведомлений)</label>
                  <input type="email" placeholder="owner@example.com" value={newPetRequestForm.email} onChange={(e) => setNewPetRequestForm(prev => ({ ...prev, email: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Эпитафия / Описание</label>
                <textarea placeholder="Помним, любим, скорбим..." value={newPetRequestForm.description} onChange={(e) => setNewPetRequestForm(prev => ({ ...prev, description: e.target.value }))} style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Фото питомца</label>
                <input type="file" accept="image/*" onChange={(e) => handleFormPhotoChange(e, setNewPetRequestForm, setNewPetRequestPhotoPreview)} style={inputStyle} />
                {newPetRequestPhotoPreview && <img src={newPetRequestPhotoPreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', marginTop: '10px' }} />}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" disabled={isSaving} style={{ ...btnPrimary, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                  {isSaving ? 'Сохранение...' : 'Создать заявку'}
                </button>
                <button type="button" disabled={isSaving} onClick={() => { setShowAddPetRequest(false); setNewPetRequestForm(emptyPetRequestForm); setNewPetRequestPhotoPreview(''); }} style={{ ...btnSecondary, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                  Отмена
                </button>
              </div>
            </form>
          )}

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
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                <p style={{ margin: 0, fontSize: '16px' }}>Нет новых заявок</p>
              </div>
            )}
          </div>

          <h2 style={{ color: '#222719', marginTop: '40px', marginBottom: '20px', fontSize: '20px' }}>История заявок</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {requests.filter((r) => r.status !== 'pending').map((request) => (
              <div
                key={request.id}
                style={{
                  backgroundColor: '#fafafa',
                  border: '1px solid #E2EBD5',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  opacity: 0.8,
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#E2EBD5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
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
                  <h3 style={{ margin: '0 0 4px', color: '#222719', fontSize: '16px' }}>{request.name}</h3>
                  <p style={{ margin: '0', color: '#556042', fontSize: '13px' }}><strong>Порода:</strong> {request.breed}</p>
                </div>

                <div>
                  <span
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: request.status === 'approved' ? '#E2F0D9' : '#FCE4D6',
                      color: request.status === 'approved' ? '#385723' : '#C65911',
                    }}
                  >
                    {request.status === 'approved' ? 'Одобрена' : 'Отклонена'}
                  </span>
                </div>
              </div>
            ))}
            {requests.filter((r) => r.status !== 'pending').length === 0 && (
              <p style={{ textAlign: 'center', color: '#999', margin: '20px 0' }}>История пуста</p>
            )}
          </div>
        </div>
      )}

      {/* ===== SERVICE REQUESTS TAB ===== */}
      {tab === 'service-requests' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: '#222719', margin: 0, fontSize: '20px' }}>Заявки на памятники</h2>
            <button
              onClick={() => setShowAddServiceRequest(!showAddServiceRequest)}
              style={btnPrimary}
            >
              {showAddServiceRequest ? '✕ Отмена' : '+ Создать заявку на памятник'}
            </button>
          </div>

          {showAddServiceRequest && (
            <form onSubmit={handleCreateServiceRequest} style={{ backgroundColor: '#f7faf3', padding: '24px', borderRadius: '14px', border: '2px solid #D8E8C8', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ margin: '0 0 10px', color: '#222719', fontSize: '16px' }}>Новая заявка на памятник</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Выберите памятник *</label>
                  <select
                    required
                    value={newServiceRequestForm.serviceId}
                    onChange={(e) => setNewServiceRequestForm(prev => ({ ...prev, serviceId: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="">-- Выберите памятник --</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{getServiceTitle(s)} ({getServicePrice(s)})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Имя клиента *</label>
                  <input type="text" required placeholder="Иван" value={newServiceRequestForm.name} onChange={(e) => setNewServiceRequestForm(prev => ({ ...prev, name: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Телефон клиента *</label>
                  <input type="text" required placeholder="+7 (707) 123-4567" value={newServiceRequestForm.phone} onChange={(e) => setNewServiceRequestForm(prev => ({ ...prev, phone: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Email клиента</label>
                  <input type="email" placeholder="client@example.com" value={newServiceRequestForm.email} onChange={(e) => setNewServiceRequestForm(prev => ({ ...prev, email: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '4px' }}>Комментарий / Пожелания</label>
                <textarea placeholder="Особые требования к оформлению памятника..." value={newServiceRequestForm.comment} onChange={(e) => setNewServiceRequestForm(prev => ({ ...prev, comment: e.target.value }))} style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" disabled={isSaving} style={{ ...btnPrimary, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                  {isSaving ? 'Сохранение...' : 'Создать заявку'}
                </button>
                <button type="button" disabled={isSaving} onClick={() => { setShowAddServiceRequest(false); setNewServiceRequestForm({ serviceId: '', name: '', phone: '', email: '', comment: '' }); }} style={{ ...btnSecondary, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                  Отмена
                </button>
              </div>
            </form>
          )}

          <h2 style={{ color: '#222719', marginBottom: '20px', fontSize: '20px' }}>Новые заявки на услуги</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {serviceRequests.filter((r) => r.status === 'pending').map((request) => (
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
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px', color: '#222719' }}>{request.serviceTitle}</h3>
                  <p style={{ margin: '0 0 4px', color: '#556042', fontSize: '14px' }}><strong>Имя:</strong> {request.name}</p>
                  <p style={{ margin: '0 0 4px', color: '#556042', fontSize: '14px' }}><strong>Телефон:</strong> {request.phone}</p>
                  {request.email && <p style={{ margin: '0 0 4px', color: '#556042', fontSize: '14px' }}><strong>Email:</strong> {request.email}</p>}
                  {request.comment && <p style={{ margin: '0 0 4px', color: '#556042', fontSize: '14px' }}><strong>Комментарий:</strong> {request.comment}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => updateServiceRequestStatus(request.id, 'done')} style={btnPrimary}>✓ Выполнено</button>
                  <button onClick={() => updateServiceRequestStatus(request.id, 'rejected')} style={btnSecondary}>✕ Отклонить</button>
                </div>
              </div>
            ))}
            {serviceRequests.filter((r) => r.status === 'pending').length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: '#999', backgroundColor: 'white', borderRadius: '14px', border: '2px dashed #E2EBD5' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                <p style={{ margin: 0, fontSize: '16px' }}>Нет новых заявок на памятники</p>
              </div>
            )}
          </div>

          <h2 style={{ color: '#222719', marginTop: '40px', marginBottom: '20px', fontSize: '20px' }}>История заявок на памятники</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {serviceRequests.filter((r) => r.status !== 'pending').map((request) => (
              <div
                key={request.id}
                style={{
                  backgroundColor: '#fafafa',
                  border: '1px solid #E2EBD5',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  opacity: 0.8,
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px', color: '#222719', fontSize: '16px' }}>{request.serviceTitle}</h3>
                  <p style={{ margin: '0', color: '#556042', fontSize: '13px' }}><strong>Клиент:</strong> {request.name} ({request.phone})</p>
                </div>
                <div>
                  <span
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: request.status === 'done' ? '#E2F0D9' : '#FCE4D6',
                      color: request.status === 'done' ? '#385723' : '#C65911',
                    }}
                  >
                    {request.status === 'done' ? 'Выполнена' : 'Отклонена'}
                  </span>
                </div>
              </div>
            ))}
            {serviceRequests.filter((r) => r.status !== 'pending').length === 0 && (
              <p style={{ textAlign: 'center', color: '#999', margin: '20px 0' }}>История пуста</p>
            )}
          </div>
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
              isSaving={isSaving}
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
                      isSaving={isSaving}
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
                        {getServicePrice(service) && (
                          <p style={{ margin: 0, color: '#222719', fontWeight: 700, fontSize: '15px' }}>{getServicePrice(service)}</p>
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
              isSaving={isSaving}
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
                      isSaving={isSaving}
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
                          <span>Загружен: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ''}</span>
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

      {/* ===== SETTINGS TAB ===== */}
      {tab === 'settings' && (
        <div style={{ maxWidth: '600px', backgroundColor: 'white', padding: '32px', borderRadius: '20px', border: '2px solid #E2EBD5', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          <h2 style={{ color: '#222719', marginTop: 0, marginBottom: '24px', fontSize: '20px' }}>⚙️ Настройки сборов и прогресса</h2>
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Раздел: Прогресс строительства */}
            <div style={{ borderBottom: '1px solid #E2EBD5', paddingBottom: '20px' }}>
              <h3 style={{ margin: '0 0 14px', color: '#556042', fontSize: '15px', fontWeight: 600 }}>🏗️ Прогресс строительства мемориала</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>Собрано (KZT) *</label>
                  <input
                    type="number"
                    required
                    placeholder="4200000"
                    value={constructionCollected}
                    onChange={(e) => setConstructionCollected(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>Цель (KZT) *</label>
                  <input
                    type="number"
                    required
                    placeholder="10000000"
                    value={constructionGoal}
                    onChange={(e) => setConstructionGoal(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                Процент на сайте: {constructionGoal && Number(constructionGoal) > 0 ? Math.min(100, Math.max(0, Math.round((Number(constructionCollected) / Number(constructionGoal)) * 100))) : 0}%
              </div>
            </div>

            {/* Раздел: Финансовая поддержка / Общие донаты */}
            <div style={{ paddingBottom: '10px' }}>
              <h3 style={{ margin: '0 0 14px', color: '#556042', fontSize: '15px', fontWeight: 600 }}>💚 Общие донаты фонда</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>Собрано (KZT) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1500000"
                    value={donationsCollected}
                    onChange={(e) => setDonationsCollected(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#556042', display: 'block', marginBottom: '6px' }}>Цель (KZT) *</label>
                  <input
                    type="number"
                    required
                    placeholder="5000000"
                    value={donationsGoal}
                    onChange={(e) => setDonationsGoal(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                Процент на сайте: {donationsGoal && Number(donationsGoal) > 0 ? Math.min(100, Math.max(0, Math.round((Number(donationsCollected) / Number(donationsGoal)) * 100))) : 0}%
              </div>
            </div>

            {/* Кнопка отправки */}
            <div style={{ display: 'flex', gap: '12px', paddingTop: '10px' }}>
              <button type="submit" disabled={isSaving} style={{ ...btnPrimary, padding: '12px 32px' }}>
                {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
              </button>
              <button type="button" disabled={isSaving} onClick={loadSettings} style={btnSecondary}>
                Сбросить
              </button>
            </div>

          </form>
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
