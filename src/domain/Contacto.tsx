import { ImageSourcePropType } from "react-native"

/**
 * Representa un contacto dentro de la aplicación de préstamos de libros
 * Adapta el Contact propio de la API de ***.
 */

export default class Contacto {

    constructor (public id: string, public numero: string, public nombre: string, public email: string, public foto: ImageSourcePropType | null) { }

    toString(): string {
        return this.nombre || "Contacto sin nombre"
    }
}