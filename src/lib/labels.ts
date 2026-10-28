// Interface labels used by layouts and section components. Business text lives
// in content; these are the few words of the site's own interface.

const LABELS = {
  en: {
    skip: "Skip to content",
    menu: "Menu",
    language: "Language",
    hours: "Opening hours",
    closed: "Closed",
    address: "Address",
    phone: "Phone",
    email: "Email",
    book: "Book online",
    notFound: "Page not found",
    notFoundText: "This page does not exist or has moved.",
    backHome: "Back to the home page",
    articles: "Articles",
    readMore: "Read more",
    price: "Price",
  },
  fr: {
    skip: "Aller au contenu",
    menu: "Menu",
    language: "Langue",
    hours: "Horaires d'ouverture",
    closed: "Fermé",
    address: "Adresse",
    phone: "Téléphone",
    email: "E-mail",
    book: "Réserver en ligne",
    notFound: "Page introuvable",
    notFoundText: "Cette page n'existe pas ou a été déplacée.",
    backHome: "Retour à l'accueil",
    articles: "Articles",
    readMore: "Lire la suite",
    price: "Prix",
  },
  de: {
    skip: "Zum Inhalt springen",
    menu: "Menü",
    language: "Sprache",
    hours: "Öffnungszeiten",
    closed: "Geschlossen",
    address: "Adresse",
    phone: "Telefon",
    email: "E-Mail",
    book: "Online buchen",
    notFound: "Seite nicht gefunden",
    notFoundText: "Diese Seite existiert nicht oder wurde verschoben.",
    backHome: "Zur Startseite",
    articles: "Artikel",
    readMore: "Weiterlesen",
    price: "Preis",
  },
  es: {
    skip: "Saltar al contenido",
    menu: "Menú",
    language: "Idioma",
    hours: "Horario",
    closed: "Cerrado",
    address: "Dirección",
    phone: "Teléfono",
    email: "Correo electrónico",
    book: "Reservar en línea",
    notFound: "Página no encontrada",
    notFoundText: "Esta página no existe o se ha movido.",
    backHome: "Volver al inicio",
    articles: "Artículos",
    readMore: "Leer más",
    price: "Precio",
  },
  it: {
    skip: "Vai al contenuto",
    menu: "Menu",
    language: "Lingua",
    hours: "Orari di apertura",
    closed: "Chiuso",
    address: "Indirizzo",
    phone: "Telefono",
    email: "E-mail",
    book: "Prenota online",
    notFound: "Pagina non trovata",
    notFoundText: "Questa pagina non esiste o è stata spostata.",
    backHome: "Torna alla home",
    articles: "Articoli",
    readMore: "Leggi di più",
    price: "Prezzo",
  },
} as const;

export type Labels = Record<keyof (typeof LABELS)["en"], string>;

export function labels(locale: string): Labels {
  const lang = locale.split("-")[0] as keyof typeof LABELS;
  return LABELS[lang] ?? LABELS.en;
}

/** The language's own name, for the language switcher. */
export function languageName(locale: string): string {
  try {
    const name = new Intl.DisplayNames([locale], { type: "language" }).of(locale) ?? locale;
    return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
  } catch {
    return locale;
  }
}

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

/** Localized weekday name; 2024-01-01 was a Monday. */
export function dayName(locale: string, day: DayKey): string {
  const date = new Date(Date.UTC(2024, 0, 1 + DAY_KEYS.indexOf(day)));
  const name = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(date);
  return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
}
