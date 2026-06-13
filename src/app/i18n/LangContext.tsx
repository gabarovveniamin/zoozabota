import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'ru' | 'kz' | 'en';

export const translations = {
  ru: {
    // Navbar
    nav: {
      home: 'Главная',
      about: 'О нас',
      services: 'Памятники',
      memorial: 'Доска памяти',
      extra: 'Услуги',
      donate: 'Донат',
    },
    // Home
    home: {
      heroTitle: 'Мемориальный комплекс\nдля ваших питомцев',
      heroSubtitle: 'Единственный в Казахстане зоомемориальный комплекс. Сохраните память о вашем любимце навсегда.',
      btnServices: 'Наши памятники',
      btnDonate: 'Поддержать проект',
      stats: [
        { number: '☝🏻', label: 'Единственный в Казахстане' },
        { number: '2026', label: 'Год основания' },
        { number: '❤️', label: 'С любовью к каждому' },
      ],
      aboutTitle: 'О нашем проекте',
      aboutP1: 'ZooZabota — это единственный в Казахстане мемориальный комплекс, созданный специально для домашних животных. Мы верим, что каждый питомец заслуживает достойного прощания и вечной памяти. Наш комплекс сочетает в себе традиции уважения к природе и современные решения для сохранения воспоминаний.',
      aboutP2: 'Мы предлагаем широкий спектр услуг: от изготовления памятников и надгробий до психологической поддержки владельцев. Наша миссия — помочь людям пережить потерю и сохранить светлую память о своих четвероногих друзьях.',
      previewCards: [
        { tag: 'Гранит', title: 'Гранитный стандарт', description: 'Классический гранитный памятник с гравировкой имени и дат.' },
        { tag: 'Мрамор', title: 'Мраморный классик', description: 'Элегантный белый мрамор с индивидуальной надписью.' },
        { tag: 'Дерево', title: 'Деревянный крест', description: 'Тёплый деревянный памятный знак ручной работы.' },
        { tag: 'Услуги', title: 'Зоотерапия', description: 'Психологическая поддержка для людей, потерявших питомца.' },
      ],
    },
    about: {
      pageTitle: 'О нас',
      subtitle: 'Мемориальный комплекс для домашних животных',
      p1: 'Потеря любимого питомца — это потеря члена семьи, верного друга и части нашей жизни. Мы создали пространство, где каждый хозяин может достойно проводить своего любимца в последний путь, сохранить светлую память и найти место для тихих воспоминаний.',
      p2: 'Наш мемориальный комплекс объединяет современный колумбарий для хранения урн с прахом домашних животных, благоустроенную территорию для посещения, аллею героев и атмосферу уважения к жизни и любви, которую дарят нам наши питомцы.',
      p3: 'Мы убеждены, что забота о животных не заканчивается с их уходом. Именно поэтому особое внимание уделяется экологичному подходу и сохранению окружающей среды. Мы уважаем природу, поддерживаем цивилизованные способы прощания с питомцами и стремимся исключить стихийные захоронения, которые наносят вред экологии.',
      p4: 'Наша цель — создать место памяти, благодарности и душевного спокойствия, где любовь к тем, кто был рядом с нами, будет жить вечно.',
      p5: 'Мы с уважением относимся к каждому питомцу, каждой семье и к природе, которая является нашим общим домом.',
      slogan: 'Светлая память. Достойное прощание. Забота о будущем.',
    },
    agreement: {
      title: 'Соглашения и документы',
      p1: 'Мы стремимся обеспечить открытость, законность и прозрачность нашей деятельности. На этой странице размещены официальные документы, регулирующие порядок оказания услуг мемориального комплекса для домашних животных, а также права и обязанности сторон.',
      p2: 'Перед оформлением заказа рекомендуем ознакомиться с представленными документами. Они содержат информацию об условиях предоставления услуг, порядке хранения урн в колумбарии, правилах посещения комплекса, политике обработки персональных данных и иных важных аспектах сотрудничества.',
      p3: 'Наша деятельность основана на принципах уважения к памяти домашних животных, заботы об окружающей среде и соблюдения действующего законодательства Республики Казахстан.',
      p4: 'Мы ценим доверие наших клиентов и делаем всё возможное, чтобы каждая услуга предоставлялась на высоком уровне, с максимальной ответственностью и вниманием к каждой семье.',
      p5: 'Если у вас возникли вопросы по условиям соглашений или порядку оказания услуг, наши специалисты всегда готовы предоставить необходимые разъяснения.',
      btnAccept: 'Ознакомлен(а)',
    },
    // Services
    services: {
      pageTitle: 'Каталог памятников',
      filters: ['Все', 'Гранитные', 'Мраморные', 'Деревянные', 'Индивидуальные'],
      loading: 'Загрузка...',
      empty: 'Нет памятников в этой категории',
      btnDetails: 'Подробнее →',
    },
    // Service Modal
    modal: {
      features: ['✓ Индивидуальный подход', '✓ Гарантия качества', '✓ Доставка и установка'],
      priceLabel: 'Стоимость',
      formTitle: 'Оставить заявку на памятник',
      nameLabel: 'Ваше имя *',
      namePlaceholder: 'Иван Петров',
      phoneLabel: 'Телефон *',
      phonePlaceholder: '+7 (___) ___-__-__',
      emailLabel: 'Email (необязательно)',
      commentLabel: 'Комментарий (необязательно)',
      commentPlaceholder: 'Расскажите подробнее — имя питомца, пожелания по материалу, сроки...',
      consent: 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных',
      btnSend: 'Отправить заявку →',
      btnSending: 'Отправляем...',
      successTitle: 'Заявка отправлена!',
      successText: 'Мы свяжемся с вами в ближайшее время.\nСпасибо, что выбрали ZooZabota 🐾',
      btnClose: 'Закрыть',
      alertFields: 'Укажите имя и телефон',
    },
    // Memorial
    memorial: {
      pageTitle: '🌿 Доска памяти',
      pageSubtitle: 'Страницы питомцев, которые навсегда останутся в наших сердцах',
      btnAdd: '+ Добавить питомца',
      formTitle: 'Добавить питомца на доску памяти',
      formNote: 'Заполните форму ниже. Ваша заявка будет проверена модератором перед публикацией.',
      namePlaceholder: 'Имя питомца*',
      breedPlaceholder: 'Порода*',
      yearsPlaceholder: 'Годы жизни (например: 2015 – 2024)*',
      emailPlaceholder: 'Ваш email',
      emojiLabel: 'Выберите эмодзи питомца',
      photoLabel: '📸 Нажмите для загрузки фотографии питомца',
      descPlaceholder: 'Описание питомца (необязательно)',
      btnSubmit: 'Отправить заявку',
      btnCancel: 'Отмена',
      successMsg: '✓ Спасибо! Ваша заявка отправлена на модерацию. Она будет опубликована после проверки.',
      emptyTitle: 'Пока нет питомцев на доске памяти.',
      emptyHint: 'Нажмите "Добавить питомца", чтобы отправить заявку.',
      btnDelete: 'Удалить',
      alertFields: 'Заполните все обязательные поля',
      searchPlaceholder: 'Поиск по имени, породе или описанию...',
      noResults: 'Ничего не найдено. Попробуйте изменить запрос.',
    },
    // Extra
    extra: {
      pageTitle: 'Услуги',
      btnLearnMore: 'Узнать больше',
      services: [
        { tag: 'Магазин', title: 'Зоомагазин', description: 'Товары для ухода за животными, корма, аксессуары и памятные вещи. Широкий ассортимент товаров для заботливых хозяев.' },
        { tag: 'Поддержка', title: 'Зоотерапия', description: 'Психологическая поддержка и анималотерапия для людей, потерявших питомца. Индивидуальные и групповые сессии с опытными специалистами.' },
        { tag: 'Приют', title: 'Приют', description: 'Временный приют для животных, оказавшихся в трудной ситуации. Обеспечиваем уход, питание и ветеринарную помощь.' },
        { tag: 'Питомник', title: 'Питомник', description: 'Ответственное разведение и передержка домашних животных. Все животные привиты и имеют ветеринарные документы.' },
      ],
    },
    // Donate
    donate: {
      pageTitle: '💚 Поддержите проект',
      pageSubtitle: 'Без вашей поддержки нам не справиться. Каждый вклад важен.',
      kaspiTitle: '🟥 Перевод через Kaspi',
      bankTitle: '🏦 Банковский перевод',
      progressTitle: 'Прогресс строительства',
      progressText: '42% собрано',
      progressGoal: 'Цель: строительство мемориального комплекса',
      kaspiRows: [
        { label: 'Номер карты', value: '4400 4303 6020 4827' },
        { label: 'Телефон', value: '+7 708 815-20-38' },
        { label: 'Получатель', value: 'Арина Ю.' },
      ],
      bankRows: [
        { label: 'IBAN', value: 'KZ88 8562 2031 0863 2280' },
        { label: 'Банк', value: 'АО «Банк ЦентрКредит»' },
        { label: 'БИК', value: 'KCJBKZKX' },
        { label: 'Получатель', value: 'ОФ «Фонд защиты животных»' },
      ],
    },
    // Footer
    footer: {
      copy: '© 2026 Фонд защиты животных «Өмірге Үміт Бер»',
      address: 'zoozabota.kz · Алматы, Казахстан',
      directorTitle: 'Директор проекта',
      contactsTitle: 'Контакты',
      socialsTitle: 'Мы в соцсетях',
      documents: 'Документы',
    },
    // 404
    notFound: {
      title404: '404',
      titleError: 'Ошибка',
      subtitle404: 'Страница не найдена',
      subtitleError: 'Что-то пошло не так',
      text404: 'Такой страницы не существует. Возможно, ссылка устарела или была введена с ошибкой.',
      textError: 'Произошла непредвиденная ошибка. Попробуйте обновить страницу.',
      btnHome: '← На главную',
    },
  },

  kz: {
    nav: {
      home: 'Басты бет',
      about: 'Біз туралы',
      services: 'Ескерткіштер',
      memorial: 'Ес қалдыру тақтасы',
      extra: 'Қызметтер',
      donate: 'Демеу',
    },
    home: {
      heroTitle: 'Үй жануарларыңызға\nарналған мемориалды кешен',
      heroSubtitle: 'Қазақстандағы жалғыз зоомемориалды кешен. Сүйікті жануарыңыздың естелігін мәңгі сақтаңыз.',
      btnServices: 'Біздің ескерткіштер',
      btnDonate: 'Жобаны қолдау',
      stats: [
        { number: '☝🏻', label: 'Қазақстандағы жалғыз' },
        { number: '2026', label: 'Құрылған жылы' },
        { number: '❤️', label: 'Әрқайсысына деген сүйіспеншілікпен' },
      ],
      aboutTitle: 'Жоба туралы',
      aboutP1: 'ZooZabota — Қазақстандағы үй жануарларына арнайы жасалған жалғыз мемориалды кешен. Биз әрбір үй жануары лайықты қоштасуға және мәңгілік естелікке ие болу керек деп сенеміз.',
      aboutP2: 'Біз кең ауқымды қызметтер ұсынамыз: ескерткіш жасаудан бастап иелеріне психологиялық қолдау көрсетуге дейін. Біздің миссиямыз — адамдарға жоғалтуды бастан өткізуге және жарық естелікті сақтауға көмектесу.',
      previewCards: [
        { tag: 'Гранит', title: 'Гранит стандарт', description: 'Аты мен күндерін ойып жазылған классикалық гранит ескерткіш.' },
        { tag: 'Мәрмәр', title: 'Мәрмәр классик', description: 'Жеке жазуы бар сәнді ақ мәрмәр.' },
        { tag: 'Ағаш', title: 'Ағаш крест', description: 'Қолдан жасалған жылы ағаш ескерткіш белгі.' },
        { tag: 'Қызметтер', title: 'Зоотерапия', description: 'Үй жануарын жоғалтқан адамдарға психологиялық қолдау.' },
      ],
    },
    about: {
      pageTitle: 'Біз туралы',
      subtitle: 'Үй жануарларына арналған мемориалды кешен',
      p1: 'Сүйікті жануарыңызды жоғалту — бұл отбасы мүшесін, адал досыңызды және өміріміздің бір бөлігін жоғалту. Біз әрбір иесі өзінің үй жануарын соңғы сапарға лайықты түрде шығарып салып, жарқын естелікті сақтап, тыныш естеліктер үшін орын таба алатын кеңістік жасадық.',
      p2: 'Біздің мемориалды кешеніміз үй жануарларының күлі салынған құмыраларды сақтауға арналған заманауи колумбарийді, келушілерге арналған абаттандырылған аумақты, батырлар аллеясын және үй жануарлары бізге сыйлайтын өмір мен махаббатқа деген құрмет атмосферасын біріктіреді.',
      p3: 'Үй жануарларына қамқорлық олардың кетуімен аяқталмайтынына сенімдіміз. Дәл сондықтан экологиялық тәсілге және қоршаған ортаны сақтауға ерекше назар аударылады. Біз табиғатты құрметтейміз, үй жануарларымен қоштасудың өркениетті жолдарын қолдаймыз және экологияға зиян келтіретін стихиялық жерлеулерді болдырмауға тырысамыз.',
      p4: 'Біздің мақсатымыз — біздің қасымызда болғандарға деген махаббат мәңгі өмір сүретін естелік, алғыс және жан тыныштығы орнын жасау.',
      p5: 'Біз әрбір үй жануарына, әрбір отбасына және ортақ үйіміз болып табылатын табиғатқа құрметпен қараймыз.',
      slogan: 'Жарқын естелік. Лайықты қоштасу. Болашаққа қамқорлық.',
    },
    agreement: {
      title: 'Келісімдер мен құжаттар',
      p1: 'Біз өз қызметіміздің ашықтығын, заңдылығын және айқындылығын қамтамасыз етуге тырысамыз. Бұл бетте үй жануарларына арналған мемориалды кешеннің қызмет көрсету тәртібін, сондай-ақ тараптардың құқықтары мен міндеттерін реттейтін ресми құжаттар орналастырылған.',
      p2: 'Тапсырысты рәсімдемес бұрын ұсынылған құжаттармен танысуды ұсынамыз. Оларда қызмет көрсету шарттары, колумбарийдегі құмыраларды сақтау тәртібі, кешенге келу ережелері, жеке деректерді өңдеу саясаты және ынтымақтастықтың басқа да маңызды аспектілері туралы ақпарат бар.',
      p3: 'Біәдің қызметіміз үй жануарларының естелігін құрметтеу, қоршаған ортаға қамқорлық жасау және Қазақстан Республикасының қолданыстағы заңнамасын сақтау принциптеріне негізделген.',
      p4: 'Біз клиенттеріміздің сенімін бағалаймыз және әрбір қызмет жоғары деңгейде, барынша жауапкершілікпен және әрбір отбасына назар аудара отырып көрсетілуі үшін қолдан келгеннің бәрін жасаймыз.',
      p5: 'Егер сізде келісімдердің шарттары немесе қызмет көрсету тәртібі бойынша сұрақтарыңыз туындаса, біздің мамандарымыз әрқашан қажетті түсініктемелер беруге дайын.',
      btnAccept: 'Таныстым',
    },
    services: {
      pageTitle: 'Ескерткіштер каталогы',
      filters: ['Барлығы', 'Гранит', 'Мәрмәр', 'Ағаш', 'Жеке'],
      loading: 'Жүктелуде...',
      empty: 'Бұл санатта ескерткіштер жоқ',
      btnDetails: 'Толығырақ →',
    },
    modal: {
      features: ['✓ Жеке тәсіл', '✓ Сапа кепілдігі', '✓ Жеткізу және орнату'],
      priceLabel: 'Құны',
      formTitle: 'Ескерткішке өтінім қалдыру',
      nameLabel: 'Сіздің атыңыз *',
      namePlaceholder: 'Иван Петров',
      phoneLabel: 'Телефон *',
      phonePlaceholder: '+7 (___) ___-__-__',
      emailLabel: 'Email (міндетті емес)',
      commentLabel: 'Пікір (міндетті емес)',
      commentPlaceholder: 'Толығырақ айтыңыз — жануардың аты, материал туралы тілектер, мерзімдер...',
      consent: 'Батырманы басу арқылы сіз жеке деректерді өңдеуге келісесіз',
      btnSend: 'Өтінім жіберу →',
      btnSending: 'Жіберілуде...',
      successTitle: 'Өтінім жіберілді!',
      successText: 'Жақын арада хабарласамыз.\nZooZabota таңдағаныңызға рақмет 🐾',
      btnClose: 'Жабу',
      alertFields: 'Аты мен телефонды көрсетіңіз',
    },
    memorial: {
      pageTitle: '🌿 Ес қалдыру тақтасы',
      pageSubtitle: 'Жүректерімізде мәңгі қалатын үй жануарлары',
      btnAdd: '+ Үй жануарын қосу',
      formTitle: 'Ес тақтасына үй жануарын қосу',
      formNote: 'Төмендегі форманы толтырыңыз. Өтініміңіз жариялаудан бұрын модератор тексереді.',
      namePlaceholder: 'Үй жануарының аты*',
      breedPlaceholder: 'Тұқымы*',
      yearsPlaceholder: 'Өмір жылдары (мысалы: 2015 – 2024)*',
      emailPlaceholder: 'Сіздің email',
      emojiLabel: 'Үй жануарының эмодзисін таңдаңыз',
      photoLabel: '📸 Үй жануарының фотосын жүктеу үшін басыңыз',
      descPlaceholder: 'Үй жануары туралы сипаттама (міндетті емес)',
      btnSubmit: 'Өтінім жіберу',
      btnCancel: 'Бас тарту',
      successMsg: '✓ Рақмет! Өтініміңіз модерацияға жіберілді. Тексерілгеннен кейін жарияланады.',
      emptyTitle: 'Ес тақтасында үй жануарлары әлі жоқ.',
      emptyHint: 'Өтінім жіберу үшін "Үй жануарын қосу" батырмасын басыңыз.',
      btnDelete: 'Өшіру',
      alertFields: 'Барлық міндетті өрістерді толтырыңыз',
      searchPlaceholder: 'Аты, тұқымы немесе сипаттамасы бойынша іздеу...',
      noResults: 'Ештеңе табылмады. Сұранысты өзгертіп көріңіз.',
    },
    extra: {
      pageTitle: 'Қызметтер',
      btnLearnMore: 'Толығырақ білу',
      services: [
        { tag: 'Дүкен', title: 'Зоодүкен', description: 'Жануарларға арналған тауарлар, жем-шөп, керек-жарақтар. Қамқор иелерге арналған кең ассортимент.' },
        { tag: 'Қолдау', title: 'Зоотерапия', description: 'Үй жануарын жоғалтқан адамдарға психологиялық қолдау. Тәжірибелі мамандармен жеке және топтық сессиялар.' },
        { tag: 'Баспана', title: 'Баспана', description: 'Қиын жағдайға тап болған жануарларға уақытша баспана. Күтім, тамақтану және ветеринарлық көмек қамтамасыз етіледі.' },
        { tag: 'Питомник', title: 'Питомник', description: 'Жауапты өсіру және үй жануарларын уақытша ұстау. Барлық жануарлар егілген және ветеринарлық құжаттары бар.' },
      ],
    },
    donate: {
      pageTitle: '💚 Жобаны қолдаңыз',
      pageSubtitle: 'Сіздің қолдауыңызсыз біз мүмкін болмаймыз. Әрбір үлес маңызды.',
      kaspiTitle: '🟥 Kaspi арқылы аудару',
      bankTitle: '🏦 Банктік аудару',
      progressTitle: 'Құрылыс барысы',
      progressText: '42% жиналды',
      progressGoal: 'Мақсат: мемориалды кешен салу',
      kaspiRows: [
        { label: 'Карта нөмірі', value: '4400 4303 6020 4827' },
        { label: 'Телефон', value: '+7 708 815-20-38' },
        { label: 'Алушы', value: 'Арина Ю.' },
      ],
      bankRows: [
        { label: 'IBAN', value: 'KZ88 8562 2031 0863 2280' },
        { label: 'Банк', value: 'АҚ «ЦентрКредит Банкі»' },
        { label: 'БИК', value: 'KCJBKZKX' },
        { label: 'Алушы', value: 'ҚҚ «Жануарларды қорғау қоры»' },
      ],
    },
    footer: {
      copy: '© 2026 «Өмірге Үміт Бер» жануарларды қорғау қоры',
      address: 'zoozabota.kz · Алматы, Қазақстан',
      directorTitle: 'Жоба директоры',
      contactsTitle: 'Байланыс',
      socialsTitle: 'Әлеуметтік желілер',
      documents: 'Құжаттар',
    },
    notFound: {
      title404: '404',
      titleError: 'Қате',
      subtitle404: 'Бет табылмады',
      subtitleError: 'Бірдеңе дұрыс болмады',
      text404: 'Мұндай бет жоқ. Мүмкін, сілтеме ескірген немесе қате енгізілген.',
      textError: 'Күтпеген қате орын алды. Бетті жаңартып көріңіз.',
      btnHome: '← Басты бетке',
    },
  },

  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      services: 'Monuments',
      memorial: 'Memorial Wall',
      extra: 'Services',
      donate: 'Donate',
    },
    home: {
      heroTitle: 'Memorial Complex\nfor Your Beloved Pets',
      heroSubtitle: 'The only pet memorial complex in Kazakhstan. Preserve the memory of your loved one forever.',
      btnServices: 'Our Monuments',
      btnDonate: 'Support the Project',
      stats: [
        { number: '☝🏻', label: 'Only one in Kazakhstan' },
        { number: '2026', label: 'Founded' },
        { number: '❤️', label: 'With Love for Everyone' },
      ],
      aboutTitle: 'About Our Project',
      aboutP1: 'ZooZabota is the only memorial complex in Kazakhstan created specifically for pets. We believe every pet deserves a dignified farewell and eternal remembrance. Our complex combines a respect for nature with modern solutions for preserving memories.',
      aboutP2: 'We offer a wide range of services: from crafting monuments and headstones to psychological support for pet owners. Our mission is to help people cope with loss and keep the bright memory of their four-legged friends alive.',
      previewCards: [
        { tag: 'Granite', title: 'Standard Granite', description: 'Classic granite monument engraved with name and dates.' },
        { tag: 'Marble', title: 'Classic Marble', description: 'Elegant white marble with a personalized inscription.' },
        { tag: 'Wood', title: 'Wooden Cross', description: 'Warm handcrafted wooden memorial marker.' },
        { tag: 'Services', title: 'Animal Therapy', description: 'Psychological support for people who have lost a pet.' },
      ],
    },
    about: {
      pageTitle: 'About Us',
      subtitle: 'Memorial Complex for Pets',
      p1: 'Losing a beloved pet is losing a family member, a loyal friend, and a part of our lives. We created a space where every owner can bid a dignified farewell to their pet, preserve their bright memory, and find a place for quiet remembrance.',
      p2: 'Our memorial complex combines a modern columbarium for storing pet ashes, a landscaped area for visits, an alley of heroes, and an atmosphere of respect for the life and love that our pets give us.',
      p3: 'We are convinced that caring for animals does not end with their passing. That is why special attention is paid to an ecological approach and environmental preservation. We respect nature, support civilized ways of saying goodbye to pets, and strive to eliminate informal burials that harm the environment.',
      p4: 'Our goal is to create a place of memory, gratitude, and peace of mind, where the love for those who were with us will live forever.',
      p5: 'We respect every pet, every family, and nature, which is our common home.',
      slogan: 'Bright memory. Dignified farewell. Caring for the future.',
    },
    agreement: {
      title: 'Agreements and Documents',
      p1: 'We strive to ensure openness, legality, and transparency in our activities. On this page you can find official documents regulating the procedure for rendering services of the pet memorial complex, as well as the rights and obligations of the parties.',
      p2: 'Before placing an order, we recommend that you familiarize yourself with the presented documents. They contain information about the terms of service, the procedure for storing urns in the columbarium, the rules for visiting the complex, the personal data processing policy, and other important aspects of cooperation.',
      p3: 'Our activities are based on the principles of respect for the memory of pets, care for the environment, and compliance with the current legislation of the Republic of Kazakhstan.',
      p4: 'We value the trust of our clients and do everything possible to ensure that each service is provided at a high level, with maximum responsibility and attention to each family.',
      p5: 'If you have any questions regarding the terms of the agreements or the procedure for rendering services, our specialists are always ready to provide the necessary clarifications.',
      btnAccept: 'I Agree',
    },
    services: {
      pageTitle: 'Monument Catalogue',
      filters: ['All', 'Granite', 'Marble', 'Wood', 'Custom'],
      loading: 'Loading...',
      empty: 'No monuments in this category',
      btnDetails: 'Learn more →',
    },
    modal: {
      features: ['✓ Individual approach', '✓ Quality guarantee', '✓ Delivery & installation'],
      priceLabel: 'Price',
      formTitle: 'Submit a Monument Request',
      nameLabel: 'Your Name *',
      namePlaceholder: 'John Smith',
      phoneLabel: 'Phone *',
      phonePlaceholder: '+7 (___) ___-__-__',
      emailLabel: 'Email (optional)',
      commentLabel: 'Comment (optional)',
      commentPlaceholder: "Tell us more — pet's name, material preferences, timeline...",
      consent: 'By clicking the button you agree to the processing of your personal data',
      btnSend: 'Submit Request →',
      btnSending: 'Sending...',
      successTitle: 'Request Submitted!',
      successText: 'We will contact you shortly.\nThank you for choosing ZooZabota 🐾',
      btnClose: 'Close',
      alertFields: 'Please provide your name and phone number',
    },
    memorial: {
      pageTitle: '🌿 Memorial Wall',
      pageSubtitle: 'Pages of pets that will forever remain in our hearts',
      btnAdd: '+ Add a Pet',
      formTitle: 'Add a Pet to the Memorial Wall',
      formNote: 'Fill in the form below. Your request will be reviewed by a moderator before publishing.',
      namePlaceholder: "Pet's name*",
      breedPlaceholder: 'Breed*',
      yearsPlaceholder: 'Years of life (e.g.: 2015 – 2024)*',
      emailPlaceholder: 'Your email',
      emojiLabel: 'Choose a pet emoji',
      photoLabel: '📸 Click to upload a photo of your pet',
      descPlaceholder: 'Description of the pet (optional)',
      btnSubmit: 'Submit Request',
      btnCancel: 'Cancel',
      successMsg: '✓ Thank you! Your request has been submitted for moderation and will be published after review.',
      emptyTitle: 'No pets on the memorial wall yet.',
      emptyHint: 'Click "Add a Pet" to submit a request.',
      btnDelete: 'Delete',
      alertFields: 'Please fill in all required fields',
      searchPlaceholder: 'Search by name, breed or description...',
      noResults: 'No results found. Try changing your query.',
    },
    extra: {
      pageTitle: 'Services',
      btnLearnMore: 'Learn More',
      services: [
        { tag: 'Shop', title: 'Pet Store', description: 'Pet care products, food, accessories and keepsakes. A wide range of products for caring owners.' },
        { tag: 'Support', title: 'Animal Therapy', description: 'Psychological support and animal-assisted therapy for people who have lost a pet. Individual and group sessions with experienced specialists.' },
        { tag: 'Shelter', title: 'Animal Shelter', description: 'Temporary shelter for animals in difficult situations. We provide care, food and veterinary assistance.' },
        { tag: 'Kennel', title: 'Kennel', description: 'Responsible breeding and temporary pet keeping. All animals are vaccinated and have veterinary documents.' },
      ],
    },
    donate: {
      pageTitle: '💚 Support the Project',
      pageSubtitle: "We can't do it without your support. Every contribution matters.",
      kaspiTitle: '🟥 Transfer via Kaspi',
      bankTitle: '🏦 Bank Transfer',
      progressTitle: 'Construction Progress',
      progressText: '42% collected',
      progressGoal: 'Goal: construction of the memorial complex',
      kaspiRows: [
        { label: 'Card number', value: '4400 4303 6020 4827' },
        { label: 'Phone', value: '+7 708 815-20-38' },
        { label: 'Recipient', value: 'Arina Yu.' },
      ],
      bankRows: [
        { label: 'IBAN', value: 'KZ88 8562 2031 0863 2280' },
        { label: 'Bank', value: 'CenterCredit Bank JSC' },
        { label: 'BIC', value: 'KCJBKZKX' },
        { label: 'Recipient', value: 'Animal Protection Foundation' },
      ],
    },
    footer: {
      copy: '© 2026 Animal Protection Foundation «Өмірге Үміт Бер»',
      address: 'zoozabota.kz · Almaty, Kazakhstan',
      directorTitle: 'Project Director',
      contactsTitle: 'Contacts',
      socialsTitle: 'Social Media',
      documents: 'Documents',
    },
    notFound: {
      title404: '404',
      titleError: 'Error',
      subtitle404: 'Page not found',
      subtitleError: 'Something went wrong',
      text404: 'This page does not exist. The link may be outdated or mistyped.',
      textError: 'An unexpected error occurred. Try refreshing the page.',
      btnHome: '← Back to Home',
    },
  },
} as const;

type Translations = typeof translations.ru;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType>({
  lang: 'ru',
  setLang: () => {},
  t: translations.ru,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('zz_lang') as Lang) || 'ru';
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('zz_lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] as unknown as Translations }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
