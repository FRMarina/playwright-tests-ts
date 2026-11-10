FROM mcr.microsoft.com/playwright:v1.65.0-jammy

WORKDIR /app
COPY . .
RUN npm ci
CMD ["npx", "playwright", "test"]