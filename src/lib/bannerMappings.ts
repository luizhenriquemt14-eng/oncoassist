/**
 * Mapeamentos centralizados para caminhos de banners
 * Este arquivo unifica as correções de caminhos usadas em HeroCarousel e use-events
 */

// Mapeamento de caminhos antigos para os novos (sem acentos e espaços)
export const PATH_MAPPINGS: Record<string, string> = {
  // Tumores Geniturinários (antigo Geniturinário)
  '/banners/Banners_Geniturinário-1.jpg': '/banners/Tumores Geniturinários.webp',
  '/banners/Banners_Geniturinário.png': '/banners/Tumores Geniturinários.webp',
  '/banners/Banners Geniturinário-1.jpg': '/banners/Tumores Geniturinários.webp',
  '/banners/Banners Geniturinário.png': '/banners/Tumores Geniturinários.webp',
  '/Banners_Geniturinário.png': '/banners/Tumores Geniturinários.webp',
  '/Banners_Geniturinário-1.jpg': '/banners/Tumores Geniturinários.webp',
  '/Banners Geniturinário.png': '/banners/Tumores Geniturinários.webp',
  '/banners/banner_geniturinario.jpg': '/banners/Tumores Geniturinários.webp',
  // Hematologia
  '/banners/banners_Hematologia.png': '/banners/banner_hematologia.webp',
  '/banners/banner_hematologia.png': '/banners/banner_hematologia.webp',
  // Mama
  '/banners/banners_Mama.png': '/banners/banner_mama.webp',
  '/banners/banner_mama.png': '/banners/banner_mama.webp',
  // Medicina Intensiva
  '/banners/banners_Medicina Intensiva.png': '/banners/banner_medicina_intensiva.webp',
  '/banners/banner_medicina_intensiva.png': '/banners/banner_medicina_intensiva.webp',
  // Multiprofissional
  '/banners/banners_Multiprofissional.png': '/banners/banner_multiprofissional.webp',
  '/banners/banner_multiprofissional.png': '/banners/banner_multiprofissional.webp',
  // Tórax
  '/banners/banners_Tórax.png': '/banners/banner_torax.webp',
  '/banners/banner_torax.png': '/banners/banner_torax.webp',
  // Tumores Gastrointestinais (antigo Tumores Geniturinários de março)
  '/banners/Banners_Tumores Geniturinários.png': '/banners/Tumores Gastrointestinais.webp',
  '/banners/Banners_Tumores_Geniturinários.png': '/banners/Tumores Gastrointestinais.webp',
  '/banners/banner_tumores_geniturinarios.png': '/banners/Tumores Gastrointestinais.webp',
  '/banners/banner_tumores_geniturinarios.webp': '/banners/Tumores Gastrointestinais.webp',
  // Tumores Ginecológicos
  '/banners/banners_Tumores Ginecológicos.png': '/banners/banner_tumores_ginecologicos.webp',
  '/banners/banners_Tumores_Ginecológicos.png': '/banners/banner_tumores_ginecologicos.webp',
  '/banners/banner_tumores_ginecologicos.png': '/banners/banner_tumores_ginecologicos.webp',
};

// Mapeamento de banners desktop para banners mobile
export const MOBILE_BANNER_MAPPINGS: Record<string, string> = {
  '/banners/Tumores Gastrointestinais.webp': '/banners-mobile/Tumores Gastrointestinais mobile.webp',
  '/banners/Tumores Geniturinários.webp': '/banners-mobile/Geniturinario Mobile.webp',
  '/banners/banner_hematologia.webp': '/banners-mobile/Hematologia Mobile.webp',
  '/banners/banner_mama.webp': '/banners-mobile/Mama Mobile.webp',
  '/banners/banner_medicina_intensiva.webp': '/banners-mobile/Medicina intensiva  Mobile.webp',
  '/banners/banner_multiprofissional.webp': '/banners-mobile/Multiprofissional Mobile.webp',
  '/banners/banner_torax.webp': '/banners-mobile/Torax Mobile.webp',
  '/banners/banner_tumores_ginecologicos.webp': '/banners-mobile/Tumores Ginecologiccos Mobile.webp',
};

/**
 * Corrige caminhos de imagens antigos para os novos padrões
 */
export function fixImagePath(imagePath: string): string {
  if (!imagePath) return imagePath;
  
  // Verifica se há um mapeamento direto
  if (PATH_MAPPINGS[imagePath]) {
    return PATH_MAPPINGS[imagePath];
  }
  
  // Se o caminho não começa com /banners/, tenta corrigir
  if (!imagePath.startsWith('/banners/')) {
    if (imagePath.startsWith('/')) {
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

/**
 * Retorna o banner mobile correspondente se disponível
 */
export function getMobileBanner(desktopPath: string, isMobile: boolean): string {
  if (!isMobile) return desktopPath;
  return MOBILE_BANNER_MAPPINGS[desktopPath] || desktopPath;
}
