import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from "react";
import { Alert, Button, FlatList, Image, ImageBackground, InputAccessoryView, Keyboard, KeyboardAvoidingView, LogBox, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PrimaryScooter, PrimaryScooterTint, SecondaryGeraldine, White } from '../../../Colors';
import AlternativeAuthOption from '../../../components/AlternativeAuthOption';
import RoundedButton from '../../../components/button/RoundedButton';
import SelectInputFormControl, { SelectInputFormControlRef } from '../../../components/input/SelectInputFormControl';
import TextInputFormControl, { TextInputFormControlRef } from '../../../components/input/TextInputFormControl';
import HeadingH4 from '../../../components/text/HeadingH4';
import { CloudUploadOutline } from '../../../Icons';
import { AuthBg, Logo } from '../../../Images';
import { appNavigationRef } from '../../../navigation/AppNavigation';
import { AppRoutes } from '../../../navigation/AppStackParams';
import { RegisterNavigationProp, RegisterRoutes } from '../../../navigation/RegisterStackParams';
import { Strings } from '../../../Strings';
import { CalculateHeightFromDesigns } from '../../../Utils';
import useMediaController from '../../../hooks/media.controller.hook';
import BodyButton from '../../../components/text/BodyButton';
import { SelectFieldModel } from '../../../models/SelectFieldModel';
import { MedicalAidRelationshipType } from '../../../enums/MedicalAidRelationshipType';
import { commonFileUpload } from '../../../domain/CommonFileUpload';
import BodySmall from '../../../components/text/BodySmall';
import { medicalAidService } from '../../../services/MedicalAidService';
import { MedialAidItemModel } from '../../../models/MedialAidItemModel';
import { MedicalAidType } from '../../../enums/MedicalAidType';
import { debounceTime, Subject } from 'rxjs';
import NumberInputFormControl from '../../../components/input/NumberInputFormControl';
import { mediaService } from '../../../services/MediaService';
import { UploadDocumentInfoModel } from '../../../models/UploadDocumentInfoModel';
import { SupportedMediaType } from '../../../enums/SupportedMediaType';
import { imageService } from '../../../services/ImageService';
import { Buffer } from 'buffer';
import { MedicalAidPlanModel } from '../../../models/MedicalAidPlanModel';
import CommonLoader from '../../../components/common/CommonLoader';

