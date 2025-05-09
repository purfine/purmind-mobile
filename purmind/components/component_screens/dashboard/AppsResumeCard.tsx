import UICard from "@/components/UI/card";
import WRText from "@/components/wrappers/Text";
import { AppUsage, calculatePercentage, DailyAnalysis, formatTime, getDailyAnalysisData, initializeDailyAnalysisData } from "@/services/appResumeService";
import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import UIDivider from "@/components/UI/divider";
import UIIcon from "@/components/UI/icon";
import { useAppTheme } from "@/context/ThemeContext";

export default function AppResumeCard() {
    const { theme } = useAppTheme();

    // Initialize with the actual data instead of empty data
    const [appAnalysis, setAppAnalysis] = useState<DailyAnalysis>(getDailyAnalysisData());
    const [showAllApps, setShowAllApps] = useState<boolean>(false);
    
    // This useEffect is no longer needed since we're initializing with the data
    // But we'll keep it for debugging purposes
    useEffect(() => {
        console.log('App usages length in useEffect:', appAnalysis.appUsages.length);
    }, [])

    const styles = StyleSheet.create({
        header: {
            marginTop: 10
        },
        row: {
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8
        },
        leftGroup: {
            flexDirection: 'row',
            gap: 8
        },
        listContainer: {
            maxHeight: 300,
        },
        appItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        appName: {
            fontSize: 16,
            fontWeight: 'bold',
            flex: 2,
        },
        appDuration: {
            fontSize: 14,
            flex: 1,
            textAlign: 'right',
            marginRight: 16,
        },
        appCategory: {
            fontSize: 14,
            flex: 1,
            textAlign: 'right',
            color: '#666',
        },
        showMoreButton: {
            alignSelf: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20,
            marginTop: 10,
            marginBottom: 10,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.5,
        },
        showMoreText: {
            fontSize: 18,
            fontWeight: 'bold',
        }
    });

    const renderAppItem = ({ item }: { item: AppUsage }) => (
        <View style={styles.appItem}>
            <WRText style={styles.appName}>{item.appName}</WRText>
            <WRText style={styles.appDuration}>{formatTime(item.duration)}</WRText>
            <WRText style={styles.appCategory}>
                {item.category}
            </WRText>
        </View>
    );

    return (
        <UICard 
            style={{marginTop: 20}}
            fullWidth={true}
            activeAccordion={true}
            accordionTitle="Análise dos Apps"
            accordionBeOpenDefault={true}
        >
            <ScrollView>
                {/** Header */}
                <View style={styles.header}>
                    <View style={styles.row}>
                        {/** Header - Left */}
                        <View style={styles.leftGroup}>
                            <UIIcon 
                                name="partly-sunny"
                                withBackground
                                size={17}
                                backgroundSize={32}
                            />
                            <WRText style={{ fontWeight: 'bold'}}>Tempo off-line</WRText>
                        </View>
                        {/** Header - Right */}
                        <WRText style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                            {formatTime(appAnalysis.offlineTime)}
                        </WRText>
                    </View>
                    <View style={styles.row}>
                        <WRText style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                            {calculatePercentage(appAnalysis.offlineTime, 86400)}% do teu dia
                        </WRText>
                    </View>
                </View>

                {/** Divider */}
                <UIDivider />

                {/** Apps Analysis */}
                <View>
                    {/* App list container with fixed height */}
                    <View style={[styles.listContainer, {maxHeight: 350}]}>
                        {/* Display only first 7 apps or all apps based on showAllApps state */}
                        {(showAllApps ? appAnalysis.appUsages : appAnalysis.appUsages.slice(0, 7)).map((item) => (
                            <View key={item.id}>
                                {renderAppItem({ item })}
                            </View>
                        ))}
                    </View>
                    
                    {/* Show more button - completely separate from the list */}

                    <View style={{alignItems: 'center', marginTop: 10}}>
                        <UIIcon 
                            name="ellipsis-horizontal"
                            size={28}
                            color={theme.colors.text}
                            onPress={() => {
                                console.log('Show more button pressed');
                                setShowAllApps(!showAllApps);
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </UICard>
    )
}