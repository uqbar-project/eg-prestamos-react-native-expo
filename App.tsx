import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { StatusBar } from 'expo-status-bar'
import React, { ReactNode, useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import PrestamosScreen from './src/screens/PrestamosScreen'
import PrestamosService from './src/services/PrestamosService'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import NuevoPrestamoScreen from './src/screens/NuevoPrestamoScreen'
import ElegirContactoScreen from './src/screens/ElegirContactoScreen'
import Contacto from './src/domain/Contacto'
import { AppLoading } from 'expo'

export type RootStackParamList = {
    Prestamos: undefined
    NuevoPrestamo: undefined
    ElegirContacto: { seleccionarContacto: (contacto: Contacto) => void }
}

const Stack = createStackNavigator<RootStackParamList>()

async function precarga(): Promise<void> {
    /* Aca puedo precargar imagenes, videos, fuentes o inicializar datos */
    await PrestamosService.init()
}


export default function App(): ReactNode {
    const [ isReady, setReady ] = useState(false)
    if (!isReady) {
        return (
            <AppLoading
                startAsync={ precarga }
                onFinish={ () => setReady(true) }
                onError={ console.warn }
            />
        )
    }

    return (
        <SafeAreaProvider>
            <ActionSheetProvider>
                <NavigationContainer theme={ DarkTheme }>
                    <Stack.Navigator initialRouteName="Prestamos">
                        <Stack.Screen
                            name="Prestamos"
                            component={ PrestamosScreen }
                            options={ { title: 'Préstamos de libros' } } />
                        <Stack.Screen
                            name="NuevoPrestamo"
                            component={ NuevoPrestamoScreen }
                            options={ { title: 'Nuevo préstamo' } } />
                        <Stack.Screen
                            name="ElegirContacto"
                            component={ ElegirContactoScreen }
                            options={ { title: 'Elegir contacto' } } />
                    </Stack.Navigator>
                </NavigationContainer>
            </ActionSheetProvider>
            <StatusBar style="auto" />
        </SafeAreaProvider>
    )
}