function SetupMyMedicalAidAccountController() {

    const navigation = useNavigation<RegisterNavigationProp<RegisterRoutes.SetupMyMedicalAidAccount>>();
    const [medicalAidCardFileContext, setMedicalAidCardFileContext] = useState<FileContext>({ fileUri: "" });
    const [identityDocumentFileContext, setIdentityDocumentFileContext] = useState<FileContext>({ fileUri: "" });
    const [medicalAidRelationshipOptions, _] = useState<SelectFieldModel[]>(getMedicalAidRelationshipOptions());
    const [isAllFieldsFilled, setIsAllFieldsFilled] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [isMedicalAidSchemeOptionsVisible, setIsMedicalAidSchemeOptionsVisible] = useState<boolean>(false);
    const [medicalAidSchemes, setMedicalAidSchemes] = useState<MedialAidItemModel[]>();

    const [isMedicalAidPlanOptionsVisible, setIsMedicalAidPlanOptionsVisible] = useState<boolean>(false);
    const [medicalAidPlansFiltered, setMedicalAidPlansFiltered] = useState<MedicalAidPlanModel[]>([]);

    const [medicalAidScheme, setMedicalAidScheme] = useState<string | undefined>();
    const [selectedMedicalAidScheme, setSelectedMedicalAidScheme] = useState<MedialAidItemModel | undefined>();

    const [medicalAidPlan, setMedicalAidPlan] = useState<string | undefined>();
    const [selectedMedicalAidPlan, setSelectedMedicalAidPlan] = useState<MedicalAidPlanModel | undefined>();

    const medicalAidNameControlRef = useRef<TextInputFormControlRef>(null);
    const medicalAidPlanControlRef = useRef<TextInputFormControlRef>(null);
    const medicalAidNumberControlRef = useRef<TextInputFormControlRef>(null);
    const meicalAidRelationshipControlRef = useRef<SelectInputFormControlRef>(null);
    const dependentControlRef = useRef<TextInputFormControlRef>(null);

    const { openSupportedMediaOptionsAsync, openImagePickerAsync, openCameraAsync } = useMediaController();

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
            if (value == undefined || value == "") {
                setIsMedicalAidSchemeOptionsVisible(false);
                return;
            };

            medicalAidService.searchMedicalAidSchemesAsync(value).then(result => {
                setMedicalAidSchemes(result.items);
                setIsMedicalAidSchemeOptionsVisible(true);
            });
        });

        const medicalAidPlanTermChangeHandler = onMedicalAidPlanTermChangeHandler.asObservable().pipe(
            debounceTime(300)
        ).subscribe(async value => {
            if (value == undefined || value.searchTerm == "") {
                setIsMedicalAidSchemeOptionsVisible(false);
                return;
            };

            setIsMedicalAidPlanOptionsVisible(true);
            setMedicalAidPlansFiltered((value?.selectedMedicalAidScheme?.plans ?? []).filter(medicalAidPlan => medicalAidPlan.name.toLowerCase().includes(value?.searchTerm.toLowerCase() ?? "")));
        });

        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        return () => {
            medicalAidSchemeTermChangeHandlerSubscription.unsubscribe();
            medicalAidPlanTermChangeHandler.unsubscribe();
        };
    }, []);

    useEffect(() => {
        setMedicalAidPlansFiltered(selectedMedicalAidScheme?.plans ?? []);
        setSelectedMedicalAidPlan(undefined);
        setMedicalAidPlan("");
    }, [selectedMedicalAidScheme]);

    const fetchMedicalAidSchemesIfNeededAsync = async () => {
        if (medicalAidSchemes === undefined) {
            const response = await medicalAidService.fetchMedicalAidSchemesAsync();
            setMedicalAidSchemes(response.items);

            return Promise.resolve(response.items);
        }

        return Promise.resolve(medicalAidSchemes);
    }

    const isMedicalAidCardImageEmpty = (): boolean => {
        return medicalAidCardFileContext.fileUri == undefined || medicalAidCardFileContext.fileUri === "";
    }

    const isIdentityDocumentImageEmpty = (): boolean => {
        return identityDocumentFileContext.fileUri === "";
    }

    function getMedicalAidOptions(): SelectFieldModel[] {
        return Object.values(MedicalAidType).map(medicalAidType => { return { label: medicalAidType.toString(), value: medicalAidType.toString() } })
    }

    const onSkipForNowPressed = () => {
        appNavigationRef.current?.navigate(AppRoutes.MainNavigation);

        appNavigationRef.current?.reset({
            index: 0,
            routes: [{ name: AppRoutes.MainNavigation }],
        });
    };

    const onUploadMedicalAidImageButtonPress = () => {
        openSupportedMediaOptionsAsync({
            onTakePhotoPress: () => { openCameraAsync((uri, base64) => setMedicalAidCardFileContext({ fileUri: uri, fileBase64: base64 })) },
            onChoosePhotoPress: () => { openImagePickerAsync((uri, base64) => setMedicalAidCardFileContext({ fileUri: uri, fileBase64: base64 })) }
        });
    }

    const onUploadIdentityDocumentButtonPress = () => {
        openSupportedMediaOptionsAsync({
            onTakePhotoPress: () => { openCameraAsync((uri, base64) => setIdentityDocumentFileContext({ fileUri: uri, fileBase64: base64 })) },
            onChoosePhotoPress: () => { openImagePickerAsync((uri, base64) => setIdentityDocumentFileContext({ fileUri: uri, fileBase64: base64 })) }
        });
    }

    function getMedicalAidRelationshipOptions(): SelectFieldModel[] {
        return Object.values(MedicalAidRelationshipType).map(type => { return { label: type.toString(), value: type.toString() } })
    }

    const isFormValid = (): boolean => {
        var _isFormValid = true;
        if (!medicalAidNameControlRef.current?.validate()) _isFormValid = false;
        if (!medicalAidPlanControlRef.current?.validate()) _isFormValid = false;
        if (!medicalAidNumberControlRef.current?.validate()) _isFormValid = false;

        if (!meicalAidRelationshipControlRef.current?.validate()) _isFormValid = false;
        if (!dependentControlRef.current?.validate()) _isFormValid = false;

        // if (isMedicalAidCardImageEmpty() || isIdentityDocumentImageEmpty()) _isFormValid = false;

        // if (selectedMedicalAidScheme == undefined || selectedMedicalAidPlan == undefined) _isFormValid = false;
        if (isMedicalAidCardImageEmpty()) _isFormValid = false;

        return _isFormValid;

    }

    const checkFieldsFilled = () => {
        const isMedicalAidNameFilled = !!medicalAidScheme;
        const isMedicalAidPlanFilled = !!selectedMedicalAidPlan;
        const isMedicalAidNumberFilled = !!medicalAidNumberControlRef.current?.getValue;
        const isMedicalAidRelationshipFilled = !!meicalAidRelationshipControlRef.current?.getValue;
        const isDependentCodeFilled = !!dependentControlRef.current?.getValue;
        const isMedicalAidCardFilled = !isMedicalAidCardImageEmpty();

        setIsAllFieldsFilled(
            isMedicalAidNameFilled &&
            isMedicalAidPlanFilled &&
            isMedicalAidNumberFilled &&
            isMedicalAidRelationshipFilled &&
            isDependentCodeFilled &&
            isMedicalAidCardFilled
        );
    };

    async function onSetupMedicalAidPress() {
        if (!isFormValid()) return;

        setIsLoading(true);

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

        medicalAidService.createMedicalAidInfo(
            medicalAidId,
            medicalAidPlanId,
            medicalAidNumber,
            relationship,
            parseInt(dependentCode),
            medicalAidCardFileName,
            medicalAidCardS3Bucket,
            medicalAidCardS3ObjectKey)

            .then(() => navigation.navigate(RegisterRoutes.MedicalAidSetupComplete))
            .catch(e => {
                setIsLoading(false);
                Alert.alert("An unhandled error occured.");
                console.error(e);
            });

        setIsLoading(false)
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

    const uploadIdentityDocumentAsync = async (): Promise<UploadDocumentInfoModel> => {
        const identityDocumentFile = await commonFileUpload.makeCommonFileAsync(identityDocumentFileContext.fileUri, identityDocumentFileContext.fileBase64);

        const identityDocumentUploadDocumentInfo = await mediaService.makeUploadDocumentInfoRequestAsync<UploadDocumentInfoModel>(
            identityDocumentFile.blob.data.name,
            identityDocumentFile.contentType,
            SupportedMediaType.MedicalAid);

        const buffer = Buffer.from(identityDocumentFileContext.fileBase64!, 'base64');

        await imageService.uploadS3ImageAsync(identityDocumentUploadDocumentInfo.uploadUrl, identityDocumentFile.contentType, buffer.buffer);

        return Promise.resolve(identityDocumentUploadDocumentInfo);
    }

    return {

        //functions
        onUploadMedicalAidImageButtonPress,
        onUploadIdentityDocumentButtonPress,
        onSkipForNowPressed,
        isMedicalAidCardImageEmpty,
        isIdentityDocumentImageEmpty,
        medicalAidRelationshipOptions,
        medicalAidCardImageUri: !isMedicalAidCardImageEmpty() ? medicalAidCardFileContext.fileUri : "",
        identityDocumentImageUri: !isIdentityDocumentImageEmpty() ? identityDocumentFileContext.fileUri : "",
        onSetupMedicalAidPress,
        setIsMedicalAidSchemeOptionsVisible, isMedicalAidSchemeOptionsVisible,
        getMedicalAidOptions,
        onMedicalAidSchemeTermChange,
        medicalAidScheme, setMedicalAidScheme,
        medicalAidSchemes,
        selectedMedicalAidScheme, setSelectedMedicalAidScheme,
        checkFieldsFilled, isAllFieldsFilled,


        medicalAidPlan, setMedicalAidPlan,
        selectedMedicalAidPlan, setSelectedMedicalAidPlan,
        medicalAidPlansFiltered,
        onMedicalAidPlanTermChange,
        isMedicalAidPlanOptionsVisible, setIsMedicalAidPlanOptionsVisible,
        isLoading, setIsLoading,
        isFormValid,

        //refs
        medicalAidNameControlRef,
        medicalAidPlanControlRef,
        medicalAidNumberControlRef,
        meicalAidRelationshipControlRef,
        dependentControlRef
    }
}

