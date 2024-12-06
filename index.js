// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCvFBXaVgcPk-iPaQ3TKIgACdUVZdWvWIQ",
    authDomain: "datahobbit-aff97.firebaseapp.com",
    projectId: "datahobbit-aff97",
    storageBucket: "datahobbit-aff97.firebasestorage.app",
    messagingSenderId: "452563551077",
    appId: "1:452563551077:web:d1351a428fd6b1c2ebd78c"
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// Referencia al formulario y tabla de productos
const formProducto = document.getElementById('form-producto');
const tablaInventario = document.getElementById('tabla-inventario').getElementsByTagName('tbody')[0];

// Cargar productos desde Firestore
function cargarInventario() {
    db.collection("inventario").get().then(querySnapshot => {
        tablaInventario.innerHTML = ''; // Limpiar tabla
        querySnapshot.forEach(doc => {
            const producto = doc.data();
            const row = tablaInventario.insertRow();
            row.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>
                    <button class="eliminar" data-id="${doc.id}">Eliminar</button>
                </td>
            `;
        });

        // Agregar eventos para eliminar productos
        document.querySelectorAll('.eliminar').forEach(button => {
            button.addEventListener('click', eliminarProducto);
        });
    });
}

// Función para agregar un producto
formProducto.addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const cantidad = parseInt(document.getElementById('cantidad').value);

    if (!nombre || isNaN(cantidad) || cantidad < 0) {
        alert('Por favor, ingresa un nombre y una cantidad válidos.');
        return;
    }

    // Agregar producto a Firestore
    db.collection("inventario").add({
        nombre: nombre,
        cantidad: cantidad
    }).then(() => {
        cargarInventario(); // Recargar inventario
        formProducto.reset(); // Limpiar formulario
    }).catch(error => {
        console.error("Error agregando el producto: ", error);
    });
});

// Función para eliminar un producto
function eliminarProducto(e) {
    const id = e.target.getAttribute('data-id');
    db.collection("inventario").doc(id).delete().then(() => {
        cargarInventario(); // Recargar inventario
    }).catch(error => {
        console.error("Error eliminando el producto: ", error);
    });
}

// Cargar inventario al inicio
window.onload = cargarInventario;
