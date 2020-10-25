import React, { PureComponent } from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import Prestamo from '../domain/Prestamo'
import { repoPrestamos } from '../services/PrestamosConfig'

export default class Main extends PureComponent<MainProps, MainState> {
    constructor (props: MainProps) {
        super(props)
        this.state = {
            prestamos: []
        }
    }
    componentDidMount(): void {
        this.cargarPrestamos()
    }

    cargarPrestamos = (): void => {
        const prestamos = repoPrestamos.getPrestamosPendientes()
        this.setState({ prestamos })
    }

    renderPrestamo = ({ item }: { item: Prestamo }): JSX.Element => {
        return (
            <View style={ styles.prestamo }>
                <Image
                    style={ styles.imgContacto }
                    source={ item.contacto.foto || require('../../assets/defaultContact.png')}
                    resizeMode='contain'
                    resizeMethod='resize'
                />
                <View>
                    <Text style={ styles.libro }>{ item.libro.toString() }</Text>
                    <Text style={ styles.datos }>{ item.datosPrestamo() }</Text>
                </View>
            </View>
        )
    }

    render(): JSX.Element {
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

type MainProps = {

}

type MainState = {
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
    libro: {
        fontSize: 18,
        color: 'grey'
    },
    datos: {
        fontSize: 16
    }
})
