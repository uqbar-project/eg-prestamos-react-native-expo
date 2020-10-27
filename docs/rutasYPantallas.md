# Pantallas, stacks y rutas

En aplicaciones mobile es esencial tener multiples pantallas ya que no contamos con el espacio necesario de pantalla.

Se utiliza el termino "stack" para indicar que una pantalla es posicionada arriba de otra, utilizaremos esta tecnica cuando necesitemos abrir una pantalla secundaria.

En este caso usaremos una libreria dedicada a manejar las pantallas y el ruteo entre estas y para esto necesitamos las siguientes dependencias:

```console
expo install @react-navigation/native react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view @react-navigation/stack
```
Documentación: https://reactnavigation.org/docs/getting-started

En este caso definiremos las rutas en nuestro `App.tsx` que es nuestro componente de mayor nivel.

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import PrestamosScreen from './src/screens/PrestamosScreen'
import NuevoPrestamo from './src/screens/NuevoPrestamo'

export type RootStackParamList = {
    Prestamos: undefined
    NuevoPrestamo: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

export default function App(): ReactNode {
    return (
        <SafeAreaProvider>
            <NavigationContainer theme={DarkTheme}>
                <Stack.Navigator initialRouteName="Prestamos">
                    <Stack.Screen
                        name="Prestamos"
                        component={ PrestamosScreen }
                        options={ { title: 'Préstamos de libros' } } />
                    <Stack.Screen
                        name="NuevoPrestamo"
                        component={ NuevoPrestamo }
                        options={ { title: 'Nuevo préstamo' } } />
                </Stack.Navigator>
            </NavigationContainer>
            <StatusBar style="auto" />
        </SafeAreaProvider>
    )
}
```

El componente `SafeAreaProvider` es una vista desde la cual enviara a sus consumidores descendientes los valores necesarios para no superponerce con cualquiera de los elementos del sistema (barra de estado, muescas, etc.). [Mas información sobre SafeAreaProvider](https://reactnavigation.org/docs/handling-safe-area/).

El componente `NavigationContainer` es el responsable de manejar el estado de la app y conectar el componente de mayor nivel con las pantallas de la aplicación.

El metodo `createStackNavigator` provee una forma de transicionar entre pantallas, cada nueva pantalla a la que se navega es posicionada arriba en el "stack".

Cada pantalla se definira dentro del componente `Stack.Navigator` como un componente `Stack.Screen` en la cual definiremos el nombre de la ruta, que componente utilizara la pantalla y otras opciones especificas de la pantalla. [Mas información sobre StackNavigator](https://reactnavigation.org/docs/stack-navigator/).


Todas las pantallas tendran la prop `navigation` que podran utilizar para navegar de una pantalla a otra.

Asi definimos el tipo de prop en el componente que utilizara:
```tsx
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../App'

export default class PrestamosScreen extends PureComponent<PrestamosScreenProps, PrestamosScreenState> {
    ...
}

type PrestamosScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Prestamos'>
}
```

Ahora si para ir a una pantalla:
```tsx
props.navigation.push('Prestamos')
```
```tsx
props.navigation.push('NuevoPrestamo', {libro: rayuela})
```

Para volver a la pantalla anterior:
```tsx
props.navigation.goBack()
```