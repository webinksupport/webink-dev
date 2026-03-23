FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Pass dummy env vars so Prisma can generate client at build time
ENV DATABASE_URL=mysql://dummy:dummy@localhost:3306/dummy
ENV NEXTAUTH_SECRET=build-time-secret
ENV NEXTAUTH_URL=https://dev.webink.solutions
# Generate Prisma client to src/generated/prisma
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build
EXPOSE 3001
ENV PORT=3001
CMD ["node", ".next/standalone/server.js"]
