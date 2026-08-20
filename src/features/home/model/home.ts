export interface HomeContentItem {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface HomeCommonContent {
  concerts: HomeContentItem[];
  magazines: HomeContentItem[];
  notices: HomeContentItem[];
}

export interface ActiveTripSummary {
  id: string;
  dDay: string;
  concertName: string;
  concertDate: string;
  venue: string;
  todayDate: string;
}

export interface RouteSummary {
  id: string;
  title: string;
  description: string;
  href: string;
}

export interface RegisteredHomeData extends HomeCommonContent {
  status: 'registered';
  activeTrip: ActiveTripSummary;
  pastRoutes: RouteSummary[];
  recommendedRoute: RouteSummary;
}

export interface EmptyHomeData extends HomeCommonContent {
  status: 'empty';
}

export type HomeData = EmptyHomeData | RegisteredHomeData;
