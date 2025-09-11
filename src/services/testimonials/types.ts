import { CredibilityContent, Testimonial, Winner } from '../../store/slices/testimonialsSlice';

export interface ITestimonialsService {
  getTestimonials(): Promise<{ testimonials: Testimonial[]; winners: Winner[]; credibilityContent: CredibilityContent[] }>;
  markAsViewed(contentId: string): Promise<{ contentId: string; viewCount: number }>;
}


