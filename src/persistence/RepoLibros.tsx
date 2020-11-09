/**
 *
 * Interfaz del objeto que maneja el origen de datos de los libros
 *
 */

import Libro from "../domain/Libro"

export default interface RepoLibros {
    getLibros(): Libro[] | Promise<Libro[]>
    librosPrestables(): Libro[] | Promise<Libro[]>
 
    addLibro(libro: Libro): void | Promise<void>
    addLibroSiNoExiste(libro: Libro): Libro | Promise<Libro>
    getLibro(libroOrigen: Partial<Libro>): Libro | undefined | Promise<Libro | undefined>
    removeLibro(libro: Libro): void | Promise<void>
    updateLibro(libro: Libro): void | Promise<void>
    eliminarLibros(): void | Promise<void>

}
