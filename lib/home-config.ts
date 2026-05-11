import type {
  HomeConfigImage,
  HomeConfigItem,
  HomeConfigResponse,
} from "@/lib/types/dearte";
import { flowHeroImages } from "@/lib/flow-hero-assets";

const DEFAULT_DEARTE_API_URL = "https://dearteenlinea.com";
const HOME_CONFIG_PATH = "/wp-json/dearte/v1/home-config";
const HOME_CONFIG_REVALIDATE_SECONDS = 200;

const fallbackDearteImage =
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=2000&q=85";
const fallbackQullqaImage =
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=2000&q=85";

export type HomePathConfig = {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  buttonLink: string;
};

export type HomePathConfigs = {
  dearte: HomePathConfig;
  qullqa: HomePathConfig;
};

export type HomeConfig = {
  paths: HomePathConfigs;
  heroes: HomePathConfigs;
};

const fallbackPathConfigs: HomePathConfigs = {
  dearte: {
    title: "dearteenlinea",
    subtitle: "Galería",
    description:
      "Obras curadas: artistas consolidados, emergentes y piezas de mercado secundario, reunidas con criterio para quien busca calidad.",
    imageUrl: fallbackDearteImage,
    imageAlt: "",
    buttonText: "",
    buttonLink: "",
  },
  qullqa: {
    title: "qullqa gallery",
    subtitle: "Espacio público",
    description:
      "Obras publicadas desde la plataforma qullqa: un escaparate abierto para artistas que gestionan y comparten su trabajo con coleccionistas.",
    imageUrl: fallbackQullqaImage,
    imageAlt: "",
    buttonText: "",
    buttonLink: "",
  },
};

const fallbackHeroConfigs: HomePathConfigs = {
  dearte: {
    title: "dearteenlinea",
    subtitle: "",
    description:
      "Galería en línea con obras curadas: artistas consolidados, emergentes y mercado secundario. La curaduría de dearteenlinea prioriza la calidad para visitantes y coleccionistas.",
    imageUrl: flowHeroImages.dearteenlinea,
    imageAlt: "Vista interior de galería con gran obra pictórica",
    buttonText: "",
    buttonLink: "",
  },
  qullqa: {
    title: "qullqa gallery",
    subtitle: "",
    description:
      "Espacio público donde los artistas que usan Qullqa pueden mostrar obras a cualquier visitante. Qullqa es también la plataforma con la que artistas y coleccionistas gestionan y dan valor a sus piezas.",
    imageUrl: flowHeroImages.qullqaGallery,
    imageAlt: "Espacio creativo y materiales de arte",
    buttonText: "",
    buttonLink: "",
  },
};

const fallbackHomeConfig: HomeConfig = {
  paths: fallbackPathConfigs,
  heroes: fallbackHeroConfigs,
};

function configuredDearteApiUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_DEARTE_API_URL ?? DEFAULT_DEARTE_API_URL;
  return raw.replace(/\/+$/, "");
}

function homeConfigUrl(): string {
  return new URL(HOME_CONFIG_PATH, configuredDearteApiUrl()).toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeImage(value: unknown): HomeConfigImage | null {
  if (!isRecord(value)) return null;

  const url = stringValue(value.url).trim();
  if (!url) return null;

  const image: HomeConfigImage = {
    id: numberValue(value.id),
    url,
    alt: stringValue(value.alt),
    title: stringValue(value.title),
    width: numberValue(value.width),
    height: numberValue(value.height),
  };

  if (isRecord(value.sizes)) {
    const sizes: Record<string, string | number> = {};
    for (const [key, sizeValue] of Object.entries(value.sizes)) {
      if (typeof sizeValue === "string" || typeof sizeValue === "number") {
        sizes[key] = sizeValue;
      }
    }
    image.sizes = sizes;
  }

  return image;
}

function normalizeItem(value: unknown): HomeConfigItem | null {
  if (!isRecord(value)) return null;

  const key = stringValue(value.key).trim();
  if (!key) return null;

  return {
    key,
    title: stringValue(value.title),
    subtitle: stringValue(value.subtitle),
    description: stringValue(value.description),
    image: normalizeImage(value.image),
    button_text: stringValue(value.button_text),
    button_link: stringValue(value.button_link),
  };
}

function normalizeResponse(value: unknown): HomeConfigResponse | null {
  if (!isRecord(value) || !Array.isArray(value.data)) return null;

  const data = value.data
    .map(normalizeItem)
    .filter((item): item is HomeConfigItem => item !== null);

  return {
    success: value.success === true,
    count: numberValue(value.count),
    data,
  };
}

function mergePathConfig(
  item: HomeConfigItem | undefined,
  fallback: HomePathConfig,
): HomePathConfig {
  const image = item?.image;

  return {
    title: item?.title.trim() || fallback.title,
    subtitle: item?.subtitle.trim() || fallback.subtitle,
    description: item?.description.trim() || fallback.description,
    imageUrl: image?.url || fallback.imageUrl,
    imageAlt: image ? image.alt.trim() || image.title.trim() : fallback.imageAlt,
    buttonText: item?.button_text.trim() || fallback.buttonText,
    buttonLink: item?.button_link.trim() || fallback.buttonLink,
  };
}

export function homePathConfigsFromItems(
  items: HomeConfigItem[],
): HomeConfig {
  const homeDearte = items.find((item) => item.key === "home_dearteenlinea");
  const homeQullqa = items.find((item) => item.key === "home_qullqa");
  const heroDearte = items.find((item) => item.key === "hero_dearteenlinea");
  const heroQullqa = items.find((item) => item.key === "hero_qullqa");

  return {
    paths: {
      dearte: mergePathConfig(homeDearte, fallbackPathConfigs.dearte),
      qullqa: mergePathConfig(homeQullqa, fallbackPathConfigs.qullqa),
    },
    heroes: {
      dearte: mergePathConfig(heroDearte, fallbackHeroConfigs.dearte),
      qullqa: mergePathConfig(heroQullqa, fallbackHeroConfigs.qullqa),
    },
  };
}

export async function getHomeConfig(): Promise<HomeConfig> {
  try {
    const response = await fetch(homeConfigUrl(), {
      headers: { accept: "application/json" },
      next: { revalidate: HOME_CONFIG_REVALIDATE_SECONDS },
    });

    if (!response.ok) return fallbackHomeConfig;

    const payload = normalizeResponse(await response.json());
    if (!payload?.success) return fallbackHomeConfig;

    return homePathConfigsFromItems(payload.data);
  } catch {
    return fallbackHomeConfig;
  }
}
