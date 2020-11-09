import Contacto from "../domain/Contacto"
import Libro from "../domain/Libro"
import Prestamo from "../domain/Prestamo"
import SQLiteHelper from "../persistence/SQLiteHelper"
import { repoContactos, repoLibros, repoPrestamos } from "./PrestamosConfig"

class PrestamosService {

    async init() {
        if (!await repoContactos.tienePermiso()) return

        await SQLiteHelper.onCreate()

        /**
         * inicializamos la información de la aplicación
         */
        await repoContactos.addContactoSiNoExiste(
            new Contacto("test1", "46421111", "Nicolas Viotti", "nicolas@gmail.com", require('../../assets/viotti.png')))
        await repoContactos.addContactoSiNoExiste(
            new Contacto("test2", "45382222", "Alejandro Dini", "alejandro@yahoo.com.ar", require('../../assets/dini.jpeg')))
        await repoContactos.addContactoSiNoExiste(
            new Contacto("test3", "47063333", "Mauro Casciati", "mauro@gmail.com", require('../../assets/casciati.jpg')))
        await repoContactos.addContactoSiNoExiste(
            new Contacto("test4", "46054444", "Fernando Dodino", "fernando@hotmail.com", require('../../assets/dodino.jpg')))
        await repoContactos.addContactoSiNoExiste(
            new Contacto("test5", "42045555", "Rodrigo Grisolía", "rodrigo@hotmail.com", require('../../assets/grisolia.jpg')))

        let elAleph = new Libro(0, "El Aleph", "J.L. Borges")
        elAleph.prestar()
        let laNovelaDePeron = new Libro(0, "La novela de Perón", "T.E. Martínez")
        laNovelaDePeron.prestar()
        let cartasMarcadas = new Libro(0, "Cartas marcadas", "A. Dolina")
        cartasMarcadas.prestar()


        // Cuando necesitemos generar una lista nueva de libros
        // homeDeLibros.eliminarLibros()
        elAleph = await repoLibros.addLibroSiNoExiste(elAleph)
        laNovelaDePeron = await repoLibros.addLibroSiNoExiste(laNovelaDePeron)
        cartasMarcadas = await repoLibros.addLibroSiNoExiste(cartasMarcadas)
        await repoLibros.addLibroSiNoExiste(new Libro(0, "Rayuela", "J. Cortázar"))
        await repoLibros.addLibroSiNoExiste(new Libro(0, "No habrá más penas ni olvido", "O. Soriano"))
        await repoLibros.addLibroSiNoExiste(new Libro(0, "La invención de Morel", "A. Bioy Casares"))
        await repoLibros.addLibroSiNoExiste(new Libro(0, "Cuentos de los años felices", "O. Soriano"))
        await repoLibros.addLibroSiNoExiste(new Libro(0, "Una sombra ya pronto serás", "O. Soriano"))
        await repoLibros.addLibroSiNoExiste(new Libro(0, "Octaedro", "J. Cortázar"))
        await repoLibros.addLibroSiNoExiste(new Libro(0, "Ficciones", "J.L. Borges"))

        const casciati = await repoContactos.getContacto({numero: "47063333"})
        const dini = await repoContactos.getContacto({numero: "45382222"})
        const viotti = await repoContactos.getContacto({nombre: "Nicolas Viotti"})

        if (!(await repoPrestamos.getPrestamosPendientes()).length) {
            console.log("Creando préstamos")
            if (casciati) {
                const prestamo = new Prestamo(0, casciati, elAleph)
                prestamo.prestar()
                await repoPrestamos.addPrestamo(prestamo)
            }
            if (dini) {
                const prestamo = new Prestamo(0, dini, laNovelaDePeron)
                prestamo.prestar()
                await repoPrestamos.addPrestamo(prestamo)
            }
            if (viotti) {
                const prestamo = new Prestamo(0, viotti, cartasMarcadas)
                prestamo.prestar()
                await repoPrestamos.addPrestamo(prestamo)
            }
        }
    }
}

export default new PrestamosService()