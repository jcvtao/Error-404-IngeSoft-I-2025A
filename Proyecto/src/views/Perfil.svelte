<script>
  import { onMount } from 'svelte';
  export let usuarioActual;

  let pesoActual = '';
  let historial = [];
  let imcActual = '';
  let mensaje = '';

  let emojis = ['🥦', '🥕', '🌽', '🦬', '🧄', '🍞', '🍗', '🧀', '🍇', '🥚'];
  let fondo = Array.from({ length: 50 }, () => ({
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 1.5 + Math.random() * 2
  }));

  async function cargarHistorial() {
    historial = await window.electronAPI.obtenerHistorialPeso(usuarioActual.id) || [];
  }

  function calcularIMC(peso, altura) {
    const alturaM = usuarioActual.altura / 100;
    return +(peso / (alturaM * alturaM)).toFixed(1);
  }

  async function registrarPeso() {
    if (!pesoActual) return;
    imcActual = calcularIMC(pesoActual, usuarioActual.altura);
    const res = await window.electronAPI.registrarPeso(usuarioActual.id, parseFloat(pesoActual), imcActual);
    if (res.success) {
      mensaje = 'Peso registrado correctamente';
      pesoActual = '';
      await cargarHistorial();
    } else {
      mensaje = 'Error al registrar peso';
    }
  }

  onMount(cargarHistorial);
</script>

<div class="dashboard-fondo">
  {#each fondo as item (item)}
    <div
      class="emoji-fondo"
      style="top: {item.top}%; left: {item.left}%; font-size: {item.size}rem"
    >{item.emoji}</div>
  {/each}

  <div class="card shadow-lg rounded-4 p-4 mb-4">
    <h3 class="fw-bold mb-3">Historial de peso</h3>

    <form class="mb-3 d-flex gap-2 align-items-end" on:submit|preventDefault={registrarPeso}>
      <div>
        <label class="form-label fw-semibold">Nuevo peso (kg):</label>
        <input type="number" min="30" max="250" step="0.1" class="form-control" bind:value={pesoActual} />
      </div>
      <button class="btn btn-warning fw-semibold" type="submit" disabled={!pesoActual}>Registrar</button>
    </form>

    {#if mensaje}
      <div class="alert alert-info py-2">{mensaje}</div>
    {/if}

    {#if historial.length === 0}
      <p class="text-muted">Aún no hay registros de peso.</p>
    {:else}
      <div class="tabla-scroll">
        <table class="table table-sm table-striped mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Peso (kg)</th>
              <th>IMC</th>
            </tr>
          </thead>
          <tbody>
            {#each historial as entry, i}
              <tr>
                <td>{i + 1}</td>
                <td>{entry.tiempo_registro.slice(0, 10)}</td>
                <td>{entry.peso}</td>
                <td>{entry.imc}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

    {#if historial.length > 1}
      <h5 class="mt-4 mb-2">Gráfica de evolución</h5>
      <div class="grafica-container">
        <svg width="100%" height="250" viewBox="0 0 400 250">
          {#each Array.from({ length: 12 }, (_, i) => 30 + i * 20) as peso}
            <line x1="30" y1={230 - (peso - 30)} x2="390" y2={230 - (peso - 30)} class="linea-guia" />
            <text x="5" y={233 - (peso - 30)} class="eje-y-label">{peso}</text>
          {/each}

          {#each historial as entry, i (entry.tiempo_registro)}
            {#if i > 0}
              <line
                x1={(i - 1) / (historial.length - 1) * 360 + 30}
                y1={230 - (historial[i - 1].peso - 30)}
                x2={i / (historial.length - 1) * 360 + 30}
                y2={230 - (entry.peso - 30)}
                stroke="#ffc107"
                stroke-width="2"
              />
            {/if}
            <circle
              cx={i / (historial.length - 1) * 360 + 30}
              cy={230 - (entry.peso - 30)}
              r="4"
              fill="#007bff"
            />
            <text
              x={i / (historial.length - 1) * 360 + 30}
              y="240"
              transform={`rotate(-90, ${i / (historial.length - 1) * 360 + 30}, 240)`}
              class="fecha-label"
            >#{i + 1}</text>
          {/each}
        </svg>
      </div>
      <div class="text-muted small">* El eje Y inicia en 30 kg y escala hasta 250 kg</div>
    {/if}
  </div>
</div>

<style>
  .dashboard-fondo {
    position: relative;
    background-color: whitesmoke;
    min-height: 100vh;
    overflow: hidden;
  }

  .emoji-fondo {
    position: absolute;
    opacity: 0.5;
    user-select: none;
    pointer-events: none;
  }

  .card {
    max-width: 600px;
    margin: 2rem auto;
  }

  .tabla-scroll {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .grafica-container {
    width: 100%;
    height: 250px;
    background: #f9f9f9;
    border-radius: 8px;
    overflow: visible;
    position: relative;
  }

  .eje-y-label {
    font-size: 10px;
    fill: #666;
  }

  .linea-guia {
    stroke: #eee;
    stroke-width: 1;
  }

  .fecha-label {
    font-size: 9px;
    text-anchor: end;
    fill: #555;
  }

  table {
    font-size: 0.95rem;
  }
</style>
