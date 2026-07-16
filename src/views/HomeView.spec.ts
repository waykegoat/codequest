import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { i18n } from '@/i18n'
import { vTilt } from '@/directives/tilt'
import HomeView from './HomeView.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/lesson/:moduleId/:lessonId', name: 'lesson', component: { template: '<div />' } },
      { path: '/profile', name: 'profile', component: { template: '<div />' } },
      { path: '/achievements', name: 'achievements', component: { template: '<div />' } },
      { path: '/playground', name: 'playground', component: { template: '<div />' } },
    ],
  })
}

const mountOpts = (router: ReturnType<typeof makeRouter>) => ({
  global: { plugins: [router, i18n], directives: { tilt: vTilt } },
})

describe('HomeView', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('рендерит карту курса с модулями и уроками', async () => {
    const router = makeRouter()
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, mountOpts(router))
    const text = wrapper.text()

    expect(text).toContain('Основы JavaScript')
    expect(text).toContain('JavaScript: глубже')
    expect(text).toContain('Твоя первая программа')

    expect(wrapper.findAll('.node').length).toBeGreaterThanOrEqual(10)
  })

  it('первый урок открыт, а последующие заблокированы', () => {
    const router = makeRouter()
    const wrapper = mount(HomeView, mountOpts(router))
    const nodes = wrapper.findAll('.node')

    expect((nodes[0].element as HTMLButtonElement).disabled).toBe(false)
    expect((nodes[1].element as HTMLButtonElement).disabled).toBe(true)
  })
})
