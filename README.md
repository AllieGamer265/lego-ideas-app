# LEGO Builder Ideas 🧱

Una aplicación web impulsada por IA que analiza los sets de LEGO y genera nuevas construcciones alternativas basadas en el inventario real de piezas. Solo introduce el número del set y deja que el agente creativo haga el resto.

## ✨ Características

- Interfaz de usuario limpia y fácil de usar.
- Búsqueda instantánea de ideas por número de set.
- Integración con la API de Gemini para obtener análisis dinámicos.
- Inventario estimado de piezas del set consultado.
- Tres propuestas creativas con instrucciones paso a paso.
- Mensajes de estado y errores descriptivos para guiarte durante la búsqueda.

## 🚀 Tecnologías Utilizadas

- **Frontend:** React
- **Herramientas de Desarrollo:** Vite
- **Estilos:** CSS puro

## 🛠️ Cómo Ejecutar Localmente

1.  **Clona el repositorio (o descarga los archivos).**

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura la clave de la API de Gemini:**

    Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example` y añade tu clave:

    ```bash
    cp .env.example .env
    # Edita el archivo y reemplaza "tu_clave_de_gemini" por tu clave real
    ```

4.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

5.  Abre tu navegador y ve a la dirección que te indique la terminal (normalmente `http://localhost:5173`).

## 🔐 Variables de Entorno

- `VITE_GEMINI_API_KEY`: clave de la API de Gemini con permisos para usar el modelo `gemini-1.5-flash`.

## ⚠️ Aviso

El agente necesita acceso a Internet para consultar la información de los sets y puede tardar unos segundos en generar resultados. Si la API no está disponible o la respuesta no se puede interpretar, se mostrará un mensaje de error y podrás intentar nuevamente.
