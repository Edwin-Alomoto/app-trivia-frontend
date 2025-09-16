import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { featureFlags } from '../../config/featureFlags';
import { getServices } from '../../services/container';
import { TriviaState, Category, Question, TriviaSession } from '../../shared/domain/types';

const initialState: TriviaState = {
  categories: [],
  currentSession: null,
  isLoading: false,
  error: null,
  offlineAnswers: [], // Para sincronización offline según UC-05
};

// Mock data
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Historia',
    description: 'Preguntas sobre eventos históricos importantes',
    icon: '🏛️',
    color: '#FF6B6B',
    questionCount: 10,
    difficulty: 'medium',
  },
  {
    id: '2',
    name: 'Ciencia',
    description: 'Descubre el mundo de la ciencia y tecnología',
    icon: '🔬',
    color: '#4ECDC4',
    questionCount: 10,
    difficulty: 'hard',
  },
  {
    id: '3',
    name: 'Deportes',
    description: 'Todo sobre deportes y atletas famosos',
    icon: '⚽',
    color: '#45B7D1',
    questionCount: 10,
    difficulty: 'easy',
  },
  {
    id: '4',
    name: 'Entretenimiento',
    description: 'Películas, música y celebridades',
    icon: '🎬',
    color: '#96CEB4',
    questionCount: 10,
    difficulty: 'easy',
  },
  {
    id: '5',
    name: 'Geografía',
    description: 'Explora países, capitales y lugares del mundo',
    icon: '🌍',
    color: '#F59E0B',
    questionCount: 10,
    difficulty: 'medium',
  },
  {
    id: '6',
    name: 'Arte y Literatura',
    description: 'Obras maestras, artistas y escritores famosos',
    icon: '🎨',
    color: '#DDA0DD',
    questionCount: 10,
    difficulty: 'hard',
  },
];

