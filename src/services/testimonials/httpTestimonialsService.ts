import { ITestimonialsService } from './types';
import { CredibilityContent, Testimonial, Winner } from '@store/slices/testimonialsSlice';

export class HttpTestimonialsService implements ITestimonialsService {
  async getTestimonials(): Promise<{ testimonials: Testimonial[]; winners: Winner[]; credibilityContent: CredibilityContent[] }> {
    await new Promise((r) => setTimeout(r, 200));
    return { testimonials: [], winners: [], credibilityContent: [] };
  }
  async markAsViewed(contentId: string): Promise<{ contentId: string; viewCount: number }> {
    await new Promise((r) => setTimeout(r, 100));
    return { contentId, viewCount: 1 };
  }
}


