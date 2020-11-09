import { StackNavigationProp } from '@react-navigation/stack'
import Fuse from 'fuse.js'
import React, { PureComponent, ReactElement, ReactNode } from 'react'
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import { RootStackParamList } from '../../App'
import Libro from '../domain/Libro'
import { repoLibros, repoPrestamos } from './../services/PrestamosConfig'
import Contacto from '../domain/Contacto'
import Prestamo from '../domain/Prestamo'
import ContactoItem from '../components/ContactoItem'

const placeholderContacto = new Contacto('', '', 'Elegir contacto', '', null)

export default class NuevoPrestamoScreen extends PureComponent<Props, State> {
    constructor (props: Props) {
        super(props)

        this.state = {
            libros: [],
            busqueda: ''
        }
    }

    async componentDidMount(): Promise<void> {
        const libros = await repoLibros.librosPrestables()
        
        this.setState({ libros })
    }

    filtrarLibros = (): Libro[] => {
        const { libros, busqueda } = this.state
        const fuse = new Fuse(libros, {
            keys: [
                "titulo",
                "autor"
            ]
        })
        return fuse.search(busqueda).map(e => e.item)
    }
    renderLibro = ({ item }: { item: Libro }): ReactElement => {
        return <Pressable
            onPress={ () => {
                this.setState({ libroSeleccionado: item })
                Keyboard.dismiss()
            } }
            style={ styles.opcion }>
            <Text style={ styles.nombreOpcion }>{ item.toString() }</Text>
        </Pressable>
    }

    seleccionarContacto = (contacto: Contacto): void => this.setState({ contactoSeleccionado: contacto })

    buscarContacto = (): void => {
        const { navigation } = this.props
        navigation.navigate('ElegirContacto', { seleccionarContacto: this.seleccionarContacto })
    }

    nuevoPrestamo = async (): Promise<void> => {
        const { navigation } = this.props
        const { libroSeleccionado, contactoSeleccionado } = this.state
        if (libroSeleccionado && contactoSeleccionado) {
            const nuevoPrestamo = new Prestamo(0, contactoSeleccionado, libroSeleccionado)
            nuevoPrestamo.prestar()
            await repoPrestamos.addPrestamo(nuevoPrestamo)
            await repoLibros.updateLibro(libroSeleccionado)
            navigation.goBack()
        }
    }

    render(): ReactNode {
        const { busqueda, libroSeleccionado, contactoSeleccionado } = this.state
        const prestarDeshabilitado = !libroSeleccionado || !contactoSeleccionado
        const resultado = this.filtrarLibros()
        return (
            <Pressable style={ styles.nuevoPrestamo } onPress={ Keyboard.dismiss }>
                <Text style={ styles.etiqueta }>Libro a prestar</Text>
                <TextInput
                    style={ styles.input }
                    onChangeText={ busqueda => this.setState({ busqueda, libroSeleccionado: undefined }) }
                    value={ busqueda || libroSeleccionado?.toString() }
                    onBlur={ () => this.setState({ busqueda: '' }) }
                />
                <View>
                    <FlatList
                        style={ [ styles.listaResultados, !!resultado.length && styles.listaResultadosActiva ] }
                        data={ resultado }
                        renderItem={ this.renderLibro }
                        keyExtractor={ item => String(item.id) }
                        keyboardShouldPersistTaps={ 'always' }
                    />
                </View>
                <Text style={ styles.etiqueta }>Contacto</Text>
                <ContactoItem
                    contacto={ contactoSeleccionado || placeholderContacto }
                    onPress={ this.buscarContacto } />
                <Pressable
                    style={ styles.boton }
                    android_ripple={ { color: 'grey' } }
                    disabled={ prestarDeshabilitado }
                    onPress={ this.nuevoPrestamo }>
                    <Text style={ [ styles.textoBoton, prestarDeshabilitado && styles.textoBotonDeshabilitado ] }>Prestar</Text>
                </Pressable>
            </Pressable>
        )
    }
}

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'NuevoPrestamo'>
}

type State = {
    libros: Libro[]
    busqueda: string
    libroSeleccionado?: Libro
    contactoSeleccionado?: Contacto
}

const styles = StyleSheet.create({
    input: {
        borderBottomColor: 'green',
        borderBottomWidth: 2,
        fontSize: 20,
        paddingVertical: 6
    },
    etiqueta: {
        fontSize: 16,
        marginTop: 16
    },
    nuevoPrestamo: {
        flex: 1,
        backgroundColor: 'rgb(242, 242, 242)',
        paddingHorizontal: 20,
        height: '100%'
    },
    opcion: {
        paddingHorizontal: 10,
        paddingVertical: 16
    },
    nombreOpcion: {
        fontSize: 18
    },
    listaResultados: {
        position: 'absolute',
        flexShrink: 1,
        flexGrow: 0,
        backgroundColor: 'rgb(242, 242, 242)',
        zIndex: 100,
        width: '100%'
    },
    listaResultadosActiva: {
        elevation: 2,
    },
    boton: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    textoBoton: {
        fontSize: 16,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: 'black'
    },
    textoBotonDeshabilitado: {
        color: 'grey'
    },
})
