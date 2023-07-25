FROM node:18.16.0-alpine as base

WORKDIR /usr/src/app

# Add package file
COPY package.json ./

# Install deps
RUN npm install --only=development --force

# Copy source
# COPY src ./src
# COPY tsconfig.json ./tsconfig.json
COPY . .

# Build dist
RUN npm run build

# Start production image build
FROM node:18.16.0-alpine

WORKDIR /usr/src/app

# Copy node modules and build directory
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]