export default function SetupMyMedicalAidAccount() {

    const controller = SetupMyMedicalAidAccountController();

    return <ImageBackground source={AuthBg()} style={styles.container}>
        <CommonLoader visible={controller.isLoading} />

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={'position'}>
            <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="none">
                <Image source={Logo()} style={styles.logoImage} />
                <HeadingH4 style={styles.headingText}>{Strings.setup_medical_aid_account_title}</HeadingH4>

                <AlternativeAuthOption style={{ ...styles.loginContainer, rightTextColor: SecondaryGeraldine }}
                    leftText={Strings.done_this_already}
                    rightText={Strings.skip_for_now}
                    onPress={controller.onSkipForNowPressed}
                />

                <View style={styles.inputGroup}>
                    <View style={{ position: 'relative', zIndex: 4 }}>
                        <TextInputFormControl
                            style={styles.formControl}
                            title={'Medical Aid Scheme'}
                            ref={controller.medicalAidNameControlRef}
                            onBlur={() => {
                                controller.setMedicalAidScheme(controller.selectedMedicalAidScheme?.name ?? "");
                                controller.setIsMedicalAidSchemeOptionsVisible(false);
                            }}
                            defaultValue={controller.medicalAidScheme}
                            onValueChange={value => controller.onMedicalAidSchemeTermChange(value)}
                            isRequired={true}
                        />

                        {controller.isMedicalAidSchemeOptionsVisible &&
                            <View style={styles.medicalAidOptionsContainer}>
                                <FlatList style={styles.medicalAidOptionsFlatList} data={controller.medicalAidSchemes} scrollEnabled={true}
                                    keyboardShouldPersistTaps='always'
                                    renderItem={(itemInfo) => {

                                        return <TouchableOpacity onPress={async () => {
                                            controller.setMedicalAidScheme(itemInfo.item.name);
                                            controller.setSelectedMedicalAidScheme(itemInfo.item);
                                            controller.setIsMedicalAidSchemeOptionsVisible(false);
                                        }}>
                                            <BodySmall style={{ padding: 16 }}>{itemInfo.item.name}</BodySmall>
                                        </TouchableOpacity>
                                    }}>
                                </FlatList>
                            </View>}
                    </View>

                    <View style={{ position: 'relative', zIndex: 3 }}>
                        <TextInputFormControl
                            style={styles.formControl}
                            title='Medical Aid Plan'
                            disabled={controller.selectedMedicalAidScheme == undefined}
                            isRequired={true}
                            ref={controller.medicalAidPlanControlRef}
                            onFocus={() => controller.setIsMedicalAidPlanOptionsVisible(true)}
                            onBlur={() => {
                                controller.setMedicalAidPlan(controller.selectedMedicalAidPlan?.name ?? "");
                                controller.setIsMedicalAidPlanOptionsVisible(false);
                            }}
                            defaultValue={controller.medicalAidPlan}
                            onValueChange={value => controller.onMedicalAidPlanTermChange(value)}
                        />

                        {controller.isMedicalAidPlanOptionsVisible &&
                            <View style={[styles.medicalAidOptionsContainer]}>
                                <FlatList style={styles.medicalAidOptionsFlatList} data={controller.medicalAidPlansFiltered} scrollEnabled={true}
                                    renderItem={(itemInfo) => {
                                        return <TouchableOpacity onPress={async () => {
                                            controller.setMedicalAidPlan(itemInfo.item.name);
                                            controller.setSelectedMedicalAidPlan(itemInfo.item);
                                            controller.setIsMedicalAidPlanOptionsVisible(false);
                                        }}>
                                            <BodySmall style={{ padding: 16 }}>{itemInfo.item.name}</BodySmall>
                                        </TouchableOpacity>
                                    }}>
                                </FlatList>
                            </View>}
                    </View>

                    <NumberInputFormControl style={styles.formControl} title='Medical Aid Number' isRequired={true}
                        placeholder='Medical Aid Number'
                        ref={controller.medicalAidNumberControlRef}
                        onValueChange={() => controller.checkFieldsFilled()}
                    />
                    <SelectInputFormControl title='Medical Aid Relationship' style={{ ...styles.formControl, zIndex: 2 }} isRequired={true}
                        placeholder='Relationship'
                        options={controller.medicalAidRelationshipOptions}
                        ref={controller.meicalAidRelationshipControlRef}
                        onValueChange={() => controller.checkFieldsFilled()}
                    />

                    <NumberInputFormControl style={styles.formControl} title='Dependant Code' isRequired={true}
                        placeholder='Dependant Code'
                        ref={controller.dependentControlRef}
                        onValueChange={() => controller.checkFieldsFilled()}
                    />
                    <>
                        <TouchableOpacity
                            style={Object.assign({}, styles.inputFieldOverlayButton, controller.isMedicalAidCardImageEmpty() ? {} : styles.replaceButton)}
                            onPress={controller.onUploadMedicalAidImageButtonPress}>
                            {!controller.isMedicalAidCardImageEmpty() && <BodyButton style={styles.replaceButtonTitle}>Replace</BodyButton>}
                        </TouchableOpacity>
                        <TextInputFormControl style={styles.formControl} title='Medical Aid Card' isRequired={true}
                            placeholder='Upload image of Medical Aid Card'
                            inlineImageRightSource={controller.isMedicalAidCardImageEmpty() ? CloudUploadOutline() : undefined}
                            editable={false}
                            inlineImageRightOnPress={controller.onUploadMedicalAidImageButtonPress}
                            defaultValue={controller.medicalAidCardImageUri.substring(controller.medicalAidCardImageUri.lastIndexOf("/")).replace('/', '')}
                        />
                    </>
                </View>

                <RoundedButton style={Object.assign({}, styles.setupMedicalAidButton, controller.isAllFieldsFilled || controller.isFormValid() ? { backgroundColor: PrimaryScooter } : { backgroundColor: PrimaryScooterTint })}

                    disabled={controller.isAllFieldsFilled}
                    // controller.isFormValid() ? {} : { backgroundColor: PrimaryScooterTint, }


                    title={Strings.setup_my_medical_aid}
                    titleColor={White}
                    onPress={controller.onSetupMedicalAidPress}
                />
            </ScrollView>
        </KeyboardAvoidingView>

    </ImageBackground>
}

