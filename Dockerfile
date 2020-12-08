FROM node:12.16.1

ENV PORT='9090'

WORKDIR /app

RUN yarn global add 'https://github.com/xmmwc/duty-ical/releases/download/1.0.0/duty-ical-1.0.2.tgz'

EXPOSE 9090

ENTRYPOINT [ "/usr/local/bin/duty-ical" ]