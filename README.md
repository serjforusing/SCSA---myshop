# MyShop

Django REST Framework-სა და React-ზე შექმნილი ონლაინ მაღაზია პროდუქტების, კალათისა და შეკვეთების სამართავად.

## ფუნქციები

- JWT რეგისტრაცია, შესვლა, გამოსვლა და token refresh
- პროდუქტების CRUD და მფლობელის უფლებები
- ძიება, ფილტრაცია, დალაგება და pagination
- პირადი კალათა და შეკვეთების ისტორია
- შეკვეთის სტატუსები და მარაგის ავტომატური შემცირება
- ქართული responsive ინტერფეისი და Swagger დოკუმენტაცია

## ტექნოლოგიები

Python, Django, DRF, SQLite/PostgreSQL, React, Axios, React Router, CSS და Docker.

## Docker-ით გაშვება

Repository-ს მთავარ საქაღალდეში:

```bash
docker compose up --build
```

- საიტი: `http://localhost:3000`
- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/api/docs/`

## Docker-ის გარეშე გაშვება

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Windows-ზე გარემოს ჩასართავად გამოიყენე `.venv\Scripts\activate`.

Frontend მეორე terminal-ში:

```bash
cd frontend
npm install
npm start
```

## ძირითადი API

| მეთოდი | Endpoint |
|---|---|
| POST | `/api/register/` |
| POST | `/api/login/` |
| POST | `/api/login/refresh/` |
| POST | `/api/logout/` |
| GET, POST | `/api/product/` |
| GET, PUT, DELETE | `/api/product/{id}/` |
| GET | `/api/cart/` |
| POST | `/api/cart/items/` |
| PATCH, DELETE | `/api/cart/items/{id}/` |
| GET, POST | `/api/orders/` |
| GET | `/api/orders/{id}/` |

## ტესტები

```bash
cd backend && python manage.py test
cd frontend && npm test -- --watchAll=false
```

## Deployment

Render-ის კონფიგურაცია არის `render.yaml`-ში. საჭიროა `DJANGO_SECRET_KEY`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` და `REACT_APP_API_URL` მნიშვნელობების მითითება.

Live URL დაემატება Render-ზე განთავსების შემდეგ.
