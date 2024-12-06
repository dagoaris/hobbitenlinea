// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCvFBXaVgcPk-iPaQ3TKIgACdUVZdWvWIQ",
  authDomain: "datahobbit-aff97.firebaseapp.com",
  projectId: "datahobbit-aff97",
  storageBucket: "datahobbit-aff97.firebasestorage.app",
  messagingSenderId: "452563551077",
  appId: "1:452563551077:web:0cc2e7612b9c0b9bebd78c"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// Función para agregar producto al inventario en Firestore
document.getElementById('form-producto').addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const cantidad = parseInt(document.getElementById('cantidad').value);

    if (!nombre || isNaN(cantidad) || cantidad < 0) {
        alert('Por favor, ingresa un nombre y una cantidad válidos.');
        return;
    }

    // Agregar el producto a Firestore
    db.collection("productos").add({
        nombre: nombre,
        cantidad: cantidad,
        fecha: new Date()
    }).then(() => {
        alert('Producto agregado correctamente.');
        cargarInventario();
    }).catch(error => {
        console.error("Error agregando producto: ", error);
        alert('Ocurrió un error al agregar el producto.');
    });
});

// Función para cargar el inventario desde Firestore
function cargarInventario() {
    const productosList = document.getElementById('productos-list');
    productosList.innerHTML = '';

    db.collection("productos").get().then(snapshot => {
        snapshot.forEach(doc => {
            const producto = doc.data();
            const productoDiv = document.createElement('div');
            productoDiv.textContent = `Nombre: ${producto.nombre} | Cantidad: ${producto.cantidad}`;
            productosList.appendChild(productoDiv);
        });
    }).catch(error => {
        console.error("Error cargando inventario: ", error);
    });
}

// Cargar el inventario al cargar la página
window.onload = cargarInventario;
