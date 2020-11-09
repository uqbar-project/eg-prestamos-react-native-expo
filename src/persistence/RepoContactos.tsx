import Contacto from "../domain/Contacto"

export default interface RepoContactos {
    tienePermiso(): boolean | Promise<boolean>
    getContactos(): Contacto[] | Promise<Contacto[]>
    addContactoSiNoExiste(contacto: Contacto): void | Promise<void>
    addContacto(contacto: Contacto): void | Promise<void>
    getContacto(contactoOrigen: Partial<Contacto>): Contacto | undefined | Promise<Contacto | undefined>
    getContactoPorId(id: string): Contacto | undefined | Promise<Contacto | undefined>
    eliminarContactos(): void | Promise<void>
}