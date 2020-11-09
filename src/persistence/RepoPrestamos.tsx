import Prestamo from "../domain/Prestamo"

export default interface RepoPrestamos {

    getPrestamosPendientes(): Prestamo[] | Promise<Prestamo[]>
    getPrestamo(id: number): Prestamo | undefined | Promise<Prestamo | undefined>
    addPrestamo(prestamo: Prestamo): void | Promise<void>
    removePrestamo(prestamo: Prestamo): void | Promise<void>
    updatePrestamo(prestamo: Prestamo): void | Promise<void>

}

