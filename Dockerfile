# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm run build

# COPY . .

# EXPOSE 4000

# # CMD ["npm", "run", "dev"]
# CMD ["npm","start"]



# -----------------------
# Build stage
# -----------------------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

RUN npm run build


# -----------------------
# Production stage
# -----------------------
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.* ./

EXPOSE 3000

CMD ["npm", "start"]