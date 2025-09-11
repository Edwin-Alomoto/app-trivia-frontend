import { IAuthService } from './auth/types';
import { HttpAuthService } from './auth/httpAuthService';
import { IPointsService } from './points/types';
import { HttpPointsService } from './points/httpPointsService';
import { IRafflesService } from './raffles/types';
import { HttpRafflesService } from './raffles/httpRafflesService';
import { IRewardsService } from './rewards/types';
import { HttpRewardsService } from './rewards/httpRewardsService';
import { INotificationsService } from './notifications/types';
import { HttpNotificationsService } from './notifications/httpNotificationsService';
import { ISurveysService } from './surveys/types';
import { HttpSurveysService } from './surveys/httpSurveysService';
import { ITestimonialsService } from './testimonials/types';
import { HttpTestimonialsService } from './testimonials/httpTestimonialsService';
import { ITriviaService } from './trivia/types';
import { HttpTriviaService } from './trivia/httpTriviaService';
import { IPurchasesService } from './purchases/types';
import { HttpPurchasesService } from './purchases/httpPurchasesService';

type Services = {
  authService: IAuthService;
  pointsService: IPointsService;
  rafflesService: IRafflesService;
  rewardsService: IRewardsService;
  notificationsService: INotificationsService;
  surveysService: ISurveysService;
  testimonialsService: ITestimonialsService;
  triviaService: ITriviaService;
  purchasesService: IPurchasesService;
};

let services: Services | null = null;

export function getServices(): Services {
  if (!services) {
    services = {
      authService: new HttpAuthService(),
      pointsService: new HttpPointsService(),
      rafflesService: new HttpRafflesService(),
      rewardsService: new HttpRewardsService(),
      notificationsService: new HttpNotificationsService(),
      surveysService: new HttpSurveysService(),
      testimonialsService: new HttpTestimonialsService(),
      triviaService: new HttpTriviaService(),
      purchasesService: new HttpPurchasesService(),
    };
  }
  return services;
}

export function setServices(custom: Partial<Services>) {
  services = { ...getServices(), ...custom };
}


