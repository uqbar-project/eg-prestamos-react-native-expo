import Prestamo from "../domain/Prestamo"
import RepoPrestamos from "./RepoPrestamos"

export default class CollectionBasedPrestamos implements RepoPrestamos {
    prestamos: Prestamo[] = []
    ultimoId = 0

    getPrestamosPendientes(): Prestamo[] {
        return this.prestamos.filter(prestamo => prestamo.estaPendiente())
    }

    getPrestamo(id: number): Prestamo | undefined {
        return this.prestamos.find(prestamo => prestamo.id === id)
    }

    addPrestamo(prestamo: Prestamo): void {
        prestamo.id = this.ultimoId++
        this.prestamos.push(prestamo)
    }

    removePrestamo(prestamoARemover: Prestamo): void {
        this.prestamos = this.prestamos.filter(prestamo => prestamo.id === prestamoARemover.id)
    }

    updatePrestamo(_prestamo: Prestamo): void {
        const prestamo = this.getPrestamo(_prestamo.id)
        if (prestamo) {
            this.removePrestamo(prestamo)
        }
        this.addPrestamo(_prestamo)
    }

}