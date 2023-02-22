# If I Have a Time Machine (IIHTM)

![IIHTM](/public/iihtm-200.png)

Manage your GitHub repositories with ease.

This project was inspired by [Dcard 2023 intern HW](https://drive.google.com/file/d/1ZlwuUafAQUKBEA_ZK6ShM5F4xLTkV_4X/view).

> 👷 The project is still under development.
> 
> If you want to make a contribution, please feel free to open an issue or pull request.
> 
> Any help is appreciated!

## ✨ Features

The project was bootstrapped with [`create-t3-app`](https://create.t3.gg/) and deployed on [Zeabur](https://zeabur.com/).

 - T3 Stack
 - TypeScript
 - Next.js
 - Tailwind CSS
 - tRPC
 - Auth.js (GitHub OAuth)
 - Prisma
 - PostgreSQL

## 🚀 Getting Started

Generate `.env` file from `.env.example` and fill in the values.

You can check the documentation of [PostgreSQL - Zeabur](https://docs.zeabur.com/databases/postgresql) to learn how to create a PostgreSQL database on Zeabur.

Also, you can check the documentation of [Auth.js - GitHub OAuth](https://next-auth.js.org/providers/github) to learn how to create a GitHub OAuth App.

 - [ ] `DATABASE_URL` - PostgreSQL database URL
 - [ ] `GH_CLIENT_ID` - GitHub OAuth App Client ID
 - [ ] `GH_CLIENT_SECRET` - GitHub OAuth App Client Secret

```bash
cp .env.example .env
```

### Install Dependencies

This project already includes a `postinstall` script to generate Prisma client, so you don't need to manually run `prisma generate`.

But you still need to run `pnpm migration:init` to initialize the database.

```bash
# Install dependencies
pnpm i

# Initialize database
pnpm migration:init
```

### Run in Development Mode

You can run the following command to start the development server and open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```bash
pnpm dev
```

## 📝 License

This project is licensed under the [MIT License](/LICENSE).
