export interface IUser {
  name?: string;
  email: string;
  password: string;
  credits?: number;
  plan?: PlanType;
}

export enum PlanType {
  Free = "Free",
  Plus = "Plus",
  Pro = "Pro",
}
