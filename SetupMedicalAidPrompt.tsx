import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { PrimaryScooter, SecondaryGeraldine, White } from '../../../Colors';
import RoundedButton from '../../../components/button/RoundedButton';
import HeadingH4 from '../../../components/text/HeadingH4';
import { AuthBg, FilePlusLeftClippedISOColor } from '../../../Images';
import { appNavigationRef } from '../../../navigation/AppNavigation';
import { AppRoutes } from '../../../navigation/AppStackParams';
import { RegisterNavigationProp, RegisterRoutes } from '../../../navigation/RegisterStackParams';
import { medicalAidService } from '../../../services/MedicalAidService';
import { Strings } from '../../../Strings';
import { CalculateHeightFromDesigns, CalculateWidthFromDesigns } from '../../../Utils';
import AccountNavigation from '../../main/account/AccountNavigation';
import { AccountNavigationProp, AccountRoutes as Routes } from '../../main/account/AccountStackParams';

export default function SetupMedicalAidPrompt() {

    const hooks = useSetupMedicalAidPromptHooks();

    return <ImageBackground source={AuthBg()} style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.folderImageContainer}>
                <Image style={styles.folderImage} source={FilePlusLeftClippedISOColor()} />
            </View>

            <HeadingH4 style={styles.promptText}>{Strings.register_medical_aid_prompt}</HeadingH4>

            <View style={styles.buttonsGroup}>
                <RoundedButton style={{ ...styles.button, backgroundColor: PrimaryScooter }}
                    title={Strings.setup_account}
                    titleColor={White}
                    onPress={hooks.onSetupMedicalAidAccountPress}
                />
                <RoundedButton title={Strings.not_now} titleColor={White}
                    style={{ ...styles.button, backgroundColor: SecondaryGeraldine }}
                    onPress={hooks.onNotNowPress}

                />
            </View>
        </SafeAreaView>
    </ImageBackground>
}

function useSetupMedicalAidPromptHooks() {
    const navigation = useNavigation<RegisterNavigationProp<RegisterRoutes.SetupMedicalAidPrompt>>();
    const route = useNavigation<AccountNavigationProp<Routes.AddMedicalAidAccount>>();


    const onSetupMedicalAidAccountPress = () => {
        navigation.navigate(RegisterRoutes.SetupMyMedicalAidAccount)
        // medicalAidService.fetchMedicalAidsAsync().then(response => {
        //     console.log(response);
        // }).catch(error => {
        //     console.error(error);
        // });
    }
    const onNotNowPress = () => {
        appNavigationRef.current?.navigate(AppRoutes.MainNavigation);

        appNavigationRef.current?.reset({
            index: 0,
            routes: [{ name: AppRoutes.MainNavigation }],
        });
    }


    return {
        onSetupMedicalAidAccountPress,
        onNotNowPress
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    folderImageContainer: {
        height: CalculateWidthFromDesigns(456),
        maxWidth: 456,
        maxHeight: 456
    },
    folderImage: {
        marginLeft: -CalculateWidthFromDesigns(80),
        flex: 1,
        width: undefined,
        height: undefined,
        resizeMode: 'contain'
    },
    promptText: {
        marginLeft: CalculateWidthFromDesigns(66),
        marginRight: CalculateWidthFromDesigns(44),
        textAlign: 'right',
        marginTop: -37
    },
    buttonsGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: CalculateWidthFromDesigns(34),
        marginRight: CalculateWidthFromDesigns(45),
        marginBottom: 7,
        marginTop: CalculateHeightFromDesigns(50)
    },
    button: {
        paddingHorizontal: 24
    }
});