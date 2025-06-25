<script>
  import CaloriasSugeridas from './CaloriasSugeridas.svelte';

  let paso = 1;
  let nombreCompleto = '';
  let nombre = '';
  let password = '';
  let sexo = '';
  let edad = 0;
  let peso = 0;
  let altura = 0;
  let objetivo = '';
  let actividad = 0;
  let calorias = 0;
  let imc= 0;
  let fechaRegistro = new Date().toISOString().split('T')[0];

  function calculoIMC(peso, altura) {
    const alturaM = parseInt(altura) / 100;
    imc = (parseFloat(peso) / (alturaM * alturaM)).toFixed(1);
  }
  function calcularCalorias({ edad, peso, altura, sexo, objetivo, actividad }) {
    edad = parseInt(edad);
    peso = parseFloat(peso);
    altura = parseFloat(altura);
    console.log(`Calculando TMB para: edad=${edad}, peso=${peso}, altura=${altura}, sexo=${sexo}, objetivo=${objetivo}, actividad=${actividad}`);
    let tmb = (10 * peso) + (6.25 * altura) - (5 * edad);
    tmb = sexo === 'mujer'
      ? tmb - 161
      : tmb + 5;

    let factores = {
      1: 1.2,
      2: 1.375,
      3: 1.55,
      4: 1.725
    };
    
    tmb *= factores[actividad];

    if (objetivo === 'perder') tmb -= 500;
    else if (objetivo === 'ganar') tmb += 300;    
    calorias = Math.round(tmb);
  }

  async function registrar() {
    const usuario = {nombreCompleto, sexo, nombre, password, edad: Number(edad), peso: Number(peso), altura: Number(altura), objetivo, actividad: Number(actividad), imc: Number(imc), calorias, fechaRegistro};
    console.log('Registrando usuario:', usuario);
  }

</script>

