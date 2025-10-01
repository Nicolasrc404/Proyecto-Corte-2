# Proyecto Final – Reconocimiento de Números Manuscritos

Aplicación web desarrollada en **React + Vite + TypeScript** para el reconocimiento de dígitos manuscritos, consumiendo una API de predicción mediante red neuronal en la nube.

## Autores:
- Nicolas Rubiano Cortes
- Angel Sebastian Castillo Leon
- Yonatan David Ruiz 

## 🚀 Tecnologías usadas

- React
- Vite
- TypeScript
- TailwindCSS
- SweetAlert2
- React Router

## ⚙️ Instalación

1. Clonar el repositorio:
    
    ```bash
    git clone https://github.com/Nicolasrc404/Proyecto-Corte-2.git
    cd Proyecto-2
    ```
    
2. Instalar dependencias:
    
    ```bash
    npm install
    ```
    
3. Iniciar la aplicación en modo desarrollo:
    
    ```bash
    npm run dev
    ```
    
4. Abrir en el navegador:
    
    ```
    http://localhost:5173
    ```
    

## 📌 Uso de la aplicación

### 🏠 Home (`/`)

Pantalla inicial con una breve descripción del proyecto y enlaces para navegar:

- Ir al formulario de reconocimiento.
- Consultar el historial de predicciones.

### 🖼️ ImageForm (`/image`)

Formulario principal donde el usuario:

- Sube una imagen de un dígito manuscrito (28x28 px).
- Marca si la imagen debe **invertirse** (cuando está en blanco sobre negro).
- Envía la imagen a la API con `multipart/form-data`.
- Recibe:
    - **Predicción del número**
    - **Precisión (%)**
    - **Tiempo de procesamiento**

Cada petición se guarda en **localStorage** para mantener un historial local.

### 📜 History (`/history`)

Página que muestra el **historial de predicciones** guardadas en el navegador.

Cada registro incluye:

- Predicción obtenida
- Precisión
- Tiempo de procesamiento
- Fecha y hora de ejecución

Además, desde esta página se puede volver al formulario de reconocimiento.

## 🔗 API

La aplicación consume el endpoint:

```
http://ec2-54-81-142-28.compute-1.amazonaws.com:8080/predict
```

Formato de los datos enviados:

- `invert`: `"true"` o `"false"`
- `image`: archivo de la imagen

Formato de la respuesta de la API:

```json
{
  "prediction": number,
  "accuracy": number,
  "process_time": "string"
}
```

## 🌳 File Tree

```markdown
├── 📁 public/
│   └── 🖼️ vite.svg
├── 📁 src/
│   ├── 📁 Components/
│   │   ├── 📁 History/
│   │   │   └── 📄 history.tsx
│   │   ├── 📁 Home/
│   │   │   └── 📄 PagHome.tsx
│   │   └── 📁 ImageForm/
│   │       ├── 🎨 index.css
│   │       └── 📄 index.tsx
│   ├── 📁 assets/
│   │   └── 🖼️ react.svg
│   ├── 📁 models/
│   │   └── 📄 Image.ts
│   ├── 🎨 App.css
│   ├── 📄 App.tsx
│   ├── 🎨 index.css
│   └── 📄 main.tsx
├── 🚫 .gitignore
├── 📖 README.md
├── 📄 eslint.config.js
├── 🌐 index.html
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 tsconfig.app.json
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
└── 📄 vite.config.ts
```
