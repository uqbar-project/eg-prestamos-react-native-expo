import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import * as Contacts from 'expo-contacts'
import Fuse from 'fuse.js'
import React, { PureComponent, ReactElement, ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import { RootStackParamList } from '../../App'
import ContactoItem from '../components/ContactoItem'
import Contacto from '../domain/Contacto'

export default class ElegirContactoScreen extends PureComponent<Props, State> {
    constructor (props: Props) {
        super(props)

        this.state = {
            busqueda: '',
            contactos: []
        }
    }

    async componentDidMount(): Promise<void> {
        const { status } = await Contacts.requestPermissionsAsync()
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync()
            const contactos = data.map(Contacto.fromContact)
            this.setState({ contactos })
        }
    }

    filtrarContactos = (): Contacto[] => {
        const { contactos, busqueda } = this.state
        const ordenados = contactos.sort((c1, c2) => c1.nombre.localeCompare(c2.nombre, 'es', { sensitivity: 'base' }))
        if (!busqueda) return ordenados
        const fuse = new Fuse(ordenados, {
            keys: [
                "nombre",
                "numero",
                "email"
            ]
        })
        return fuse.search(busqueda).map(e => e.item)
    }

    elegirContacto = (contacto: Contacto): void => {
        const { navigation, route } = this.props
        route.params.seleccionarContacto(contacto)
        navigation.goBack()
    }

    renderContacto = ({ item }: { item: Contacto }): ReactElement => {
        return <ContactoItem contacto={item} onPress={ () => this.elegirContacto(item) } />
    }

    render(): ReactNode {
        const { busqueda } = this.state
        const contactos = this.filtrarContactos()
        return (
            <View style={ styles.elegirContacto }>
                <TextInput
                    style={ styles.input }
                    value={busqueda}
                    onChangeText={ busqueda => this.setState({ busqueda }) }
                    placeholder={'Buscar'}
                />
                <FlatList
                    data={ contactos }
                    renderItem={ this.renderContacto }
                    keyExtractor={ item => item.id }
                    keyboardShouldPersistTaps={ 'always' }
                />
            </View>
        )
    }
}

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'ElegirContacto'>
    route: RouteProp<RootStackParamList, 'ElegirContacto'>
}

type State = {
    busqueda: string
    contactos: Contacto[]
}

const styles = StyleSheet.create({
    elegirContacto: {
        flex: 1,
        backgroundColor: 'rgb(242, 242, 242)',
        paddingTop: 10
    },
    input: {
        borderBottomColor: 'green',
        borderBottomWidth: 2,
        marginHorizontal: 20,
        fontSize: 18,
        paddingVertical: 6
    },
})
