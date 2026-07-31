# Feature Specification: Task Management API

**Feature Branch**: `001-task-management-api`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "Especificación funcional — Backend REST para gestión de tareas"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gestionar el ciclo de vida de una tarea (Priority: P1)

Como consumidor de la API, quiero crear, consultar, actualizar y eliminar tareas para mantener
actualizada la información de trabajo del sistema.

**Why this priority**: El CRUD es el valor mínimo viable y permite que cualquier cliente gestione
el estado de sus tareas.

**Independent Test**: Crear una tarea válida, consultarla, actualizar sus datos, verificar que la
actualización se conserva y eliminarla; cada acción debe devolver el resultado y estado esperado.

**Acceptance Scenarios**:

1. **Given** una solicitud válida de creación, **When** se registra una tarea, **Then** el sistema
   devuelve la tarea creada y un identificador único.
2. **Given** una tarea existente, **When** se consulta por identificador, **Then** se devuelve su
   representación completa.
3. **Given** una tarea existente y datos editables válidos, **When** se actualiza, **Then** se
   conservan su identificador y fecha de creación y cambia la fecha de actualización.
4. **Given** una tarea existente, **When** se elimina, **Then** deja de estar disponible en
   consultas posteriores.
5. **Given** un identificador válido sin tarea asociada, **When** se actualiza o elimina, **Then**
   el sistema informa que el recurso no existe y no crea uno nuevo.

### User Story 2 - Consultar y localizar tareas (Priority: P1)

Como consumidor de la API, quiero listar tareas, buscar por texto y filtrar por estado para
encontrar rápidamente la información relevante.

**Why this priority**: La consulta es necesaria para mostrar el estado del trabajo y la búsqueda
reduce el esfuerzo para localizar tareas en colecciones grandes.

**Independent Test**: Con una colección que contenga títulos, descripciones y estados distintos,
realizar listados sin filtros, búsquedas combinadas y filtros por estado, verificando resultados y
colecciones vacías.

**Acceptance Scenarios**:

1. **Given** una colección vacía, **When** se solicita el listado, **Then** se devuelve una
   colección vacía con respuesta exitosa, no un error de recurso inexistente.
2. **Given** tareas con texto coincidente, **When** se busca un término ignorando mayúsculas y
   espacios externos, **Then** se devuelven las tareas cuyo título o descripción lo contiene.
3. **Given** tareas con distintos estados, **When** se filtra por un estado permitido, **Then** se
   devuelven únicamente las tareas de ese estado.
4. **Given** una búsqueda o filtro sin coincidencias, **When** se consulta, **Then** se devuelve
   una colección vacía con respuesta exitosa.
5. **Given** un filtro de estado no permitido, **When** se solicita el listado, **Then** se
   devuelve un error de validación sin fallar el servicio.

### User Story 3 - Recibir validación y errores previsibles (Priority: P1)

Como consumidor de la API, quiero recibir respuestas consistentes cuando envío datos inválidos o
cuando ocurre un problema para poder corregir la solicitud o manejar el fallo de forma segura.

**Why this priority**: La validación y los errores previsibles protegen la integridad de los datos
 y evitan que clientes tengan que interpretar fallos internos.

**Independent Test**: Enviar cuerpos, identificadores, consultas y JSON inválidos; simular recursos
ausentes y fallos inesperados; comprobar códigos, estructura, mensajes seguros y correlación.

**Acceptance Scenarios**:

1. **Given** un título ausente, no textual, vacío, compuesto por espacios o mayor de 100
   caracteres, **When** se crea o actualiza una tarea, **Then** se rechaza con un error de
   validación por campo.
2. **Given** una descripción no textual o mayor de 500 caracteres, **When** se envía, **Then** se
   rechaza con un error de validación.
3. **Given** un estado ausente o no permitido, **When** se crea o actualiza una tarea, **Then** se
   rechaza con un error de validación.
4. **Given** un identificador malformado, **When** se solicita un recurso, **Then** se devuelve un
   error de solicitud inválida; un identificador válido pero inexistente devuelve recurso no
   encontrado.
5. **Given** un error inesperado, **When** se procesa una solicitud, **Then** se devuelve un error
   seguro con código estable y sin consultas, rutas internas ni trazas.

### User Story 4 - Proteger y documentar el acceso (Priority: P2)

Como responsable técnico, quiero habilitar protección básica mediante configuración y consultar
documentación interactiva para integrar clientes de forma segura y consistente.

**Why this priority**: La autenticación configurable cubre demostraciones protegidas sin introducir
gestión de usuarios, mientras la documentación reduce errores de integración.

