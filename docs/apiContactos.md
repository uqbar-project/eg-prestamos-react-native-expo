# Interacción con API Contactos

## Nuestro objetivo

Vamos a integrar la lista de contactos de la aplicación con la [API expo contacts](https://docs.expo.io/versions/latest/sdk/contacts/) que permite utilizar la lista de contactos del dispositivo.

Es importante

* ver los contactos que hay
* saber si un contacto existe
* crear nuevos contactos
* eliminar los contactos (Opcional)

Definimos una interfaz RepoContactos con una implementación PhoneBasedContactos.

## Vista principal: llamando al PrestamosService

En el componente de mayor nivel `App.tsx` llamamos a `PrestamosService` que le pide a un repo que incorpore contactos si no existen, mientras tanto muestro la pantalla de carga con `AppLoading`...

```tsx
async function precarga(): Promise<void> {
    /* Aca puedo precargar imagenes, videos, fuentes o inicializar datos */
    await PrestamosService.init()
}

export default function App(): ReactNode {
    const [ isReady, setReady ] = useState(false)
    if (!isReady) {
        return (
            <AppLoading
                startAsync={ precarga }
                onFinish={ () => setReady(true) }
                onError={ console.warn }
            />
        )
    }
    ...
```

PrestamosService es un **Singleton**, que se implementa como objeto:

```tsx
class PrestamosService {

    async init() {
         if (!await repoContactos.tienePermiso()) return
        /**
         * inicializamos la información de la aplicación
         */
        await repoContactos.addContactoSiNoExiste(
            new Contacto("1", "46421111", "Nicolas Viotti", "nicolas@gmail.com", require('../../assets/viotti.png')))
        ...
    }
}
export default new PrestamosService()
```

En la inicialización del objeto delegamos la creación en el repositorio de contactos, que sale de la configuración de la aplicación `PrestamosConfig`. 

## API de Contactos de Expo

Un `Contact` identifica a una persona, que puede tener diferentes formas de ser contactada. Cada una de estas formas es lo que se guarda como *"Raw Contact"* (amigo, compañero de facultad, compañero de trabajo, etc.) Esto permite agrupar a una persona en diferentes roles, sobre todo cuando sincronizamos los contactos desde diferentes orígenes:

* Outlook del trabajo
* Gmail
* otro teléfono
* etc.

A su vez cada *raw contact* tiene n datos, donde el formato varía en base a la información que se almacena:

* un número de teléfono de la casa o móvil
* un mail corporativo de trabajo o de contacto
* una foto
* una cuenta de facebook
* una cuenta de twitter

## Implementación del repositorio de contactos de Expo

Antes que nada tendremos que instalar la dependencia `expo-contacts`.

```console
expo install expo-contacts
```

### Instanciación

Ahora que sabemos cómo es la estructura de los contactos vamos al Home, en el método addContacto recibimos un objeto Contacto (del dominio de nuestra aplicación) y creamos un Contact de Android.

```tsx
export default class PhoneBasedContactos implements RepoContactos {

    async addContactoSiNoExiste(contacto: Contacto): void {
        if (this.getContacto(contacto) == null) {
            this.addContacto(contacto)
        }
    }
    ...
}
```

### Generación de un contacto

Vemos cómo se crea un contacto, generando un `Contact` con cada tipo de información que tiene el contacto:

```tsx
async addContacto(contacto: Contacto): Promise<void> {
    const contact: Contacts.Contact = {
        id: '',
        contactType: Contacts.ContactTypes.Person,
        name: contacto.nombre,
        emails: contacto.email ? [ { email: contacto.email, id: '', label: '' } ] : undefined,
        phoneNumbers: contacto.numero ? [ { number: contacto.numero, id: '', label: '' } ] : undefined,
        image: contacto.foto
    }
    const contactId = await Contacts.addContactAsync(contact)
    contacto.id = contactId
}
```

En el ejempo nos encontramos con el problema que segun la documentación expo solo permite agregar o modificar un usuario cuando es una aplicación [*Standalone*](https://docs.expo.io/distribution/building-standalone-apps/), una aplicacion que no dependa de la app de expo que requiere hacer un *build*, lo que nos obliga a mockear esta funcionalidad cuando estamos desarrollando.

```tsx
extraContactos: Contacto[] = []
async addContacto(contacto: Contacto): Promise<void> {
    /* Si corro desde expo no tengo permisos para agregar contactos */
    if (Constants.appOwnership === Constants.AppOwnership.Standalone || Platform.OS !== 'android') {
        ...
    } else {
        this.extraContactos.push(contacto)
    }
}
```

### Obtener todos los contactos

En el ejempolo queremos obtener los contactos para mostrarle al usuario la lista de contactos al crear un prestamo para que pueda elejir a quien hacerle un prestamo.

```tsx
async getContactos(): Promise<Contacto[]> {
    const { data } = await Contacts.getContactsAsync()
    return data.map(Contacto.fromContact).concat(this.extraContactos)
}
```

### Contact vs. Contacto

Como decisión de diseño decidimos tener nuestro propio objeto Contacto, que esconde la complejidad de la API de contactos simplificándolo en un objeto con los datos necesarios para nuestra aplicación: nombre, teléfono, mail y foto.

### Búsqueda de un contacto

Queremos hacer un search by example, por número de teléfono, email o bien por nombre. Para cualquiera de los casos se pasa un contacto o un objeto con uno de los valores buscados:

```tsx
async getContacto(contactoOrigen: Partial<Contacto>): Promise<Contacto | undefined> {
    const contactos = await this.getContactos()
    return contactos.find(contacto => 
        (contactoOrigen.numero && contacto.numero === contactoOrigen.numero) ||
        (contactoOrigen.email && contacto.email === contactoOrigen.email) ||
        (contactoOrigen.nombre && contacto.nombre === contactoOrigen.nombre)
    )
}
```

Vemos el método que adapta un Contact a un objeto Contacto:

```tsx
static fromContact(contacto: Contact): Contacto {
    return new Contacto(
        contacto.id,
        contacto.phoneNumbers?.[ 0 ]?.number || '',
        contacto.name,
        contacto.emails?.[ 0 ]?.email || '',
        contacto.image
    )
}
```

### Configuración de permisos

Para poder acceder a los contactos es necesario preguntarle al usuario si nos da permiso, para eso está el método `tienePermiso` que llamamos en el `init` del `PrestamosService`:

```tsx
async tienePermiso(): Promise<boolean> {
    const { status } = await Contacts.requestPermissionsAsync()
    return status === 'granted'
}
```