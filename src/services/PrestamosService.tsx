import Contacto from "../domain/Contacto"
import Libro from "../domain/Libro"
import Prestamo from "../domain/Prestamo"
import { repoContactos, repoLibros, repoPrestamos } from "./PrestamosConfig"

class PrestamosService {

    async init() {
        if (!await repoContactos.tienePermiso()) return
        /**
         * inicializamos la información de la aplicación
         */
        await repoContactos.addContactoSiNoExiste(
            new Contacto("1", "46421111", "Nicolas Viotti", "nicolas@gmail.com", require('../../assets/viotti.png')))
        await repoContactos.addContactoSiNoExiste(
            new Contacto("2", "45382222", "Alejandro Dini", "alejandro@yahoo.com.ar", require('../../assets/dini.jpeg')))
        await repoContactos.addContactoSiNoExiste(
            new Contacto("3", "47063333", "Mauro Casciati", "mauro@gmail.com", require('../../assets/casciati.jpg')))
        await repoContactos.addContactoSiNoExiste(
            new Contacto("4", "46054444", "Fernando Dodino", "fernando@hotmail.com", require('../../assets/dodino.jpg')))
        await repoContactos.addContactoSiNoExiste(
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

        const casciati = await repoContactos.getContacto({numero: "47063333"})
        const dini = await repoContactos.getContacto({numero: "45382222"})
        const viotti = await repoContactos.getContacto({nombre: "Nicolas Viotti"})

        if (!repoPrestamos.getPrestamosPendientes().length) {
            console.log("Librex", "Creando préstamos")
            if (casciati) {
                const prestamo = new Prestamo(1, casciati, elAleph)
                prestamo.prestar()
                repoPrestamos.addPrestamo(prestamo)
            }
            if (dini) {
                const prestamo = new Prestamo(2, dini, laNovelaDePeron)
                prestamo.prestar()
                repoPrestamos.addPrestamo(prestamo)
            }
            if (viotti) {
                const prestamo = new Prestamo(3, viotti, cartasMarcadas)
                prestamo.prestar()
                repoPrestamos.addPrestamo(prestamo)
            }
        }
    }
}

export default new PrestamosService()