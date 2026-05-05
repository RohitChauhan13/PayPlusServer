# PayPlus Server

Production-ready backend for PayPlus work entries, rates, commissions, and JWT authentication.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Create a MySQL database matching `DB_NAME` before starting the server.

For local development only, set `DB_SYNC=true` to let Sequelize create tables. Use migrations in production.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/rates`
- `PUT /api/rates`
- `POST /api/work`
- `GET /api/work?startDate=2026-01-01&endDate=2026-01-10&page=1&limit=20`
- `GET /api/work/:id`
- `PUT /api/work/:id`
- `DELETE /api/work/:id`

Protected routes require:

```http
Authorization: Bearer <token>
```

## Rate and Work Fields

`awak`, `jawak`, `dock_awak`, `dock_jawak`, `jawak_varning`, `dock_jawak_varning`, `c_box`, `panni`, `potti_3`, `potty_5`, `potti_10`, `solapur`, `kishan_DA`, `other`

Each field has a rate and commission rate in the single rates row. Work entries store quantities and calculated `total_amount` and `total_commission`.
"# PayPlusServer" 
