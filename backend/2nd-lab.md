## 1. Основные сущности доменной модели

### 1.1. User

**Атрибуты:**
- `id`
- `username`
- `email`
- `passwordHash`
- `createdAt`

### 1.2. Recipe

**Атрибуты:**
- `id`
- `title`
- `description`
- `category`
- `photoUrl`
- `createdAt`
- `updatedAt`

### 1.3. Comment

**Атрибуты:**
- `id`
- `content`
- `createdAt`

### 1.4. Like

**Атрибуты:**
- `id`
- `createdAt`

### 1.5. Favorite

**Атрибуты:**
- `id`
- `createdAt`

### 1.6. Subscription

**Атрибуты:**
- `subscriberId`
- `targetUserId`
- `createdAt`

## 2. Value Objects

### 2.1. IngredientLine

**Атрибуты:**
- `name`
- `quantity`
- `unit`
- `position`

### 2.2. RecipeStep

**Атрибуты:**
- `description`
- `position`
- `imageUrl`

### 2.3. RecipeCategory

**Допустимые значения:**
- `desserts`
- `meat`
- `drinks`
- `vegan`

## 3. Связи между сущностями

### 3.1. User — Recipe
- Один пользователь может создать много рецептов.
- Один рецепт принадлежит одному автору.

**Тип связи:**  
`User 1 -> * Recipe`

### 3.2. Recipe — IngredientLine
- Один рецепт содержит много ингредиентов.
- Один ингредиент существует только внутри конкретного рецепта.

**Тип связи:**  
`Recipe 1 -> * IngredientLine`

### 3.3. Recipe — RecipeStep
- Один рецепт содержит много шагов приготовления.
- Один шаг существует только внутри конкретного рецепта.

**Тип связи:**  
`Recipe 1 -> * RecipeStep`

### 3.4. Recipe — Comment
- Один рецепт может иметь много комментариев.
- Один комментарий относится только к одному рецепту.

**Тип связи:**  
`Recipe 1 -> * Comment`

### 3.5. User — Comment
- Один пользователь может оставить много комментариев.
- Один комментарий принадлежит одному пользователю.

**Тип связи:**  
`User 1 -> * Comment`

### 3.6. User — Like — Recipe
- Один пользователь может поставить много лайков.
- Один лайк ставится одним пользователем.
- Один рецепт может иметь много лайков.
- Один лайк относится к одному рецепту.

**Тип связи:**  
`User 1 -> * Like`  
`Recipe 1 -> * Like`

### 3.7. User — Favorite — Recipe
- Один пользователь может добавить в избранное много рецептов.
- Одна запись избранного принадлежит одному пользователю.
- Один рецепт может находиться в избранном у многих пользователей.
- Одна запись избранного относится к одному рецепту.

**Тип связи:**  
`User 1 -> * Favorite`  
`Recipe 1 -> * Favorite`

### 3.8. User — Subscription — User
- Один пользователь может подписаться на многих авторов.
- Одна подписка создаётся одним подписчиком.
- Один пользователь может иметь много подписчиков.
- Одна подписка указывает на одного автора.

**Тип связи:**  
`User 1 -> * Subscription` (как подписчик)  
`User 1 -> * Subscription` (как автор)

## 4. Инварианты доменной модели

### Для User
- имя пользователя обязательно;
- имя пользователя должно быть уникальным;
- email должен быть уникальным;
- пароль в системе должен храниться только в виде хеша;
- пользователь не может подписаться сам на себя.

### Для Recipe
- рецепт не может существовать без названия;
- рецепт не может существовать без автора;
- рецепт должен содержать хотя бы один ингредиент;
- рецепт должен содержать хотя бы один шаг приготовления;
- категория рецепта должна принадлежать допустимому набору значений.

### Для Comment
- комментарий не может быть пустым;
- комментарий должен быть привязан к существующему рецепту;
- комментарий должен быть привязан к существующему пользователю.

### Для Like
- один пользователь не может поставить лайк одному и тому же рецепту дважды;
- лайк может быть поставлен только существующему рецепту существующим пользователем.

### Для Favorite
- один пользователь не может добавить один и тот же рецепт в избранное дважды;
- запись избранного может существовать только для существующего рецепта и существующего пользователя.

### Для Subscription
- одна и та же подписка не может быть создана дважды;
- пользователь не может подписаться сам на себя;
- подписка может существовать только между существующими пользователями.

## 5. UML-представление доменной модели

### Сущности и value objects

```mermaid
classDiagram
direction LR

class User {
  Long id
  String username
  String email
  String passwordHash
  Date createdAt
}

class Recipe {
  Long id
  String title
  String description
  RecipeCategory category
  String photoUrl
  Date createdAt
  Date updatedAt
}

class Comment {
  Long id
  String content
  Date createdAt
}

class Like {
  Long id
  Date createdAt
}

class Favorite {
  Long id
  Date createdAt
}

class Subscription {
  Long subscriberId
  Long targetUserId
  Date createdAt
}

class IngredientLine {
  String name
  String quantity
  String unit
  Integer position
}

class RecipeStep {
  String description
  Integer position
  String imageUrl
}

class RecipeCategory {
  <<enumeration>>
  desserts
  meat
  drinks
  vegan
}

User "1" -- "*" Recipe : creates

Recipe "1" *-- "*" IngredientLine : contains
Recipe "1" *-- "*" RecipeStep : consists of
Recipe "1" *-- "*" Comment : has
User "1" -- "*" Comment : writes

User "1" -- "*" Like : puts
Recipe "1" -- "*" Like : receives

User "1" -- "*" Favorite : adds
Recipe "1" -- "*" Favorite : saved in

User "1" -- "*" Subscription : follower
Subscription "*" -- "1" User : author

Recipe --> RecipeCategory : category