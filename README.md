## INSTALL EXTENSIONES bcrypt - PARA ENCRIPTAR CONTRASEÑAS
npm install bcrypt

## INSTALL NEXT-AUTH - PARA LA AUTENTICACIÓN
npm install next-auth

## INSTALL REACT HOOK FORM - PARA LOS FORMULARIOS
npm install react-hook-form

## INSTALL NODEMAILER
npm install nodemailer

## INSTALL PRISMA.ORM IN NEXT.JS - BASE DE DATOS
npm install prisma --save-dev // Instalar Prisma
npx prisma init --datasource-provider postgresql // Inicializa prisma
npx prisma migrate dev --name nombre_de_tu_migracion // Crea una migración
npx prisma generate // Esto asegura que los modelos de TypeScript utilizados en tu código estén en sincronía con tu base de datos.
npx prisma migrate deploy // Ejecuta la migración
npx prisma studio // Abre el panel de prisma

## EJECUTAR SEMILLA O SEED.JS - PRISMA

# Agregar al package.json:

"prisma": {
"seed": "node prisma/seed.js"
},

npx prisma db seed    