interface FileContext {
    fileUri: string,
    fileBase64?: string
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logoImage: {
        resizeMode: 'contain',
        aspectRatio: 1,
        marginLeft: 45,
        alignSelf: 'flex-start',
        height: CalculateHeightFromDesigns(69),
        marginTop: CalculateHeightFromDesigns(98)
    },
    headingText: {
        textAlign: 'left',
        marginHorizontal: 42
    },

    loginContainer: {
        marginTop: CalculateHeightFromDesigns(19),
        marginLeft: 45
    },
    inputGroup: {
    },
    formControl: {
        marginTop: CalculateHeightFromDesigns(25),
        marginHorizontal: 24
    },
    setupMedicalAidButton: {
        backgroundColor: PrimaryScooter,
        marginHorizontal: 32,
        marginTop: CalculateHeightFromDesigns(70),
        marginBottom: 40

    },
    editButton: {
        marginRight: 20,
        width: 24,
        height: 24,
        alignSelf: 'center'
    },
    editButtonImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    inputFieldOverlayButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 55,
        zIndex: 1,
        marginHorizontal: 24
    },
    replaceButton: {
        backgroundColor: SecondaryGeraldine,
        borderRadius: 12,
        width: 74,
        left: undefined,
        right: 8,
        justifyContent: 'center'
    },
    replaceButtonTitle: {
        color: White,
        fontSize: 12
    },
    medicalAidOptionsContainer: {
        position: 'absolute',
        backgroundColor: White,
        width: '85%',
        maxHeight: 250,
        shadowColor: '#000000',
        shadowRadius: 12,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.2,
        alignSelf: 'center',
        borderRadius: 12,
        marginTop: 8,
        elevation: 4,
        top: '100%'
    },
    medicalAidOptionsFlatList: {

    }
});