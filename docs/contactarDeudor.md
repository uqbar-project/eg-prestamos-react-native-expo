# Contactar a un deudor de un libro

La aplicación no solo nos muestra la lista de préstamos, podemos aprovechar las capacidades del celular para contactar a quien nos debe el libro de diferentes formas:

- podemos llamarlo
- o escribirle un mail

## Definición de un menú contextual

Cuando un usuario haga un "click largo" sobre un préstamo, activaremos el menú contextual. Definiremos en principio la vista de ese menú, que son las opciones disponibles:

En este caso usaremos una dependencia que nos da una implementacion de `ActionSheet` para Android ademas de la nativa que ya existe para IOS.

```shell
expo install @expo/react-native-action-sheet
```

Agregamos el `ActionSheetProvider` a nuestro componente de mayor nivel.

```tsx
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

export default function App(): JSX.Element {
    ...
    return (
        <SafeAreaProvider>
            <ActionSheetProvider>
                <NavigationContainer theme={DarkTheme}>
                   ...
                </NavigationContainer>
            </ActionSheetProvider>
            <StatusBar style="auto" />
        </SafeAreaProvider>
    )
}
```
Conectamos el componente que utilizara el menu para recivir las props necesarias.
```tsx
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'

class Main extends PureComponent<MainProps & ActionSheetProps, MainState> {
    constructor (props: MainProps & ActionSheetProps) {
        super(props)
        this.state = {
            prestamos: []
        }
    }
    ...
}

export default connectActionSheet(Main)
```

Y ahora si definimos el metodo que muestra el menu.

```tsx
opcionesPrestamo = (prestamo: Prestamo) => {
    this.props.showActionSheetWithOptions(
        {
            title: 'Elige una opción',
            options: [ 'Llamar', 'Enviar email', 'Cancelar' ],
            icons: [
                <FontAwesome key='phone' name='phone' size={24} />,
                <FontAwesome key='envelope' name='envelope' size={24} />,
                <FontAwesome key='close' name='close' size={24} />
            ],
            cancelButtonIndex: 2,
        },
        buttonIndex => {}
    )
}
```

Cada opción se define en el orden en que debe aparecer y un icono para cada una.

## Activando el menú

Tendremos que cambiar el componente base `View` por `Pressable` para poder detectar el "click largo".

```tsx
renderPrestamo = ({ item }: { item: Prestamo }): JSX.Element => {
    return (
        <Pressable
            style={ styles.prestamo }
            onLongPress={ () => this.opcionesPrestamo(item) }
            android_ripple={{color: 'grey'}}>
            ...
        </Pressable>
    )
}
```

Lo vemos en acción:

![image](../images/menuActivado.png)

## Opción seleccionada

Ahora necesitamos que cuando el usuario haga click en alguna opción se dispare la acción correspondiente. Esto ocurre en el metodo que pasamos como segundo parametro a `showActionSheetWithOptions`:

```tsx
this.props.showActionSheetWithOptions(
    ...,
    buttonIndex => {
        if (buttonIndex === 0) {
            Linking.openURL(`tel:${ prestamo.telefono() }`)
        } else if (buttonIndex === 1) {
            Linking.openURL(`mailto:${ prestamo.contactoMail() }`)
        }
    }
)
```

>Podríamos reemplazarlo por un mapa asociado a funciones pero nuestro foco está en ver cómo resolver el envío de mails y la llamada desde el dispositivo.

## Llamar a un contacto

Para llamar a un contacto utilizamos un **Link**. 

```tsx
Linking.openURL(`tel:${ prestamo.telefono() }`)
```

Lo vemos en acción:

![image](../images/llamando.png)

## Enviar un mail

Para enviar un mail, tenemos otro **Link** que Expo nos provee:

```tsx
Linking.openURL(`mailto:${ prestamo.contactoMail() }`)
```

>Otra cosa interesante es que si configuramos nuestro correo en el emulador, tendremos acceso a los contactos (y podremos prestarle a ellos nuestros libros).
