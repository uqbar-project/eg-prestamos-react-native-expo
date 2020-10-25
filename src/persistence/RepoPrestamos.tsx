import Prestamo from "../domain/Prestamo"

export default interface RepoPrestamos {

    getPrestamosPendientes(): Prestamo[]
    getPrestamo(id: number): Prestamo | undefined
    addPrestamo(prestamo: Prestamo): void
    removePrestamo(prestamo: Prestamo): void
    updatePrestamo(prestamo: Prestamo): void

}

