<script>
  import { onMount, onDestroy } from 'svelte';

  let emojis = ['🥦', '🥕', '🌽', '🥬', '🧄', '🥚', '🍞', '🍗', '🫐', '🫑', '🥔', '🫘'];
  let items = [];
  const maxItems = 50;

  let intervalo;
  let activo = true;

  function randomFromEdge() {
    const edges = ['top', 'bottom', 'left', 'right'];
    return edges[Math.floor(Math.random() * edges.length)];
  }

  function generateEmoji() {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const size = 1.2 + Math.random() * 2;
    const edge = randomFromEdge();

    let top = 0, left = 0, dx = 0, dy = 0;

    if (edge === 'top') {
      top = '-5%';
      left = `${Math.random() * 100}%`;
      dx = (Math.random() - 0.5) * 0.5;
      dy = 1;
    } else if (edge === 'bottom') {
      top = '105%';
      left = `${Math.random() * 100}%`;
      dx = (Math.random() - 0.5) * 0.5;
      dy = -1;
    } else if (edge === 'left') {
      top = `${Math.random() * 100}%`;
      left = '-5%';
      dx = 1;
      dy = (Math.random() - 0.5) * 0.5;
    } else if (edge === 'right') {
      top = `${Math.random() * 100}%`;
      left = '105%';
      dx = -1;
      dy = (Math.random() - 0.5) * 0.5;
    }

    return {
      id: crypto.randomUUID(),
      emoji,
      size: `${size}rem`,
      top,
      left,
      dx,
      dy
    };
  }

  function iniciarAnimacion() {
    if (intervalo) return;
    intervalo = setInterval(() => {
      if (!activo) return;
      items = [...items, generateEmoji()];
      if (items.length > maxItems) items.splice(0, items.length - maxItems);
    }, 200);
  }

  function detenerAnimacion() {
    clearInterval(intervalo);
    intervalo = null;
  }

  function manejarVisibilidad() {
    activo = !document.hidden;
    if (activo) {
      iniciarAnimacion();
    } else {
      detenerAnimacion();
    }
  }

  onMount(() => {
    document.addEventListener('visibilitychange', manejarVisibilidad);
    iniciarAnimacion();
  });

  onDestroy(() => {
    document.removeEventListener('visibilitychange', manejarVisibilidad);
    detenerAnimacion();
  });
</script>

<div class="fondo-animado">
  {#each items as item (item.id)}
    <div
      class="emoji"
      style="
        top: {item.top};
        left: {item.left};
        font-size: {item.size};
        --dx: {item.dx};
        --dy: {item.dy};
      "
    >
      {item.emoji}
    </div>
  {/each}
</div>

<style>
  .fondo-animado {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: white;
    pointer-events: none;
  }

  .emoji {
    position: absolute;
    opacity: 0.9;
    animation: flotar 10s linear forwards;
    user-select: none;
  }

  @keyframes flotar {
    from {
      transform: translate(0, 0);
      opacity: 0.9;
    }
    to {
      transform: translate(calc(var(--dx) * 120vw), calc(var(--dy) * 120vh));
      opacity: 0;
    }
  }
</style>