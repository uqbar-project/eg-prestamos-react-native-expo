import Contacto from "../domain/Contacto"

export default interface RepoContactos {
    getContactos(): Contacto[]
    addContactoSiNoExiste(contacto: Contacto): void
    addContacto(contacto: Contacto): void
    getContacto(contactoOrigen: Contacto): Contacto | undefined
    eliminarContactos(): void
}