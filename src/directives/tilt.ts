import type { Directive, DirectiveBinding } from 'vue'

interface TiltEl extends HTMLElement {
  __tilt?: {
    move: (e: PointerEvent) => void
    leave: () => void
  }
}

export const vTilt: Directive<TiltEl, { max?: number; scale?: number } | undefined> = {
  mounted(el, binding: DirectiveBinding) {
    const max = binding.value?.max ?? 7
    const scale = binding.value?.scale ?? 1.015

    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(760px) rotateX(${-y * max}deg) rotateY(${x * max}deg) scale(${scale})`
    }
    const leave = () => {
      el.style.transform = 'perspective(760px) rotateX(0deg) rotateY(0deg) scale(1)'
    }

    el.style.transformStyle = 'preserve-3d'
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el.__tilt = { move, leave }
  },
  unmounted(el) {
    if (el.__tilt) {
      el.removeEventListener('pointermove', el.__tilt.move)
      el.removeEventListener('pointerleave', el.__tilt.leave)
    }
  },
}
