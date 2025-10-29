export interface Document {
  id: string;
  category: 'required' | 'optional' | 'guide';
  translations: {
    [key: string]: {
      title: string;
      description: string;
      help?: string;
    };
  };
  pages: number;
  formats: ('pdf')[];
  fileSize: {
    pdf: number;  // in KB
  };
  officialSource?: string;
  lastUpdated: string;
}

export const DOCUMENTS: Document[] = [
  {
    id: 'ansuchen',
    category: 'required',
    translations: {
      de: {
        title: 'Ansuchen um Betriebsanlagengenehmigung',
        description: 'Das Haupt-Antragsformular für Ihre Betriebsanlagengenehmigung in Wien',
        help: 'Dieses Formular ist verpflichtend für jeden Antrag bei der MA 36'
      },
      en: {
        title: 'Application for Business Facility Permit',
        description: 'The main application form for your business facility permit in Vienna',
        help: 'This form is mandatory for every application to MA 36'
      },
      tr: {
        title: 'İşletme Tesisi Ruhsatı Başvurusu',
        description: 'Viyana'da işletme tesisi ruhsatınız için ana başvuru formu',
        help: 'Bu form MA 36'ya her başvuru için zorunludur'
      },
      sr: {
        title: 'Zahtev za dozvolu za poslovni objekat',
        description: 'Glavni obrazac za zahtev za dozvolu za poslovni objekat u Beču',
        help: 'Ovaj obrazac je obavezan za svaku prijavu kod MA 36'
      },
      hr: {
        title: 'Zahtjev za dozvolu za poslovni objekt',
        description: 'Glavni obrazac zahtjeva za dozvolu za poslovni objekt u Beču',
        help: 'Ovaj obrazac je obvezan za svaku prijavu kod MA 36'
      },
      it: {
        title: 'Domanda di autorizzazione per impianto aziendale',
        description: 'Il modulo principale per l\'autorizzazione dell\'impianto aziendale a Vienna',
        help: 'Questo modulo è obbligatorio per ogni domanda presso MA 36'
      },
      es: {
        title: 'Solicitud de permiso para instalación empresarial',
        description: 'El formulario principal para el permiso de instalación empresarial en Viena',
        help: 'Este formulario es obligatorio para cada solicitud en MA 36'
      },
      uk: {
        title: 'Заява на дозвіл для підприємства',
        description: 'Основна форма заяви на дозвіл для підприємства у Відні',
        help: 'Ця форма обов\'язкова для кожної заяви в MA 36'
      }
    },
    pages: 1,
    formats: ['pdf'],
    fileSize: {
      pdf: 188
    },
    officialSource: 'https://www.wien.gv.at/amtshelfer/wirtschaft/gewerbe/betriebsanlage/',
    lastUpdated: '2024-10-29'
  },
  {
    id: 'betriebsbeschreibung',
    category: 'required',
    translations: {
      de: {
        title: 'Betriebsbeschreibung (4-fach erforderlich)',
        description: 'Detaillierte Beschreibung Ihrer Betriebsanlage mit technischen Details',
        help: 'Dieses umfangreiche Formular muss 4x ausgefüllt und eingereicht werden'
      },
      en: {
        title: 'Business Description (4 copies required)',
        description: 'Detailed description of your business facility with technical details',
        help: 'This comprehensive form must be completed and submitted 4 times'
      },
      tr: {
        title: 'İşletme Açıklaması (4 kopya gerekli)',
        description: 'Teknik ayrıntılarla işletme tesislerinizin detaylı açıklaması',
        help: 'Bu kapsamlı form 4 kez doldurulmalı ve sunulmalıdır'
      },
      sr: {
        title: 'Opis poslovanja (potrebno 4 primerka)',
        description: 'Detaljan opis vašeg poslovnog objekta sa tehničkim detaljima',
        help: 'Ovaj sveobuhvatan obrazac mora biti popunjen i podnet 4 puta'
      },
      hr: {
        title: 'Opis poslovanja (potrebno 4 primjerka)',
        description: 'Detaljan opis vašeg poslovnog objekta s tehničkim detaljima',
        help: 'Ovaj sveobuhvatni obrazac mora biti ispunjen i predan 4 puta'
      },
      it: {
        title: 'Descrizione dell\'impianto (4 copie richieste)',
        description: 'Descrizione dettagliata del vostro impianto aziendale con dettagli tecnici',
        help: 'Questo modulo completo deve essere compilato e presentato 4 volte'
      },
      es: {
        title: 'Descripción de la instalación (4 copias requeridas)',
        description: 'Descripción detallada de su instalación empresarial con detalles técnicos',
        help: 'Este formulario completo debe completarse y presentarse 4 veces'
      },
      uk: {
        title: 'Опис підприємства (потрібно 4 копії)',
        description: 'Детальний опис вашого підприємства з технічними деталями',
        help: 'Ця комплексна форма повинна бути заповнена та подана 4 рази'
      }
    },
    pages: 14,
    formats: ['pdf'],
    fileSize: {
      pdf: 581
    },
    officialSource: 'https://www.wien.gv.at/amtshelfer/wirtschaft/gewerbe/betriebsanlage/',
    lastUpdated: '2024-10-29'
  },
  {
    id: 'ausfuellhilfe',
    category: 'guide',
    translations: {
      de: {
        title: 'Ausfüllhilfe und Hinweise',
        description: 'Offizielle Anleitung zum korrekten Ausfüllen der Betriebsanlagen-Formulare',
        help: 'Lesen Sie diese Hinweise, bevor Sie mit dem Ausfüllen beginnen'
      },
      en: {
        title: 'Completion Guide and Notes',
        description: 'Official guide for correctly completing the business facility forms',
        help: 'Read these instructions before you start filling out the forms'
      },
      tr: {
        title: 'Doldurma Kılavuzu ve Notlar',
        description: 'İşletme tesisi formlarını doğru doldurmak için resmi kılavuz',
        help: 'Formları doldurmaya başlamadan önce bu talimatları okuyun'
      },
      sr: {
        title: 'Vodič za popunjavanje i napomene',
        description: 'Zvanično uputstvo za pravilno popunjavanje obrazaca za poslovne objekte',
        help: 'Pročitajte ova uputstva pre nego što počnete sa popunjavanjem'
      },
      hr: {
        title: 'Vodič za ispunjavanje i napomene',
        description: 'Službeni vodič za ispravno ispunjavanje obrazaca za poslovne objekte',
        help: 'Pročitajte ove upute prije nego počnete s ispunjavanjem'
      },
      it: {
        title: 'Guida alla compilazione e note',
        description: 'Guida ufficiale per la corretta compilazione dei moduli per impianti aziendali',
        help: 'Leggere queste istruzioni prima di iniziare a compilare i moduli'
      },
      es: {
        title: 'Guía de cumplimentación y notas',
        description: 'Guía oficial para completar correctamente los formularios de instalaciones empresariales',
        help: 'Lea estas instrucciones antes de comenzar a completar los formularios'
      },
      uk: {
        title: 'Посібник з заповнення та примітки',
        description: 'Офіційний посібник для правильного заповнення форм підприємства',
        help: 'Прочитайте ці інструкції перед початком заповнення форм'
      }
    },
    pages: 10,
    formats: ['pdf'],
    fileSize: {
      pdf: 188
    },
    officialSource: 'https://www.wien.gv.at/amtshelfer/wirtschaft/gewerbe/betriebsanlage/',
    lastUpdated: '2024-10-29'
  }
];
