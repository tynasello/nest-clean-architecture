Workaround for prisma not being able to handle dynamic migration URL.

- Use dotenv-cli package in prisma migrate scripts to load desired env variable.
- There should be a better way to handle this to avoid copy and paste error between env files.
- https://github.com/prisma/prisma/issues/6485