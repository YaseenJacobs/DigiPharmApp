import React from 'react';
import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PrimaryScooter, White } from '../../../Colors';
import RoundedButton from '../../../components/button/RoundedButton';
import HeadingH4 from '../../../components/text/HeadingH4';
import { CloseIcon } from '../../../Icons';
import { CheckGreenOval, FilePlusRightClippedISOColor } from '../../../Images';
import { Strings } from '../../../Strings';
import { CalculateHeightFromDesigns, CalculateWidthFromDesigns } from '../../../Utils';
import { AccountNavigationProp, AccountNavigationRouteProp, AccountRoutes as Routes } from './AccountStackParams';

interface Props {
    navigation: AccountNavigationProp<Routes.NewMedicalAidSetupComplete>,
    route: AccountNavigationRouteProp<Routes.NewMedicalAidSetupComplete>
}

export default function NewMedicalAidSetupComplete(props: Props) {

    return <SafeAreaView style={{ flex: 1, backgroundColor: White }}>
        <View style={styles.imagesContainer}>
            <Image style={styles.folderImage} source={FilePlusRightClippedISOColor()} />
            <Image style={styles.checkImage} source={CheckGreenOval()} />
        </View>
        <HeadingH4 style={styles.SuccessText}>{Strings.new_medical_aid_setup_complete_title}</HeadingH4>

        <RoundedButton
            title={Strings.go_back_to_list}
            titleColor={White} style={styles.GoBackToListButton}
            onPress={() => {
                props.navigation.navigate(Routes.MedicalAidInfomation)
            }}
        />
    </SafeAreaView>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    CloseIcon: {
        marginTop: 21,
        marginRight: 23,
        width: 37,
        height: 37,
        alignSelf: 'flex-end'
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
        marginRight: 44
    },
    GoBackToListButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: PrimaryScooter,
        marginHorizontal: 32,
        marginBottom: 34
    }
})
