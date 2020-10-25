/**
 *
 * Interfaz del objeto que maneja el origen de datos de los libros
 *
 */

import Libro from "../domain/Libro"

export default interface RepoLibros {
    getLibros(): Libro[]
    librosPrestables(): Libro[]
 
    addLibro(libro: Libro): void
    addLibroSiNoExiste(libro: Libro): Libro
    getLibro(libroOrigen: Libro): Libro | undefined
    getLibroPosicion(posicion: number): Libro | undefined
    removeLibro(libro: Libro): void
    removeLibroPosicion(posicion: number): void
    updateLibro(libro: Libro): void
    eliminarLibros(): void

}
