import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useParallax() {
  const px = ref(0)
  const py = ref(0)
  let raf = 0
  let tx = 0
  let ty = 0

  function apply() {
    raf = 0
    px.value = tx
    py.value = ty
  }

  function onMove(e: PointerEvent) {
    tx = (e.clientX / window.innerWidth - 0.5) * 2
    ty = (e.clientY / window.innerHeight - 0.5) * 2
    if (!raf) raf = requestAnimationFrame(apply)
  }

  onMounted(() => window.addEventListener('pointermove', onMove, { passive: true }))
  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onMove)
    if (raf) cancelAnimationFrame(raf)
  })

  return { px, py }
}
