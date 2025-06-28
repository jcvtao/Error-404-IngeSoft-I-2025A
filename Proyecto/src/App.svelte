<script>
  import { onMount } from 'svelte';
  import Inicio from './views/Inicio.svelte';
  import Login from './views/Login.svelte';
  import Registro from './views/Registro.svelte';
  import Navbar from './views/Navbar.svelte';
  import Dashboard from './views/Dashboard.svelte';
  import Fondo from './views/Fondo.svelte';

  let vista = 'inicio';
  let mostrarFondo = false;
  

  function transicionVista(nuevaVista) {
    vista = nuevaVista;
    mostrarFondo = false;

    if (nuevaVista !== 'inicio') {
        mostrarFondo = true; 
    }
  }

  function mostrarInicio() {
    transicionVista('inicio');
  }

  function mostrarLogin() {
    transicionVista('login');
  }

  function mostrarRegistro() {
    transicionVista('registro');
  }
  function mostrarDashboard() {
    transicionVista('dashboard');
  }
  function loginExitoso(event) {
    transicionVista('dashboard');
  }

  onMount(() => {
    if (vista !== 'inicio') {
      setTimeout(() => {
        mostrarFondo = true;
      }, 300);
    }
  });
</script>

<!-- Fondo animado -->
{#if mostrarFondo}
  <Fondo />
{/if}

<!-- Rutas principales -->
{#if vista === 'inicio'}
  <Inicio on:comenzarRegistro={mostrarRegistro} on:comenzarLogin={mostrarLogin} />

{:else if vista === 'login'}
  <Login on:loginExitoso={loginExitoso} on:mostrarRegistro={mostrarRegistro}/>

{:else if vista === 'registro'}
  <Registro on:registroExitoso={mostrarLogin} on:mostrarInicio={mostrarInicio} />

{:else if vista === 'dashboard'}
  <Navbar on:navegar={mostrarInicio} on:cerrarSesion={mostrarInicio} />
  <Dashboard />
{/if}