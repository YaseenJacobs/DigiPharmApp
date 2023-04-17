import React, { useState, useEffect, useRef } from 'react';
import { Alert, FlatList, LogBox, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NeutralGrey, PrimaryScooter, White } from '../../../Colors';
import RoundedButton from '../../../components/button/RoundedButton';
import SelectInputFormControl, { SelectInputFormControlRef } from '../../../components/input/SelectInputFormControl';
import TextInputFormControl, { TextInputFormControlRef } from '../../../components/input/TextInputFormControl';
import BodyButton from '../../../components/text/BodyButton';
import BodyRegular from '../../../components/text/BodyRegular';
import { MedicalAidRelationshipType } from '../../../enums/MedicalAidRelationshipType';
import { SelectFieldModel } from '../../../models/SelectFieldModel';
import { Strings } from '../../../Strings';
import useMediaController from '../../../hooks/media.controller.hook';
import { AccountNavigationProp, AccountNavigationRouteProp, AccountRoutes as Routes } from './AccountStackParams';
import { StackHeaderProps } from '@react-navigation/stack';
import CommonStackHeader from '../../../components/CommonStackHeader';
import BodySmall from '../../../components/text/BodySmall';
import { medicalAidService } from '../../../services/MedicalAidService';
import { MedialAidItemModel } from '../../../models/MedialAidItemModel';
import NumberInputFormControl from '../../../components/input/NumberInputFormControl';
import MedicalAidCompletePopup from '../account/NewMedicalAidAccountCompletePopup'
import { MedicalAidType } from '../../../enums/MedicalAidType';
import { debounceTime, Subject } from 'rxjs';
import { MedicalAidPlanModel } from '../../../models/MedicalAidPlanModel';
import { UploadDocumentInfoModel } from '../../../models/UploadDocumentInfoModel';
import { mediaService } from '../../../services/MediaService';
import { commonFileUpload } from '../../../domain/CommonFileUpload';
import { SupportedMediaType } from '../../../enums/SupportedMediaType';
import { imageService } from '../../../services/ImageService';
import { Buffer } from 'buffer';


interface Props {
    navigation: AccountNavigationProp<Routes.AddMedicalAidAccount>,
    route: AccountNavigationRouteProp<Routes.AddMedicalAidAccount>
}