**Independent Test**: Ejecutar la API con protección deshabilitada y habilitada, probar solicitudes
sin token, con token inválido y con token válido, y consultar la documentación de cada operación.

**Acceptance Scenarios**:

1. **Given** la protección deshabilitada, **When** se solicita cualquier operación permitida,
   **Then** se procesa sin exigir credenciales.
2. **Given** la protección habilitada, **When** falta el token o es inválido, **Then** se devuelve
   una respuesta de no autorizado y no se ejecuta la operación.
3. **Given** la protección habilitada y un token válido, **When** se solicita una operación,
   **Then** la solicitud continúa normalmente.
4. **Given** un desarrollador consumidor, **When** abre la ruta de documentación, **Then** puede
   descubrir operaciones, datos, filtros, respuestas, errores y autenticación.

### User Story 5 - Ejecutar y mantener el servicio (Priority: P2)

Como desarrollador del equipo, quiero configurar, probar y ejecutar el backend de forma repetible
para mantenerlo con confianza y diagnosticar problemas operativos.

**Why this priority**: La repetibilidad y las pruebas automatizadas reducen regresiones y hacen que
el proyecto sea entregable a otro desarrollador.

**Independent Test**: Configurar el entorno desde el ejemplo proporcionado, iniciar el servicio,
ejecutar la suite automatizada y comprobar que los datos sobreviven a un reinicio.

**Acceptance Scenarios**:

1. **Given** una configuración válida, **When** se inicia el servicio, **Then** se validan las
   opciones y se inicia sin intervención adicional.
2. **Given** una configuración requerida inválida, **When** se inicia el servicio, **Then** falla
   rápidamente con un mensaje claro y seguro.
3. **Given** una tarea persistida, **When** el servicio se reinicia, **Then** la tarea conserva sus
   datos, identificador y fechas.
4. **Given** un desarrollador nuevo, **When** sigue el README, **Then** puede instalar, configurar,
   ejecutar, probar y consultar la API sin instrucciones externas.

### Edge Cases

- Cuerpo ausente, JSON malformado o tipo de contenido incorrecto debe producir un error de solicitud
  controlado.
- Campos adicionales que intenten definir identificador o fechas no deben sobrescribir valores del
  backend.
- Una descripción vacía puede representarse como nula de forma consistente.
- Búsquedas con comillas, comodines o caracteres especiales no deben alterar la consulta ni causar
  un fallo del servicio.
- Solicitudes repetidas de actualización o eliminación sobre una tarea borrada deben producir
  respuestas previsibles.
- Rutas inexistentes, métodos no soportados y tiempos de espera deben producir errores seguros.
- Fallos de almacenamiento, inicialización o migración no deben exponer detalles internos ni
  terminar el proceso sin control.
- Solicitudes concurrentes sobre la misma tarea deben conservar invariantes y no producir datos
  parcialmente actualizados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST exponer operaciones para listar, consultar por identificador, crear,
  actualizar y eliminar tareas.
- **FR-002**: El sistema MUST asignar identificadores únicos y fechas de creación y actualización;
  el cliente MUST NOT controlar esos valores.
- **FR-003**: El sistema MUST aceptar únicamente los estados `pending`, `in_progress` y `done`.
- **FR-004**: El sistema MUST exigir títulos textuales no vacíos después de quitar espacios, con
  un máximo de 100 caracteres.
- **FR-005**: El sistema MUST limitar las descripciones textuales a 500 caracteres y normalizar
  consistentemente una descripción vacía.
- **FR-006**: El sistema MUST validar cuerpos, identificadores, consultas y credenciales antes de
  ejecutar una operación.
- **FR-007**: El sistema MUST devolver códigos HTTP coherentes: creación exitosa `201`, validación
  inválida `400`, credenciales inválidas `401`, recurso ausente `404` y fallo inesperado `500`.
- **FR-008**: El sistema MUST devolver una estructura consistente para éxitos y errores, incluyendo
  código de error estable, mensaje legible y detalles de campo cuando corresponda.
- **FR-009**: El sistema MUST devolver fechas en formato ISO 8601 y un identificador de solicitud
  para correlación cuando sea posible.
- **FR-010**: El sistema MUST conservar las tareas entre reinicios y aislar los datos de pruebas
  de los datos locales de desarrollo.
- **FR-011**: El sistema MUST permitir búsqueda insensible a mayúsculas sobre título y descripción,
  ignorando espacios externos del término.
- **FR-012**: El sistema MUST permitir filtrar por estado y rechazar estados no soportados sin
  producir un error interno.
- **FR-013**: El sistema MUST proteger las consultas de búsqueda y filtrado frente a caracteres
  especiales y entradas manipuladas.
