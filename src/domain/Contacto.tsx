import { Contact, Image } from "expo-contacts"

/**
 * Representa un contacto dentro de la aplicación de préstamos de libros
 * Adapta el Contact propio de la API de ***.
 */

export default class Contacto {

    constructor (public id: string, public numero: string, public nombre: string, public email: string, public foto: Image | undefined) { }

    toString(): string {
        return this.nombre || "Contacto sin nombre"
    }

    static fromContact(contacto: Contact): Contacto {
        return new Contacto(
            contacto.id,
            contacto.phoneNumbers?.[ 0 ]?.number || '',
            contacto.name,
            contacto.emails?.[ 0 ]?.email || '',
            contacto.image
        )
    }
}