/**
 * Representa un libro, un documento que puede ser prestado a un contacto.
 */

export default class Libro {

    isPrestado = false

    constructor(public id: number, public titulo: string, public autor: string) {}

    toString(): string {
        return `${this.titulo} (${this.autor})`
    }

    prestar() {
        this.isPrestado = true
    }

    devolver() {
        this.isPrestado = false
    }

    estaPrestado(): boolean {
        return this.isPrestado
    }

    estaDisponible(): boolean {
        return !this.isPrestado
    }
}