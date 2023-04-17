import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryScooter, White } from "../../../Colors";
import RoundedButton from "../../../components/button/RoundedButton";
import HeadingH4 from "../../../components/text/HeadingH4";
import { AuthBg, CheckGreenOval, FilePlusRightClippedISOColor } from "../../../Images";
import { appNavigationRef } from "../../../navigation/AppNavigation";
import { AppNavigationProp, AppRoutes } from "../../../navigation/AppStackParams";
import { Strings } from "../../../Strings";
import { CalculateHeightFromDesigns, CalculateWidthFromDesigns } from "../../../Utils";

export default function MedicalAidSetupComplete() {

    const hooks = useMedicalAidSetupCompleteHook();

    return <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.imagesContainer}>
            <Image style={styles.folderImage} source={FilePlusRightClippedISOColor()} />
            <Image style={styles.checkImage} source={CheckGreenOval()} />
        </View>
        <HeadingH4 style={styles.SuccessText}>{Strings.medical_aid_success_title}</HeadingH4>

        <RoundedButton
            title={Strings.go_to_home_page}
            titleColor={White} style={styles.completeMedicalAidButton}
            onPress={hooks.onGoToHomePagePress}
        />
    </SafeAreaView>
}

function useMedicalAidSetupCompleteHook() {

    const onGoToHomePagePress = () => {
        appNavigationRef.current?.navigate(AppRoutes.MainNavigation);
    }

    return {
        onGoToHomePagePress
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imagesContainer: {
        width: CalculateWidthFromDesigns(197, 330),
        height: CalculateHeightFromDesigns(359, 624),
        maxWidth: 197,
        maxHeight: 359,
        marginLeft: 38
    },
    folderImage: {
        resizeMode: 'contain',
        flex: 1,
        height: undefined,
        width: undefined
    },
    checkImage: {
        width: 72,
        height: 72,
        position: 'absolute',
        right: '-5%',
        bottom: '25%'
    },
    SuccessText: {
        textAlign: 'right',
        marginRight: 29
    },
    completeMedicalAidButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: PrimaryScooter,
        marginHorizontal: 32,
        marginBottom: 34
    }
})