
import Contacto from '../domain/Contacto'
import RepoContactos from './RepoContactos'
import * as Contacts from 'expo-contacts'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

export default class PhoneBasedContactos implements RepoContactos {
    extraContactos: Contacto[] = [] // Si corro desde expo

    async tienePermiso(): Promise<boolean> {
        const { status } = await Contacts.requestPermissionsAsync()
        return status === 'granted'
    }

    async addContactoSiNoExiste(contacto: Contacto): Promise<void> {
        if (await this.getContacto(contacto) == null) {
            this.addContacto(contacto)
        }
    }

    async addContacto(contacto: Contacto): Promise<void> {
        /* Si corro desde expo no tengo permisos para agregar contactos */
        if (Constants.appOwnership === 'standalone' || Platform.OS !== 'android') {
            const contact: Contacts.Contact = {
                id: '',
                contactType: Contacts.ContactTypes.Person,
                name: contacto.nombre,
                emails: contacto.email ? [ { email: contacto.email, id: '', label: '' } ] : undefined,
                phoneNumbers: contacto.numero ? [ { number: contacto.numero, id: '', label: '' } ] : undefined,
                image: contacto.foto
            }
            const contactId = await Contacts.addContactAsync(contact)
            contacto.id = contactId
        } else {
            this.extraContactos.push(contacto)
        }
    }

    async getContactos(): Promise<Contacto[]> {
        const { data } = await Contacts.getContactsAsync()
        return data.map(Contacto.fromContact).concat(this.extraContactos)
    }

    async getContacto(contactoOrigen: Partial<Contacto>): Promise<Contacto | undefined> {
        const contactos = await this.getContactos()
        return contactos.find(contacto => 
            (contactoOrigen.id && contacto.id === contactoOrigen.id) ||
            (contactoOrigen.numero && contacto.numero === contactoOrigen.numero) ||
            (contactoOrigen.email && contacto.email === contactoOrigen.email) ||
            (contactoOrigen.nombre && contacto.nombre === contactoOrigen.nombre)
        )
    }

    eliminarContactos(): void {
        /* No quiero borrar los contactos del telefono */
    }

}