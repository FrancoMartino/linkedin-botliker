# LinkedIn Botliker - Automatización para LinkedIn

**LinkedIn Botliker** es una extensión de Chrome diseñada para automatizar interacciones en LinkedIn, específicamente dar "Me gusta" a publicaciones en el feed, simulando un comportamiento humano para evitar ser detectado. Opera a través de múltiples pestañas de manera secuencial, ofreciendo una herramienta potente para mantener actividad en la plataforma.

## 🛠 Instalación

1.  **Clona o Descarga** este repositorio en tu máquina local.
2.  Abre Google Chrome y navega a `chrome://extensions/`.
3.  Activa el **Modo de desarrollador** en la esquina superior derecha.
4.  Haz clic en **Cargar descomprimida** (Load unpacked).
5.  Selecciona la carpeta donde guardaste los archivos de **LinkedIn Botliker**.
6.  La extensión debería aparecer ahora en la barra de herramientas de tu navegador.

## 📖 Cómo Usar

1.  Abre una o más pestañas con **LinkedIn** (ej. tu feed de inicio).
2.  Haz clic en el icono de **LinkedIn Botliker** en la barra de herramientas de Chrome.
3.  Configura tus preferencias en el popup:
    *   **Pestañas Máximas**: Número de pestañas de LinkedIn que gestionará el bot.
    *   **Tiempo por Tab**: Cuánto tiempo (en segundos) permanece el bot en una pestaña antes de cambiar a la siguiente.
    *   **Velocidad de Scroll e Intervalos**: Controla cuán rápido y con qué frecuencia hace scroll el bot.
    *   **Delay Pre-Click**: Establece el tiempo de espera aleatorio mínimo y máximo antes de hacer clic en un botón "Me gusta".
4.  Haz clic en **Iniciar**.
    *   El bot identificará las pestañas abiertas de LinkedIn, alternará entre ellas, hará scroll y dará like a las publicaciones según tu configuración.
5.  Usa **Pausar** para detener temporalmente las operaciones o **Detener** para finalizar la sesión completamente.

## ⚙️ Opciones de Configuración

| Configuración | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| **Pestañas Máximas** | Número máximo de pestañas de LinkedIn a incluir en la rotación. | 5 |
| **Tiempo por Tab** | Duración (segundos) para permanecer activo en una pestaña específica antes de cambiar. | 20s |
| **Velocidad de Scroll** | Píxeles a desplazar en cada paso de scroll. | 25px |
| **Intervalo Scroll** (Min/Max) | Rango de tiempo aleatorio (ms) entre acciones de scroll. | 100-200ms |
| **Delay Pre-Click** (Min/Max) | Tiempo de espera aleatorio (ms) después de encontrar un botón y antes de hacer clic. | 500-1500ms |

## 📂 Estructura del Proyecto

*   **manifest.json**: Archivo de configuración de la extensión de Chrome (Manifest V3).
*   **background.js**: Service worker que gestiona el estado global, la lógica de ciclado de pestañas y los temporizadores de sesión.
*   **content.js**: Script inyectado en las páginas de LinkedIn. Maneja la interacción con el DOM (scroll, búsqueda de botones, clics).
*   **popup.html** y **popup.js**: La interfaz de usuario para configurar y controlar el bot.

## ⚠️ Aviso Legal

Esta herramienta es solo para fines educativos y de prueba. La interacción automatizada con sitios web puede violar sus Términos de Servicio. Usa esta herramienta bajo tu propia responsabilidad. Los autores no se hacen responsables de ninguna consecuencia derivada del uso de este software.
