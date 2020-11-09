import React, { PureComponent, ReactElement, ReactNode } from 'react'
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import Prestamo from '../domain/Prestamo'
import { repoPrestamos, repoLibros } from '../services/PrestamosConfig'
import { ActionSheetProps, connectActionSheet } from '@expo/react-native-action-sheet'
import * as Linking from 'expo-linking'
import { FontAwesome } from '@expo/vector-icons'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../App'
class PrestamosScreen extends PureComponent<PrestamosScreenProps, PrestamosScreenState> {
    constructor (props: PrestamosScreenProps) {
        super(props)
        this.state = {
            prestamos: []
        }
    }

    unsubscribeNavigationFocus!: () => void

    componentDidMount(): void {
        const { navigation } = this.props
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={ () => navigation.navigate('NuevoPrestamo') }
                    style={ styles.nuevoPrestamo }
                    hitSlop={ 20 }>
                    <FontAwesome name={ 'plus-circle' } size={ 30 } color='white' />
                </Pressable>
            )
        })
        this.cargarPrestamos()
        this.unsubscribeNavigationFocus = navigation.addListener('focus', this.cargarPrestamos)
    }

    componentWillUnmount() {
        this.unsubscribeNavigationFocus()
    }


    cargarPrestamos = async (): Promise<void> => {
        const prestamos = await repoPrestamos.getPrestamosPendientes()
        this.setState({ prestamos })
    }

    devolverPrestamo = async (prestamo: Prestamo): Promise<void> => {
        prestamo.devolver()
        await repoPrestamos.updatePrestamo(prestamo)
        await repoLibros.updateLibro(prestamo.libro)
        this.cargarPrestamos()
    }

    opcionesPrestamo = (prestamo: Prestamo): void => {
        this.props.showActionSheetWithOptions(
            {
                title: 'Elige una opción',
                options: [ 'Llamar', 'Enviar email', 'Devolver', 'Cancelar' ],
                icons: [
                    <FontAwesome key='phone' name='phone' size={ 24 } />,
                    <FontAwesome key='envelope' name='envelope' size={ 24 } />,
                    <FontAwesome key='undo' name='undo' size={ 24 } color='brown' />,
                    <FontAwesome key='close' name='close' size={ 24 } />
                ],
                destructiveButtonIndex: 2,
                cancelButtonIndex: 3,
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    Linking.openURL(`tel:${ prestamo.telefono() }`)
                } else if (buttonIndex === 1) {
                    Linking.openURL(`mailto:${ prestamo.contactoMail() }`)
                } else if (buttonIndex === 2) {
                    this.devolverPrestamo(prestamo)
                }
            },
        )
    }

    renderPrestamo = ({ item }: { item: Prestamo }): ReactElement => {
        return (
            <Pressable
                style={ styles.prestamo }
                onLongPress={ () => this.opcionesPrestamo(item) }
                android_ripple={ { color: 'grey' } }>
                <Image
                    style={ styles.imgContacto }
                    source={ item.contacto.foto || require('../../assets/defaultContact.png') }
                    resizeMode='contain'
                    resizeMethod='resize'
                />
                <View style={styles.contenedorTexto}>
                    <Text style={ styles.libro }>{ item.libro.toString() }</Text>
                    <Text style={ styles.datos }>{ item.datosPrestamo() }</Text>
                </View>
            </Pressable>
        )
    }

    render(): ReactNode {
        const { prestamos } = this.state
        return (
            <FlatList
                style={ styles.lista }
                data={ prestamos }
                renderItem={ this.renderPrestamo }
                keyExtractor={ item => String(item.id) }
            />
        )
    }
}

export default connectActionSheet(PrestamosScreen)

type PrestamosScreenProps = ActionSheetProps & {
    navigation: StackNavigationProp<RootStackParamList, 'Prestamos'>
}

type PrestamosScreenState = {
    prestamos: Prestamo[]
}

const styles = StyleSheet.create({
    lista: {
        flex: 1,
        backgroundColor: 'rgb(242, 242, 242)'
    },
    prestamo: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    imgContacto: {
        height: 50,
        width: 50,
        borderRadius: 50,
        marginRight: 14
    },
    contenedorTexto: {
        flexShrink: 1
    },
    libro: {
        fontSize: 18,
        color: 'grey'
    },
    datos: {
        fontSize: 16
    },
    nuevoPrestamo: {
        marginRight: 20
    }
})
