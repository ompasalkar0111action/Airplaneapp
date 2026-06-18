# Student DB

Simple Node.js, Express, and MySQL app with `regno`, `mark`, `grade`, and `result`.

## Setup

```bash
npm install
mysql -u root < database.sql
npm start
```

Open `http://localhost:3000`.

If you already created the table before adding `grade`, run this in MySQL:

```sql
USE studentdb;
ALTER TABLE students ADD COLUMN grade VARCHAR(10) NOT NULL AFTER mark;
```
