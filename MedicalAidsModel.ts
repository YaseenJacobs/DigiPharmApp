import { MedicalAidRelationshipType } from "../enums/MedicalAidRelationshipType";
import { ImageModel } from "./ImageModel";
import { MedialAidItemModel } from "./MedialAidItemModel";
import { MedicalAidModel } from "./MedicalAidModel";
import { MedicalAidPlanModel } from "./MedicalAidPlanModel";
import { UserModel } from "./UserModel";

export interface MedicalAidsModel {
    page: number;
    pageSize: number;
    totalPages: number;
    items: MedialAidItemModel[];
    relationship: MedicalAidRelationshipType;
    medicalAid: MedicalAidModel[];
    medicalAidPlan: MedicalAidPlanModel[];
    medicalAidNumber: string;

    dependantCode: string;
    mainMember: UserModel[];
    roleNames: string;
    profilePicture: ImageModel[];
    dependants: UserModel[];

}

