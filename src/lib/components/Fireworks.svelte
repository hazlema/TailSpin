<script lang="ts">
  import { Fireworks } from '@fireworks-js/svelte';
  import { onDestroy } from 'svelte';
  
  interface Props {
    trigger?: number;
    duration?: number; // TTL in milliseconds, default 3000ms
    intensity?: number; // 1-100, default 30
    particles?: number; // default 50
    opacity?: number; // 0-1, default 0.5
  }
  
  let { trigger = 0, duration = 3000, intensity = 30, particles = 50, opacity = 0.5 }: Props = $props();
  
  let isActive = $state(false);
  let timeoutId: number;
  
  const fireworksOptions = {
    autoresize: true,
    opacity,
    acceleration: 1.05,
    friction: 0.97,
    gravity: 1.5,
    particles,
    traceLength: 3,
    traceSpeed: 10,
    explosion: 5,
    intensity,
    flickering: 50,
    lineStyle: 'round' as const,
    hue: {
      min: 0,
      max: 360
    },
    delay: {
      min: 30,
      max: 60
    },
    rocketsPoint: {
      min: 50,
      max: 50
    },
    lineWidth: {
      explosion: {
        min: 1,
        max: 3
      },
      trace: {
        min: 1,
        max: 2
      }
    },
    brightness: {
      min: 50,
      max: 80
    },
    decay: {
      min: 0.015,
      max: 0.03
    },
    mouse: {
      click: false,
      move: false,
      max: 1
    }
  };
  
  function startFireworks() {
    if (!isActive) {
      console.log('Starting fireworks with options:', fireworksOptions);
      isActive = true;
      
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Set TTL timer
      timeoutId = setTimeout(() => {
        console.log('Stopping fireworks after', duration, 'ms');
        stopFireworks();
      }, duration);
    }
  }
  
  function stopFireworks() {
    console.log('Stopping fireworks');
    isActive = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = 0;
    }
  }
  
  let lastTrigger = 0;
  
  // Watch for trigger changes
  $effect(() => {
    console.log('Trigger effect:', trigger, 'lastTrigger:', lastTrigger);
    if (trigger > lastTrigger) {
      lastTrigger = trigger;
      startFireworks();
    }
  });
  
  onDestroy(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
</script>

<!-- Fireworks container - fixed overlay when active -->
{#if isActive}
  <div class="fixed inset-0 pointer-events-none z-50 w-screen h-screen">
    <Fireworks options={fireworksOptions} style="width: 100vw; height: 100vh; display: block;" />
  </div>
{/if}