FROM node:18-slim AS js-builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build


FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY --from=js-builder /app /app

RUN pip install --no-cache-dir wheel "setuptools<80"

RUN pip install --no-cache-dir .

VOLUME ["/root/.visdom"]


EXPOSE 8097

ENTRYPOINT ["python", "-m", "visdom.server", "-port", "8097", "--hostname", "0.0.0.0"]
