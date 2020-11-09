import Libro from "../domain/Libro"
import RepoLibros from "./RepoLibros"

export default class CollectionBasedLibros implements RepoLibros {
    libros: Libro[] = [];

    addLibro(libro: Libro): void {
        this.libros.push(libro)
    }

    addLibroSiNoExiste(libro: Libro): Libro {
        if (!this.getLibro(libro)) {
            this.addLibro(libro)
        }
        return libro
    }

    getLibro(libroOrigen: Partial<Libro>): Libro | undefined {
        return this.libros.find(libro => 
            (libroOrigen.id && libro.id === libroOrigen.id) ||
            (libroOrigen.titulo && libro.titulo === libroOrigen.titulo)
        )
    }

    librosPrestables(): Libro[] {
        return this.libros.filter(libro => libro.estaDisponible())
    }

    removeLibro(libroARemover: Libro): void {
        this.libros = this.libros.filter(libro => libro.titulo === libroARemover.titulo)
    }

    updateLibro(libro: Libro): void {
        this.removeLibro(libro)
        this.addLibro(libro)
    }

    eliminarLibros(): void {
        this.libros.length = 0
    }

    getLibros(): Libro[] {
        return this.libros
    }
}