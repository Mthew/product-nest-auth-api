# Seguridad y Desarrollo en la Nube (Respuestas Breves)

Aquí tienes las respuestas a tus preguntas, presentadas de manera concisa y clara, como lo haría un arquitecto de software.

---

### **¿Cuáles son las diferencias fundamentales entre OAuth y JWT?**

- **OAuth (Open Authorization)**: Es un **protocolo de autorización**. Su objetivo principal es delegar el acceso a recursos. Permite que una aplicación actúe en nombre de un usuario sin necesidad de conocer sus credenciales.

  - **Analogía**: Es como la llave de valet de un hotel; le das permiso a alguien (una app) para que use tu coche (tus datos), pero con limitaciones y sin darle la llave maestra.
  - **Enfoque**: Define los flujos y roles (cliente, servidor de recursos, servidor de autorización) para conceder permisos de forma segura.

- **JWT (JSON Web Token)**: Es un **estándar para crear tokens**. Es una forma compacta y autónoma de transmitir información segura (llamada _claims_) como un objeto JSON.
  - **Analogía**: Es como una tarjeta de identificación o un pase de abordar sellado y firmado. Contiene información sobre quién eres y a qué tienes acceso, y su firma digital garantiza que no ha sido alterado.
  - **Enfoque**: Define la estructura de un token. Puede ser utilizado _dentro_ de un flujo OAuth como el "artefacto" que se entrega para probar la autorización concedida.

**En resumen**: **OAuth es el proceso de autorización (el "cómo"), mientras que JWT es a menudo el token resultante (el "qué") que demuestra ese permiso.**

---

### **¿Cómo asegurarías una API desplegada en Azure contra ataques de fuerza bruta?**

Para proteger una API en Azure, implementaría una estrategia de defensa en capas, principalmente utilizando **Azure API Management** y el **Web Application Firewall (WAF)** de Azure:

1.  **Rate Limiting (Limitación de Tasa)**:

    - Configurar políticas en Azure API Management para limitar el número de solicitudes por IP o por clave de suscripción en un intervalo de tiempo. Por ejemplo, `100 peticiones por minuto`.

2.  **Throttling (Regulación)**:

    - Establecer cuotas de uso (ej. `10,000 llamadas por mes`) para evitar el abuso sistemático por parte de un cliente.

3.  **Bloqueo de IP y Reglas de Firewall**:

    - Utilizar el Web Application Firewall (WAF) de Azure Application Gateway para crear reglas que bloqueen automáticamente direcciones IP que muestren patrones de ataque (ej. múltiples fallos de autenticación desde la misma IP).

4.  **Políticas de Bloqueo de Cuentas**:

    - A nivel de lógica de aplicación, implementar un mecanismo que bloquee temporalmente las cuentas de usuario después de un número determinado de intentos de inicio de sesión fallidos (ej. 5 intentos).

5.  **Implementación de CAPTCHA**:
    - Integrar un servicio como reCAPTCHA en los endpoints de autenticación críticos para distinguir a los usuarios humanos de los bots automatizados.

---

### **¿Qué buenas prácticas de seguridad seguirías al manejar datos sensibles en MongoDB?**

La protección de datos sensibles en MongoDB se basa en un enfoque multicapa:

1.  **Cifrado en Tránsito**:

    - Forzar siempre las conexiones a la base de datos a través de **TLS/SSL** para que los datos viajen cifrados por la red.

2.  **Cifrado en Reposo**:

    - Habilitar el **Cifrado Transparente de Datos (TDE)**, disponible en MongoDB Atlas y la versión Enterprise. Esto cifra los archivos físicos de la base de datos en el disco.

3.  **Cifrado a Nivel de Campo del Lado del Cliente (Client-Side Field Level Encryption)**:

    - Para los datos más críticos (ej. DNI, números de tarjeta de crédito), cifrarlos en la propia aplicación **antes** de enviarlos a MongoDB. De esta manera, la base de datos almacena los datos ya cifrados y no tiene acceso a las claves de descifrado.

4.  **Control de Acceso Basado en Roles (RBAC)**:

    - Aplicar el **principio de mínimo privilegio**. Crear usuarios y roles específicos con los permisos estrictamente necesarios para sus tareas. Nunca usar cuentas de administrador para las operaciones de la aplicación.

5.  **Auditoría**:

    - Activar la auditoría de MongoDB para registrar eventos de acceso y modificación de datos sensibles. Esto es crucial para detectar actividades no autorizadas y cumplir con normativas como GDPR o HIPAA.

6.  **Red Privada**:
    - Desplegar la base de datos en una red virtual privada (VNet en Azure, VPC en AWS) y restringir el acceso únicamente a las IPs de los servidores de aplicación.

---

### **Describe brevemente cómo gestionarías el despliegue en la nube de una aplicación basada en microservicios.**

Gestionaría el despliegue enfocándome en la **automatización**, **orquestación** y **observabilidad**:

1.  **Contenerización**:

    - Empaquetaría cada microservicio en un contenedor **Docker**. Esto garantiza la portabilidad y la consistencia del entorno, eliminando el clásico problema de "en mi máquina sí funciona".

2.  **Orquestación de Contenedores**:

    - Utilizaría un orquestador como **Kubernetes** (a través de un servicio gestionado como Azure Kubernetes Service - AKS). Kubernetes se encargaría de automatizar:
      - **Despliegue**: Lanzar nuevas versiones de los servicios.
      - **Auto-escalado**: Añadir o quitar réplicas de un servicio según la demanda.
      - **Auto-reparación**: Reiniciar automáticamente contenedores que fallen.
      - **Balanceo de carga y descubrimiento de servicios**.

3.  **Pipelines de CI/CD (Integración y Despliegue Continuo)**:

    - Implementaría un pipeline automatizado con herramientas como **Azure DevOps** o **GitHub Actions**. Cada microservicio tendría su propio pipeline que compila el código, ejecuta pruebas unitarias y de integración, construye la imagen Docker y la despliega en Kubernetes sin intervención manual. Esto permite entregas rápidas y fiables.

4.  **Infraestructura como Código (IaC)**:

    - Definiría toda la infraestructura de nube (redes, clusters de Kubernetes, bases de datos) usando herramientas como **Terraform** o **Bicep**. Esto permite versionar la infraestructura y recrearla de forma predecible en cualquier momento.

5.  **Observabilidad**:
    - Desplegaría una pila de observabilidad (ej. **Azure Monitor**, **Prometheus**, **Grafana**, **Jaeger**) para centralizar logs, métricas y trazas de todos los microservicios. Esto es fundamental para entender el comportamiento del sistema distribuido y diagnosticar problemas rápidamente.
