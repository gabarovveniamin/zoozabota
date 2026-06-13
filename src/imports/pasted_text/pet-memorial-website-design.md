Design a multi-page website for a pet memorial complex in Kazakhstan called "ZooZabota" (zoozabota.kz).

BRAND & STYLE
- Logo: circular emblem with hands holding a cat and dog silhouette, heart shape, olive green leaves
- Color palette: 
  • Background: #F8F9F5 (off-white)
  • Primary: #456332 (dark olive green)
  • Secondary: #6E8B51 (medium olive)
  • Accent light: #C8DFA0 (soft sage)
  • Surface light: #E2EBD5 (pale green)
  • Text dark: #222719
  • Text mid: #556042
  • Donate accent: #D37632 (warm orange)
- Typography: Inter font family
- Style: clean, warm, nature-inspired, trustworthy. NOT clinical or dark. 
  Think: gentle memorial park, not funeral home.
- Corner radius: 16px cards, 26px buttons
- Shadows: soft, 8% opacity

GLOBAL COMPONENTS (reuse on every page)
Navbar (72px height, #456332 background):
- Left: circular logo placeholder (40px) + "ZooZabota" bold white 20px
- Right: nav links in #C8DFA0 — [Главная] [Услуги] [Доска памяти] [Доп. услуги] [Донат]
- Sticky, 1440px wide

Footer (100px, #456332):
- Left: "© 2024 Фонд защиты животных «Өмірге Үміт Бер»"
- Sub: "zoozabota.kz · Алматы, Казахстан"

PAGE HERO COMPONENT (reuse on inner pages):
- Full width, 200px height, #456332 fill
- 44px Bold white title, 18px Regular #E2EBD5 subtitle

---

PAGE 1 — ГЛАВНАЯ (Home)

Section 1 — Hero (600px tall):
- Background: dark olive gradient left-to-right (#456332 → #6E8B51)
- Left side text:
  • H1 56px Bold white: "Мемориальный комплекс\nдля ваших питомцев"
  • Body 20px #E2EBD5: "Единственный в Казахстане зоомемориальный комплекс. Сохраните память о вашем любимце навсегда."
  • Two buttons side by side:
    - Primary: white pill button "Наши услуги" → text #456332
    - Secondary: outline pill button "Поддержать проект" → text white, border white
- Right side: large decorative circle placeholder (400×400px) with leaf/paw illustration placeholder

Section 2 — Stats strip (96px, #E2EBD5 background):
Four stats evenly spaced:
- "Единственный в Казахстане"
- "2024" / "Год основания"  
- "∞" / "Памятей навсегда"
- "❤️" / "С любовью к животным"
Each: number 28px Bold #456332, label 13px Regular #556042

Section 3 — О проекте:
- Section title 36px Bold: "О нашем проекте"
- Body text 16px Regular #556042 (two paragraphs about the project)
- 4 preview cards in a row (card design below)

CARD COMPONENT:
- 280×340px, white background, 16px radius, soft shadow
- Top 180px: #E2EBD5 image placeholder with 🐾 centered
- Tag chip (90×24px, 12px radius) with category label
- Title 16px Semi Bold
- Description 13px Regular #556042
- Bottom: full-width #456332 button "Подробнее", 8px radius

---

PAGE 2 — ОФИЦИАЛЬНОЕ ОБРАЩЕНИЕ

Page Hero: "Официальное обращение"

Main content: centered document card (900px wide, white, 20px radius, soft shadow):
- Header strip (#E2EBD5):
  • "ОФ «ФОНД ЗАЩИТЫ ЖИВОТНЫХ «ӨМІРГЕ ҮМІТ БЕР»" — 14px Bold #456332
  • "БИН: 200640028131 · 050054, г. Алматы, район Турксибский, ул. Пограничная, д. 1/1" — 12px #556042
- Divider line (#C8DFA0)
- Title: "ОБРАЩЕНИЕ К ГРАЖДАНАМ И ОРГАНИЗАЦИЯМ" — 22px Bold
- Body text (15px Regular, dark): formal appeal letter text about the memorial complex project, ~6 paragraphs
- Signature: "С уважением, Фонд защиты животных «Өмірге Үміт Бер»"
- Bottom: #6E8B51 button "📄 Скачать PDF"

---

PAGE 3 — НАШИ УСЛУГИ (Каталог памятников)

Page Hero: "Каталог памятников"

Filter bar (full width, white background, 12px radius):
Pills: [Все ✓] [Гранитные] [Мраморные] [Деревянные] [Индивидуальные]
Active pill: #456332 background white text. Inactive: #E2EBD5 background #556042 text.

3×2 grid of monument cards (380×340px each, using Card Component above):
1. "Гранитный стандарт" — tag: Гранит — "от 45 000 ₸"
2. "Мраморный классик" — tag: Мрамор — "от 65 000 ₸"
3. "Деревянный крест" — tag: Дерево — "от 18 000 ₸"
4. "Гранит Премиум" — tag: Премиум — "от 120 000 ₸"
5. "Именная табличка" — tag: Бюджет — "от 8 000 ₸"
6. "Индивидуальный заказ" — tag: VIP — "по запросу"

---

PAGE 4 — ДОСКА ПАМЯТИ (Memorial Wall)

Page Hero: "🌿 Доска памяти" + subtitle "Страницы питомцев, которые навсегда останутся в наших сердцах"

CTA button: #6E8B51 pill "+ Добавить питомца"

4-column grid of memorial cards (300×320px each):
Each card contains:
- Centered circle avatar (100×100px, #E2EBD5) with 🐱 or 🐶 emoji
- Pet name: 20px Bold centered
- Breed: 13px Regular #556042 centered
- Years: 14px Medium #6E8B51 centered (e.g. "2010 – 2023")
- Small ♥ divider in #6E8B51
- Ghost button "Открыть страницу" (#E2EBD5 background, #456332 text)

Example pets: Барсик (Персидский кот, 2010–2023), Шарик (Лабрадор, 2012–2024), 
Мурка (Сиамская кошка, 2015–2023), Рекс (Немецкая овчарка, 2008–2022),
Пушок (Ангорский кот, 2016–2024), Бобик (Дворняжка, 2011–2023)

---

PAGE 5 — ДОП. УСЛУГИ

Page Hero: "Дополнительные услуги"

2×2 grid of horizontal service cards (620×200px each):
Each card: white bg, 20px radius, soft shadow, left accent bar 6px #456332
Layout inside: emoji (52px) on left, then tag chip + title (22px Bold) + description (14px) + small #456332 button "Узнать больше"

1. 🏪 Зоомагазин — "Товары для ухода за животными, корма, аксессуары и памятные вещи"
2. 🤝 Зоотерапия — "Психологическая поддержка и анималотерапия для людей, потерявших питомца"
3. 🏠 Приют — "Временный приют для животных, оказавшихся в трудной ситуации"
4. 🐾 Питомник — "Ответственное разведение и передержка домашних животных"

---

PAGE 6 — ДОНАТ

Page Hero: "💚 Поддержите проект" + subtitle "Без вашей поддержки нам не справиться. Каждый вклад важен."

Two side-by-side donation cards (560×360px each, white, 20px radius, heavy shadow):

Card 1 — Kaspi:
- Header strip: Kaspi red (#ED1B24) — "🟥 Перевод через Kaspi"
- Rows of info:
  • Номер карты: 4400 4303 6020 4827
  • Телефон: +7 708 815-20-38
  • Получатель: Арина Ю.
- Right side: 120×120px QR code placeholder (#E2EBD5)

Card 2 — Bank transfer:
- Header strip: #456332 — "🏦 Банковский перевод"
- Rows of info:
  • IBAN: KZ88 8562 2031 0863 2280
  • Банк: АО «Банк ЦентрКредит»
  • БИК: KCJBKZKX
  • Получатель: ОФ «Фонд защиты животных»

Progress bar section (1200px wide, white card below both donate cards):
- Title: "Прогресс строительства" 20px Bold
- Full-width progress bar: #E2EBD5 background, #6E8B51 fill at 42%
- Label: "42% собрано"

---

DESIGN SYSTEM NOTES
- All pages: 1440px wide desktop frames
- Consistent navbar + footer on every page
- Spacing: 100px horizontal padding, 40px between sections
- All interactive elements (buttons, cards) should show hover state variant
- Light theme only
- Responsive hints: mark which sections collapse to 1-column on mobile