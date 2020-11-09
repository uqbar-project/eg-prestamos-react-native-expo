/**
 * Representa un libro, un documento que puede ser prestado a un contacto.
 */

export default class Libro {

    prestado = false

    constructor(public id: number, public titulo: string, public autor: string) {}

    toString(): string {
        return `${this.titulo} (${this.autor})`
    }

    prestar(): void {
        this.prestado = true
    }

    devolver(): void {
        this.prestado = false
    }

    estaPrestado(): boolean {
        return this.prestado
    }

    estaDisponible(): boolean {
        return !this.prestado
    }
}