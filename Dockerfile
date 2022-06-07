FROM nginx:alpine

#COPY nginx /etc/nginx/
WORKDIR /etc/nginx/conf.d

COPY default.conf ./

COPY --chown=nginx:nginx /public /usr/share/nginx/html

RUN touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid  && chown -R nginx:nginx /var/cache/nginx/

USER nginx

EXPOSE 8080

