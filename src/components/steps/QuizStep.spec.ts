import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/i18n'
import QuizStep from './QuizStep.vue'
import type { QuizStep as QuizStepType } from '@/content/types'

const step: QuizStepType = {
  kind: 'quiz',
  question: 'Сколько будет 2 + 2?',
  options: ['3', '4', '5'],
  answer: 1,
  explanation: 'Дважды два — четыре.',
}

describe('QuizStep', () => {
  it('правильный ответ помечается верным и эмитит solved', async () => {
    const wrapper = mount(QuizStep, { props: { step }, global: { plugins: [i18n] } })
    const options = wrapper.findAll('.quiz__opt')

    await options[1].trigger('click')
    await wrapper.find('.quiz__check').trigger('click')

    expect(wrapper.emitted('solved')).toBeTruthy()
    expect(wrapper.find('.quiz__feedback.is-ok').exists()).toBe(true)
  })

  it('неправильный ответ не эмитит solved', async () => {
    const wrapper = mount(QuizStep, { props: { step }, global: { plugins: [i18n] } })
    const options = wrapper.findAll('.quiz__opt')

    await options[0].trigger('click')
    await wrapper.find('.quiz__check').trigger('click')

    expect(wrapper.emitted('solved')).toBeFalsy()
    expect(wrapper.find('.quiz__feedback.is-bad').exists()).toBe(true)
  })
})
