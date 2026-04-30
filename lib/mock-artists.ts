import type { Artist } from "@/lib/types/artist";

const portrait = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=80`;

/**
 * Datos de prueba por flujo. Mantener `slug` único por lista.
 * Imagen opcional: sin `imageUrl` el catálogo muestra iniciales.
 */
export const mockArtistsDearteenlinea: Artist[] = [
  {
    slug: "lucia-aguilar",
    firstName: "Lucía",
    lastName: "Aguilar",
    imageUrl: portrait("photo-1494790108377-be9c29b29330"),
    nationality: "ES",
    birthDate: "1984-03-12",
    description:
      "Su obra recorre la pintura y el ensayo visual sobre memoria colectiva y territorio. Expone en Europa y Latinoamérica; obra en colecciones públicas y privadas. Combina óleo y instalación ligera para habitar el espacio entre el recuerdo y el presente.",
    web: "https://example.com/lucia-aguilar",
    social: {
      instagram: "https://www.instagram.com/example.lucia.aguilar",
      facebook: "https://www.facebook.com/example.lucia.aguilar",
      twitter: "https://twitter.com/example_lucia_aguilar",
      linkedin: "https://www.linkedin.com/in/example-lucia-aguilar",
    },
  },
  {
    slug: "martin-benitez",
    firstName: "Martín",
    lastName: "Benítez",
    imageUrl: null,
    nationality: "AR",
  },
  {
    slug: "carmen-castro",
    firstName: "Carmen",
    lastName: "Castro",
    imageUrl: portrait("photo-1506794778202-cad84cf45f1d"),
    web: "https://example.com",
  },
  {
    slug: "david-dominguez",
    firstName: "David",
    lastName: "Domínguez",
    nationality: "MX",
  },
  {
    slug: "elena-estevez",
    firstName: "Elena",
    lastName: "Estévez",
    imageUrl: portrait("photo-1438761681033-6461ffad8d80"),
    social: { instagram: "https://instagram.com" },
  },
  {
    slug: "fernando-fernandez",
    firstName: "Fernando",
    lastName: "Fernández",
  },
  {
    slug: "gabriela-gomez",
    firstName: "Gabriela",
    lastName: "Gómez",
    imageUrl: portrait("photo-1544005313-94ddf0286df2"),
  },
  {
    slug: "hector-herrera",
    firstName: "Héctor",
    lastName: "Herrera",
  },
  {
    slug: "ines-iglesias",
    firstName: "Inés",
    lastName: "Iglesias",
    imageUrl: portrait("photo-1531746020798-e6953c6e8e04"),
  },
  {
    slug: "jorge-jimenez",
    firstName: "Jorge",
    lastName: "Jiménez",
  },
  {
    slug: "karla-katz",
    firstName: "Karla",
    lastName: "Katz",
    nationality: "CL",
  },
  {
    slug: "leonardo-lopez",
    firstName: "Leonardo",
    lastName: "López",
    imageUrl: portrait("photo-1500648767791-00dcc994a43e"),
  },
  {
    slug: "monica-martinez",
    firstName: "Mónica",
    lastName: "Martínez",
  },
  {
    slug: "nestor-navarro",
    firstName: "Néstor",
    lastName: "Navarro",
  },
  {
    slug: "olga-ortega",
    firstName: "Olga",
    lastName: "Ortega",
    imageUrl: portrait("photo-1488426862026-3ee34a7d66df"),
  },
  {
    slug: "pablo-perez",
    firstName: "Pablo",
    lastName: "Pérez",
  },
  {
    slug: "rachel-ruiz",
    firstName: "Rachel",
    lastName: "Ruiz",
    nationality: "US",
  },
  {
    slug: "sergio-sanchez",
    firstName: "Sergio",
    lastName: "Sánchez",
    imageUrl: portrait("photo-1472099645785-5658abf4ff4e"),
  },
];

export const mockArtistsQullqaGallery: Artist[] = [
  {
    slug: "ana-avelar",
    firstName: "Ana",
    lastName: "Avelar",
    imageUrl: portrait("photo-1534528741775-53994a69daeb"),
    nationality: "PT",
    birthDate: "1990-07-21",
    description:
      "Trabaja la cerámica contemporánea y el volumen como relato: piezas de gres y porcelana que exploran la textura, la luz y el cuerpo. Formación en Lisboa y residencias en São Paulo; su obra dialoga con la artesanía tradicional y la escena digital.",
    web: "https://example.com/ana-avelar",
    social: {
      instagram: "https://www.instagram.com/example.ana.avelar",
      facebook: "https://www.facebook.com/example.ana.avelar",
      twitter: "https://twitter.com/example_ana_avelar",
      linkedin: "https://www.linkedin.com/in/example-ana-avelar",
    },
    purchaseContact: {
      contactName: "Ana Avelar — estudio",
      email: "contacto@example-ana-avelar.com",
      phone: "+351912345678",
      web: "https://example.com/compras-ana-avelar",
      instagram: "https://www.instagram.com/example.ana.avelar",
    },
  },
  {
    slug: "bruno-barreto",
    firstName: "Bruno",
    lastName: "Barreto",
    nationality: "BR",
    purchaseContact: {
      contactName: "Estudio Barreto",
    },
  },
  {
    slug: "clara-cordeiro",
    firstName: "Clara",
    lastName: "Cordeiro",
    imageUrl: portrait("photo-1517841905240-472988babdf9"),
  },
  {
    slug: "diego-duarte",
    firstName: "Diego",
    lastName: "Duarte",
  },
  {
    slug: "edu-eloy",
    firstName: "Edu",
    lastName: "Eloy",
    web: "https://example.org",
  },
  {
    slug: "flavia-freitas",
    firstName: "Flávia",
    lastName: "Freitas",
    imageUrl: portrait("photo-1524504388940-b1c1722653e1"),
  },
  {
    slug: "gustavo-guedes",
    firstName: "Gustavo",
    lastName: "Guedes",
  },
  {
    slug: "helena-holanda",
    firstName: "Helena",
    lastName: "Holanda",
    social: { facebook: "https://facebook.com" },
  },
  {
    slug: "igor-inacio",
    firstName: "Igor",
    lastName: "Inácio",
    imageUrl: portrait("photo-1507003211169-0a1dd7228f2d"),
  },
  {
    slug: "julia-jardim",
    firstName: "Júlia",
    lastName: "Jardim",
  },
  {
    slug: "kaio-kirsch",
    firstName: "Kaio",
    lastName: "Kirsch",
    nationality: "DE",
  },
  {
    slug: "livia-lacerda",
    firstName: "Lívia",
    lastName: "Lacerda",
    imageUrl: portrait("photo-1487412720507-e7ab37603c6f"),
  },
  {
    slug: "marina-moura",
    firstName: "Marina",
    lastName: "Moura",
  },
  {
    slug: "nina-nogueira",
    firstName: "Nina",
    lastName: "Nogueira",
  },
  {
    slug: "otavio-oliveira",
    firstName: "Otávio",
    lastName: "Oliveira",
    birthDate: "1991-11-02",
  },
  {
    slug: "paula-pinheiro",
    firstName: "Paula",
    lastName: "Pinheiro",
    imageUrl: portrait("photo-1517841905240-472988babdf9"),
  },
  {
    slug: "raquel-rebelo",
    firstName: "Raquel",
    lastName: "Rebelo",
  },
  {
    slug: "tiago-tavares",
    firstName: "Tiago",
    lastName: "Tavares",
    imageUrl: portrait("photo-1463453091185-61582044d556"),
    social: { linkedin: "https://linkedin.com" },
  },
];