- **FR-014**: El sistema MUST permitir activar o desactivar autenticación mediante configuración;
  cuando esté activa, debe validar un token de encabezado sin registrarlo.
- **FR-015**: El sistema MUST ofrecer documentación de las operaciones, modelos, filtros,
  respuestas, errores y autenticación en una ruta accesible.
- **FR-016**: El sistema MUST proporcionar configuración de entorno de ejemplo y documentación
  para instalación, ejecución, pruebas, persistencia, autenticación y CORS.
- **FR-017**: El sistema MUST registrar errores inesperados con contexto seguro y MUST NOT devolver
  trazas, secretos, rutas del sistema o detalles de almacenamiento a los clientes.
- **FR-018**: El sistema MUST incluir pruebas automatizadas para casos de uso, validación, rutas,
  respuestas, errores, autenticación, búsqueda, filtrado y persistencia.
- **FR-019**: La solución MUST mantener separadas las responsabilidades de dominio, aplicación,
  persistencia, presentación HTTP, configuración y middleware, sin dependencias circulares.
- **FR-020**: El sistema MUST permitir probar la aplicación sin abrir un puerto de red real y MUST
  separar la configuración de la aplicación del arranque del servidor.
- **FR-021**: El sistema MUST aplicar límites razonables al cuerpo JSON, CORS configurable,
  encabezados de seguridad y tiempos de espera controlados.
- **FR-022**: El sistema MUST documentar una única respuesta exitosa para la eliminación y respetar
  que una respuesta sin contenido no incluya cuerpo.

### Key Entities

- **Tarea**: Unidad de trabajo administrable, con identificador único, título, descripción opcional,
  estado y fechas de creación y actualización.
- **Estado de tarea**: Valor controlado que representa `pending`, `in_progress` o `done`.
- **Consulta de tareas**: Criterios opcionales de búsqueda textual y filtro por estado.
- **Respuesta de API**: Envoltorio consistente para datos individuales, colecciones, metadatos y
  errores correlacionables.
- **Configuración del servicio**: Valores de ejecución como puerto, prefijo, almacenamiento,
  origen permitido, timeout, autenticación y nivel de registro.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un consumidor puede completar el flujo crear-consultar-actualizar-eliminar sin
  intervención manual en el almacenamiento y recibe el resultado esperado en cada paso.
- **SC-002**: El 100% de los datos aceptados cumple las reglas de título, descripción y estado; el
  100% de entradas inválidas cubiertas por los escenarios devuelve una respuesta de validación,
  no un error interno.
- **SC-003**: Al menos el 95% de las búsquedas y listados de una colección de referencia de 1.000
  tareas devuelve resultados en menos de 1 segundo bajo condiciones locales normales.
- **SC-004**: El 100% de las respuestas de error cubiertas por pruebas incluye código estable,
  mensaje seguro y, cuando esté disponible, identificador de solicitud sin secretos ni trazas.
- **SC-005**: Una nueva persona desarrolladora puede configurar y ejecutar el servicio siguiendo el
  README en menos de 15 minutos y ejecutar la suite automatizada con un único comando documentado.
- **SC-006**: El 100% de los endpoints obligatorios y filtros descritos aparece en la documentación
  publicada con ejemplos y códigos de respuesta coherentes.
- **SC-007**: Con autenticación habilitada, el 100% de solicitudes sin credencial o con credencial
  inválida es rechazado antes de modificar o revelar datos protegidos.
- **SC-008**: Después de reiniciar el servicio, el 100% de las tareas creadas en la prueba de
  persistencia conserva contenido, identificador y fecha de creación.

## Assumptions

- La API se consume mediante HTTP y expone el prefijo `/api` y las operaciones de tareas descritas.
- La eliminación usará `204 No Content`, sin cuerpo, porque es la estrategia recomendada en el
  encargo y simplifica el contrato.
- La persistencia local será relacional y estará respaldada por SQLite en la primera entrega; el
  contrato funcional no depende de una marca concreta de almacenamiento.
- La autenticación es un token compartido para demostraciones, no un sistema de cuentas o permisos.
- El origen permitido por defecto es el cliente local en `http://localhost:4200`, configurable por
  entorno.
- La paginación y el ordenamiento avanzado no son necesarios para la primera entrega; búsqueda y
  filtro por estado sí lo son.
- Los consumidores pueden enviar solicitudes JSON válidas y tienen acceso a la ruta de
  documentación.
- El servicio debe soportar el volumen de referencia de 1.000 tareas sin requerir despliegue
  distribuido.
- La interfaz Angular y cualquier experiencia visual pertenecen a otro alcance y no se especifican
  aquí.
- Las decisiones técnicas detalladas se definirán durante la planificación respetando la
  constitución del proyecto.