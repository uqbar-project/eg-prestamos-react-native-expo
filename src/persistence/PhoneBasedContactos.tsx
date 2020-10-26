
import Contacto from '../domain/Contacto'
import RepoContactos from './RepoContactos'

export default class PhoneBasedContactos implements RepoContactos {

    addContactoSiNoExiste(contacto: Contacto) {
        if (this.getContacto(contacto) == null) {
            this.addContacto(contacto)
        }
    }

    addContacto(contacto: Contacto) {
        /* TODO */

    }

    getContactos(): Contacto[] {
        /* TODO */
        return []
    }

    getContacto(contactoOrigen: Contacto): Contacto | undefined {
        // si queremos buscar por nombre
        /* TODO */
        return undefined
    }

    eliminarContactos() {
        /* TODO */
    }

}