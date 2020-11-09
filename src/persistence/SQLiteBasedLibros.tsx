import Libro from "../domain/Libro"
import RepoLibros from "./RepoLibros"
import SQLiteHelper from './SQLiteHelper'

export default class SQLiteBasedLibros implements RepoLibros {
    async addLibro(libro: Libro): Promise<void> {
        const { insertId } = await SQLiteHelper.executeSql(
            'INSERT INTO Libros (titulo, autor, prestado) values (?, ?, ?);',
            [ libro.titulo, libro.autor, libro.prestado ]
        )
        libro.id = insertId
        console.log(`Se creó libro ${ libro }`)
    }

    async addLibroSiNoExiste(libro: Libro): Promise<Libro> {
        const libroPosta = await this.getLibro(libro)
        if (libroPosta) {
            return libroPosta
        } else {
            this.addLibro(libro)
        }
        return libro
    }

    async getLibro(libroOrigen: Partial<Libro>): Promise<Libro | undefined> {
        const { rows } = await SQLiteHelper.executeSql(
            'SELECT * FROM Libros WHERE id = ? OR titulo = ? LIMIT 1;',
            [ libroOrigen.id, libroOrigen.titulo || '' ]
        )
        let result
        if (rows.length) result = this.libroFromRow(rows.item(0))
        console.log('getLibro', result)
        return result
    }

    async librosPrestables(): Promise<Libro[]> {
        const { rows } = await SQLiteHelper.executeSql(
            'SELECT * FROM Libros WHERE prestado = ?;',
            [ false ]
        )
        const result = Array.from({length: rows.length}, (_, i) => rows.item(i)).map(this.libroFromRow)
        console.log('librosPrestables', result)
        return result
    }

    async removeLibro(libroARemover: Libro): Promise<void> {
        await SQLiteHelper.executeSql('DELETE FROM Libros WHERE id = ?;', [ libroARemover.id ])
    }

    async updateLibro(libro: Libro): Promise<void> {
        await SQLiteHelper.executeSql(
            'UPDATE Libros SET titulo = ?, autor = ?, prestado = ? WHERE id = ?;',
            [ libro.titulo, libro.autor, libro.prestado, libro.id ]
        )
        console.log('updateLibro')
    }

    async eliminarLibros(): Promise<void> {
        await SQLiteHelper.executeSql('DELETE FROM Libros;')
    }

    async getLibros(): Promise<Libro[]> {
        const { rows } = await SQLiteHelper.executeSql(
            'SELECT * FROM Libros;'
        )
        const result = Array.from({length: rows.length}, (_, i) => rows.item(i)).map(this.libroFromRow)
        console.log("getLibros", result)
        return result
    }

    libroFromRow(row: { id: number, autor: string, titulo: string, prestado: 0 | 1 }): Libro {
        const libro = new Libro(row.id, row.titulo, row.autor)
        libro.prestado = !!row.prestado
        return libro
    }
}