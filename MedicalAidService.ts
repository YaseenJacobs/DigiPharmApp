
import { MedicalAidsModel } from "../models/MedicalAidsModel";
import { BaseService } from "./BaseService"

class MedicalAidService extends BaseService {

    async fetchMedicalAidSchemesAsync(): Promise<MedicalAidsModel> {
        return this.httpGetAsync<MedicalAidsModel>('/medicalAids');
    }

    async searchMedicalAidSchemesAsync(searchTerm: string): Promise<MedicalAidsModel> {
        var query = `?searchTerm=${searchTerm}`;

        return this.httpGetAsync<MedicalAidsModel>(`/medicalAids${query}`);
    }

    async createMedicalAidInfo(
        medicalAidId: string,
        medicalAidPlanId: string,
        medicalAidNumber: string,
        relationship: string,
        dependentCode: number,
        medicalAidCardFileName: string,
        medicalAidCardS3Bucket: string,
        medicalAidCardS3ObjectKey: string,
    ) {


        //TODO: Create actual DTO model for this
        return this.httpPostAsync<any>('/medicalAids/my/medicalAids', {
            "medicalAidId": medicalAidId,
            "medicalAidPlanId": medicalAidPlanId,
            "medicalAidNumber": medicalAidNumber,
            "relationship": relationship,
            "dependantCode": dependentCode,
            "medicalAidCardCopy": {
                "fileName": medicalAidCardFileName,
                "bucket": medicalAidCardS3Bucket,
                "key": medicalAidCardS3ObjectKey
            }
        });

    }
}
export const medicalAidService = new MedicalAidService();