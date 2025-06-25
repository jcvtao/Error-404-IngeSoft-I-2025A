<script>
  import { onMount } from 'svelte';
  export let calorias;
  export let imc; // IMC debe ser pasado por el padre
  export let altura; // Altura debe ser pasada por el padre
  export let onConfirmar = () => {};
  export let onBack = () => {};

  let current = 0;
  let mostrarEmoji = false;
  let slide = 0;

  const animarContador = () => {
    const duracion = 1000;
    const paso = Math.ceil(calorias / (duracion / 10));
    const interval = setInterval(() => {
      current += paso;
      if (current >= calorias) {
        current = calorias;
        clearInterval(interval);
        mostrarEmoji = true;
      }
    }, 10);
  };

  function categoriaIMC(valor) {
    if (valor < 18.5) return "Bajo peso";
    if (valor < 25) return "Normal";
    if (valor < 29.9) return "Sobrepeso";
    return "Obesidad";
  }

  onMount(() => {
    animarContador();
  });
</script>

<div class="text-dark px-3">
  <h3 class="fw-bold card-header mb-4">¡Todo listo! ✅</h3>

  <!-- Carrusel de info -->
  <div class="carousel-wrapper">
    {#if slide === 0}
      <div class="info-box animate-fade">
        <h4 class="fw-bold text-center mb-2">Calorías recomendadas</h4>
        <div class="contador-wrapper">
          <h1 class="display-3 fw-bold text-warning text-center">{current} kcal</h1>
          {#if mostrarEmoji}
            <div class="celebracion">🎉</div>
          {/if}
        </div>
        <p class="text-muted text-center">Según tus datos, incluyendo tu objetivo y actividad física.</p>
      </div>
    {:else}
      <div class="info-box animate-fade">
        <h4 class="fw-bold text-center mb-2">Tu índice de masa corporal (IMC)</h4>
        <h1 class="display-4 fw-bold text-warning text-center">{imc}</h1>
        <p class="text-center mt-2">
          Categoría: 
          <span class="badge bg-warning text-dark ms-1">{categoriaIMC(imc)}</span>
        </p>
        {#if imc}
          <div class="alert alert-warning mt-3">
            Tu peso ideal estimado es entre <strong>{(18.5 * (Math.pow(altura/100, 2))).toFixed(1)}kg</strong> y <strong>{(24.9 * (Math.pow(altura/100, 2))).toFixed(1)}kg</strong>.
          </div>
        {/if}
      </div>
    {/if}
    
    <div class="d-flex justify-content-center gap-3 mt-3">
      <button class="btn btn-secondary btn-sm" on:click={() => slide = 0} disabled={slide === 0}>
        <i class="fa-solid fa-circle-chevron-left">
      </button>
      <button class="btn btn-secondary btn-sm" on:click={() => slide = 1} disabled={slide === 1}>
        <i class="fa-solid fa-circle-chevron-right"></i>
      </button>
    </div>
  </div>

  <!-- Botones finales -->
  <div class="d-flex justify-content-between mt-4">
    <button class="btn btn-secondary fw-semibold" on:click={onBack}>
      <i class="fa-solid fa-circle-chevron-left"></i> Atrás
    </button>
    <button class="btn btn-warning fw-semibold" on:click={onConfirmar}>
      Continuar <i class="fa-solid fa-circle-check"></i>
    </button>
  </div>
</div>

<style>
  .carousel-wrapper {
    background: #f9f9f9;
    border-radius: 1.2rem;
    padding: 1.5rem;
    border: 1px solid #c1c1c1;
  }

  .contador-wrapper {
    position: relative;
    width: fit-content;
    margin: 1.5rem auto 1rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .celebracion {
    position: absolute;
    top: -30px;
    right: -20px;
    font-size: 2.2rem;
    animation: pop 0.6s ease-out forwards;
    pointer-events: none;
  }

  .info-box {
    min-height: 190px;
    text-align: center;
  }

  .animate-fade {
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes pop {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); }
  }
</style>
