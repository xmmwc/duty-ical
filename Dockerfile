FROM node:12.16.1

ENV PORT='9090'

WORKDIR /app

# RUN yarn global add ''

ENTRYPOINT [ "duty-ical" ]