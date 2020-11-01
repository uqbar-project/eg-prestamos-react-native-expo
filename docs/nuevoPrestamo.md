# Nuevo préstamo

## Nuestro objetivo

Definir la pantalla que permita cargar un nuevo préstamo.

## Pasos

* seleccionar el libro que uno está prestando, mediante una búsqueda rápida que muestra las opciones a medida que va escribiendo
* seleccionar el contacto 
* la fecha se asume la del día de hoy
* agregar el préstamo en la lista y cerrar la pantalla

<!-- ## Persistencia

Toda esta información queda en memoria mientras dura la aplicación o se persiste en un SQL Lite, teniendo en cuenta que 

1. la relación many-to-one entre las entidades Préstamo y Libro. En la tabla Préstamo se almacena el identificador unívoco de Libro (LIBRO_ID según vimos). 
2. la relación many-to-one contra los contactos, que se guardan en el dispositivo. La referencia al contacto puede ser el ID (que podría re-mapearse al RAW_CONTACT_ID), el teléfono (PHONE), o bien el nombre del contacto. En el ejemplo elegimos la segunda opción para no tener que hacer tantos cambios en la aplicación.  -->

## Pantalla

Definimos una pantalla donde

* utilizamos un `Pressable` como contenedor en vez de un `View` para poder esconder el teclado al precionar una parte de la pantalla vacia
* un `TextInput` y un `FlatList` para mostrarle al usuario las opciones de libros que puede seleccionar
* para mostrar los datos del contacto en una sola línea, cramos un componente `ContactoItem`. En este componente esta copuesto de
    * un `Image` que muestre la foto del contacto
    * varios `Text` que muestran la información del contacto: esto puede ser sólo nombre o podría incluir telefono y email
    * un `View` para separar la imagen y el texto en dos columnas
    * un `Pressable` que dispare la app búsqueda de contactos del dispositivo
    * si no tenemos un contacto seleccionado, utilizamos uno con una imagen y texto por defecto
* un `Pressable` que dispare la acción que crear el nuevo préstamo


### Búsqueda con Autocomplete

En el `componentDidMount` de la pantalla obtenemos la lista de libros pendientes:

```tsx
componentDidMount(): void {
    const libros = repoLibros.librosPrestables()
    this.setState({ libros })
}
```

<!-- Como el toString() de Libro concatena título y autor la estrategia que adoptamos es crear un mapa cuya clave será el toString de libro y cuyo valor es el objeto Libro (una estrategia un tanto heterodoxa porque no manejamos objetos seleccionados como cuando disponemos de binding). -->

Podemos capturar el evento `onChangeText` del `TextInput` para guardar el valor ingresado y hacer la búsqueda en la lista de libros en base a este:

```tsx
filtrarLibros = (): Libro[] => {
    const { libros, busqueda } = this.state
    const fuse = new Fuse(libros, {
        keys: [
            "titulo",
            "autor"
        ]
    })
    return fuse.search(busqueda).map(e => e.item)
}
```

Al seleccionar un elemento de la lista se borrara la busqueda y se mostrará el titulo del libro seleccionado en el input, en el caso de que no se seleccione ninguno, se borrara el input y la variable `libroSeleccionado` quedará en `undefined`.

### Búsqueda de contactos

Al hacer click en el botón se navegara a la pantalla de búsqueda de contacto

```tsx
buscarContacto = (): void => {
    const { navigation } = this.props
    navigation.navigate('ElegirContacto', { seleccionarContacto: this.seleccionarContacto })
}
```

Una vez que seleccionamos un contacto, hay que capturar el evento como callback:

```tsx
seleccionarContacto = (contacto: Contacto): void => this.setState({ contactoSeleccionado: contacto })
```

<!-- En el método seleccionarContacto recibimos un cursor, con el que generamos contactoBuscar, el objeto Contacto que nos sirve de prototipo para hacer la búsqueda al home de Contactos que ya diseñamos. La ventaja es que el home nos devuelve un Contacto ya construido, solamente tenemos que encargarnos del binding de la imagen con la foto y el textview con los datos del contacto. -->

### Prestar

Al prestar hay que instanciar un préstamo con 

* el libro seleccionado, que lo tenemos en una variable de estado `libroSeleccionado` (se carga en el método `onPress` del `Pressable` en `renderLibro`)
* el contacto seleccionado, que lo tenemos también en una variable de estado `contactoSeleccionado` (se carga en el método seleccionarContacto)

luego delegar al repositorio y cerrar la pantalla.
<!--  Si hay errores de validación, se muestra un Toast al usuario y se corta el flujo (la actividad no se cierra ni se agrega el préstamo). Si hay un error diferente (de programación), el mensaje es diferente -->

```tsx
nuevoPrestamo = (): void => {
    const { navigation } = this.props
    const { libroSeleccionado, contactoSeleccionado } = this.state
    if (libroSeleccionado && contactoSeleccionado) {
        const nuevoPrestamo = new Prestamo(0, contactoSeleccionado, libroSeleccionado)
        nuevoPrestamo.prestar()
        repoPrestamos.addPrestamo(nuevoPrestamo)
        navigation.goBack()
    }
}
```

Por último hay que indicar a la pantalla principal que refresque la lista de préstamos al volver:

```tsx
unsubscribeNavigationFocus!:() => void

componentDidMount(): void {
    ...
     this.unsubscribeNavigationFocus = navigation.addListener('focus', this.cargarPrestamos)
}

componentWillUnmount() {
    this.unsubscribeNavigationFocus()
}
```

<!-- ## Diagrama de clases de la solución

![image](../images/nuevoPrestamoClassDiagram.png)
 -->
## Ejecutando la aplicación

Vemos cómo queda el resultado final.

![image](../images/nuevoPrestamoApp.png)
![image](../images/nuevoPrestamoApp2.png)