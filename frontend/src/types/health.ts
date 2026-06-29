export interface ServiceDescriptor {
  name: string;
  kind: string;
  url: string;
}

export interface HealthResponse {
  status: string;
  app: string;
  environment: string;
  services: ServiceDescriptor[];
}

