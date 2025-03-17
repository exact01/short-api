# API Documentation

## Техническая информация

### Стек технологий

- Node.js + TypeScript
- Express.js
- PostgreSQL
- Redis
- Prisma ORM
- Docker & Docker Compose
- Jest для тестирования

### Архитектура

- CQRS (Command Query Responsibility Segregation)
  - Разделение на команды и запросы
  - Command Bus для обработки команд
  - Query Bus для обработки запросов
  - Декораторы для обработчиков команд и запросов
  - Базовые классы для команд и запросов
- Dependency Injection (используется inversify)
  - Инверсия зависимостей
  - Контейнер зависимостей
  - Декораторы для инъекции зависимостей
- Repository pattern

  - Абстракция над базой данных
  - Интерфейсы для репозиториев
  - Prisma-реализации репозиториев

- Модульная структура
  - Каждый модуль содержит:
    - Controllers (обработка HTTP запросов)
    - Services (бизнес-логика)
    - Repositories (работа с данными)
    - Models (модели данных)
    - Commands/Queries (CQRS)

### Основные компоненты

#### Middlewares

1. **Auth Middleware**:

   - Проверка JWT токена
   - Декодирование и валидация токена
   - Добавление информации о пользователе в request

2. **Validation Middleware**:

   - Валидация тела запроса (request body)
   - Валидация параметров запроса
   - Использование Zod для валидации схем

3. **Error Handling Middleware**:
   - Централизованная обработка ошибок
   - Форматирование ответов об ошибках
   - Логирование ошибок

#### Guards

- **Auth Guard**:
  - Защита роутов от неавторизованного доступа
  - Проверка прав доступа
  - Интеграция с middleware

#### Common Components

1. **Logger (tslog)**:

   - Структурированное логирование
   - Различные уровни логов
   - Форматирование логов

2. **Config Service**:

   - Управление конфигурацией приложения
   - Загрузка переменных окружения
   - Валидация конфигурации

3. **Database Service (Prisma)**:

   - Управление подключением к БД
   - Миграции
   - Генерация типов

4. **CQRS Implementation**:

   - Command Bus
   - Query Bus
   - Handlers
   - Декораторы для обработчиков

5. **Error Handlers**:

   - HTTP ошибки
   - Бизнес-ошибки
   - Ошибки валидации

6. **Helpers и утилиты**:
   - Конвертеры
   - Форматтеры
   - Общие утилиты

### Безопасность

- JWT аутентификация
- Хеширование паролей (bcryptjs)
- Helmet для HTTP заголовков
- Валидация входных данных
- Rate limiting (Redis)

### Запуск проекта

1. **Установка зависимостей**:

```bash
npm install
```

2. **Настройка окружения**:

- Скопируйте `.env.example` в `.env`
- Заполните необходимые переменные окружения

3. **Запуск базы данных и Redis**:

```bash
docker-compose up -d
```

4. **Миграции базы данных**:

```bash
# Генерация Prisma клиента
npm run generate

# Применение миграций
npm run migrate:dev

# Заполнение базы данных начальными данными
npm run seed
```

5. **Запуск приложения**:

```bash
# Режим разработки
npm run start:dev

# Режим production
npm run build
npm run start:prod

# Режим отладки
npm run dev:inspect
```

### Скрипты

- `npm run start:dev` - запуск в режиме разработки с hot-reload
- `npm run start:prod` - запуск production версии
- `npm run dev:inspect` - запуск с отладкой
- `npm run lint` - проверка кода линтером
- `npm run format` - форматирование кода
- `npm run test` - запуск unit тестов
- `npm run test:e2e` - запуск e2e тестов
- `npm run build` - сборка проекта
- `npm run migrate:dev` - применение миграций
- `npm run migrate:generate` - генерация миграций
- `npm run migrate:deploy` - деплой миграций
- `npm run seed` - заполнение БД начальными данными

### Docker

Проект включает два основных сервиса:

1. **PostgreSQL**:

   - Порт: 5437
   - Пользователь: postgres
   - База данных: short-api
   - Ограничения: 0.5 CPU, 500MB RAM

2. **Redis**:
   - Порт: 6379
   - Persistence: каждые 60 секунд
   - Ограничения: 1 CPU, 5GB RAM

## Базовая информация

- Базовый URL: `/api/v1`
- Все ответы возвращаются в формате JSON
- Для авторизованных запросов требуется JWT токен в заголовке: `Authorization: Bearer <token>`

## Аутентификация

### Регистрация

- **URL**: `/api/v1/auth/register`
- **Метод**: POST
- **Тело запроса**:

```json
{
  "email": "string",
  "password": "string"
}
```

- **Ответ**:

```json
{
  "data": {
    "jwt": "string"
  }
}
```

### Вход

- **URL**: `/api/v1/auth/login`
- **Метод**: POST
- **Тело запроса**:

```json
{
  "email": "string",
  "password": "string"
}
```

- **Ответ**:

```json
{
  "data": {
    "jwt": "string"
  }
}
```

## Пользователи

### Получение информации о текущем пользователе

- **URL**: `/api/v1/users/me`
- **Метод**: GET
- **Требуется авторизация**: Да
- **Ответ**:

```json
{
  "data": {
    "user": {
      "uuid": "string",
      "email": "string",
      "balance": "number"
    }
  }
}
```

## Продукты

### Создание продукта

- **URL**: `/api/v1/products/create`
- **Метод**: POST
- **Требуется авторизация**: Да
- **Тело запроса**:

```json
{
  "marketHashName": "string",
  "currency": "string",
  "minPrice": "number",
  "meanPrice": "number",
  "suggestedPrice": "number",
  "quantity": "number"
}
```

- **Ответ**:

```json
{
  "data": {
    "product": {
      "uuid": "string",
      "marketHashName": "string",
      "currency": "string",
      "minPrice": "number",
      "meanPrice": "number"
    }
  }
}
```

### Получение продукта по UUID

- **URL**: `/api/v1/products/get-by-uuid/:uuid`
- **Метод**: GET
- **Требуется авторизация**: Да
- **Параметры URL**:
  - uuid: UUID продукта
- **Ответ**:

```json
{
  "data": {
    "product": {
      "uuid": "string",
      "marketHashName": "string",
      "currency": "string",
      "minPrice": "number",
      "meanPrice": "number"
    }
  }
}
```

### Получение всех продуктов

- **URL**: `/api/v1/products/get-all`
- **Метод**: GET
- **Требуется авторизация**: Да
- **Ответ**:

```json
{
  "data": {
    "products": [
      {
        "uuid": "string",
        "marketHashName": "string",
        "minPrice": "number",
        "meanPrice": "number",
        "suggestedPrice": "number",
        "quantity": "number"
      }
    ]
  }
}
```

### Удаление продукта

- **URL**: `/api/v1/products/delete/:uuid`
- **Метод**: DELETE
- **Требуется авторизация**: Да
- **Параметры URL**:
  - uuid: UUID продукта
- **Ответ**:

```json
{
  "data": {
    "success": true
  }
}
```

## Покупки

### Создание покупки

- **URL**: `/api/v1/purchases/create`
- **Метод**: POST
- **Требуется авторизация**: Да
- **Тело запроса**:

```json
{
  "productUuid": "string",
  "quantity": "number"
}
```

- **Ответ**:

```json
{
  "data": {
    "userBalance": "number"
  }
}
```
