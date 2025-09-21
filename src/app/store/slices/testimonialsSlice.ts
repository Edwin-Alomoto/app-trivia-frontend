import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { featureToggles } from '@config/featureToggles';

export interface Testimonial {
  id: string;
  type: 'winner' | 'brand' | 'delivery' | 'milestone';
  title: string;
  content: string;
  author?: string;
  authorImage?: string;
  prize?: string;
  date: string;
  image?: string;
  video?: string;
  isActive: boolean;
  publishAt: string;
  segment: 'all' | 'new_users' | 'active_users' | 'winners';
  viewCount: number;
  verified: boolean;
}

export interface Winner {
  id: string;
  name: string;
  email: string;
  raffleName: string;
  prize: string;
  drawDate: string;
  deliveryDate?: string;
  testimonial?: string;
  image?: string;
  verified: boolean;
}

export interface CredibilityContent {
  id: string;
  type: 'testimonial' | 'winner' | 'delivery' | 'milestone';
  data: Testimonial | Winner;
  isActive: boolean;
  priority: number;
}

export interface TestimonialsState {
  testimonials: Testimonial[];
  winners: Winner[];
  credibilityContent: CredibilityContent[];
  isLoading: boolean;
  error: string | null;
  lastWinnerNotification: string | null;
}

const initialState: TestimonialsState = {
  testimonials: [],
  winners: [],
  credibilityContent: [],
  isLoading: false,
  error: null,
  lastWinnerNotification: null,
};

// Mock data para testimonios
const mockTestimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    type: 'winner',
    title: '¡Gané un iPhone 15 Pro Max!',
    content: 'No podía creer cuando recibí la notificación. El proceso fue súper transparente y recibí mi premio en perfectas condiciones. ¡Gracias por esta increíble experiencia!',
    author: 'María González',
    authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&auto=format',
    prize: 'iPhone 15 Pro Max',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    publishAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    segment: 'all',
    viewCount: 1250,
    verified: true,
  },
  {
    id: 'testimonial-2',
    type: 'winner',
    title: 'PlayStation 5 en casa',
    content: 'Llevaba meses participando y finalmente gané. La entrega fue rápida y el producto llegó perfecto. ¡Ahora puedo disfrutar de mis juegos favoritos!',
    author: 'Carlos Rodríguez',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format',
    prize: 'PlayStation 5',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    publishAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    segment: 'all',
    viewCount: 890,
    verified: true,
  },
  {
    id: 'testimonial-3',
    type: 'delivery',
    title: 'Entrega rápida y segura',
    content: 'Recibí mi Gift Card de Amazon en menos de 24 horas por email. El proceso fue muy profesional y transparente. ¡Altamente recomendado!',
    author: 'Ana Martínez',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format',
    prize: 'Gift Card Amazon $500',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    publishAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    segment: 'all',
    viewCount: 567,
    verified: true,
  },
  {
    id: 'testimonial-4',
    type: 'milestone',
    title: '¡10,000 usuarios activos!',
    content: 'Hemos alcanzado un hito importante: 10,000 usuarios activos participando en nuestros sorteos. Gracias por confiar en nuestra plataforma.',
    author: 'Equipo Trivia',
    authorImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop&auto=format',
    prize: 'Marca',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    publishAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    segment: 'all',
    viewCount: 2340,
    verified: true,
  },
  {
    id: 'testimonial-5',
    type: 'brand',
    title: 'Sorteos verificados y seguros',
    content: 'Todos nuestros sorteos son auditados por terceros independientes para garantizar la transparencia y equidad en cada sorteo.',
    author: 'Certificación ISO',
    authorImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format',
    prize: 'Certificación',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    publishAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    segment: 'all',
    viewCount: 1890,
    verified: true,
  },
];

