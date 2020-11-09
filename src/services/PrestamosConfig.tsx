import CollectionBasedLibros from "../persistence/CollectionBasedLibros"
import CollectionBasedPrestamos from "../persistence/CollectionBasedPrestamos"
import PhoneBasedContactos from "../persistence/PhoneBasedContactos"
import RepoContactos from "../persistence/RepoContactos"
import RepoLibros from "../persistence/RepoLibros"
import RepoPrestamos from "../persistence/RepoPrestamos"
import SQLiteBasedLibros from "../persistence/SQLiteBasedLibros"
import SQLiteBasedPrestamos from "../persistence/SQLiteBasedPrestamos"

// PERSISTENTE
export const repoLibros: RepoLibros = new SQLiteBasedLibros()
export const repoPrestamos: RepoPrestamos = new SQLiteBasedPrestamos()
export const repoContactos: RepoContactos = new PhoneBasedContactos()

// NO PERSISTENTE
/* export const repoLibros: RepoLibros = new CollectionBasedLibros() */
/* export const repoPrestamos: RepoPrestamos = new CollectionBasedPrestamos() */
/* export const repoContactos: RepoContactos = new CollectionBasedContactos() */