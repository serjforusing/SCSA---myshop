# MyShop

## Project Name

**MyShop — ონლაინ მაღაზიის full-stack აპლიკაცია**

## Project Description

MyShop არის მარტივი ონლაინ მაღაზია, სადაც მომხმარებელს შეუძლია პროდუქტების დათვალიერება, ძებნა და კატეგორიების მიხედვით გაფილტვრა. რეგისტრაციის შემდეგ შესაძლებელია საკუთარი პროდუქტის დამატება და მართვა, კალათის გამოყენება და შეკვეთის გაფორმება.

პროექტი მცირე ონლაინ კატალოგისა და შეკვეთების პროცესს ერთ სივრცეში აერთიანებს. Backend მართავს მომხმარებლებს, პროდუქტებს, მარაგს, კალათასა და შეკვეთებს, React-ზე აწყობილი frontend კი ამ ფუნქციებისთვის მარტივ და გასაგებ ინტერფეისს ქმნის.

## Technologies

- Python
- Django
- Django REST Framework
- React
- PostgreSQL
- Axios
- React Router
- JWT Authentication
- Docker
- Render

## Features

- მომხმარებლის რეგისტრაცია, ავტორიზაცია და გამოსვლა
- პროდუქტების ძებნა, კატეგორიით გაფილტვრა და დალაგება
- პროდუქტის დამატება, რედაქტირება და წაშლა მხოლოდ მისი ავტორის მიერ
- პროდუქტისთვის სურათის ფაილის ან ინტერნეტ-ლინკის არასავალდებულო დამატება
- მარაგში არსებული რაოდენობის კონტროლი
- პირადი კალათა და პროდუქტის რაოდენობის შეცვლა
- შეკვეთის გაფორმება და შეკვეთების ისტორიის ნახვა
- პროდუქტებისა და შეკვეთების გვერდებად დაყოფილი სიები
- სხვადასხვა ზომის ეკრანზე მორგებული დიზაინი
- Swagger API დოკუმენტაცია

## Installation

პროექტის ლოკალურად გაშვების ყველაზე მოკლე გზა Docker Compose-ია:

```bash
git clone https://github.com/serjforusing/SCSA---myshop.git
cd SCSA---myshop
docker compose up --build
```

გაშვების შემდეგ frontend ხელმისაწვდომი იქნება `http://localhost:3000`-ზე, backend API — `http://localhost:8000`-ზე, ხოლო Swagger UI — `http://localhost:8000/api/docs/`-ზე.

Docker-ის გარეშე backend-ის გასაშვებად:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cd backend
python manage.py migrate
python manage.py runserver
```

მეორე ტერმინალში გაუშვი frontend:

```bash
cd frontend
npm ci
npm start
```

ლოკალურად პროექტი SQLite-ს იყენებს. PostgreSQL-ის გამოსაყენებლად საჭიროა `DATABASE_URL` გარემოს ცვლადის მითითება.

## API

| Method | Endpoint | დანიშნულება |
| --- | --- | --- |
| `POST` | `/api/register/` | რეგისტრაცია |
| `POST` | `/api/login/` | JWT ტოკენების მიღება |
| `POST` | `/api/login/refresh/` | access token-ის განახლება |
| `POST` | `/api/logout/` | ანგარიშიდან გამოსვლა |
| `GET`, `POST` | `/api/product/` | პროდუქტების სია და ახალი პროდუქტის დამატება |
| `GET`, `PUT`, `DELETE` | `/api/product/<id>/` | პროდუქტის ნახვა, შეცვლა და წაშლა |
| `GET` | `/api/category/` | კატეგორიების სია |
| `GET` | `/api/cart/` | მომხმარებლის კალათა |
| `POST` | `/api/cart/items/` | პროდუქტის კალათაში დამატება |
| `PATCH`, `DELETE` | `/api/cart/items/<id>/` | კალათაში რაოდენობის შეცვლა ან წაშლა |
| `GET`, `POST` | `/api/orders/` | შეკვეთების სია და ახალი შეკვეთა |
| `GET` | `/api/orders/<id>/` | კონკრეტული შეკვეთის ნახვა |

API-ის სრული აღწერა ხელმისაწვდომია `/api/docs/` მისამართზე.

## Deployment

პროექტი განთავსებულია Render-ზე: frontend მუშაობს Static Site-ის სახით, backend — Web Service-ის სახით, მონაცემები კი Render PostgreSQL-ში ინახება.

## Live Demo

[MyShop-ის გახსნა](https://myshop-frontend.onrender.com)
