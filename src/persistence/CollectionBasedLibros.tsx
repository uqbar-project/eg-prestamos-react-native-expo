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

    getLibro(libroOrigen: Libro): Libro | undefined {
        return this.libros.find(libro => libro.titulo === libroOrigen.titulo)
    }

    getLibroPosicion(posicion: number): Libro | undefined {
        return this.libros[ posicion ]
    }

    librosPrestables(): Libro[] {
        return this.libros.filter(libro => libro.estaDisponible())
    }

    removeLibro(libroARemover: Libro): void {
        this.libros = this.libros.filter(libro => libro.titulo === libroARemover.titulo)
    }

    removeLibroPosicion(posicion: number): void {
        this.libros.splice(posicion, 1)
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