import { useState, useEffect } from 'react';
import { db, DEFAULT_SERVICES, type PetRequest, type Service, type ServiceRequest } from '../db/memorialDB';

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

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'requests' | 'service-requests' | 'services'>('requests');

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

  useEffect(() => {
    if (isAuthenticated) {
      loadRequests();
      loadServices();
      loadServiceRequests();
    }
  }, [isAuthenticated]);

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
    const allRequests = await db.petRequests.toArray();
    setRequests(allRequests);
  };

  // ===== SERVICE REQUESTS =====
  const loadServiceRequests = async () => {
    const all = await db.serviceRequests.toArray();
    setServiceRequests(all.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)));
  };

  const updateServiceRequestStatus = async (id: number | undefined, status: 'done' | 'rejected') => {
    if (!id) return;
    await db.serviceRequests.update(id, { status });
    loadServiceRequests();
  };



  const approvePetRequest = async (id: number | undefined) => {
    if (!id) return;
    const request = await db.petRequests.get(id);
    if (request) {
      await db.pets.add({
        name: request.name,
        breed: request.breed,
        years: request.years,
        emoji: request.emoji,
        description: request.description,
        photo: request.photo,
        createdAt: new Date(),
      });
      await db.petRequests.update(id, { status: 'approved' });
      loadRequests();
    }
  };

  const rejectPetRequest = async (id: number | undefined) => {
    if (!id) return;
    await db.petRequests.update(id, { status: 'rejected' });
    loadRequests();
  };

  // ===== SERVICES =====
  const loadServices = async () => {
    let allServices = await db.services.toArray();
    // Seed defaults if empty
    if (allServices.length === 0) {
      await db.services.bulkAdd(DEFAULT_SERVICES);
      allServices = await db.services.toArray();
    }
    setServices(allServices.sort((a, b) => a.order - b.order));
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
    await db.services.add({
      tag: addForm.tag,
      title: addForm.title,
      description: addForm.description,
      image: addForm.image || undefined,
      price: addForm.price || undefined,
      category: addForm.category || undefined,
      order: maxOrder + 1,
    });
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
    await db.services.update(editingId, {
      tag: editForm.tag,
      title: editForm.title,
      description: editForm.description,
      image: editForm.image || undefined,
      price: editForm.price || undefined,
      category: editForm.category || undefined,
    });
    cancelEdit();
    loadServices();
  };

  const deleteService = async (id: number | undefined) => {
    if (!id) return;
    if (confirm('Удалить услугу?')) {
      await db.services.delete(id);
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
    </div>
  );
}
