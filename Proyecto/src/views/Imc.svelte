<script>
  import { onMount } from 'svelte';
  export let calorias;
  export let peso;
  export let altura;
  export let onConfirmar = () => {};
  export let onBack = () => {};

  let slideIndex = 0;
  let current = 0;
  let mostrarEmoji = false;

  let imc = 0;
  let categoriaIMC = '';

  function calcularIMC(peso, altura) {
    const alturaM = altura / 100;
    imc = +(peso / (alturaM * alturaM)).toFixed(1);

    if (imc < 18.5) categoriaIMC = 'Bajo peso';
    else if (imc < 24.9) categoriaIMC = 'Normal';
    else if (imc < 29.9) categoriaIMC = 'Sobrepeso';
    else categoriaIMC = 'Obesidad';
  }

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

  onMount(() => {
    calcularIMC(peso, altura);
    animarContador();
  });
</script>

<div class="carousel-container w-100 text-dark bg-white ">
  {#if slideIndex === 0}
    <!-- Slide 1: Calorías -->
    <div class="carousel-slide">
      <h3 class="titulo-carrusel card-header mt-0 pt-0">Calorías recomendadas</h3>
      <div class="contador-wrapper mx-auto">
        <h1 class="display-3 fw-bold text-warning">{current} kcal</h1>
        {#if mostrarEmoji}
          <div class="celebracion">🎉</div>
          <div class="confeti"></div>
        {/if}
      </div>
      <p class="text-muted fs-6">Según tus datos, incluyendo tu objetivo y actividad física.</p>
    </div>
  {:else if slideIndex === 1}
    <!-- Slide 2: IMC -->
    <div class="carousel-slide">
        <h2 class="card-header titulo-slide">Tu índice de masa corporal (IMC)</h2>
        <p class="text-muted fs-6">El IMC es una medida que relaciona tu peso con tu altura.</p>
      <h1 class="display-3 fw-bold text-primary">{imc}</h1>
      <p class="text-muted fs-5">{categoriaIMC}</p>
    </div>
  {/if}

  <!-- Controles -->
  <div class="carousel-controls mt-3 d-flex justify-content-center gap-2">
    <button class="btn btn-outline-dark btn-sm" on:click={() => slideIndex = 0} disabled={slideIndex === 0}>◀️</button>
    <button class="btn btn-outline-dark btn-sm" on:click={() => slideIndex = 1} disabled={slideIndex === 1}>▶️</button>
  </div>

  <!-- Navegación -->
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
  .carousel-container {
  background: #fff;
  color: #212529;
  padding: 1.5rem;
  border-radius: 1rem;
  width: 100%;
  margin: 0;
  text-align: center;
  }

  .carousel-slide {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  padding-top: 0rem; /* más cerca del borde superior */
  animation: fadeIn 0.4s ease;
  }
  .titulo-carrusel {
  margin-top: 0 !important;
  padding-top: 0.5rem;
 }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .contador-wrapper {
    position: relative;
    width: fit-content;
    margin: 1rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .celebracion {
    position: absolute;
    top: -35px;
    right: 10px;
    font-size: 2.5rem;
    animation: pop 0.6s ease-out forwards;
    pointer-events: none;
  }

  .confeti::before,
  .confeti::after {
    content: "🎊";
    position: absolute;
    font-size: 1.2rem;
    top: -20px;
    animation: lluvia 1s ease-out forwards;
  }

  .confeti::before { left: -25px; }
  .confeti::after { right: -25px; }

  @keyframes pop {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); }
  }

  @keyframes lluvia {
    0% { transform: translateY(-20px); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(30px); opacity: 0; }
  }
</style>