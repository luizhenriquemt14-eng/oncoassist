export interface LocationLink {
  name: string;
  mapsLink: string;
}

export interface Professional {
  id: string;
  name: string;
  role?: string;
  photo: string;
  showOnHome?: boolean;
  curriculum: string[];
  locations: LocationLink[];
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  speaker: string | null;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
  time: string;
  location: string;
  address: string;
  city: string;
  state: string;
  targetAudience: string;
  objective: string;
  image: string;
  mobileImage?: string;
  registrationEnabled?: boolean;
  speakers: Speaker[];
  schedule?: ScheduleItem[];
}

export interface EventFormValues {
  title: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
  time: string;
  location: string;
  address: string;
  city: string;
  state: string;
  targetAudience: string;
  objective: string;
  image: string;
  mobileImage: string;
  registrationEnabled: boolean;
  schedule: Array<{
    time: string;
    title: string;
    speaker: string;
  }>;
}
