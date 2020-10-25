import Contacto from "../domain/Contacto"
import Libro from "../domain/Libro"
import Prestamo from "../domain/Prestamo"
import { repoContactos, repoLibros, repoPrestamos } from "./PrestamosConfig"

class PrestamosService {

    init() {
        /**
         * inicializamos la información de la aplicación
         */
        repoContactos.addContactoSiNoExiste(
            new Contacto("1", "46421111", "Nicolas Viotti", "nicolas@gmail.com", require('../../assets/viotti.png')))
        repoContactos.addContactoSiNoExiste(
            new Contacto("2", "45382222", "Alejandro Dini", "alejandro@yahoo.com.ar", require('../../assets/dini.jpeg')))
        repoContactos.addContactoSiNoExiste(
            new Contacto("3", "47063333", "Mauro Casciati", "mauro@gmail.com", require('../../assets/casciati.jpg')))
        repoContactos.addContactoSiNoExiste(
            new Contacto("4", "46054444", "Fernando Dodino", "fernando@hotmail.com", require('../../assets/dodino.jpg')))
        repoContactos.addContactoSiNoExiste(
            new Contacto("5", "42045555", "Rodrigo Grisolía", "rodrigo@hotmail.com", require('../../assets/grisolia.jpg')))

        let elAleph = new Libro(1, "El Aleph", "J.L. Borges")
        elAleph.prestar()
        let laNovelaDePeron = new Libro(2, "La novela de Perón", "T.E. Martínez")
        laNovelaDePeron.prestar()
        let cartasMarcadas = new Libro(3, "Cartas marcadas", "A. Dolina")
        cartasMarcadas.prestar()


        // Cuando necesitemos generar una lista nueva de libros
        // homeDeLibros.eliminarLibros()
        elAleph = repoLibros.addLibroSiNoExiste(elAleph)
        laNovelaDePeron = repoLibros.addLibroSiNoExiste(laNovelaDePeron)
        cartasMarcadas = repoLibros.addLibroSiNoExiste(cartasMarcadas)
        repoLibros.addLibroSiNoExiste(new Libro(4, "Rayuela", "J. Cortázar"))
        repoLibros.addLibroSiNoExiste(new Libro(5, "No habrá más penas ni olvido", "O. Soriano"))
        repoLibros.addLibroSiNoExiste(new Libro(6, "La invención de Morel", "A. Bioy Casares"))
        repoLibros.addLibroSiNoExiste(new Libro(7, "Cuentos de los años felices", "O. Soriano"))
        repoLibros.addLibroSiNoExiste(new Libro(8, "Una sombra ya pronto serás", "O. Soriano"))
        repoLibros.addLibroSiNoExiste(new Libro(9, "Octaedro", "J. Cortázar"))
        repoLibros.addLibroSiNoExiste(new Libro(10, "Ficciones", "J.L. Borges"))

        const casciati = repoContactos.getContacto(new Contacto("", "47063333", "", "", null))
        const dini = repoContactos.getContacto(new Contacto("", "45382222", "", "", null))
        const viotti = repoContactos.getContacto(new Contacto("", "", "Nicolas Viotti", "", null))

        if (!repoPrestamos.getPrestamosPendientes().length) {
            console.log("Librex", "Creando préstamos")
            if (casciati)
                repoPrestamos.addPrestamo(new Prestamo(1, casciati, elAleph))
            if (dini)
                repoPrestamos.addPrestamo(new Prestamo(2, dini, laNovelaDePeron))
            if (viotti)
                repoPrestamos.addPrestamo(new Prestamo(3, viotti, cartasMarcadas))
        }
    }
}

export default new PrestamosService()