// Constantes de navbar
const boton = document.getElementById("hamburger");
const menu = document.getElementById("menu");
// Fin
// Abrir y cerrar carrito
const deseados = document.getElementById("deseados");
const carro = document.getElementById("carro");
// Fin

// Agregar al carrito
const carrito = document.getElementById("carrito");
const productos = document.getElementById("productos");
const vaciarcarrito = document.getElementById("vaciar__carrito");
// Operadores
const aumentar = document.querySelector(".carrito__mas");
const reducir = document.querySelector(".carrito__menos");
const cantidadcarro = document.querySelector(".nav__num--carro");

const totalcontent = document.getElementById('total');

const contentcarrito = document.getElementById("carritocontenido");

let articulosCarrito = [];
// Fin

// Funcion de abrir y cerrar el nav
boton.addEventListener("click", function () {
  menu.classList.toggle("nav__items--open");
});
// Fin

// Funcion para ver el modal de compras
carro.addEventListener("click", function () {
  carrito.classList.toggle("carrito--open");
});
// Fin

cargarEventListeners();

function cargarEventListeners() {
  //Cuando agregar un curso presionando "Agregar al carrito"
  productos.addEventListener("click", agregarCurso);

  //Elimina cursos del carrito
  carrito.addEventListener("click", eliminarCursos);

  // Muestra los cursos de local Storage

  document.addEventListener("DOMContentLoaded",() =>{

    articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carritoHTML();

  });

  //Vaciar cursos del carrito
  vaciarcarrito.addEventListener("click", () => {
    articulosCarrito = [];
    totalcontent.textContent = 0;
    cantidadcarro.textContent = 0;
    sincronizarStorage();
    limpiarHTML();
  });

  //   Operadores

  carrito.addEventListener("click", sumar);
  //   carrito.addEventListener("click", restar);
  
}

// Funciones

function agregarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar__carrito")) {
    const cursoSeleccionado =
      e.target.parentElement.parentElement.parentElement;

    leerDatosCurso(cursoSeleccionado);
  }
}

// Eliminar un curso del carrito

function eliminarCursos(e) {
  // console.log(e.target.classList)

  if (e.target.classList.contains("carrito__delete")) {
    const cursoId = e.target.getAttribute("data-id");
    //Eliminar del arreglo de articulosCarrito por el data-id
    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);

    carritoHTML();
    
  }
}

// Operadores

function sumar(e) {
  // console.log(e.target.classList
  if (e.target.classList.contains("carrito__mas")) {
    const cursoId = e.target.getAttribute("data-id");
    //Eliminar del arreglo de articulosCarrito por el data-id
    articulosCarrito = articulosCarrito.map((curso) => {
      if (curso.id === cursoId) {
        curso.cantidad++;
        return curso;
      } else {
        return curso; //Retorna los objetos que no son los duplicados
      }
    });
    carritoHTML();
  } else if (e.target.classList.contains("carrito__menos")) {
    const cursoId = e.target.getAttribute("data-id");
    //Eliminar del arreglo de articulosCarrito por el data-id
    articulosCarrito = articulosCarrito.map((curso) => {
      if (curso.id === cursoId) {
        curso.cantidad--;
        return curso;
      } else {
        return curso; //Retorna los objetos que no son los duplicados
      }
    });
    carritoHTML();
  }
}

// Lee el contenido del Html al que le dimos click y extrae la informacion del curso

function leerDatosCurso(curso) {
  // console.log(curso);

  // Crear un objeto con el contenido del curso actual

  const infoCurso = {
    imagen: curso.querySelector("img").src,
    marca: curso.querySelector("h3").textContent,
    titulo: curso.querySelector("h2").textContent,
    precio: curso.querySelector(".precio").textContent,
    id: curso.querySelector("i").getAttribute("data-id"),
    cantidad: 1,
    // subtotal: (precio * cantidad).toFixed(2),
  };

  //Revisa si un elemento ya existe en el carrito

  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (existe) {
    // Actualizamos la cantidad
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; //Retorna el objeto actualizado
      } else {
        return curso; //Retorna los objetos que no son los duplicados
      }
    });

    articulosCarrito = [...cursos];
  } else {
    //Agregarmos al carrito

    articulosCarrito = [...articulosCarrito, infoCurso];
  }
  //Agrega elementos al arreglo de carrito

  //   console.log(articulosCarrito);
  carritoHTML();
}

//Muesta el carruto de compras en el html

function carritoHTML() {
  // Limpiar HTML

  limpiarHTML();
  // Recorre el carrito y genera el HTML
  let total = 0;
  let contador = 0;

  const prodlimpio = articulosCarrito.filter(function (curs){
    if(curs.cantidad>0){
      return true;
    }
  });

  prodlimpio.forEach((curso) => {
    const { imagen, marca, titulo, precio, cantidad, id } = curso;
    contador ++;
    total = total + parseFloat((precio * cantidad).toFixed(2));
    const row = document.createElement("div");
    row.classList.add("carrito__producto");
    // ${total.toFixed(2)}
    row.innerHTML = `<img src="${imagen}" alt="" class="carrito__img">
         <div class="carrito__description">
            <h3 class="carrito__marca">${marca}</h3>
             <h2 class="carrito__nombre">${titulo}</h2>
             <div class="carrito__precios">
                <div class="carrito__precio">
                    <span>S/</span><span class=" ">${precio}</span>
                </div>
                <div class="carrito__precio carrito__precio--subtotal">
                    <span> S/</span><span class="">${parseFloat(
                      (precio * cantidad).toFixed(2)
                    )}</span>
                </div>
                                 
                                    </div>
             <div class="carrito__cantidades">
         <span class="carrito__operador carrito__menos" data-id="${id}">-</span>
         <span class="carrito__cantidad">${cantidad}</span>
         <span class="carrito__operador carrito__mas" data-id="${id}">+</span>
     </div>
         </div>
         <i class="fa-solid fa-circle-xmark carrito__delete" data-id="${id}"></i>
        
         
         `;
    //Agrega el Html del carrito en el div
    contentcarrito.appendChild(row);
  });

  //Agregar el carrito de compras al storage

  sincronizarStorage();

  cantidadcarro.textContent =  contador;
  totalcontent.textContent = parseFloat((total).toFixed(2));
 
  

}


function sincronizarStorage() {
  
  localStorage.setItem('carrito',JSON.stringify(articulosCarrito)); 

}


//ELIMINa los cursos del carrito

function limpiarHTML() {
  // Forma lenta
  // contentcarrito.innerHTML='';

  while (contentcarrito.firstChild) {
    contentcarrito.removeChild(contentcarrito.firstChild);
  }
}
