import { useState, useEffect } from 'react';
import { PageHero } from '../components/PageHero';
import { db, type Pet } from '../db/memorialDB';
import { useLang } from '../i18n/LangContext';

export function MemorialWall() {
  const { t } = useLang();
  const mem = t.memorial;

  const [pets, setPets] = useState<Pet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    years: '',
    emoji: '🐱',
    description: '',
    email: '',
    photo: '',
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    const allPets = await db.pets.toArray();
    setPets(allPets);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPhotoPreview(base64);
        setFormData({ ...formData, photo: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.breed || !formData.years) {
      alert(mem.alertFields);
      return;
    }
    await db.petRequests.add({
      name: formData.name,
      breed: formData.breed,
      years: formData.years,
      emoji: formData.emoji,
      description: formData.description,
      email: formData.email,
      photo: formData.photo || undefined,
      status: 'pending',
      createdAt: new Date(),
    });
    setFormData({ name: '', breed: '', years: '', emoji: '🐱', description: '', email: '', photo: '' });
    setPhotoPreview('');
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleDeletePet = async (id: number | undefined) => {
    if (id && confirm('Вы уверены, что хотите удалить?')) {
      await db.pets.delete(id);
      loadPets();
    }
  };

  return (
    <div>
      <PageHero title={mem.pageTitle} subtitle={mem.pageSubtitle} />

      <div className="container-responsive" style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 100px' }}>
        {/* Success message */}
        {submitted && (
          <div
            style={{
              backgroundColor: '#f0f8f0',
              border: '2px solid #C8DFA0',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
              color: '#2d5a2d',
              fontWeight: 500,
            }}
          >
            {mem.successMsg}
          </div>
        )}

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: '#d0e0bd',
              color: '#222719',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '26px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = '#b8cba3'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = '#d0e0bd'; }}
          >
            {mem.btnAdd}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div
            style={{
              backgroundColor: '#f9f9f9',
              padding: '32px',
              borderRadius: '16px',
              marginBottom: '40px',
              border: '2px solid #E2EBD5',
            }}
          >
            <h3 style={{ margin: '0 0 24px', color: '#222719' }}>{mem.formTitle}</h3>
            <p style={{ margin: '0 0 24px', color: '#556042', fontSize: '14px' }}>{mem.formNote}</p>
            <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="memorial-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input
                  type="text"
                  placeholder={mem.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                />
                <input
                  type="text"
                  placeholder={mem.breedPlaceholder}
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                />
              </div>

              <div className="memorial-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input
                  type="text"
                  placeholder={mem.yearsPlaceholder}
                  value={formData.years}
                  onChange={(e) => setFormData({ ...formData, years: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                />
                <input
                  type="email"
                  placeholder={mem.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#556042' }}>
                  {mem.emojiLabel}
                </label>
                <select
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', width: '50%' }}
                >
                  <option value="🐱">🐱</option>
                  <option value="🐶">🐶</option>
                  <option value="🐰">🐰</option>
                  <option value="🦜">🦜</option>
                  <option value="🐹">🐹</option>
                  <option value="🐢">🐢</option>
                </select>
              </div>

              {/* Photo upload */}
              <div style={{ border: '2px dashed #C8DFA0', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  <div style={{ fontSize: '14px', color: '#556042', fontWeight: 500 }}>{mem.photoLabel}</div>
                </label>
                {photoPreview && (
                  <div style={{ marginTop: '12px' }}>
                    <img src={photoPreview} alt="Preview" style={{ maxWidth: '120px', maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <textarea
                placeholder={mem.descPlaceholder}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minHeight: '100px', fontFamily: 'inherit' }}
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{ backgroundColor: '#d0e0bd', color: '#222719', border: 'none', padding: '12px 32px', borderRadius: '26px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {mem.btnSubmit}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setPhotoPreview(''); setFormData({ name: '', breed: '', years: '', emoji: '🐱', description: '', email: '', photo: '' }); }}
                  style={{ backgroundColor: '#E2EBD5', color: '#222719', border: 'none', padding: '12px 32px', borderRadius: '26px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {mem.btnCancel}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pet grid */}
        <div className="memorial-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 300px)', gap: '28px', justifyContent: 'center' }}>
          {pets.map((pet) => (
            <div
              key={pet.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                minHeight: '320px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#E2EBD5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '8px', overflow: 'hidden' }}>
                {pet.photo ? (
                  <img src={pet.photo} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : pet.emoji}
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#222719', margin: 0, textAlign: 'center' }}>{pet.name}</h3>
              <p style={{ fontSize: '13px', color: '#556042', margin: 0, textAlign: 'center' }}>{pet.breed}</p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#6E8B51', margin: 0, textAlign: 'center' }}>{pet.years}</p>

              {pet.description && (
                <p style={{ fontSize: '12px', color: '#666', margin: '8px 0', textAlign: 'center', fontStyle: 'italic' }}>
                  "{pet.description}"
                </p>
              )}

              <div style={{ color: '#6E8B51', fontSize: '16px', margin: '4px 0' }}>♥</div>

              <button
                onClick={() => handleDeletePet(pet.id)}
                style={{
                  marginTop: 'auto',
                  backgroundColor: '#E2EBD5',
                  color: '#222719',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  width: '100%',
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = '#C8DFA0'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = '#E2EBD5'; }}
              >
                {mem.btnDelete}
              </button>
            </div>
          ))}
        </div>

        {pets.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#556042' }}>
            <p style={{ fontSize: '18px' }}>{mem.emptyTitle}</p>
            <p style={{ fontSize: '14px' }}>{mem.emptyHint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
