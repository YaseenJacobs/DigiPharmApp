import React, { useState, useEffect } from 'react';
import { Alert, Image, Platform, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NeutralBlack80, NeutralWhite100, NeutralWhite400, PrimaryScooterShade, PrimaryScooterTint, SecondaryGeraldineShade, SecondaryGeraldineTint, White } from '../../Colors';
import { ChevronRight, Group } from '../../Icons';
import { SampleDiscoveryLogo, SampleLogo } from '../../Images';
import BodyMediumBold from '../text/BodyMediumBold';
import BodyTiny from '../text/BodyTiny';
import HeadingH6 from '../text/HeadingH6';
import { medicalAidService } from '../../services/MedicalAidService'
import { MedicalAidsModel } from '../../models/MedicalAidsModel';
import { MedicalAidModel } from '../../models/MedicalAidModel';
import { Strings } from '../../Strings';
import { MedicalAidType } from '../../enums/MedicalAidType';


export default function MedicalAccountInfomationCard() {

    const [medicalAid, setMedicalAid] = useState(null);

    useEffect(() => {
        fetch('https://api-staging.digipharm.store/medicalAids/my/medicalAids')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setMedicalAid(data);
            })
            .catch(error => {
                console.error(error);
                // handle the error here
            });
    }, []);

    return <View style={styles.container}>
        <View style={styles.headingTitle}>
            <Image source={Group()} style={styles.groupIcon} />
            <HeadingH6>Saved Medical Aids Accounts</HeadingH6>
        </View>

        <View style={styles.borderLine}></View>
        <View style={styles.medicalAidCard}>
            <Image source={SampleLogo()} style={styles.logo} />
            <View style={styles.cardDetails}>
                <BodyMediumBold style={styles.title}>{medicalAid ? medicalAid : ""}</BodyMediumBold>
                <View style={styles.containerCard}>
                    <View style={styles.planType}>
                        <BodyTiny style={{ color: PrimaryScooterShade }}>Hospital Plan</BodyTiny>
                    </View>
                    <View style={styles.medicalAidNumber}>
                        <BodyTiny style={{ color: SecondaryGeraldineShade }}>231DSAD32342</BodyTiny>
                    </View>
                </View>
            </View>
            <TouchableOpacity>
                <Image source={ChevronRight()} style={styles.headingIcon} />
            </TouchableOpacity>
        </View>


        <View style={styles.medicalAidCard}>
            <Image source={SampleDiscoveryLogo()} style={styles.logo} />
            <View style={styles.cardDetails}>
                <BodyMediumBold style={styles.title}>Discovery</BodyMediumBold>
                <View style={styles.containerCard}>
                    <View style={styles.planType}>
                        <BodyTiny style={{ color: PrimaryScooterShade }}>Maternity Benefit</BodyTiny>
                    </View>
                    <View style={styles.medicalAidNumber}>
                        <BodyTiny style={{ color: SecondaryGeraldineShade }}>231DSAD32342</BodyTiny>
                    </View>
                </View>
            </View>
            <TouchableOpacity>
                <Image source={ChevronRight()} style={styles.headingIcon} />
            </TouchableOpacity>
        </View>
    </View>
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 19,
    },
    headingTitle: {
        marginTop: 38,
        marginBottom: 19,
        alignItems: 'center',
        flexDirection: 'row'
    },
    groupIcon: {
        marginRight: 13,
        width: 24,
        height: 24
    },
    headingIcon: {
        width: 8,
        height: 13.29,
        marginRight: 14,
        color: NeutralBlack80
    },
    borderLine: {
        width: '100%',
        borderWidth: 0.4,
        backgroundColor: '#F4F4FA',
        marginBottom: 21
    },
    medicalAidCard: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: PrimaryScooterTint,
        borderRadius: 20,
        shadowColor: Platform.OS === 'ios' ? NeutralWhite100 : NeutralWhite400,
        height: 84,
        width: '100%',
        marginBottom: 15,
    },
    logo: {
        width: 72,
        height: 49,
        marginLeft: 18,
        marginRight: 12,
    },
    containerCard: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    cardDetails: {
        justifyContent: 'center',
        width: 192,
        height: 60,
        backgroundColor: White,
        borderRadius: 12
    },

    title: {
        marginLeft: 13,
        marginBottom: 2
    },
    planType: {
        borderRadius: 16,
        backgroundColor: PrimaryScooterTint,
        paddingHorizontal: 5,
        marginRight: 3,

    },
    medicalAidNumber: {
        width: undefined,
        borderRadius: 16,
        backgroundColor: SecondaryGeraldineTint,
        paddingHorizontal: 5,
        paddingTop: 1,
    },



})


