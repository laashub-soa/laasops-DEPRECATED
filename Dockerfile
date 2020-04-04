# 编译nodejs为js
#FROM node:12.16.1 as frontend
FROM python:3.6
WORKDIR /usr/src/app
RUN rm -rf *
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
#COPY --from=frontend /tes /test
RUN echo "编译整体项目"
RUN python3 -m compileall .
RUN echo "删除python文件"
RUN find . -name "*.py" |xargs rm -rf
MAINTAINER tristan "https://github.com/tristan-tsl"
VOLUME /usr/src/app/distribution/configs
VOLUME /usr/src/app/engine_logic_dir
EXPOSE 5000
CMD [ "python", "./setup.pyc" ]