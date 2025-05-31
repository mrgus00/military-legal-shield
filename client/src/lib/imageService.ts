// Image service for fetching authentic military and legal imagery
export interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

export class ImageService {
  private cache = new Map<string, UnsplashImage[]>();

  async searchImages(query: string, count: number = 10): Promise<UnsplashImage[]> {
    if (this.cache.has(query)) {
      return this.cache.get(query)!.slice(0, count);
    }

    try {
      const response = await fetch(
        `/api/images/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      const images = data.results || [];
      
      this.cache.set(query, images);
      return images;
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  }

  async getHeroImages(): Promise<UnsplashImage[]> {
    return this.searchImages('military uniform professional portrait', 3);
  }

  async getAttorneyImages(): Promise<UnsplashImage[]> {
    return this.searchImages('lawyer attorney professional suit courtroom', 6);
  }

  async getLegalResourceImages(): Promise<UnsplashImage[]> {
    return this.searchImages('legal documents courthouse justice scale', 4);
  }

  async getEducationImages(): Promise<UnsplashImage[]> {
    return this.searchImages('military education training classroom', 3);
  }

  async getMilitaryUniformImages(): Promise<UnsplashImage[]> {
    return this.searchImages('military dress uniform ceremony formal', 5);
  }

  async getCourtImages(): Promise<UnsplashImage[]> {
    return this.searchImages('courtroom judge gavel legal proceedings', 4);
  }

  getRandomImage(images: UnsplashImage[]): UnsplashImage | null {
    if (images.length === 0) return null;
    return images[Math.floor(Math.random() * images.length)];
  }
}

export const imageService = new ImageService();