<style>
  .selectable-card {
    border: 2px solid transparent;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    background-color: #f8f9fa;
    color: #212529;
    border-radius: 1rem;
    flex: 1;
    min-width: 140px;
  }

  .selectable-card:hover {
    border-color: #ffc107;
    background-color: #fff3cd;
  }

  .selected {
    border-color: #ffc107;
    background-color: #ffe69c;
  }

  .icon-input .input-group-text {
    background-color: #f8f9fa;
    border-right: 0;
  }

  .icon-input input {
    border-left: 0;
  }

  .progress-container {
    height: 12px;
    background-color: #dee2e6;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 20px;
    position: relative;
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(to right, #ffc107, #ff9800);
    transition: width 0.4s ease-in-out;
  }

  .progress-steps {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    margin-bottom: 10px;
    color: #6c757d;
  }
</style>

<div class="d-flex justify-content-center align-items-center min-vh-100">
  <div class="card shadow-lg rounded-4 px-3 pt-3 pb-3" style="width: 100%; max-width: 500px;">
    {#if paso === 1 || paso === 2 || paso === 3}
        <h3 class="card-header mb-4 text-dark fw-bold">Registro de usuario</h3>
    {:else if paso === 5}
        <h3 class="card-header mb-4 text-dark fw-bold">Completa tu registro</h3>
    {/if}
  

    <!-- Indicadores de pasos -->
    {#if paso >= 1 && paso <= 3}
    <div class="progress-steps">
      <span>Paso 1</span>
      <span>Paso 2</span>
      <span>Paso 3</span>
    </div>
    <div class="progress-container">
      <div class="progress-bar" style="width: {(paso-0.82) * 46}%"></div>
    </div>
    {/if}
    {#if paso === 1}
      <!-- Paso 1: Objetivo -->
      <div class="mb-3">
        <span id="objetivo-label" class="form-label fw-semibold" style="font-size: 1.5rem;">Selecciona tu objetivo 🎯</span>
        <div class="d-flex flex-column flex-md-row gap-3 mt-2">
          <button type="button" class="card p-3 text-center selectable-card" class:selected={objetivo === 'perder'} on:click={() => objetivo = 'perder'} aria-pressed={objetivo === 'perder'} aria-labelledby="objetivo-label">
            <div style="font-size: 1.5rem;">🏃</div>
            <h5 class="mt-2 mb-1">Perder peso</h5>
            <p class="text-muted small">Reduce grasa corporal y define tu figura.</p>
          </button>
          <button type="button" class="card p-3 text-center selectable-card" class:selected={objetivo === 'mantener'} on:click={() => objetivo = 'mantener'} aria-pressed={objetivo === 'mantener'} aria-labelledby="objetivo-label">
            <div style="font-size: 1.5rem;">⚖️</div>
            <h5 class="mt-2 mb-1">Mantener peso</h5>
            <p class="text-muted small">Conserva tu estado físico actual.</p>
          </button>
          <button type="button" class="card p-3 text-center selectable-card" class:selected={objetivo === 'ganar'} on:click={() => objetivo = 'ganar'} aria-pressed={objetivo === 'ganar'} aria-labelledby="objetivo-label">
            <div style="font-size: 1.5rem;">💪</div>
            <h5 class="mt-2 mb-1">Ganar peso</h5>
            <p class="text-muted small">Aumenta tu masa muscular.</p>
          </button>
        </div>
      </div>
      <div class="d-flex justify-content-between">
        <a class="navbar-brand text-light fw-semibold fs-3" href="/">
        <button class="btn btn-secondary fw-semibold"><i class="fa-solid fa-circle-chevron-left"></i> Atrás</button>
        </a>
        <button class="btn btn-warning fw-semibold" on:click={() => paso = 2} disabled={!objetivo}>Siguiente <i class="fa-solid fa-circle-chevron-right"></i></button>
      </div>

    {:else if paso === 2}
      <!-- Paso 2: Sexo, edad, peso, altura -->
      <label for="sexo-select" class="form-label mb-3 fw-semibold" style="font-size: 1.5rem;">Sobre ti 🪪</label>
      <div class="d-flex flex-column flex-md-row gap-3 mb-4" id="sexo-select">
        <button type="button" class="card p-3 text-center selectable-card" class:selected={sexo === 'hombre'} on:click={() => sexo = 'hombre'} aria-pressed={sexo === 'hombre'}>
          <div style="font-size: 1.5rem;">👨</div>
          <h6 class="mt-2 mb-0">Hombre</h6>
        </button>
        <button type="button" class="card p-3 text-center selectable-card" class:selected={sexo === 'mujer'} on:click={() => sexo = 'mujer'} aria-pressed={sexo === 'mujer'}>
          <div style="font-size: 1.5rem;">👩</div>
          <h6 class="mt-2 mb-0">Mujer</h6>
        </button>
      </div>

      <div class="mb-3">
        <label for="edad-select" class="form-label fw-semibold">Edad</label>
        <select id="edad-select" class="form-select" bind:value={edad}>
          <option value="" disabled selected>Selecciona tu edad</option>
            {#each Array(83).fill(0).map((_, i) => i + 18) as e}
              <option value={e}>{e} años</option>
            {/each}
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Peso</label>
        <select class="form-select" bind:value={peso}>
          <option value="" disabled>Selecciona tu peso</option>
          {#each Array.from({ length: 221 }, (_, i) => (i * 0.5 + 40).toFixed(1)) as p}
            <option value={p}>{p} kg</option>
          {/each}
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Altura</label>
          <select class="form-select" bind:value={altura}>
            <option value="" disabled>Selecciona tu altura</option>
            {#each Array(111).fill(0).map((_, i) => i + 140) as h}
              <option value={h}>{h} cm</option>
            {/each}
          </select>
      </div>

      <div class="d-flex justify-content-between">
        <button class="btn btn-secondary fw-semibold " on:click={() => paso = 1}><i class="fa-solid fa-circle-chevron-left"></i> Atrás</button>
        <button class="btn btn-warning fw-semibold" on:click={() => paso = 3} disabled={!sexo || !edad || !peso || !altura}>Siguiente <i class="fa-solid fa-circle-chevron-right"></i></button>
      </div>

    {:else if paso === 3}
      <!-- Paso 3: Actividad física -->
      <label class="form-label mb-3 fw-semibold text-center" style="font-size: 1.5rem;">Nivel de actividad física🏃‍♂️</label>
      <div class="text-center mb-2" style="font-size: 2rem;">
        {#each Array(4) as _, i}
          <button
            type="button"
            class="btn p-0 border-0 bg-transparent"
            aria-label="Seleccionar nivel de actividad {i + 1}"
            on:click={() => actividad = i + 1}
            style="line-height: 1; margin: 0 6px;">
            <i class="fa-solid fa-fire"
              style="color: {i < actividad ? '#ff5722' : '#ccc'}; font-size: 2rem;"
              aria-hidden="true"></i>
          </button>
        {/each}
      </div>
      {#if actividad > 0}
        <div class="text-muted small text-center mb-3">
          {actividad === 1 ? 'Muy baja (0-1 días por semana)' :
           actividad === 2 ? 'Baja (1-3 días por semana)' :
           actividad === 3 ? 'Moderada (4-5 días por semana)' :
           'Alta (6-7 días por semana)'}
        </div>
      {/if}
      {#if actividad === 0}
       <div class="text-muted small text-center mb-3">Selecciona tu nivel de actividad física</div>
      {/if}
      <div class="d-flex justify-content-between">
        <button class="btn btn-secondary fw-semibold" on:click={() => paso = 2}>
          <i class="fa-solid fa-circle-chevron-left"></i> Atrás</button>
        <button class="btn btn-warning fw-semibold" on:click={() => {paso = 4; calcularCalorias({ edad, peso, altura, sexo, objetivo, actividad }); calculoIMC(peso, altura)}} disabled={!actividad}>Siguiente <i class="fa-solid fa-circle-chevron-right"></i></button>
      </div>

   <!-- Paso 4: Calorías sugeridas -->
      {:else if paso === 4}
        <CaloriasSugeridas calorias={calorias} imc={imc} altura={altura} peso={peso} onConfirmar={() => paso = 5} onBack={() => paso = 3} />
      <!-- Paso 5: Nombre y contraseña -->
      {:else if paso === 5}
      <div class="mb-3 input-group icon-input">
        <span class="input-group-text"><i class="fa fa-id-card"></i></span>
        <input class="form-control" bind:value={nombreCompleto} placeholder="Nombre completo" />
      </div>

      <div class="mb-3 input-group icon-input">
        <span class="input-group-text"><i class="fa fa-user"></i></span>
        <input class="form-control" bind:value={nombre} placeholder="Nombre de usuario" />
      </div>

      <div class="mb-4 input-group icon-input">
        <span class="input-group-text"><i class="fa fa-lock"></i></span>
        <input type="password" class="form-control" bind:value={password} placeholder="Contraseña" />
      </div>

      <div class="d-flex justify-content-between">
        <button class="btn btn-secondary fw-semibold" on:click={() => paso = 4}>
          <i class="fa-solid fa-circle-chevron-left"></i> Atrás</button>
        <button class="btn btn-warning fw-semibold" on:click={registrar} disabled={!nombreCompleto || !nombre || !password}>
          <i class="fa-solid fa-right-to-bracket"></i> Registrar</button>
      </div>

      
    {/if}
  </div>
</div>

