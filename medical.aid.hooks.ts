import React, { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { debounceTime, Subject } from 'rxjs';
import { NumberInputFormControlRef } from '../components/input/NumberInputFormControl';
import { SelectInputFormControlRef } from '../components/input/SelectInputFormControl';
import { TextInputFormControlRef } from '../components/input/TextInputFormControl';
import { MedicalAidType } from '../enums/MedicalAidType';
import { MedicalAidsModel } from '../models/MedicalAidsModel';
import { newSelectField, SelectFieldModel } from '../models/SelectFieldModel';
import { autoCompleteService } from '../services/google/places/AutoCompleteService';
import { medicalAidService } from '../services/MedicalAidService'
import { Strings } from '../Strings';

export default function useMedicalAidHooks() {

    const [isFetchingMedicalDetails, setIsFetchingMedicalDetails] = useState(false);
    const [storedMedicalAidDetails, setStoredMedicalAidDetails] = useState<MedicalAidsModel[] | null>(null);
    const [selectFieldOptions, setSelectFieldOptions] = useState<SelectFieldModel[]>([]);
    const [isPredictionsVisible, setIsPredictionsVisible] = useState(false);
    const onInputFieldHandler = useRef(new Subject<string>()).current;
    const [predictionsTop, setPredictionsTop] = useState(0);


    const [isSavingMedicalAid, setIsSavingMedicalAid] = useState(false);
    const [savedMedicalAids, setSavedMedicalAids] = useState<MedicalAidsModel[] | null>(null);

    //refs    
    const medicalAidPlanRef = useRef<TextInputFormControlRef>(null);
    const medicalAidNumberRef = useRef<TextInputFormControlRef>(null);
    const relationshipRef = useRef<SelectInputFormControlRef>(null);
    const dependantCodeRef = useRef<TextInputFormControlRef>(null);
    const medicalAidRef = useRef<TextInputFormControlRef>(null);
    //////////////////////////////////////////////////////////////////////////////////
    const [isFetchingMedicalAids, setIsFetchingMedicalAids] = useState(false);
    const medicalAidNameControlRef = useRef<TextInputFormControlRef>(null);     //
    const medicalAidPlanControlRef = useRef<TextInputFormControlRef>(null);     //
    const medicalAidNumberControlRef = useRef<NumberInputFormControlRef>(null); //
    const medicalAidRelationshipControlRef = useRef<SelectInputFormControlRef>(null);//
    const medicalAidDependantCodeControlRef = useRef<TextInputFormControlRef>(null);//
    /////////////////////////////////////////////////////////////////////////////////


    const fetchMedicalAidDetailsIfNeeded = (forceRefresh?: boolean) => {
        if ((storedMedicalAidDetails == null && !isFetchingMedicalDetails) || forceRefresh === true) {
            setIsFetchingMedicalDetails(true);
            medicalAidService.fetchMedicalAidSchemesAsync().then((data) => {
                setIsFetchingMedicalDetails(false);
                setStoredMedicalAidDetails;
            }).catch((error: any) => {
                setIsFetchingMedicalDetails(false);
                if (Array.isArray(error)) {
                    Alert.alert(Strings.service_error_title, error[0]);
                } else {
                    Alert.alert(Strings.service_error_title, Strings.something_went_wrong);
                }
            });
        }
    }

    const fetchPredictions = (query: string) => {
        console.log(`fetchPredictions: ${query}`);
        autoCompleteService.fetchPredictionsAsync(query).then(async (predictions) => {
            setSelectFieldOptions(predictions.map(p => newSelectField(p.description, p.place_id)));
        }).catch(e => {
            console.error(e);
        });
    }

    useEffect(() => {
        onInputFieldHandler.asObservable().pipe(
            debounceTime(1000)
        ).subscribe(value => fetchPredictions(value));
    }, []);

    useEffect(() => {
        if (!isPredictionsVisible) return;

        medicalAidRef.current?.inputFieldRef?.current?.measure((x, y, width, height, pageX, pageY) => {

            setPredictionsTop(pageY + -(height + 10));
        });
    }, [isPredictionsVisible]);

    const fetchSavedMedicalAidsIfNeeded = (forceRefresh?: boolean) => {
        if ((savedMedicalAids == null && !isFetchingMedicalAids) || forceRefresh === true) {

            setIsFetchingMedicalAids(true);

            medicalAidService.fetchMedicalAidSchemesAsync().then((data) => {

                setIsFetchingMedicalAids(false);
                setSavedMedicalAids(data);

            }).catch((error: any) => {
                setIsFetchingMedicalAids(false);
                if (Array.isArray(error)) {
                    Alert.alert(Strings.service_error_title, error[0]);
                } else {
                    Alert.alert(Strings.service_error_title, Strings.something_went_wrong);
                }
            });
        }

    }

    const isFormValid = (): boolean => {
        var _isFormValid = true;
        if (!medicalAidNameControlRef.current?.validate()) _isFormValid = false;
        if (!medicalAidPlanControlRef.current?.validate()) _isFormValid = false;
        if (!medicalAidNumberControlRef.current?.validate()) _isFormValid = false;
        if (!medicalAidRelationshipControlRef.current?.validate()) _isFormValid = false;
        if (!medicalAidDependantCodeControlRef.current?.validate()) _isFormValid = false;
        // if (isMedicalAidCardImageEmpty() || isIdentityDocumentImageEmpty()) _isFormValid = false;
        return _isFormValid;
    }

    const savedMedicalAidInfomationAsync = async (): Promise<Boolean> => {
        return new Promise<Boolean>(async (resolve, reject) => {
            if (!isFormValid()) {
                resolve(false);
                return;
            }
            setIsSavingMedicalAid(true);

            const medicalAidType = Object.values(MedicalAidType).find(x => x.toLowerCase() === medicalAidName.toLowerCase())!;
            const medicalAidName = medicalAidNameControlRef.current?.getValue()!;
            const medicalAidPlan = medicalAidPlanControlRef.current?.getValue()!;
            const medicalAidNumber = medicalAidNumberControlRef.current?.getValue()!;
            const medicalAidRelationship = medicalAidRelationshipControlRef.current?.getValue()!;
            const medicalAidDependantCode = medicalAidDependantCodeControlRef.current?.getValue()!;

            return medicalAidService.updateMedicalAidsAsync(medicalAidType, medicalAidName, medicalAidPlan, medicalAidNumber, medicalAidRelationship, medicalAidDependantCode).then((medicalAids: MedicalAidsModel) => {
                setIsSavingMedicalAid(false);
                setTimeout(() => {
                    resolve(true);
                }, 550)
            }).catch((error: any) => {
                setIsSavingMedicalAid(false);
                if (Array.isArray(error)) {
                    Alert.alert(Strings.service_error_title, error[0]);
                } else {
                    Alert.alert(Strings.service_error_title, Strings.something_went_wrong);
                }
                resolve(false);
            })
        }

        )
    };

    const getLoadingMessage = () => {
        // setIsLoading(isFetchingUserProfile || isFetchingAdvertisements || isFetchingNewArrivals || isFetchingNearbyPharmacies);
        if (isFetchingMedicalAids) return 'Fetching saved addresses';
        // else if (isDeletingMedicalAid) return 'Deleting saved medical aid';

        return undefined
    };




    return {

        //ref
        medicalAidRef,
        medicalAidPlanRef,
        medicalAidNumberRef,
        dependantCodeRef,
        relationshipRef,

        //functions 
        predictionsTop,
        isPredictionsVisible, setIsPredictionsVisible,
        onInputFieldHandler,
        fetchMedicalAidDetailsIfNeeded,
        isFetchingMedicalDetails,
        storedMedicalAidDetails,
        selectFieldOptions
    }
}
