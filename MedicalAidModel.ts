import { MedicalAidPlanModel } from "./MedicalAidPlanModel";

export interface MedicalAidModel {
    medicalAidId: string;
    name: string;
    description: string;
    plans: MedicalAidPlanModel[];
}