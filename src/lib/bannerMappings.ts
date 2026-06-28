/**
 * Mapeamentos centralizados para caminhos de banners.
 * Mantem compatibilidade com caminhos locais antigos e com URLs públicas do Supabase Storage.
 */

export const PATH_MAPPINGS: Record<string, string> = {
  "/banners/Banners_Geniturinarios-1.jpg": "/banners/Tumores Geniturinarios.webp",
  "/banners/Banners_Geniturinario.png": "/banners/Tumores Geniturinarios.webp",
  "/banners/Banners Geniturinario-1.jpg": "/banners/Tumores Geniturinarios.webp",
  "/banners/Banners Geniturinario.png": "/banners/Tumores Geniturinarios.webp",
  "/Banners_Geniturinario.png": "/banners/Tumores Geniturinarios.webp",
  "/Banners_Geniturinario-1.jpg": "/banners/Tumores Geniturinarios.webp",
  "/Banners Geniturinario.png": "/banners/Tumores Geniturinarios.webp",
  "/banners/banner_geniturinario.jpg": "/banners/Tumores Geniturinarios.webp",
  "/banners/banners_Hematologia.png": "/banners/banner_hematologia.webp",
  "/banners/banner_hematologia.png": "/banners/banner_hematologia.webp",
  "/banners/banners_Mama.png": "/banners/banner_mama.webp",
  "/banners/banner_mama.png": "/banners/banner_mama.webp",
  "/banners/banners_Medicina Intensiva.png": "/banners/banner_medicina_intensiva.webp",
  "/banners/banner_medicina_intensiva.png": "/banners/banner_medicina_intensiva.webp",
  "/banners/banners_Multiprofissional.png": "/banners/banner_multiprofissional.webp",
  "/banners/banner_multiprofissional.png": "/banners/banner_multiprofissional.webp",
  "/banners/banners_Torax.png": "/banners/banner_torax.webp",
  "/banners/banner_torax.png": "/banners/banner_torax.webp",
  "/banners/Banners_Tumores Geniturinarios.png": "/banners/Tumores Gastrointestinais.webp",
  "/banners/Banners_Tumores_Geniturinarios.png": "/banners/Tumores Gastrointestinais.webp",
  "/banners/banner_tumores_geniturinarios.png": "/banners/Tumores Gastrointestinais.webp",
  "/banners/banner_tumores_geniturinarios.webp": "/banners/Tumores Gastrointestinais.webp",
  "/banners/banners_Tumores Ginecologicos.png": "/banners/banner_tumores_ginecologicos.webp",
  "/banners/banners_Tumores_Ginecologicos.png": "/banners/banner_tumores_ginecologicos.webp",
  "/banners/banner_tumores_ginecologicos.png": "/banners/banner_tumores_ginecologicos.webp",
};

export const MOBILE_BANNER_MAPPINGS: Record<string, string> = {
  "/banners/Tumores Gastrointestinais.webp": "/banners-mobile/Tumores Gastrointestinais mobile.webp",
  "/banners/Tumores Geniturinarios.webp": "/banners-mobile/Geniturinario Mobile.webp",
  "/banners/banner_hematologia.webp": "/banners-mobile/Hematologia Mobile.webp",
  "/banners/banner_mama.webp": "/banners-mobile/Mama Mobile.webp",
  "/banners/banner_medicina_intensiva.webp": "/banners-mobile/Medicina intensiva  Mobile.webp",
  "/banners/banner_multiprofissional.webp": "/banners-mobile/Multiprofissional Mobile.webp",
  "/banners/banner_torax.webp": "/banners-mobile/Torax Mobile.webp",
  "/banners/banner_tumores_ginecologicos.webp": "/banners-mobile/Tumores Ginecologiccos Mobile.webp",
};

function isAbsoluteImageUrl(imagePath: string): boolean {
  return /^(https?:)?\/\//i.test(imagePath) || /^data:/i.test(imagePath) || /^blob:/i.test(imagePath);
}

function normalizeFileName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function fixImagePath(imagePath: string): string {
  if (!imagePath) {
    return imagePath;
  }

  if (isAbsoluteImageUrl(imagePath)) {
    return imagePath;
  }

  if (PATH_MAPPINGS[imagePath]) {
    return PATH_MAPPINGS[imagePath];
  }

  if (!imagePath.startsWith("/banners/")) {
    if (imagePath.startsWith("/")) {
      const fileName = imagePath.substring(1);
      const fullPath = `/banners/${fileName}`;
      if (PATH_MAPPINGS[fullPath]) {
        return PATH_MAPPINGS[fullPath];
      }
      return fullPath;
    }

    return `/banners/${imagePath}`;
  }

  return imagePath;
}

export function getMobileBanner(desktopPath: string, isMobile: boolean): string {
  if (!isMobile) {
    return desktopPath;
  }

  if (MOBILE_BANNER_MAPPINGS[desktopPath]) {
    return MOBILE_BANNER_MAPPINGS[desktopPath];
  }

  if (isAbsoluteImageUrl(desktopPath) && desktopPath.includes("/storage/v1/object/public/")) {
    const marker = "/storage/v1/object/public/";
    const markerIndex = desktopPath.indexOf(marker);

    if (markerIndex !== -1) {
      const prefix = desktopPath.slice(0, markerIndex + marker.length);
      const remainder = desktopPath.slice(markerIndex + marker.length);
      const slashIndex = remainder.indexOf("/");

      if (slashIndex !== -1) {
        const bucket = remainder.slice(0, slashIndex);
        const objectPath = remainder.slice(slashIndex);
        const mappedPath =
          MOBILE_BANNER_MAPPINGS[objectPath] ||
          Object.entries(MOBILE_BANNER_MAPPINGS).find(([key]) => {
            const sourceFile = key.split("/").pop() || key;
            const currentFile = objectPath.split("/").pop() || objectPath;
            return normalizeFileName(sourceFile) === normalizeFileName(currentFile);
          })?.[1];

        if (mappedPath) {
          return `${prefix}${bucket}${mappedPath}`;
        }
      }
    }
  }

  return desktopPath;
}
