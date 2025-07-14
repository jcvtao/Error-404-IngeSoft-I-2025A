<script>
  import { onMount } from 'svelte';
  export let usuarioActual;

  let pesoActual = '';
  let historial = [];
  let imcActual = '';
  let mensaje = '';

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
    <table class="table table-sm table-striped mt-3">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Peso (kg)</th>
          <th>IMC</th>
        </tr>
      </thead>
      <tbody>
        {#each historial as entry}
          <tr>
            <td>{entry.tiempo_registro.slice(0, 10)}</td>
            <td>{entry.peso}</td>
            <td>{entry.imc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}

  <!-- Gráfica simple con SVG -->
  {#if historial.length > 1}
    <h5 class="mt-4 mb-2">Gráfica de evolución</h5>
    <svg width="100%" height="120" viewBox="0 0 400 120" style="background:#f9f9f9;border-radius:8px;">
      {#each historial as entry, i}
        {#if i > 0}
          <line
            x1={((i-1)/(historial.length-1))*380+10}
            y1={110-(historial[i-1].peso-40)*2}
            x2={(i/(historial.length-1))*380+10}
            y2={110-(entry.peso-40)*2}
            stroke="#ffc107" stroke-width="2"
          />
        {/if}
        <circle
          cx={(i/(historial.length-1))*380+10}
          cy={110-(entry.peso-40)*2}
          r="4"
          fill="#007bff"
        />
      {/each}
    </svg>
    <div class="text-muted small">* El eje Y inicia en 40kg</div>
  {/if}
</div>

<style>
  .card { max-width: 600px; margin: 2rem auto; }
  table { font-size: 0.95rem; }
</style>