// Mock data para ganadores
const mockWinners: Winner[] = [
  {
    id: 'winner-1',
    name: 'María González',
    email: 'maria.g@email.com',
    raffleName: 'iPhone 15 Pro Max',
    prize: 'iPhone 15 Pro Max 256GB',
    drawDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    testimonial: '¡Increíble experiencia! El proceso fue transparente y recibí mi premio perfecto.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&auto=format',
    verified: true,
  },
  {
    id: 'winner-2',
    name: 'Carlos Rodríguez',
    email: 'carlos.r@email.com',
    raffleName: 'PlayStation 5',
    prize: 'PlayStation 5 + 2 controles + 5 juegos',
    drawDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    testimonial: 'Llevaba meses participando y finalmente gané. ¡La entrega fue perfecta!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format',
    verified: true,
  },
  {
    id: 'winner-3',
    name: 'Ana Martínez',
    email: 'ana.m@email.com',
    raffleName: 'Gift Card Amazon $500',
    prize: 'Gift Card Amazon $500',
    drawDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    testimonial: 'Recibí mi gift card en menos de 24 horas. ¡Muy profesional!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format',
    verified: true,
  },
  {
    id: 'winner-4',
    name: 'Luis Pérez',
    email: 'luis.p@email.com',
    raffleName: 'AirPods Pro 2',
    prize: 'AirPods Pro 2',
    drawDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    testimonial: '¡No podía creer cuando gané! Los AirPods son increíbles.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format',
    verified: true,
  },
];

// Async thunks
export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      // Simulación existente y armado de contenido
      await new Promise(resolve => setTimeout(resolve, 800));
      const activeTestimonials = mockTestimonials.filter(t => t.isActive);
      const activeWinners = mockWinners.filter(w => w.verified);
      const credibilityContent: CredibilityContent[] = [
        ...activeTestimonials.map((testimonial, index) => ({
          id: `content-${testimonial.id}`,
          type: 'testimonial' as const,
          data: testimonial,
          isActive: testimonial.isActive,
          priority: index + 1,
        })),
        ...activeWinners.map((winner, index) => ({
          id: `content-${winner.id}`,
          type: 'winner' as const,
          data: winner,
          isActive: winner.verified,
          priority: index + 1,
        })),
      ].sort((a, b) => b.priority - a.priority);
      return { testimonials: activeTestimonials, winners: activeWinners, credibilityContent };
    } catch (error) {
      return rejectWithValue('Error al cargar testimonios');
    }
  }
);

export const markAsViewed = createAsyncThunk(
  'testimonials/markAsViewed',
  async (contentId: string, { getState, rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const state = getState() as any;
      const testimonial = state.testimonials.testimonials.find((t: Testimonial) => t.id === contentId);
      if (testimonial) {
        return { contentId, viewCount: testimonial.viewCount + 1 };
      }
      return { contentId, viewCount: 1 };
    } catch (error) {
      return rejectWithValue('Error al actualizar métricas');
    }
  }
);

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLastWinnerNotification: (state, action: PayloadAction<string>) => {
      state.lastWinnerNotification = action.payload;
    },
    clearLastWinnerNotification: (state) => {
      state.lastWinnerNotification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.testimonials = action.payload.testimonials;
        state.winners = action.payload.winners;
        state.credibilityContent = action.payload.credibilityContent;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(markAsViewed.fulfilled, (state, action) => {
        const testimonial = state.testimonials.find(t => t.id === action.payload.contentId);
        if (testimonial) {
          testimonial.viewCount = action.payload.viewCount;
        }
      });
  },
});

export const { clearError, setLastWinnerNotification, clearLastWinnerNotification } = testimonialsSlice.actions;
export default testimonialsSlice.reducer;

// Selectores memoizados
export const selectTestimonialsState = (state: any) => state.testimonials as import('./testimonialsSlice').TestimonialsState;
export const selectTestimonials = createSelector(selectTestimonialsState, (t) => t.testimonials);
export const selectWinners = createSelector(selectTestimonialsState, (t) => t.winners);
export const selectCredibilityContent = createSelector(selectTestimonialsState, (t) => t.credibilityContent);
export const selectTestimonialsLoading = createSelector(selectTestimonialsState, (t) => t.isLoading);
export const selectTestimonialsError = createSelector(selectTestimonialsState, (t) => t.error);