export default function AddMedicalAidAccount(props: Props) {

    const hooks = useAddMedicalAidAccountHooks(props);

    return <View>
        <ScrollView style={styles.container}
            onScroll={() => hooks.setIsMedicalAidOptionsVisible(false)}>
            <MedicalAidCompletePopup
                visible={hooks.showNewMedicalAidAccountComplete}
                onGoBackButton={() => {
                    hooks.setShowNewMedicalAidAccountComplete(false);
                    props.navigation.navigate(Routes.MedicalAidInfomation)

                }}
            />
            <View style={styles.containerChild}>
                <View style={Object.assign({}, styles.formGroup, styles.medicalAidOptionsFlatList, { position: 'relative', zIndex: 3 })}>
                    <BodyRegular style={styles.fieldLabel}>Medical Aid Name *</BodyRegular>
                    <TextInputFormControl
                        placeholder={'Medical Aid Name'}
                        isRequired={true}
                        inputFieldStyle={styles.textInput}
                        useShadow={false}
                        ref={hooks.medicalAidNameControlRef}
                        onBlur={() => {
                            hooks.setMedicalAidScheme(hooks.selectedMedicalAidScheme?.name ?? "");
                            hooks.setIsMedicalAidSchemeOptionsVisible(false);
                        }}
                        defaultValue={hooks.medicalAidScheme}
                        onValueChange={value => hooks.onMedicalAidSchemeTermChange(value)}
                    />

                    {hooks.isMedicalAidSchemeOptionsVisible &&
                        <View style={[styles.medicalAidOptionsContainer]}>
                            <FlatList style={styles.medicalAidOptionsFlatList} data={hooks.medicalAidSchemesFiltered} scrollEnabled={true}
                                renderItem={(itemInfo) => {

                                    return <TouchableOpacity onPress={async () => {
                                        hooks.setMedicalAidScheme(itemInfo.item.name);
                                        hooks.setSelectedMedicalAidScheme(itemInfo.item);
                                        hooks.setIsMedicalAidSchemeOptionsVisible(false);
                                    }}>
                                        <BodySmall style={{ padding: 16 }}>{itemInfo.item.name}</BodySmall>
                                    </TouchableOpacity>
                                }}>
                            </FlatList>
                        </View>}

                </View>
                <View style={Object.assign({}, styles.formGroup, styles.medicalAidOptionsFlatList, { position: 'relative', zIndex: 2 })}>
                    <BodyRegular style={styles.fieldLabel}>Medical Aid Plan *</BodyRegular>
                    <TextInputFormControl
                        disabled={hooks.selectedMedicalAidScheme == undefined}
                        isRequired={true}
                        inputFieldStyle={styles.textInput}
                        useShadow={false}
                        ref={hooks.medicalAidPlanControlRef}
                        onFocus={() => hooks.setIsMedicalAidPlanOptionsVisible(true)}
                        onBlur={() => {
                            hooks.setMedicalAidPlan(hooks.selectedMedicalAidPlan?.name ?? "");
                            hooks.setIsMedicalAidPlanOptionsVisible(false);
                        }}
                        defaultValue={hooks.medicalAidPlan}
                        onValueChange={value => hooks.onMedicalAidPlanTermChange(value)}
                    />

                    {hooks.isMedicalAidPlanOptionsVisible &&
                        <View style={[styles.medicalAidOptionsContainer]}>
                            <FlatList style={styles.medicalAidOptionsFlatList} data={hooks.medicalAidPlansFiltered} scrollEnabled={true}
                                renderItem={(itemInfo) => {
                                    return <TouchableOpacity onPress={async () => {
                                        hooks.setMedicalAidPlan(itemInfo.item.name);
                                        hooks.setSelectedMedicalAidPlan(itemInfo.item);
                                        hooks.setIsMedicalAidPlanOptionsVisible(false);
                                    }}>
                                        <BodySmall style={{ padding: 16 }}>{itemInfo.item.name}</BodySmall>
                                    </TouchableOpacity>
                                }}>
                            </FlatList>
                        </View>}
                </View>
                <View style={Object.assign({}, styles.formGroup, { position: 'relative', zIndex: 1 })}>
                    <BodyRegular style={styles.fieldLabel}>Medical Aid Number *</BodyRegular>
                    <TextInputFormControl
                        isRequired={true}
                        inputFieldStyle={styles.textInput}
                        useShadow={false}
                        placeholder={'Enter your medical aid number'}
                        keyboardType='numeric'
                        ref={hooks.medicalAidNumberControlRef}
                    />
                </View>
                <View style={Object.assign({}, styles.formGroup, { position: 'relative', zIndex: 1 })}>
                    <BodyRegular style={styles.fieldLabel}>Relationship *</BodyRegular>
                    <SelectInputFormControl
                        isRequired={true} inputFieldStyle={styles.textInput}
                        useShadow={false}
                        options={hooks.medicalAidRelationshipOptions}
                        ref={hooks.meicalAidRelationshipControlRef}
                    />
                </View>
                <View style={styles.formGroup}>
                    <BodyRegular style={styles.fieldLabel}>Dependant Code *</BodyRegular>
                    <NumberInputFormControl
                        keyboardType='numeric'
                        isRequired={true}
                        inputFieldStyle={styles.textInput}
                        useShadow={false}
                        placeholder={'Enter your dependant code'}
                        ref={hooks.dependentControlRef}
                    />
                </View>
                <View style={{ marginTop: 7 }}>
                    <TouchableOpacity style={styles.medicalAidCardImageUpload}
                        onPress={hooks.onUploadMedicalAidImagePress}>
                        <BodyButton style={styles.uploadButtonText}>{!hooks.medicalAidCardImageUri.substring(hooks.medicalAidCardImageUri.lastIndexOf("/")).replace('/', '') ? 'Image of medical aid card' : hooks.medicalAidCardImageUri.substring(hooks.medicalAidCardImageUri.lastIndexOf("/")).replace('/', '')}</BodyButton>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.medicalAidCardImageUpload}
                        onPress={hooks.onUploadIdentityDocumentPress}
                    >
                        <BodyButton style={styles.uploadButtonText}>{!hooks.identityDocumentImageUri.substring(hooks.identityDocumentImageUri.lastIndexOf("/")).replace('/', '') ? 'Upload Image of ID card' : hooks.identityDocumentImageUri.substring(hooks.identityDocumentImageUri.lastIndexOf("/")).replace('/', '')}</BodyButton>
                    </TouchableOpacity>
                </View>
            </View>
            <RoundedButton
                style={styles.addMedicalAidAccountbutton}
                titleColor={White}
                title={Strings.Add_new_medical_aid_account}
                onPress={hooks.onSetupMedicalAidPress}
            ></RoundedButton>
        </ScrollView>
    </View>
}

