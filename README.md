# MyShop

## Project Description

MyShop არის Django REST Framework და React-ზე შექმნილი ონლაინ მაღაზიის აპლიკაცია. მომხმარებელს შეუძლია რეგისტრაცია, პროდუქტების მართვა, კალათის შევსება, მიწოდების მონაცემებით შეკვეთის გაფორმება და საკუთარი შეკვეთების ისტორიის ნახვა.

## Technologies

- Python, Django, Django REST Framework
- JWT (`djangorestframework-simplejwt`)
- SQLite ლოკალურად და PostgreSQL production-ში
- React, React Router, Axios
- CSS
- Docker და Docker Compose
- DRF Spectacular / Swagger
- Render

## Features

- Register, login, logout და automatic token refresh
- Protected React routes
- Product CRUD
- მხოლოდ პროდუქტის owner-ს შეუძლია მისი შეცვლა ან წაშლა
- მომხმარებელზე დამოკიდებული კალათა და შეკვეთები
- კალათაში რაოდენობის შეცვლა და პროდუქტის ამოღება
- შეკვეთის გაფორმება, სტატუსები და შეკვეთების ისტორია
- შეკვეთისას მარაგის უსაფრთხოდ შემცირება
- User, Product, Category, Cart, CartItem, Order და OrderItem relationships
- ძიება, კატეგორიით ფილტრაცია და დალაგება
- გვერდებად დაყოფა
- Loading, error და empty states
- Responsive დიზაინი
- Swagger API documentation

## Models

- `User` — Django-ს მომხმარებელი
- `Category` — პროდუქტის კატეგორია
- `Product` — უკავშირდება `User`-სა და `Category`-ს ForeignKey-ებით
- `Cart` — მომხმარებლის პირადი კალათა
- `CartItem` — კალათასა და პროდუქტს აკავშირებს და ინახავს რაოდენობას
- `Order` — მომხმარებლის შეკვეთა, მიწოდების ინფორმაცია და სტატუსი
- `OrderItem` — შეკვეთილი პროდუქტის სახელი, ფასი და რაოდენობა

SQLite გამოიყენება მარტივი ლოკალური გაშვებისთვის. Render-ზე გამოიყენება PostgreSQL, რადგან production მონაცემები deployment-ის შემდეგაც უნდა შენარჩუნდეს.

## Local Installation

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend გაეშვება `http://localhost:8000` მისამართზე. საწყისი ქართული კატეგორიები migration-ით იქმნება, მათი მართვა კი შესაძლებელია `http://localhost:8000/admin/` გვერდიდან.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

Frontend გაეშვება `http://localhost:3000` მისამართზე.

## Docker

```bash
docker compose up --build
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:8000`

## API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register/` | რეგისტრაცია |
| POST | `/api/login/` | Access და refresh token |
| POST | `/api/login/refresh/` | Access token-ის განახლება |
| POST | `/api/logout/` | Logout და refresh token-ის გაუქმება |
| GET | `/api/category/` | კატეგორიების სია |
| GET, POST | `/api/product/` | პროდუქტების სია და შექმნა |
| GET, PUT, DELETE | `/api/product/{id}/` | პროდუქტის ნახვა, შეცვლა და წაშლა |
| GET | `/api/cart/` | მომხმარებლის კალათა |
| POST | `/api/cart/items/` | პროდუქტის კალათაში დამატება |
| PATCH, DELETE | `/api/cart/items/{id}/` | რაოდენობის შეცვლა და კალათიდან ამოღება |
| GET, POST | `/api/orders/` | შეკვეთების ისტორია და შეკვეთის გაფორმება |
| GET | `/api/orders/{id}/` | საკუთარი შეკვეთის დეტალები |

Query parameters:

```text
?search=python
?category=1
?ordering=-created_at
?page=2
?status=pending
```

Swagger documentation: `http://localhost:8000/api/docs/`

## Tests

```bash
cd backend
python manage.py test

cd ../frontend
npm test -- --watchAll=false
```

## Deployment

Repository-ის root-ში არსებული `render.yaml` ქმნის:

- Django API web service-ს
- React static site-ს
- PostgreSQL database-ს

Render Blueprint-ის შექმნისას საჭიროა ამ მნიშვნელობების მითითება:

- Backend `CORS_ALLOWED_ORIGINS` და `CSRF_TRUSTED_ORIGINS` — frontend-ის სრული Render URL
- Frontend `REACT_APP_API_URL` — backend-ის სრული Render URL

## Live Demo

Production URL-ები დაემატება Render-ზე deployment-ის შემდეგ.
