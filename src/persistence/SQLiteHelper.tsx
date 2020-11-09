import * as SQLite from 'expo-sqlite'

const DATABASE_NAME = "librex.db"

const db = SQLite.openDatabase(DATABASE_NAME)

class SQLiteHelper {

    /**
     * Script para iniciar la base
     */
    onCreate(): Promise<void> {
        return new Promise((resolve, reject) =>
            db.transaction(tx => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS Libros (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        titulo TEXT NOT NULL,
                        autor TEXT NOT NULL,
                        prestado BOOLEAN NOT NULL
                    );`
                )
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS Prestamos (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        fechaPrestamo DATETIME NOT NULL,
                        fechaDevolucion DATETIME,
                        libro_id INTEGER NOT NULL,
                        contacto_id TEXT NOT NULL
                    );`
                )
            }, reject, resolve)
        )
    }

    onDrop(): Promise<void> {
        return new Promise((resolve, reject) =>
            db.transaction(tx => {
                tx.executeSql("DROP TABLE IF EXISTS Libros;")
                tx.executeSql("DROP TABLE IF EXISTS Prestamos;")
            }, reject, resolve)
        )
    }

    onUpgrade(): Promise<void> {
        return this.onDrop().then(this.onCreate)
    }

    executeSql(sqlStatement: string, args?: any[]): Promise<SQLite.SQLResultSet> {
        return new Promise((resolve, reject) =>
            db.transaction(tx => {
                tx.executeSql(
                    sqlStatement,
                    args,
                    (_, result) => resolve(result),
                    (_, error) => {
                        reject(error)
                        return false
                    }
                )
            }, reject)
        )
    }
}
export default new SQLiteHelper()