interface FileContext {
    fileUri: string,
    fileBase64?: string
}
interface Props {
    navigation: AccountNavigationProp<Routes.AddMedicalAidAccount>;
    route: AccountNavigationRouteProp<Routes.AddMedicalAidAccount>;
}

function useAddMedicalAidAccountHooks(props: Props) {

    const configureNavigationBar = (navigation: AccountNavigationProp<Routes.AddMedicalAidAccount>) => {
        navigation.setOptions({
            title: Strings.Add_new_medical_aid,
            header: (stackHeaderProps: StackHeaderProps) => {
                return <CommonStackHeader {...stackHeaderProps}
                    style={Object.assign({}, styles.navigationBar, stackHeaderProps.options.headerStyle)}
                    onBackButtonPress={() => {
                        if (stackHeaderProps.navigation.canGoBack()) {
                            stackHeaderProps.navigation.goBack();
                        } else {
                            // navigation.goBack();
                        }
                    }}
                />
            }
        });
    };

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            configureNavigationBar(props.navigation);
        });

        return unsubscribe;
    });

    const [medicalAidRelationshipOptions, _] = useState<SelectFieldModel[]>(getMedicalAidRelationshipOptions());
    const { openSupportedMediaOptionsAsync, openImagePickerAsync, openCameraAsync } = useMediaController();
    const [medicalAidCardFileContext, setMedicalAidCardFileContext] = useState<FileContext>({ fileUri: "" });
    const [identityDocumentFileContext, setIdentityDocumentFileContext] = useState<FileContext>({ fileUri: "" });
    const [isMedicalAidOptionsVisible, setIsMedicalAidOptionsVisible] = useState<boolean>(false);
    const [isMedicalAidRelationshipOptionsVisible, setIsMedicalAidRelationshipOptionsVisible] = useState<boolean>(false);
    const [medicalAidScheme, setMedicalAidScheme] = useState<string | undefined>();
    const [selectedMedicalAidScheme, setSelectedMedicalAidScheme] = useState<MedialAidItemModel | undefined>();
    const [medicalAidPlan, setMedicalAidPlan] = useState<string | undefined>();
    const [isMedicalAidSchemeOptionsVisible, setIsMedicalAidSchemeOptionsVisible] = useState<boolean>(false);
    const [medicalAidSchemesFiltered, setMedicalAidSchemesFiltered] = useState<MedialAidItemModel[]>([]);
    const [isMedicalAidPlanOptionsVisible, setIsMedicalAidPlanOptionsVisible] = useState<boolean>(false);
    const [medicalAidPlansFiltered, setMedicalAidPlansFiltered] = useState<MedicalAidPlanModel[]>([]);
    const [medicalAidSchemes, setMedicalAidSchemes] = useState<MedialAidItemModel[]>();
    const [selectedMedicalAidPlan, setSelectedMedicalAidPlan] = useState<MedicalAidPlanModel | undefined>();
    const [medicalAidName, setMedicalAidName,] = useState<string>();
    const [showNewMedicalAidAccountComplete, setShowNewMedicalAidAccountComplete] = useState<Boolean>(false);
    const [medicalAidNameOptions, setMedicalAidNameOptions] = useState<MedialAidItemModel[]>([]);

    const medicalAidNameControlRef = useRef<TextInputFormControlRef>(null);
    const medicalAidPlanControlRef = useRef<TextInputFormControlRef>(null);
    const medicalAidNumberControlRef = useRef<TextInputFormControlRef>(null);
    const meicalAidRelationshipControlRef = useRef<SelectInputFormControlRef>(null);
    const dependentControlRef = useRef<TextInputFormControlRef>(null);

    const isFormValid = (): boolean => {
        var _isFormValid = true;
        if (!medicalAidNameControlRef.current?.validate()) _isFormValid = false;
        if (!medicalAidPlanControlRef.current?.validate()) _isFormValid = false;
        if (!medicalAidNumberControlRef.current?.validate()) _isFormValid = false;
        if (!meicalAidRelationshipControlRef.current?.validate()) _isFormValid = false;
        if (!dependentControlRef.current?.validate()) _isFormValid = false;
        if (isMedicalAidCardImageEmpty() || isIdentityDocumentImageEmpty()) _isFormValid = false;
        return _isFormValid;
    }

    const onMedicalAidSchemeTermChangeHandler = useState(new Subject<string | undefined>())[0];
    const onMedicalAidPlanTermChangeHandler = useState(new Subject<{ searchTerm: string, selectedMedicalAidScheme: MedialAidItemModel } | undefined>())[0];

    const onMedicalAidSchemeTermChange = (text: string | undefined) => {
        setMedicalAidScheme(text);
        onMedicalAidSchemeTermChangeHandler.next(text);
    };

    const onMedicalAidPlanTermChange = (text: string | undefined) => {
        if (!selectedMedicalAidScheme) return;

        setMedicalAidPlan(text);
        onMedicalAidPlanTermChangeHandler.next({
            searchTerm: text ?? "",
            selectedMedicalAidScheme: selectedMedicalAidScheme
        });
    };

    useEffect(() => {
        const medicalAidSchemeTermChangeHandlerSubscription = onMedicalAidSchemeTermChangeHandler.asObservable().pipe(
            debounceTime(300)
        ).subscribe(async value => {
            if (value == undefined) return;

            fetchMedicalAidSchemesIfNeededAsync().then(_medicalAidSchemes => {
                setIsMedicalAidSchemeOptionsVisible(true);
                setMedicalAidSchemesFiltered((_medicalAidSchemes ?? []).filter(medicalAidScheme => medicalAidScheme.name.toLowerCase().includes(value.toLowerCase())));
            });
        });

        const medicalAidPlanTermChangeHandler = onMedicalAidPlanTermChangeHandler.asObservable().pipe(
            debounceTime(300)
        ).subscribe(async value => {

            setIsMedicalAidPlanOptionsVisible(true);
            setMedicalAidPlansFiltered((value?.selectedMedicalAidScheme?.plans ?? []).filter(medicalAidPlan => medicalAidPlan.name.toLowerCase().includes(value?.searchTerm.toLowerCase() ?? "")));
        });

        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        return () => {
            medicalAidSchemeTermChangeHandlerSubscription.unsubscribe();
            medicalAidPlanTermChangeHandler.unsubscribe();
        };
    }, []);

    const fetchMedicalAidSchemesIfNeededAsync = async () => {
        if (medicalAidSchemes === undefined) {
            const response = await medicalAidService.fetchMedicalAidSchemesAsync();
            setMedicalAidSchemes(response.items);

            return Promise.resolve(response.items);
        }

        return Promise.resolve(medicalAidSchemes);
    }

    function getMedicalAidOptions(): SelectFieldModel[] {
        return Object.values(MedicalAidType).map(medicalAidType => { return { label: medicalAidType.toString(), value: medicalAidType.toString() } })
    }

    const onUploadMedicalAidImagePress = () => {
        openSupportedMediaOptionsAsync({
            onTakePhotoPress: () => { openCameraAsync((uri, base64) => setMedicalAidCardFileContext({ fileUri: uri, fileBase64: base64 })) },
            onChoosePhotoPress: () => { openImagePickerAsync((uri, base64) => setMedicalAidCardFileContext({ fileUri: uri, fileBase64: base64 })) }
        });
    }

    const onUploadIdentityDocumentPress = () => {
        openSupportedMediaOptionsAsync({
            onTakePhotoPress: () => { openCameraAsync((uri, base64) => setIdentityDocumentFileContext({ fileUri: uri, fileBase64: base64 })) },
            onChoosePhotoPress: () => { openImagePickerAsync((uri, base64) => setIdentityDocumentFileContext({ fileUri: uri, fileBase64: base64 })) }
        });
    }

    async function onSetupMedicalAidPress() {
        if (!isFormValid()) return;

        const medicalAidCardUploadResponse = await uploadMedicalAidCardDocumentAsync().catch(e => {
            console.error(e);
            return null;
        });

        if (medicalAidCardUploadResponse === null) return;

        const medicalAidId = selectedMedicalAidScheme!.medicalAidId;
        const medicalAidPlanId = selectedMedicalAidPlan!.medicalAidPlanId;
        const medicalAidNumber = medicalAidNumberControlRef.current?.getValue()!;
        const relationship = meicalAidRelationshipControlRef.current?.getValue()!;
        const dependentCode = dependentControlRef.current?.getValue()!;

        const medicalAidCardFileName = medicalAidCardUploadResponse.document.fileName;
        const medicalAidCardS3Bucket = medicalAidCardUploadResponse.document.bucket;
        const medicalAidCardS3ObjectKey = medicalAidCardUploadResponse.document.key;

        medicalAidService.createMedicalAidInfo(medicalAidId, medicalAidPlanId, medicalAidNumber, relationship, parseInt(dependentCode),
            medicalAidCardFileName,
            medicalAidCardS3Bucket,
            medicalAidCardS3ObjectKey).then(() => setShowNewMedicalAidAccountComplete(true)).catch(e => {
                Alert.alert('An unhandled error occured.');
                console.error(e)
                console.log("medicalAidServiceSection")
            })
    }

    const uploadMedicalAidCardDocumentAsync = async (): Promise<UploadDocumentInfoModel> => {
        const medicalAidCardFile = await commonFileUpload.makeCommonFileAsync(medicalAidCardFileContext.fileUri, medicalAidCardFileContext.fileBase64);

        const medicalAidCardUploadDocumentInfo = await mediaService.makeUploadDocumentInfoRequestAsync<UploadDocumentInfoModel>(
            medicalAidCardFile.blob.data.name,
            medicalAidCardFile.contentType,
            SupportedMediaType.MedicalAid);

        const buffer = Buffer.from(medicalAidCardFileContext.fileBase64!, 'base64');

        await imageService.uploadS3ImageAsync(medicalAidCardUploadDocumentInfo.uploadUrl, medicalAidCardFile.contentType, buffer.buffer);

        return Promise.resolve(medicalAidCardUploadDocumentInfo);
    }

    useEffect(() => {
        setMedicalAidPlansFiltered(selectedMedicalAidScheme?.plans ?? []);
        setSelectedMedicalAidPlan(undefined);
        setMedicalAidPlan("");
    }, [selectedMedicalAidScheme]);

    const filterData = (query: any) => {
        const filteredData = medicalAidNameOptions.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setMedicalAidNameOptions(filteredData)
    };

    function getMedicalAidRelationshipOptions(): SelectFieldModel[] {
        return Object.values(MedicalAidRelationshipType).map(type => { return { label: type.toString(), value: type.toString() } })
    };

    const onUploadIdentityDocumentButtonPress = () => {
        openSupportedMediaOptionsAsync({
            onTakePhotoPress: () => { openCameraAsync((uri, base64) => setIdentityDocumentFileContext({ fileUri: uri, fileBase64: base64 })) },
            onChoosePhotoPress: () => { openImagePickerAsync((uri, base64) => setIdentityDocumentFileContext({ fileUri: uri, fileBase64: base64 })) }
        });
    };

    const isIdentityDocumentImageEmpty = (): boolean => {
        return identityDocumentFileContext.fileUri === "";
    }

    const onUploadMedicalAidImageButtonPress = () => {
        openSupportedMediaOptionsAsync({
            onTakePhotoPress: () => { openCameraAsync((uri, base64) => setMedicalAidCardFileContext({ fileUri: uri, fileBase64: base64 })) },
            onChoosePhotoPress: () => { openImagePickerAsync((uri, base64) => setMedicalAidCardFileContext({ fileUri: uri, fileBase64: base64 })) }
        });
    };

    const isMedicalAidCardImageEmpty = (): boolean => {
        return medicalAidCardFileContext.fileUri === "";
    };

    return {

        //functions
        isFormValid,
        medicalAidNameOptions,
        filterData,
        medicalAidRelationshipOptions,
        isMedicalAidOptionsVisible, setIsMedicalAidOptionsVisible,
        isMedicalAidRelationshipOptionsVisible, setIsMedicalAidRelationshipOptionsVisible,
        medicalAidCardImageUri: !isMedicalAidCardImageEmpty() ? medicalAidCardFileContext.fileUri : "",
        identityDocumentImageUri: !isIdentityDocumentImageEmpty() ? identityDocumentFileContext.fileUri : "",
        medicalAidName, setMedicalAidName,
        showNewMedicalAidAccountComplete, setShowNewMedicalAidAccountComplete,
        onMedicalAidSchemeTermChange,
        onUploadMedicalAidImageButtonPress,
        onUploadIdentityDocumentButtonPress,
        onSetupMedicalAidPress,
        setIsMedicalAidSchemeOptionsVisible, isMedicalAidSchemeOptionsVisible,
        getMedicalAidOptions,
        medicalAidScheme, setMedicalAidScheme,
        medicalAidSchemes,
        selectedMedicalAidScheme, setSelectedMedicalAidScheme,
        medicalAidSchemesFiltered,
        onUploadMedicalAidImagePress, onUploadIdentityDocumentPress,

        medicalAidPlan, setMedicalAidPlan,
        selectedMedicalAidPlan, setSelectedMedicalAidPlan,
        medicalAidPlansFiltered,
        onMedicalAidPlanTermChange,
        isMedicalAidPlanOptionsVisible, setIsMedicalAidPlanOptionsVisible,

        //ref
        medicalAidNameControlRef,
        medicalAidPlanControlRef,
        medicalAidNumberControlRef,
        meicalAidRelationshipControlRef,
        dependentControlRef
    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: White
    },
    containerChild: {
        paddingTop: 24
    },
    rightItemStyle: {
        height: 37,
        width: 37,
        backgroundColor: PrimaryScooter,
        tintColor: White,
        borderRadius: 37 / 2
    },
    navigationBar: {
        backgroundColor: 'rgba(232, 247, 251, 1)',
        backButtonColor: PrimaryScooter
    },
    formGroup: {
        marginHorizontal: 30,
        marginBottom: 17
    },
    fieldLabel: {
        marginBottom: 9
    },
    textInput: {
        backgroundColor: NeutralGrey,
        elevation: 0
    },
    medicalAidCardImageUpload: {
        width: 330,
        height: 66,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: PrimaryScooter,
        alignSelf: 'center',
        marginBottom: 9
    },
    uploadButtonText: {
        paddingTop: 21,
        color: PrimaryScooter,
        marginHorizontal: 10
    },
    addMedicalAidAccountbutton: {
        marginRight: 30,
        marginLeft: 30,
        marginBottom: 17,
        marginTop: 22,
        backgroundColor: PrimaryScooter
    },
    medicalAidOptionsContainer: {
        position: 'absolute',
        backgroundColor: White,
        width: '100%',
        maxHeight: 250,
        shadowColor: '#000000',
        shadowRadius: 12,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.2,
        alignSelf: 'center',
        borderRadius: 12,
        marginTop: 8,
        elevation: 4,
        top: '100%',
        zIndex: 1
    },
    medicalAidOptionsFlatList: {
    }
})