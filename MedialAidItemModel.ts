import { MedicalAidPlanModel } from "./MedicalAidPlanModel";

export interface MedialAidItemModel {
    medicalAidId: string;
    name: string;
    description: string;
    plans: MedicalAidPlanModel[]
}