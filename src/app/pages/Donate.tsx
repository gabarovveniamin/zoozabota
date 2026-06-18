import { useState, useEffect } from 'react';
import { PageHero } from '../components/PageHero';
import { useLang } from '../i18n/LangContext';
import { settingsApi } from '../db/api';

export function Donate() {
  const { lang, t } = useLang();
  const { donate } = t;

  const [settings, setSettings] = useState<Record<string, string>>({
    construction_collected: '4200000',
    construction_goal: '10000000',
    donations_collected: '1500000',
    donations_goal: '5000000',
  });

  useEffect(() => {
    let isMounted = true;
    settingsApi.get()
      .then((data) => {
        if (isMounted) {
          setSettings(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load settings:', err);
      });
    return () => { isMounted = false; };
  }, []);

  const constCollected = Number(settings.construction_collected) || 0;
  const constGoal = Number(settings.construction_goal) || 1;
  const constPercentage = Math.min(100, Math.max(0, Math.round((constCollected / constGoal) * 100)));

  const donCollected = Number(settings.donations_collected) || 0;
  const donGoal = Number(settings.donations_goal) || 1;
  const donPercentage = Math.min(100, Math.max(0, Math.round((donCollected / donGoal) * 100)));

  const texts: Record<'ru' | 'kz' | 'en', { collected: string; goalConstruction: string; donationsTitle: string; donationsGoal: string }> = {
    ru: {
      collected: 'собрано',
      goalConstruction: 'Цель: строительство мемориального комплекса',
      donationsTitle: 'Сбор средств на содержание фонда',
      donationsGoal: 'Цель: поддержка приюта и операционные расходы',
    },
    kz: {
      collected: 'жинақталды',
      goalConstruction: 'Мақсаты: мемориалдық кешен құрылысы',
      donationsTitle: 'Қорды қолдауға қаражат жинау',
      donationsGoal: 'Мақсаты: баспананы қолдау және операциялық шығындар',
    },
    en: {
      collected: 'collected',
      goalConstruction: 'Goal: construction of the memorial complex',
      donationsTitle: 'Fundraising for fund maintenance',
      donationsGoal: 'Goal: shelter support and operating expenses',
    }
  };

  return (
    <div>
      <PageHero title={donate.pageTitle} subtitle={donate.pageSubtitle} />

      <div className="container-responsive" style={{ maxWidth: '1440px', margin: '0 auto', padding: '60px 100px' }}>
        {/* Donation cards */}
        <div
          className="donate-flex-row"
          style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {/* Kaspi Card */}
          <div
            className="donate-card-responsive"
            style={{
              width: '560px',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: '#ED1B24',
                padding: '20px 28px',
                color: 'white',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {donate.kaspiTitle}
            </div>

            <div style={{ padding: '28px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                {donate.kaspiRows.map((row) => (
                  <div key={row.label} style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', color: '#556042', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#222719', fontFamily: 'monospace' }}>
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* QR */}
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: '#E2EBD5',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ fontSize: '32px' }}>📱</div>
                <div style={{ fontSize: '10px', color: '#556042', textAlign: 'center' }}>QR-код</div>
              </div>
            </div>
          </div>

          {/* Bank Transfer Card */}
          <div
            className="donate-card-responsive"
            style={{
              width: '560px',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: '#d0e0bd',
                padding: '20px 28px',
                color: '#222719',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {donate.bankTitle}
            </div>

            <div style={{ padding: '28px' }}>
              {donate.bankRows.map((row) => (
                <div key={row.label} style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#556042', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#222719', fontFamily: 'monospace' }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Progress bar card 1: Construction */}
          <div
            style={{
              flex: '1 1 450px',
              maxWidth: '560px',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              padding: '36px 48px',
              boxSizing: 'border-box',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#222719', margin: '0 0 24px' }}>
              {donate.progressTitle}
            </h3>

            <div
              style={{
                width: '100%',
                height: '16px',
                backgroundColor: '#E2EBD5',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: `${constPercentage}%`,
                  height: '100%',
                  backgroundColor: '#d0e0bd',
                  borderRadius: '8px',
                  transition: 'width 1s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#222719' }}>
                {constPercentage}% {texts[lang as 'ru'|'kz'|'en']?.collected || 'собрано'}
              </span>
              <span style={{ fontSize: '13px', color: '#556042' }}>{texts[lang as 'ru'|'kz'|'en']?.goalConstruction}</span>
            </div>
          </div>

          {/* Progress bar card 2: General Donations */}
          <div
            style={{
              flex: '1 1 450px',
              maxWidth: '560px',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              padding: '36px 48px',
              boxSizing: 'border-box',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#222719', margin: '0 0 24px' }}>
              {texts[lang as 'ru'|'kz'|'en']?.donationsTitle}
            </h3>

            <div
              style={{
                width: '100%',
                height: '16px',
                backgroundColor: '#E2EBD5',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: `${donPercentage}%`,
                  height: '100%',
                  backgroundColor: '#c8dfa0',
                  borderRadius: '8px',
                  transition: 'width 1s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#222719' }}>
                {donPercentage}% {texts[lang as 'ru'|'kz'|'en']?.collected || 'собрано'}
              </span>
              <span style={{ fontSize: '13px', color: '#556042' }}>{texts[lang as 'ru'|'kz'|'en']?.donationsGoal}</span>
            </div>
          </div>
        </div>

        {/* Plan Image */}
        <div
          style={{
            marginTop: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="/image/plan.jpg"
            alt="Construction Plan"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '700px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  );
}
