import type { Module } from '../types'

export const m6bVue: Module = {
  id: 'vue',
  title: 'Vue 3: Современный реактивный стек',
  description:
    'Composition API, <script setup>, ref и reactive, computed, компонентная архитектура, Pinia и битва с боссом.',
  color: '#42b883',
  icon: '💚',
  lessons: [
    {
      id: 'l1-vue-composition',
      title: 'Реактивность и ref',
      subtitle: '<script setup> и привязка данных',
      xp: 60,
      icon: '⚡',
      steps: [
        {
          kind: 'theory',
          title: 'Как мыслит современный Vue 3',
          blocks: [
            {
              type: 'text',
              md: 'В Vue 3 весь современный код пишется через **Composition API** и синтаксис `<script setup>`. Больше никакого ручного вызова `document.querySelector`!',
            },
            {
              type: 'code',
              lang: 'js',
              code: `<script setup>
import { ref } from 'vue'

const count = ref(0) // создаём реактивное число

function increment() {
  count.value++ // в JS читаем и меняем через .value
}
</script>

<template>
  <button @click="increment">Кликнули: {{ count }}</button>
</template>`,
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'Запомни главное правило: внутри `<script>` к значению ref обращаемся через `.value`, а в `<template>` пишем просто имя переменной без `.value` — Vue разворачивает его автоматически!',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Как изменить значение переменной `const score = ref(10)` внутри функции в <script setup>?',
          options: [
            'score = 20',
            'score.value = 20',
            'score.set(20)',
            'this.score = 20',
          ],
          answer: 1,
          explanation: 'В Composition API ref оборачивает значение в объект с геттером/сеттером .value.',
        },
        {
          kind: 'blank',
          title: 'Инициализация реактивности',
          prompt: 'Импортируй ref и объяви реактивную строку title со значением "CodeQuest".',
          lang: 'js',
          template: "import { ___ } from 'vue'\nconst title = ___('CodeQuest')",
          blanks: [{ answer: 'ref' }, { answer: 'ref' }],
          hints: ['Для создания реактивной переменной используется функция ref.'],
        },
        {
          kind: 'code',
          title: 'Симулятор реактивного счётчика',
          lang: 'js',
          prompt:
            'Напиши функцию `increment(current, step = 1)`, которая возвращает новое значение счётчика, увеличенное на step.',
          entry: 'increment',
          starter: 'function increment(current, step = 1) {\n  \n}',
          tests: [
            {
              name: 'Начальное 0, +1 → 1',
              args: [0, 1],
              expected: 1,
            },
            {
              name: 'Начальное 5, +3 → 8',
              args: [5, 3],
              expected: 8,
            },
          ],
          hints: ['Верни current + step.'],
          solution:
            'function increment(current, step = 1) {\n  return current + step\n}',
        },
      ],
    },
    {
      id: 'l2-vue-directives',
      title: 'Директивы шаблона',
      subtitle: 'v-for, v-if и v-model',
      xp: 65,
      icon: '🎨',
      steps: [
        {
          kind: 'theory',
          title: 'Директивы делают HTML динамичным',
          blocks: [
            {
              type: 'text',
              md: 'Во Vue директивы — это специальные атрибуты с префиксом `v-`:\n\n- `v-if="condition"` — отрисовывает элемент только если условие истинно\n- `v-for="item in items" :key="item.id"` — цикл по массиву\n- `v-model="text"` — двустороннее связывание с полем ввода\n- `@click="handleClick"` — сокращение для `v-on:click`\n- `:class="{ active: isActive }"` — сокращение для `v-bind:class`',
            },
            {
              type: 'code',
              lang: 'html',
              code: `<input v-model="searchQuery" placeholder="Поиск..." />
<ul>
  <li v-for="user in filteredUsers" :key="user.id">
    {{ user.name }}
  </li>
</ul>
<p v-if="filteredUsers.length === 0">Ничего не найдено</p>`,
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какая директива обеспечивает двустороннее связывание значения инпута с переменной?',
          options: ['v-bind:value', 'v-model', 'v-sync', '@input'],
          answer: 1,
          explanation: 'v-model синхронизирует состояние инпута и переменной в обе стороны.',
        },
        {
          kind: 'order',
          title: 'Сборка списка задач с директивами',
          prompt: 'Расставь строки шаблона Vue в правильном порядке:',
          lang: 'html',
          lines: [
            '<input v-model="newTask" @keyup.enter="addTask" />',
            '<button @click="addTask">Добавить</button>',
            '<ul v-if="tasks.length > 0">',
            '  <li v-for="t in tasks" :key="t.id">{{ t.title }}</li>',
            '</ul>',
            '<p v-else>Задач пока нет</p>',
          ],
          hints: ['Сначала инпут с кнопкой, затем список с проверкой v-if, внутри v-for, и в конце v-else.'],
        },
      ],
    },
    {
      id: 'l3-vue-computed',
      title: 'Вычисляемые свойства',
      subtitle: 'computed и watch',
      xp: 65,
      icon: '🧮',
      steps: [
        {
          kind: 'theory',
          title: 'computed: умные кэшируемые значения',
          blocks: [
            {
              type: 'text',
              md: 'Если значение зависит от других реактивных данных (например, отфильтрованный список, сумма в корзине), используй `computed()`. Оно вычисляется лениво и кэшируется: пока исходные переменные не изменились, повторные обращения мгновенны.',
            },
            {
              type: 'code',
              lang: 'js',
              code: `import { ref, computed } from 'vue'

const items = ref([
  { name: 'Клавиатура', price: 4000, count: 2 },
  { name: 'Мышь', price: 2000, count: 1 }
])

// Автоматически пересчитается, если изменится items
const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item.price * item.count, 0)
})`,
            },
            {
              type: 'callout',
              tone: 'tip',
              md: 'В отличие от `computed`, функция `watch()` используется для **побочных эффектов**: например, сохранить данные в localStorage или отправить запрос на сервер при смене фильтра.',
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'В чём главное преимущество computed() перед вызовом обычной функции в шаблоне {{ getTotal() }}?',
          options: [
            'computed() работает асинхронно',
            'computed() кэширует результат и не пересчитывается без изменения зависимостей',
            'computed() умеет менять DOM напрямую',
            'Разницы нет, это просто синтаксический сахар',
          ],
          answer: 1,
          explanation: 'Обычная функция в шаблоне вызывается при каждом ререндере страницы, а computed() только когда меняются зависимые сигналы.',
        },
        {
          kind: 'code',
          title: 'Расчёт корзины с промокодом',
          lang: 'js',
          prompt:
            'Напиши функцию `calcCart(items, promoCode)`. `items` — массив `{ price, count }`. Если `promoCode === "VUE3"`, примени скидку 20%. Верни итоговую сумму округлённую до целого.',
          entry: 'calcCart',
          starter: 'function calcCart(items, promoCode) {\n  \n}',
          tests: [
            {
              name: 'Без промокода: 100*2 + 50*1 = 250',
              args: [[{ price: 100, count: 2 }, { price: 50, count: 1 }], ''],
              expected: 250,
            },
            {
              name: 'С промокодом VUE3: 250 - 20% = 200',
              args: [[{ price: 100, count: 2 }, { price: 50, count: 1 }], 'VUE3'],
              expected: 200,
            },
            {
              name: 'Пустая корзина → 0',
              args: [[], 'VUE3'],
              expected: 0,
            },
          ],
          solution:
            'function calcCart(items, promoCode) {\n  const sum = items.reduce((acc, i) => acc + i.price * i.count, 0)\n  return promoCode === "VUE3" ? Math.round(sum * 0.8) : sum\n}',
        },
      ],
    },
    {
      id: 'l4-vue-components',
      title: 'Компоненты и Props',
      subtitle: 'defineProps и defineEmits',
      xp: 70,
      icon: '🧩',
      steps: [
        {
          kind: 'theory',
          title: 'Компонентная архитектура',
          blocks: [
            {
              type: 'text',
              md: 'В реальных приложениях страницу делят на независимые компоненты (`ProductCard.vue`, `UserAvatar.vue`, `NavBar.vue`).\n\nДанные передаются **сверху вниз** через **props** (`defineProps`), а события передаются **снизу вверх** через **emits** (`defineEmits`).',
            },
            {
              type: 'code',
              lang: 'html',
              code: `<!-- Дочерний компонент TaskItem.vue -->
<script setup>
const props = defineProps({
  task: { type: Object, required: true }
})
const emit = defineEmits(['toggle', 'remove'])
</script>

<template>
  <div class="task-item">
    <span :class="{ done: task.done }">{{ task.title }}</span>
    <button @click="emit('toggle', task.id)">✓</button>
    <button @click="emit('remove', task.id)">✕</button>
  </div>
</template>`,
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какой макрос используется в <script setup> для объявления входных параметров компонента?',
          options: ['defineProps', 'useProps', 'propsSetup', 'declareInputs'],
          answer: 0,
          explanation: 'defineProps — встроенный компиляторный макрос Vue 3 для описания входных параметров.',
        },
        {
          kind: 'code',
          title: 'Фильтрация списка по статусу',
          lang: 'js',
          prompt:
            'Напиши функцию `filterTasks(tasks, status)`, где status может быть "all", "active" (done: false), или "completed" (done: true). Верни отфильтрованный массив.',
          entry: 'filterTasks',
          starter: 'function filterTasks(tasks, status) {\n  \n}',
          tests: [
            {
              name: 'Фильтр completed',
              args: [
                [{ id: 1, done: true }, { id: 2, done: false }, { id: 3, done: true }],
                'completed',
              ],
              expected: [{ id: 1, done: true }, { id: 3, done: true }],
            },
            {
              name: 'Фильтр active',
              args: [
                [{ id: 1, done: true }, { id: 2, done: false }],
                'active',
              ],
              expected: [{ id: 2, done: false }],
            },
            {
              name: 'Фильтр all возвращает всё',
              args: [[{ id: 1, done: false }], 'all'],
              expected: [{ id: 1, done: false }],
            },
          ],
          solution:
            'function filterTasks(tasks, status) {\n  if (status === "active") return tasks.filter(t => !t.done)\n  if (status === "completed") return tasks.filter(t => t.done)\n  return tasks\n}',
        },
      ],
    },
    {
      id: 'l5-vue-pinia',
      title: 'Pinia: Глобальный стейт',
      subtitle: 'Управление состоянием приложения',
      xp: 75,
      icon: '🍍',
      steps: [
        {
          kind: 'theory',
          title: 'Зачем нужен Pinia Store',
          blocks: [
            {
              type: 'text',
              md: 'Когда данным нужно быть доступными в шапке (счётчик корзины), на странице каталога и в профиле пользователя, прокидывать props через 10 уровней компонентов становится неудобно (**prop drilling**). Решение — **Pinia** (официальный стейт-менеджер Vue).',
            },
            {
              type: 'code',
              lang: 'js',
              code: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  
  // Getters
  const isLoggedIn = computed(() => !!user.value)
  
  // Actions
  function login(userData) {
    user.value = userData
  }
  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
})`,
            },
          ],
        },
        {
          kind: 'quiz',
          question: 'Какая функция используется в Pinia для создания нового хранилища?',
          options: ['createStore', 'defineStore', 'initStore', 'new PiniaStore'],
          answer: 1,
          explanation: 'В Pinia используется фабричная функция defineStore(id, setupFunction).',
        },
        {
          kind: 'code',
          title: 'Логика хранилища избранного (Favorites Store)',
          lang: 'js',
          prompt:
            'Напиши функцию `toggleFavorite(list, id)`, которая принимает массив id избранных товаров и целевой id. Если id уже есть в списке — удаляет его, иначе добавляет. Верни новый массив.',
          entry: 'toggleFavorite',
          starter: 'function toggleFavorite(list, id) {\n  \n}',
          tests: [
            {
              name: 'Добавление нового id: [1, 2], 3 → [1, 2, 3]',
              args: [[1, 2], 3],
              expected: [1, 2, 3],
            },
            {
              name: 'Удаление существующего: [1, 2, 3], 2 → [1, 3]',
              args: [[1, 2, 3], 2],
              expected: [1, 3],
            },
          ],
          hints: ['Проверь list.includes(id): если да, используй list.filter(...), иначе [...list, id].'],
          solution:
            'function toggleFavorite(list, id) {\n  return list.includes(id) ? list.filter(x => x !== id) : [...list, id]\n}',
        },
      ],
    },
    {
      id: 'l6-vue-boss',
      title: 'Битва с боссом: Архитектор Реактивности',
      subtitle: 'Полноценный Vue 3 модуль корзины',
      xp: 120,
      icon: '👑',
      steps: [
        {
          kind: 'boss',
          title: 'Реактивный модуль интернет-магазина на Vue 3',
          bossName: 'Архитектор Реактивности',
          bossAvatar: '🧙‍♂️',
          bossRole: 'Повелитель Composition API & Pinia',
          bossHp: 100,
          prompt: `Создай архитектуру реактивного сервиса корзины покупок на Vue 3 Composition API!

**Требования к проекту:**
1. **Реактивное состояние**: создай реактивный массив товаров \`items\` (каждый товар: \`{ id, title, price, count }\`) и реактивную строку промокода \`coupon\`.
2. **Вычисляемые свойства**: реализуй \`totalSum\` (общая сумма с учётом количества) и \`discountedSum\` (при купоне \`'SAVE20'\` применяется скидка 20%).
3. **Методы управления**: функции добавления товара (\`addItem\`), изменения количества (\`updateCount\`) и удаления (\`removeItem\`).
4. **Безопасность и обработка ошибок**: при обновлении количества не допускай значения меньше 1 (выбрасывай ошибку или оборачивай в try/catch).
5. **Асинхронный чекаут**: метод \`checkout(orderData)\`, имитирующий отправку на сервер с промисом (\`async/await\`) и очищающий корзину при успехе.`,
          lang: 'js',
          rubrics: [
            {
              id: 'vue-reactive-state',
              title: 'Реактивное состояние',
              description: 'Использован ref или reactive для управления элементами корзины и промокодом',
            },
            {
              id: 'vue-computed-total',
              title: 'Вычисляемые свойства (computed)',
              description: 'Итоговая сумма и расчёт скидки реализованы через computed функции',
            },
            {
              id: 'vue-methods-crud',
              title: 'Методы управления корзиной',
              description: 'Реализованы функции добавления, изменения количества и удаления товаров',
            },
            {
              id: 'vue-error-handling',
              title: 'Обработка ошибок и валидация',
              description: 'Предусмотрена защита от некорректных количеств товаров и обработка с try/catch',
            },
            {
              id: 'vue-async-checkout',
              title: 'Асинхронный чекаут (async/await)',
              description: 'Функция оформления заказа реализована с использованием асинхронности (async/await или Promise)',
            },
          ],
          hints: [
            'Импортируй ref и computed из Vue.',
            'Для вычисления суммы используй items.value.reduce(...) внутри computed.',
            'Для checkout используй async function checkout() { await ...; items.value = []; }',
          ],
          starter: `// 🧙‍♂️ Битва с боссом: Архитектор Реактивности
// Напиши полноценный модуль корзины на Vue 3 Composition API

import { ref, computed } from 'vue'

export function useCart() {
  // 1. Реактивное состояние (items, coupon)
  const items = ref([])
  const coupon = ref('')

  // 2. Вычисляемые свойства (totalSum, discountedSum)
  const totalSum = computed(() => {
    // посчитай сумму items
    return 0
  })

  // 3. Методы: addItem, updateCount, removeItem

  // 4. Асинхронное оформление заказа checkout

  return {
    items,
    coupon,
    totalSum,
  }
}
`,
          solution: `import { ref, computed } from 'vue'

export function useCart() {
  const items = ref([
    { id: 1, title: 'Механическая клавиатура', price: 7500, count: 1 },
    { id: 2, title: 'Игровая мышь', price: 3200, count: 2 }
  ])
  const coupon = ref('')

  // Вычисляемая общая сумма
  const totalSum = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.count, 0)
  })

  // Вычисляемая сумма со скидкой
  const discountedSum = computed(() => {
    const raw = totalSum.value
    if (coupon.value.toUpperCase() === 'SAVE20') {
      return Math.round(raw * 0.8)
    }
    return raw
  })

  function addItem(item) {
    const existing = items.value.find((i) => i.id === item.id)
    if (existing) {
      existing.count += item.count || 1
    } else {
      items.value.push({ ...item, count: item.count || 1 })
    }
  }

  function updateCount(id, newCount) {
    try {
      if (newCount < 1) {
        throw new Error('Количество товара не может быть меньше 1')
      }
      const target = items.value.find((i) => i.id === id)
      if (target) {
        target.count = newCount
      }
    } catch (err) {
      console.warn('Ошибка изменения количества:', err)
      throw err
    }
  }

  function removeItem(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  async function checkout(orderData = {}) {
    try {
      if (items.value.length === 0) {
        throw new Error('Нельзя оформить заказ с пустой корзиной')
      }
      // Имитация асинхронного API-запроса
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const order = {
        orderId: 'ORD-' + Date.now(),
        total: discountedSum.value,
        itemsCount: items.value.length,
        status: 'confirmed',
        ...orderData
      }
      
      // Очищаем корзину после успешной оплаты
      items.value = []
      coupon.value = ''
      return order
    } catch (error) {
      console.error('Чекаут не удался:', error)
      throw error
    }
  }

  return {
    items,
    coupon,
    totalSum,
    discountedSum,
    addItem,
    updateCount,
    removeItem,
    checkout
  }
}
`,
        },
      ],
    },
  ],
}
