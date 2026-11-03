// Archivo principal de UniBot


const readline = require('readline/promises');
const { stdin, stdout } = require('process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const rl = readline.createInterface({
    input: stdin,
    output: stdout
});

// Leer los estudiantes desde el archivo CSV
function cargarEstudiantes() {
    try {
        const rutaCSV = path.join(__dirname, '..', 'data', 'estudiantes.csv');
        const contenido = fs.readFileSync(rutaCSV, 'utf-8');

        const lineas = contenido.trim().split(/\r?\n/);

        return lineas.slice(1).map(linea => {
            const [codigo, nombreCompleto, carrera] = linea.split(',');

            return {
                codigo: codigo.trim(),
                nombreCompleto: nombreCompleto.trim(),
                carrera: carrera.trim()
            };
        });

    } catch (error) {
        console.log('Error al leer el archivo de estudiantes:', error.message);
        return [];
    }
}

// Leer las carreras desde el archivo JSON
function cargarCarreras() {
    try {
        const rutaJSON = path.join(__dirname, '..', 'data', 'carreras.json');
        const contenido = fs.readFileSync(rutaJSON, 'utf-8');

        return JSON.parse(contenido);

    } catch (error) {
        console.log('Error al leer el archivo de carreras:', error.message);
        return [];
    }
}


// Ingreso del administrador
async function ingresarAdministrador() {
    const password = await rl.question('Ingrese la contraseña maestra: ');

    if (password === process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD) {
        console.log('\nAcceso autorizado. Bienvenido, administrador.\n');
    } else {
        console.log('\nContraseña incorrecta. Acceso denegado.\n');
    }
}

// Ingreso del estudiante
async function ingresarEstudiante() {
    const estudiantes = cargarEstudiantes();

    if (estudiantes.length === 0) {
        console.log('No hay estudiantes disponibles para validar.\n');
        return;
    }

    let estudianteEncontrado = null;

    while (!estudianteEncontrado) {
        const codigo = await rl.question('Ingrese su código institucional: ');

        estudianteEncontrado = estudiantes.find(
            estudiante => estudiante.codigo === codigo.trim()
        );

        if (!estudianteEncontrado) {
            console.log('Código no encontrado. Intente nuevamente.\n');
        }
    }

    console.log(`\n¡Bienvenido/a, ${estudianteEncontrado.nombreCompleto}!`);
    console.log(`Carrera: ${estudianteEncontrado.carrera}\n`);
}

// Menú principal
async function iniciarUniBot() {
    let opcion = '';

    console.log('================================');
    console.log('       UNIBOT - ASESOR ACADÉMICO');
    console.log('================================');

    while (opcion !== '3') {
        console.log('1. Administrador');
        console.log('2. Estudiante');
        console.log('3. Salir');

        opcion = await rl.question('\nSeleccione una opción: ');

        switch (opcion) {
            case '1':
                await ingresarAdministrador();
                break;

            case '2':
                await ingresarEstudiante();
                break;

            case '3':
                console.log('\nGracias por utilizar UniBot.');
                break;

            default:
                console.log('\nOpción no válida. Intente nuevamente.\n');
        }
    }
}

iniciarUniBot()
    .catch(error => {
        console.log('Ocurrió un error:', error.message);
    })
    .finally(() => {
        rl.close();
    });

