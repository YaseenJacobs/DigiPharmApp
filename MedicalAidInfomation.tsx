import { StackHeaderProps } from '@react-navigation/stack';
import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { PrimaryScooter, White } from '../../../Colors';
import RoundedButton from '../../../components/button/RoundedButton';
import CommonStackHeader from '../../../components/CommonStackHeader';
import MedicalAccountInfomationCard from '../../../components/medicalAid/MedicalAidAccountInfomationCard';
import { FileISOColor } from '../../../Images';
import { Strings } from '../../../Strings';
import { CalculateHeightFromDesigns, CalculateWidthFromDesigns } from '../../../Utils';
import { AccountNavigationProp, AccountNavigationRouteProp, AccountRoutes as Routes } from './AccountStackParams';
import useMedicalAidHooks from '../../../hooks/medical.aid.hooks';

interface Props {
    navigation: AccountNavigationProp<Routes.MedicalAidInfomation>,
    route: AccountNavigationRouteProp<Routes.MedicalAidInfomation>
}

export default function MedicalAidInfomation(props: Props) {

    const hooks = useMedicalAidHooks();

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            configureNavigationBar(props.navigation);
        });

        return unsubscribe;
    });

    const configureNavigationBar = (navigation: AccountNavigationProp<Routes.MedicalAidInfomation>) => {
        navigation.setOptions({
            title: Strings.Medical_Aid_Infomation,
            header: (stackHeaderProps: StackHeaderProps) => {
                return <CommonStackHeader {...stackHeaderProps}
                    style={Object.assign({}, styles.navigationBar, stackHeaderProps.options.headerStyle)}
                    rightItemImage={FileISOColor()}
                    rightItemStyle={styles.navBarFolderIcon}
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
    }

    return <ScrollView style={styles.container}>
        <View >
            <MedicalAccountInfomationCard></MedicalAccountInfomationCard>
        </View>
        <RoundedButton
            style={styles.addNewMedicalAidAccountbutton}
            titleColor={White}
            title={Strings.Plus_add_new_medical_aid_account}
            onPress={() => {
                props.navigation.navigate(Routes.AddMedicalAidAccount);
            }}
        ></RoundedButton>


    </ScrollView>

}

export function useMedicalAidInformationHooks() {
    return {

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: White
    },
    navigationBar: {
        backgroundColor: 'rgba(232, 247, 251, 1)',
        backButtonColor: PrimaryScooter
    },
    navBarFolderIcon: {
        width: CalculateWidthFromDesigns(47),
        height: CalculateHeightFromDesigns(47)
    },
    addNewMedicalAidAccountbutton: {

        marginRight: 30,
        marginLeft: 30,
        marginBottom: 17,
        marginTop: 22,
        backgroundColor: PrimaryScooter
    }
})