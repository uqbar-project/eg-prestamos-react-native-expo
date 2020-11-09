import Prestamo from "../domain/Prestamo"
import { repoContactos, repoLibros } from "../services/PrestamosConfig"
import RepoPrestamos from "./RepoPrestamos"
import SQLiteHelper from './SQLiteHelper'

export default class SQLiteBasedPrestamos implements RepoPrestamos {

    async getPrestamosPendientes(): Promise<Prestamo[]> {
        const { rows } = await SQLiteHelper.executeSql(
            'SELECT * FROM Prestamos WHERE fechaDevolucion is null;'
        )
        console.log('Préstamos pendientes', rows)
        const result = await Promise.all(
            Array.from({ length: rows.length }, (_, i) => rows.item(i))
                .map(this.prestamoFromRow)
        )
        console.log('Préstamos pendientes', result)
        return result
    }

    async getPrestamo(id: number): Promise<Prestamo | undefined> {
        const { rows } = await SQLiteHelper.executeSql(
            'SELECT * FROM Prestamos WHERE id = ?;',
            [ id ]
        )
        const row = rows.item(0)
        let result
        if (row) result = await this.prestamoFromRow(row)
        console.log('getPrestamo', result)
        return result
    }

    async addPrestamo(prestamo: Prestamo): Promise<void> {
        const { insertId } = await SQLiteHelper.executeSql(
            'INSERT INTO Prestamos (fechaPrestamo, fechaDevolucion, libro_id, contacto_id) values (?, ?, ?, ?);',
            [ prestamo.fechaPrestamo.getTime(), prestamo.fechaDevolucion?.getTime(), prestamo.libro.id, prestamo.contacto.id ]
        )
        prestamo.id = insertId
        console.log(`Se creó prestamo ${ prestamo }`)
    }

    async removePrestamo(prestamoARemover: Prestamo): Promise<void> {
        await SQLiteHelper.executeSql('DELETE FROM Prestamos WHERE id = ?;', [ prestamoARemover.id ])
    }

    async updatePrestamo(prestamo: Prestamo): Promise<void> {
        await SQLiteHelper.executeSql(
            'UPDATE Prestamos SET fechaPrestamo = ?, fechaDevolucion = ?, libro_id = ?, contacto_id = ? WHERE id = ?;',
            [ prestamo.fechaPrestamo.getTime(), prestamo.fechaDevolucion?.getTime(), prestamo.libro.id, prestamo.contacto.id, prestamo.id ]
        )
        console.log('updatePrestamo')
    }

    async prestamoFromRow(row: { id: number, fechaPrestamo: number, fechaDevolucion: number, libro_id: number, contacto_id: string }): Promise<Prestamo> {       
        const libro = await repoLibros.getLibro({ id: row.libro_id })
        const contacto = await repoContactos.getContacto({ id: row.contacto_id })
        if (!libro) {
            throw new Error(`Libro no existe. id: ${ row.libro_id }`)
        }
        if (!contacto) {
            throw new Error(`Contacto no existe. id: ${ row.contacto_id }`)
        }
        const prestamo = new Prestamo(row.id, contacto, libro)
        prestamo.fechaPrestamo = new Date(row.fechaPrestamo)
        if (row.fechaDevolucion) prestamo.fechaDevolucion = new Date(row.fechaDevolucion)
        return prestamo
    }

}