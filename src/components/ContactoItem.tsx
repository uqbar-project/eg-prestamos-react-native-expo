import React, { ReactElement } from 'react'
import { Image, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native'
import Contacto from '../domain/Contacto'

const ContactoItem = ({contacto, onPress}: Props): ReactElement => {
    return (
        <Pressable
                style={ styles.contacto }
                onPress={ onPress }
                android_ripple={ { color: 'grey' } }>
                <Image
                    style={ styles.imgContacto }
                    source={ contacto.foto || require('../../assets/defaultContact.png') }
                    resizeMode='contain'
                    resizeMethod='resize'
                />
                <View>
                    <Text style={ styles.contactoNombre }>{ contacto.nombre }</Text>
                    {!!contacto.numero && <Text style={ styles.contactoDatos }>{ contacto.numero }</Text>}
                    {!!contacto.email && <Text style={ styles.contactoDatos }>{ contacto.email }</Text>}
                </View>
            </Pressable>
    )
}

type Props = {
    contacto: Contacto
    onPress: PressableProps["onPress"]
}

export default ContactoItem

const styles = StyleSheet.create({
    contacto: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center'
    },
    imgContacto: {
        height: 50,
        width: 50,
        borderRadius: 50,
        marginRight: 14
    },
    contactoNombre: {
        fontSize: 18,
        color: 'grey'
    },
    contactoDatos: {
        fontSize: 16
    },
})
