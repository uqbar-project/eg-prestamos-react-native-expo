import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Main from './src/screens/Main'
import PrestamosService from './src/services/PrestamosService'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

const Stack = createStackNavigator()

export default function App(): JSX.Element {
    useEffect(() => {
        PrestamosService.init()
    }, [])
    return (
        <SafeAreaProvider>
            <ActionSheetProvider>
                <NavigationContainer theme={DarkTheme}>
                    <Stack.Navigator initialRouteName="Prestamos">
                        <Stack.Screen
                            name="Prestamos"
                            component={ Main }
                            options={ { title: 'Préstamos de libros' } } />
                    </Stack.Navigator>
                </NavigationContainer>
            </ActionSheetProvider>
            <StatusBar style="auto" />
        </SafeAreaProvider>
    )
}