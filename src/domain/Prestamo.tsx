import Contacto from "./Contacto"
import Libro from "./Libro"

/**
 * Representa el préstamo de un libro a un contacto
 */
export default class Prestamo {

    fechaPrestamo: Date = new Date()
    fechaDevolucion!: Date

    constructor(public id: number, public contacto: Contacto, public libro: Libro) {}

    datosPrestamo = (): string => `${this.fechaPrestamo.toLocaleDateString()} a ${this.contacto?.toString()}`

    telefono(): string {
        return this.contacto.numero
    }

    contactoMail(): string {
        return this.contacto.email
    }

    estaPendiente(): boolean {
        return !this.fechaDevolucion
    }

    toString(): string {
        return this.libro?.toString() + " - " + this.datosPrestamo
    }

    prestar() {
        if (!this.libro) {
            throw new Error("Debe ingresar libro")
        }
        if (!this.contacto) {
            throw new Error("Debe ingresar contacto")
        }
        this.fechaPrestamo = new Date()
        this.libro.prestar()
    }

    devolver() {
        this.libro?.devolver()
        this.fechaDevolucion = new Date()
    }
}

