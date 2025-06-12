## EJEMPLO SETTING BRANCH

## INSTALL HEROICONS - ICONOS
npm install lucide-react
https://lucide.dev/icons/

## INSTALL REACT SPINNERS
npm install react-spinners

npm install @heroicons/react                            // Importar los iconos en el archivo que se necesite       
Ej: import { BeakerIcon } from '@heroicons/react/solid'

# TailwindCSS Formater
npm install -D prettier prettier-plugin-tailwindcss



## INSTALL EXTENSIONES bcrypt - PARA ENCRIPTAR CONTRASEÑAS
npm install bcrypt                                      // Encriptar contraseñas

## INSTALL PRISMA.ORM IN NEXT.JS - BASE DE DATOS
npm install prisma --save-dev                           // Instalar Prisma
npx prisma init --datasource-provider postgresql        // Inicializa prisma
npx prisma migrate dev --name nombre_de_tu_migracion    // Crea una migración
npx prisma migrate deploy                               // Ejecuta la migración
npx prisma studio                                       // Abre el panel de prisma

## EJECUTAR SEMILLA O SEED.JS - PRISMA
# Agregar al package.json:
"prisma": {
"seed": "node prisma/seed.js"
},

npx prisma db seed                                      // Ejecuta la semilla

## DESDE ACÁ SON TODOS COMPONENTES PARA FUNCIONALIDAD Y DISEÑO.

## INSTALL REACT-DATA-TABLE-COMPONENT - PARA LAS TABLAS
npm install react-data-table-component                  // Instalar DataTables

## INSTALL NEXT-AUTH - PARA LA AUTENTICACIÓN
npm install next-auth                                   // Inicializar Autenticación
## INSTALL REACT HOOK FORM - PARA LOS FORMULARIOS
npm install react-hook-form                             // Inicializar Formularios

## INSTALL SWEETALERT2
npm install sweetalert2

## AUMENTAR BUFFER DE GIT CONFIG
git config http.postBuffer 524288000

## INSTALL NODEMAILER
npm install nodemailer

## PRODUCCIÓN.

Para migrar el contenido de una base de datos existente a una nueva base de datos en tu proyecto Next.js con Prisma y PostgreSQL, sigue estos pasos:  
Exportar los datos de la base de datos actual:  
Utiliza una herramienta como pg_dump para exportar los datos de la base de datos actual a un archivo SQL.
pg_dump -U <usuario> -h <host> -d <nombre_base_datos> -F c -b -v -f backup.sql
Importar los datos a la nueva base de datos:  
Utiliza una herramienta como psql para importar los datos del archivo SQL a la nueva base de datos.
psql -U <usuario> -h <host> -d <nombre_nueva_base_datos> -f backup.sql
Actualizar la URL de la base de datos en tu proyecto:  
Abre el archivo .env y actualiza la variable DATABASE_URL con la nueva URL de la base de datos.
Ejecutar las migraciones de Prisma:  
Abre una terminal en el directorio raíz de tu proyecto y ejecuta el siguiente comando para desplegar las migraciones:
npx prisma migrate deploy
Verificar la migración:  
Asegúrate de que los datos se hayan migrado correctamente y que tu aplicación funcione con la nueva base de datos.
Estos pasos te permitirán migrar el contenido de tu base de datos actual a una nueva base de datos en tu proyecto Next.js con Prisma y PostgreSQL.


#### PASAR A PRODUCCIÓN EL SISTEMA ####

### RESPALDAR TABLAS ###

- PAISES
- CIUDADES
- AEROPUERTOS
- PUERTOS
- TIPO DE TRANSPORTES
- TIPOS DE PROVEEDORES
- INCOTERMS

