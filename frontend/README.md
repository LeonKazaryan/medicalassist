# Медицинский AI-Ассистент - Frontend

Премиум интерфейс для медицинского AI-ассистента диагностики на основе клинических протоколов Казахстана.

## Технологический стек

- **React 18** + **TypeScript** (strict mode)
- **Vite** - сборщик и dev-сервер
- **TailwindCSS** - стили и дизайн-система
- **shadcn/ui** - компоненты на основе Radix UI
- **Framer Motion** - анимации
- **TanStack Query** - управление серверным состоянием
- **React Hook Form** + **Zod** - формы и валидация
- **next-themes** - поддержка темной темы
- **sonner** - уведомления
- **lucide-react** - иконки

## Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Настройка окружения

Создайте файл `.env` в корне проекта:

```bash
VITE_API_URL=http://localhost:8000
```

### Запуск dev-сервера

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### Сборка для продакшена

```bash
npm run build
```

### Проверка типов

```bash
npm run type-check
```

## Архитектура проекта

```
src/
├── app/                    # Корень приложения, провайдеры
│   ├── layout.tsx          # Общий лэйаут с хедером/футером
│   └── providers.tsx       # React Query, Theme, Toaster
├── components/
│   ├── ui/                 # shadcn/ui компоненты
│   └── common/             # Переиспользуемые компоненты
├── features/
│   ├── intake/             # Форма ввода симптомов
│   └── session/            # Сессия диагностики (уточнения, результаты)
├── lib/
│   ├── api/                # API клиент, хуки React Query
│   ├── config/             # Константы и конфигурация
│   ├── hooks/              # Пользовательские хуки
│   └── utils/              # Утилиты (cn, форматтеры)
├── styles/                 # Глобальные стили
└── types/                  # TypeScript типы
```

## Основные возможности

### 1️⃣ Ввод симптомов
- Форма с валидацией (10-2000 символов)
- Выбор пола (обязательно)
- Возраст (опционально, 0-120 лет)
- Slider + input для возраста

### 2️⃣ Режим уточнения
- Чат-интерфейс для уточняющих вопросов
- Быстрые ответы (Да/Нет/Не уверен)
- Детальный текстовый ответ
- История диалога
- Аккордеон "Что мы зафиксировали"

### 3️⃣ Результаты диагностики
- Список диагнозов с уровнем уверенности
- Прогресс-бары с анимацией заполнения
- ICD-10 коды
- Аккордеон с объяснениями
- Панель рекомендаций

### 4️⃣ Состояния
- Пустое состояние
- Загрузка с анимированным спиннером
- Ошибка с возможностью повтора
- Скелетоны для предзагрузки

### 5️⃣ Дополнительно
- Темная/светлая тема с плавным переключением
- Адаптивный дизайн (desktop/tablet/mobile)
-Keyb oard-навигация
- ARIA-атрибуты для доступности
- Сохранение сессии в localStorage
- Сброс сессии с подтверждением

## Дизайн-система

### Цветовая палитра
- **Primary**: Мягкий синий (#3b82f6)
- **Neutral**: Zinc/Stone
- **Accent**: Фиолетовый (#8b5cf6)
- Без неоновых градиентов
- Спокойная клиническая эстетика

### Типография
- Шрифт: Inter
- Line-height: 1.6
- Generous whitespace
- Средние веса для заголовков

### UI принципы
- Мягкие тени
- Скругленные углы (xl)
- Тонкие borders
- Нет громких цветов
- **Без эмодзи** - только Lucide иконки

## API интеграция

### Эндпоинт: `/diagnose`

**Запрос на начальную оценку:**
```typescript
{
  sex: "male" | "female",
  age?: number | null,
  user_prompt: string
}
```

**Запрос на уточнение:**
```typescript
{
  sex: "male" | "female",
  age?: number | null,
  user_prompt: string,
  question: string,
  answer: string
}
```

**Ответ (уточнение):**
```typescript
{
  kind: "clarify",
  question: string,
  updated_prompt?: string,
  diagnoses?: Diagnosis[]
}
```

**Ответ (результат):**
```typescript
{
  kind: "result",
  diagnoses: Diagnosis[],
  updated_prompt?: string
}
```

**Diagnosis:**
```typescript
{
  name: string,
  confidence: number,  // 0-1
  icd10_code?: string,
  explanation?: string
}
```

## Валидация

Все запросы/ответы валидируются с использованием Zod schemas:
- Runtime проверка типов
- Защита от некорректных данных
- Детальные сообщения об ошибках

## State Management

- **Server state**: React Query (mutations для API calls)
- **UI state**: Local component state
- **Session state**: useReducer + localStorage
- **Theme state**: next-themes

## Анимации

Framer Motion используется для:
- Появление карточек (fade + y-slide)
- Staggered reveal для списка диагнозов
- Анимированное заполнение прогресс-баров
- Плавные переходы между состояниями
- Морфинг кнопки загрузки

## Accessibility

- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels на всех интерактивных элементах
- Focus rings (WCAG-compliant)
- Контраст цветов (AA standard)
- Screen reader friendly

## Поддержка браузеров

- Chrome/Edge (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)

## Лицензия

Private project for Qazcode Datasaur 2026 Challenge