const mockQuestions: Record<string, Question[]> = {
  '1': [
    {
      id: '1-1',
      categoryId: '1',
      question: '¿En qué año comenzó la Primera Guerra Mundial?',
      options: ['1914', '1915', '1916', '1917'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '1-2',
      categoryId: '1',
      question: '¿Quién fue el primer presidente de Estados Unidos?',
      options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '1-3',
      categoryId: '1',
      question: '¿En qué año cayó el Imperio Romano de Occidente?',
      options: ['376 d.C.', '476 d.C.', '576 d.C.', '676 d.C.'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Romulus_Augustulus_resigns_the_crown_%28514x800%29.jpg/400px-Romulus_Augustulus_resigns_the_crown_%28514x800%29.jpg',
    },
    {
      id: '1-4',
      categoryId: '1',
      question: '¿En qué año terminó la Segunda Guerra Mundial?',
      options: ['1943', '1944', '1945', '1946'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '1-5',
      categoryId: '1',
      question: '¿Quién fue el primer emperador de Roma?',
      options: ['Julio César', 'Augusto', 'Nerón', 'Calígula'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '1-6',
      categoryId: '1',
      question: '¿En qué año se descubrió América?',
      options: ['1490', '1491', '1492', '1493'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '1-7',
      categoryId: '1',
      question: '¿Quién fue Napoleón Bonaparte?',
      options: ['Un pintor', 'Un emperador francés', 'Un científico', 'Un escritor'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '1-8',
      categoryId: '1',
      question: '¿En qué año comenzó la Revolución Francesa?',
      options: ['1787', '1788', '1789', '1790'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '1-9',
      categoryId: '1',
      question: '¿Quién fue el primer rey de España?',
      options: ['Fernando el Católico', 'Carlos I', 'Felipe II', 'Isabel la Católica'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '1-10',
      categoryId: '1',
      question: '¿En qué año se construyó el Muro de Berlín?',
      options: ['1959', '1960', '1961', '1962'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
  ],
  '2': [
    {
      id: '2-1',
      categoryId: '2',
      question: '¿Cuál es el elemento químico más abundante en el universo?',
      options: ['Helio', 'Hidrógeno', 'Carbono', 'Oxígeno'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '2-2',
      categoryId: '2',
      question: '¿Cuál es la velocidad de la luz en el vacío?',
      options: ['299,792 km/s', '199,792 km/s', '399,792 km/s', '499,792 km/s'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '2-3',
      categoryId: '2',
      question: '¿Cuántos planetas hay en el sistema solar?',
      options: ['7', '8', '9', '10'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Planets2013.svg/640px-Planets2013.svg.png',
    },
    {
      id: '2-4',
      categoryId: '2',
      question: '¿Cuál es el hueso más largo del cuerpo humano?',
      options: ['Fémur', 'Húmero', 'Tibia', 'Radio'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '2-5',
      categoryId: '2',
      question: '¿Cuál es la fórmula química del agua?',
      options: ['H2O', 'CO2', 'O2', 'N2'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '2-6',
      categoryId: '2',
      question: '¿Quién descubrió la gravedad?',
      options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '2-7',
      categoryId: '2',
      question: '¿Cuál es el animal más grande del mundo?',
      options: ['Elefante africano', 'Ballena azul', 'Jirafa', 'Rinoceronte'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Blue_whale_size.svg/640px-Blue_whale_size.svg.png',
    },
    {
      id: '2-8',
      categoryId: '2',
      question: '¿Cuál es la temperatura de ebullición del agua?',
      options: ['90°C', '95°C', '100°C', '105°C'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '2-9',
      categoryId: '2',
      question: '¿Cuántos cromosomas tiene el ser humano?',
      options: ['42', '44', '46', '48'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '2-10',
      categoryId: '2',
      question: '¿Cuál es el metal más abundante en la corteza terrestre?',
      options: ['Hierro', 'Aluminio', 'Cobre', 'Zinc'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
  ],
  '3': [
    {
      id: '3-1',
      categoryId: '3',
      question: '¿En qué año se celebró la primera Copa Mundial de Fútbol?',
      options: ['1930', '1934', '1938', '1950'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Soccer_ball.svg/512px-Soccer_ball.svg.png',
    },
    {
      id: '3-2',
      categoryId: '3',
      question: '¿Cuántos jugadores tiene un equipo de baloncesto en la cancha?',
      options: ['4', '5', '6', '7'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '3-3',
      categoryId: '3',
      question: '¿Cuántos jugadores tiene un equipo de fútbol en la cancha?',
      options: ['9', '10', '11', '12'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '3-4',
      categoryId: '3',
      question: '¿Cuál es el deporte más popular del mundo?',
      options: ['Baloncesto', 'Fútbol', 'Tenis', 'Béisbol'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Football_%28soccer_ball%29.svg/512px-Football_%28soccer_ball%29.svg.png',
    },
    {
      id: '3-5',
      categoryId: '3',
      question: '¿Cuántos sets se juegan en un partido de tenis?',
      options: ['2 de 3', '3 de 5', '4 de 7', '5 de 9'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '3-6',
      categoryId: '3',
      question: '¿Quién es considerado el mejor boxeador de todos los tiempos?',
      options: ['Mike Tyson', 'Muhammad Ali', 'Floyd Mayweather', 'Manny Pacquiao'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '3-7',
      categoryId: '3',
      question: '¿Cuántos jugadores tiene un equipo de voleibol en la cancha?',
      options: ['5', '6', '7', '8'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '3-8',
      categoryId: '3',
      question: '¿En qué deporte se usa un "birdie"?',
      options: ['Tenis', 'Bádminton', 'Golf', 'Ping Pong'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '3-9',
      categoryId: '3',
      question: '¿Cuántos jugadores tiene un equipo de béisbol en la cancha?',
      options: ['8', '9', '10', '11'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '3-10',
      categoryId: '3',
      question: '¿Cuál es el deporte nacional de Estados Unidos?',
      options: ['Fútbol americano', 'Béisbol', 'Baloncesto', 'Hockey'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
  ],
  '4': [
    {
      id: '4-1',
      categoryId: '4',
      question: '¿Quién dirigió la película "Titanic"?',
      options: ['Steven Spielberg', 'James Cameron', 'Christopher Nolan', 'Quentin Tarantino'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/en/2/22/Titanic_poster.jpg',
    },
    {
      id: '4-2',
      categoryId: '4',
      question: '¿En qué año se lanzó el primer iPhone?',
      options: ['2005', '2006', '2007', '2008'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/IPhone_1st_Generation.png/200px-IPhone_1st_Generation.png',
    },
    {
      id: '4-3',
      categoryId: '4',
      question: '¿Quién interpretó a Iron Man en el Universo Cinematográfico de Marvel?',
      options: ['Chris Evans', 'Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/en/0/00/Iron_Man_poster.jpg',
    },
    {
      id: '4-4',
      categoryId: '4',
      question: '¿Cuál es la película más taquillera de la historia?',
      options: ['Titanic', 'Avatar', 'Avengers: Endgame', 'Star Wars: El despertar de la fuerza'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/en/b/b0/Avatar-Teaser-Poster.jpg',
    },
    {
      id: '4-5',
      categoryId: '4',
      question: '¿Quién es el cantante principal de Queen?',
      options: ['Freddie Mercury', 'Brian May', 'Roger Taylor', 'John Deacon'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '4-6',
      categoryId: '4',
      question: '¿En qué año se estrenó la primera película de Star Wars?',
      options: ['1975', '1976', '1977', '1978'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '4-7',
      categoryId: '4',
      question: '¿Quién escribió "Harry Potter"?',
      options: ['J.K. Rowling', 'Stephen King', 'George R.R. Martin', 'Suzanne Collins'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '4-8',
      categoryId: '4',
      question: '¿Cuál es la serie de TV más vista de la historia?',
      options: ['Friends', 'Game of Thrones', 'Breaking Bad', 'The Walking Dead'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '4-9',
      categoryId: '4',
      question: '¿Quién es el director de "El Padrino"?',
      options: ['Martin Scorsese', 'Francis Ford Coppola', 'Steven Spielberg', 'Quentin Tarantino'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '4-10',
      categoryId: '4',
      question: '¿En qué año se fundó Disney?',
      options: ['1921', '1923', '1925', '1927'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
  ],
  '5': [
    {
      id: '5-1',
      categoryId: '5',
      question: '¿Cuál es la capital de Australia?',
      options: ['Sídney', 'Melbourne', 'Canberra', 'Brisbane'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Parliament_House_Canberra.jpg/400px-Parliament_House_Canberra.jpg',
    },
    {
      id: '5-2',
      categoryId: '5',
      question: '¿Cuál es el río más largo del mundo?',
      options: ['Nilo', 'Amazonas', 'Yangtsé', 'Misisipi'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Amazon_river.jpg/400px-Amazon_river.jpg',
    },
    {
      id: '5-3',
      categoryId: '5',
      question: '¿Cuál es la capital de Japón?',
      options: ['Osaka', 'Kioto', 'Tokio', 'Yokohama'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '5-4',
      categoryId: '5',
      question: '¿Cuál es el país más grande del mundo?',
      options: ['China', 'Estados Unidos', 'Rusia', 'Canadá'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '5-5',
      categoryId: '5',
      question: '¿Cuál es la montaña más alta del mundo?',
      options: ['K2', 'Monte Everest', 'Kangchenjunga', 'Lhotse'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '5-6',
      categoryId: '5',
      question: '¿Cuál es la capital de Brasil?',
      options: ['São Paulo', 'Río de Janeiro', 'Brasilia', 'Salvador'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '5-7',
      categoryId: '5',
      question: '¿En qué continente está Egipto?',
      options: ['Asia', 'Europa', 'África', 'América'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '5-8',
      categoryId: '5',
      question: '¿Cuál es el océano más grande del mundo?',
      options: ['Atlántico', 'Índico', 'Pacífico', 'Ártico'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Pacific_Ocean_-_en.png/400px-Pacific_Ocean_-_en.png',
    },
    {
      id: '5-9',
      categoryId: '5',
      question: '¿Cuál es la capital de Canadá?',
      options: ['Toronto', 'Montreal', 'Vancouver', 'Ottawa'],
      correctAnswer: 3,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '5-10',
      categoryId: '5',
      question: '¿Cuál es el desierto más grande del mundo?',
      options: ['Sahara', 'Gobi', 'Antártico', 'Arábigo'],
      correctAnswer: 2,
      points: 10,
      timeLimit: 30,
    },
  ],
  '6': [
    {
      id: '6-1',
      categoryId: '6',
      question: '¿Quién pintó la Mona Lisa?',
      options: ['Miguel Ángel', 'Leonardo da Vinci', 'Rafael', 'Donatello'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/400px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
    },
    {
      id: '6-2',
      categoryId: '6',
      question: '¿Quién escribió "Don Quijote"?',
      options: ['Miguel de Cervantes', 'William Shakespeare', 'Dante Alighieri', 'Homer'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '6-3',
      categoryId: '6',
      question: '¿Quién pintó "La noche estrellada"?',
      options: ['Pablo Picasso', 'Vincent van Gogh', 'Salvador Dalí', 'Claude Monet'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/The_Starry_Night.jpg/400px-The_Starry_Night.jpg',
    },
    {
      id: '6-4',
      categoryId: '6',
      question: '¿Quién escribió "Romeo y Julieta"?',
      options: ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Mark Twain'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '6-5',
      categoryId: '6',
      question: '¿Quién esculpió "El David"?',
      options: ['Leonardo da Vinci', 'Miguel Ángel', 'Donatello', 'Rafael'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '6-6',
      categoryId: '6',
      question: '¿Quién escribió "Cien años de soledad"?',
      options: ['Gabriel García Márquez', 'Pablo Neruda', 'Isabel Allende', 'Mario Vargas Llosa'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '6-7',
      categoryId: '6',
      question: '¿Quién pintó "El grito"?',
      options: ['Edvard Munch', 'Gustav Klimt', 'Egon Schiele', 'Oskar Kokoschka'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Scream.jpg/400px-The_Scream.jpg',
    },
    {
      id: '6-8',
      categoryId: '6',
      question: '¿Quién escribió "El principito"?',
      options: ['Antoine de Saint-Exupéry', 'Victor Hugo', 'Albert Camus', 'Jean-Paul Sartre'],
      correctAnswer: 0,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '6-9',
      categoryId: '6',
      question: '¿Quién pintó "Los girasoles"?',
      options: ['Claude Monet', 'Vincent van Gogh', 'Paul Gauguin', 'Henri Matisse'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
    {
      id: '6-10',
      categoryId: '6',
      question: '¿Quién escribió "El señor de los anillos"?',
      options: ['C.S. Lewis', 'J.R.R. Tolkien', 'George R.R. Martin', 'Terry Pratchett'],
      correctAnswer: 1,
      points: 10,
      timeLimit: 30,
    },
  ],
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'trivia/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      if (featureFlags.useServicesTrivia) {
        const { triviaService } = getServices();
        return await triviaService.getCategories();
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCategories;
    } catch (error) {
      return rejectWithValue('Error al cargar categorías');
    }
  }
);

export const startTriviaSession = createAsyncThunk(
  'trivia/startSession',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      // Validar que la categoría existe
      if (!categoryId || typeof categoryId !== 'string') {
        throw new Error('ID de categoría inválido');
      }

      if (featureFlags.useServicesTrivia) {
        const { triviaService } = getServices();
        const session = await triviaService.startSession(categoryId);
        
        // Validar que la sesión del servicio es válida
        if (!session || !session.questions || session.questions.length === 0) {
          throw new Error('El servicio no devolvió preguntas válidas');
        }
        
        return session;
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      const allQuestions = mockQuestions[categoryId] || [];
      
      if (allQuestions.length === 0) {
        throw new Error(`No hay preguntas disponibles para la categoría: ${categoryId}`);
      }
      
      // Validar que las preguntas tienen la estructura correcta
      const validQuestions = allQuestions.filter(q => 
        q && 
        q.id && 
        q.question && 
        q.options && 
        q.options.length > 0 && 
        q.correctAnswer !== undefined &&
        q.correctAnswer >= 0 &&
        q.correctAnswer < q.options.length
      );
      
      if (validQuestions.length === 0) {
        throw new Error('Las preguntas de la categoría no tienen un formato válido');
      }
      
      const questions = validQuestions.slice(0, 10);
      const session: TriviaSession = {
        id: `session_${Date.now()}`,
        categoryId,
        questions,
        currentQuestionIndex: 0,
        score: 0,
        streak: 0,
        startTime: new Date().toISOString(),
        isCompleted: false,
        sessionHintsUsed: 0,
      };
      
      return session;
    } catch (error) {
      console.error('Error en startTriviaSession:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión de trivia';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk para sincronizar respuestas offline según UC-05
export const syncOfflineAnswers = createAsyncThunk(
  'trivia/syncOfflineAnswers',
  async (_, { getState, dispatch }) => {
    try {
      const state = getState() as any;
      const offlineAnswers = state.trivia.offlineAnswers;
      if (offlineAnswers.length === 0) {
        return { message: 'No hay respuestas offline para sincronizar' };
      }
      if (featureFlags.useServicesTrivia) {
        // Si hubiera un servicio de sync, se llamaría aquí; mantenemos mock
        await new Promise(resolve => setTimeout(resolve, 300));
        return { message: `${offlineAnswers.length} respuestas sincronizadas exitosamente`, syncedCount: offlineAnswers.length };
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: `${offlineAnswers.length} respuestas sincronizadas exitosamente`, syncedCount: offlineAnswers.length };
    } catch (error) {
      throw new Error('Error al sincronizar respuestas offline');
    }
  }
);

const triviaSlice = createSlice({
  name: 'trivia',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    answerQuestion: (state, action: PayloadAction<{ isCorrect: boolean; points: number; isOffline?: boolean }>) => {
      if (state.currentSession) {
        const { isCorrect, points, isOffline = false } = action.payload;
        
        // Guardar respuesta para sincronización offline si es necesario
        if (isOffline) {
          state.offlineAnswers.push({
            sessionId: state.currentSession.id,
            questionIndex: state.currentSession.currentQuestionIndex,
            isCorrect,
            points,
            timestamp: new Date().toISOString(),
          });
        }
        
        if (isCorrect) {
          state.currentSession.score += points;
          state.currentSession.streak += 1;
        } else {
          state.currentSession.streak = 0;
        }
      }
    },
    advanceQuestion: (state) => {
      if (!state.currentSession) return;
      state.currentSession.currentQuestionIndex += 1;
      if (state.currentSession.currentQuestionIndex >= state.currentSession.questions.length) {
        state.currentSession.isCompleted = true;
      }
    },
    resetSession: (state) => {
      state.currentSession = null;
    },
    useHint: (state) => {
      if (!state.currentSession) return;
      const used = state.currentSession.sessionHintsUsed ?? 0;
      if (used < 2) {
        state.currentSession.sessionHintsUsed = used + 1;
      }
    },
    clearOfflineAnswers: (state) => {
      state.offlineAnswers = [];
    },
    skipQuestion: (state) => {
      if (state.currentSession) {
        state.currentSession.currentQuestionIndex += 1;
        state.currentSession.streak = 0;
        
        if (state.currentSession.currentQuestionIndex >= state.currentSession.questions.length) {
          state.currentSession.isCompleted = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Start Session
      .addCase(startTriviaSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startTriviaSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
      })
      .addCase(startTriviaSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sync Offline Answers
      .addCase(syncOfflineAnswers.fulfilled, (state, action) => {
        // Limpiar respuestas offline después de sincronizar exitosamente
        state.offlineAnswers = [];
      });
  },
});

export const { clearError, answerQuestion, advanceQuestion, resetSession, useHint, skipQuestion, clearOfflineAnswers } = triviaSlice.actions;
export default triviaSlice.reducer;

// Selectores memoizados
export const selectTriviaState = (state: any) => state.trivia as import('../../shared/domain/types').TriviaState;
export const selectCategories = createSelector(selectTriviaState, (t) => t.categories);
export const selectCurrentSession = createSelector(selectTriviaState, (t) => t.currentSession);
export const selectTriviaLoading = createSelector(selectTriviaState, (t) => t.isLoading);
export const selectTriviaError = createSelector(selectTriviaState, (t) => t.error);
