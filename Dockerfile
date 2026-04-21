FROM node:18-slim AS js-builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM python:3.10-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*


COPY --from=js-builder /app/py ./py
COPY --from=js-builder /app/setup.py .
COPY --from=js-builder /app/package.json .
COPY --from=js-builder /app/MANIFEST.in .
COPY --from=js-builder /app/README.md .

RUN pip install --no-cache-dir wheel "setuptools<80"
RUN pip install --no-cache-dir .


RUN python -c "from visdom.server.build import download_scripts; download_scripts()"

RUN groupadd --system visdom \
    && useradd --system --gid visdom --create-home --home-dir /home/visdom visdom \
    && mkdir -p /home/visdom/.visdom \
    && chown -R visdom:visdom /app /home/visdom

USER visdom

VOLUME ["/home/visdom/.visdom"]
EXPOSE 8097

ENTRYPOINT ["python", "-m", "visdom.server"]
CMD ["-port", "8097", "--hostname", "0.0.0.0"]
