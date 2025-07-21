<script>
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  export let usuarioActual;
  export let alimentosFavoritos;

  const dispatch = createEventDispatcher();

  // Convertir los alimentos favoritos a un array de IDs para un manejo más fácil
  let seleccionados = alimentosFavoritos.map(alimento => alimento.id);

  const categorias = [
    {
      nombre: "Frutas",
      items: [
        { id: 1, nombre: "Manzana", icono: "🍎", calorias: 52 },
        { id: 2, nombre: "Banano", icono: "🍌", calorias: 89 },
        { id: 3, nombre: "Fresa", icono: "🍓", calorias: 33 },
        { id: 4, nombre: "Uvas", icono: "🍇", calorias: 69 },
        { id: 5, nombre: "Piña", icono: "🍍", calorias: 50 },
        { id: 6, nombre: "Mango", icono: "🥭", calorias: 60 },
        { id: 7, nombre: "Naranja", icono: "🍊", calorias: 47 },
        { id: 8, nombre: "Sandía", icono: "🍉", calorias: 30 }
      ]
    },
    {
      nombre: "Lácteos",
      items: [
        { id: 9, nombre: "Leche", icono: "🥛", calorias: 42 },
        { id: 10, nombre: "Yogur", icono: "🍶", calorias: 59 },
        { id: 11, nombre: "Queso", icono: "🧀", calorias: 402 },
        { id: 12, nombre: "Mantequilla", icono: "🧈", calorias: 717 },
        { id: 13, nombre: "Helado", icono: "🍨", calorias: 207 },
        { id: 14, nombre: "Batido", icono: "🥤", calorias: 150 },
        { id: 15, nombre: "Chocolate", icono: "🍫", calorias: 546 },
        { id: 16, nombre: "Café con leche", icono: "☕", calorias: 42 }
      ]
    },
    {
      nombre: "Proteínas",
      items: [
        { id: 17, nombre: "Huevo", icono: "🥚", calorias: 155 },
        { id: 18, nombre: "Pollo", icono: "🍗", calorias: 165 },
        { id: 19, nombre: "Carne", icono: "🥩", calorias: 250 },
        { id: 20, nombre: "Pescado", icono: "🐟", calorias: 206 },
        { id: 21, nombre: "Tofu", icono: "🧈", calorias: 76 },
        { id: 22, nombre: "Cerdo", icono: "🐖", calorias: 242 },
        { id: 23, nombre: "Lentejas", icono: "🍲", calorias: 116 },
        { id: 24, nombre: "Frijoles", icono: "🫘", calorias: 127 }
      ]
    },
    {
      nombre: "Carbohidratos",
      items: [
        { id: 25, nombre: "Arroz", icono: "🍚", calorias: 130 },
        { id: 26, nombre: "Pan", icono: "🍞", calorias: 265 },
        { id: 27, nombre: "Pasta", icono: "🍝", calorias: 131 },
        { id: 28, nombre: "Maíz", icono: "🌽", calorias: 86 },
        { id: 29, nombre: "Papa", icono: "🥔", calorias: 77 },
        { id: 30, nombre: "Yuca", icono: "🫚", calorias: 160 },
        { id: 31, nombre: "Avena", icono: "🌾", calorias: 389 },
        { id: 34, nombre: "Arepa", icono: "🫓", calorias: 227 }
      ]
    },
    {
      nombre: "Grasas y frutos secos",
      items: [
        { id: 32, nombre: "Aguacate", icono: "🥑", calorias: 160 },
        { id: 33, nombre: "Mantequilla de maní", icono: "🫙", calorias: 588 },
        { id: 35, nombre: "Maní", icono: "🥜", calorias: 567 },
        { id: 36, nombre: "Almendras", icono: "🌰", calorias: 579 },
        { id: 37, nombre: "Palomitas", icono: "🍿", calorias: 536 }
      ]
    }
  ];

  // Función para agregar o quitar un alimento de la selección
  function alternarSeleccion(id) {
    if (seleccionados.includes(id)) {
      seleccionados = seleccionados.filter(item => item !== id);
    } else {
      seleccionados = [...seleccionados, id];
    }
  }

  // Función para guardar los cambios en la base de datos
  // Dentro de la función guardar en ModalEditarFavoritos.svelte

async function guardar() {
    const res = await window.electronAPI.guardarAlimentosFavoritos(usuarioActual.id, seleccionados);
    
    if (res.success) {
      // ✅ Si la operación es exitosa, notifica al componente padre
      dispatch('guardado');
    }
    
    // ✅ Siempre cierra el modal después del intento de guardado
    dispatch('cerrar');
}
</script>

<div class="modal-backdrop">
  <div class="modal-content card shadow p-4" transition:fade>
    <h4 class="card-header fw-bold mb-3 text-center">Gestionar alimentos favoritos ⭐</h4>
    
    <p class="text-muted text-center mb-4">
      Selecciona los alimentos que quieres tener en tu lista de favoritos.
    </p>

    {#each categorias as categoria}
      <div class="mb-3">
        <h6 class="fw-semibold">{categoria.nombre}</h6>
        <div class="d-flex flex-wrap gap-2">
          {#each categoria.items as alimento}
            <button class="chip-button"
              class:selected={seleccionados.includes(alimento.id)}
              on:click={() => alternarSeleccion(alimento.id)}>
              <span>{alimento.icono} {alimento.nombre}</span>
            </button>
          {/each}
        </div>
      </div>
    {/each}

    <div class="d-flex justify-content-end mt-4">
      <button class="btn btn-primary fw-semibold" on:click={guardar}>
        Guardar cambios <i class="fa-solid fa-check-circle ms-2"></i>
      </button>
    </div>
  </div>
</div>

<style>
  /* Aquí puedes pegar los estilos de tu archivo Preferencias.svelte */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
  }

  .modal-content {
    background-color: #fff;
    border-radius: 1.5rem;
    max-width: 700px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    animation: fade-in 0.3s ease;
  }

  .chip-button {
    border: 1px solid #ddd;
    background-color: #f8f9fa;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
  }

  .chip-button:hover {
    background-color: #e9ecef;
  }

  .chip-button.selected {
    background-color: #ffc107;
    border-color: #ffc107;
    color: white;
    font-weight: 600;
  }

  .chip-button span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Estilos adicionales para un mejor diseño */
  h6.fw-semibold {
    margin-bottom: 0.5rem;
    color: #495057;
  }

  .btn-primary {
    background-color: #ffc107;
    border-color: #ffc107;
  }

  .btn-primary:hover {
    background-color: #e0a800;
    border-color: #e0a800;
  }
</style>