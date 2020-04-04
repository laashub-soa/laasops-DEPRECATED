# 编译nodejs为js
FROM python:3.6
WORKDIR /usr/src/app
RUN rm -rf *
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN echo "编译整体项目"
RUN python -m compileall .
RUN echo "删除python文件"
RUN find . -name *.py |xargs rm -rf
MAINTAINER tristan "https://github.com/tristan-tsl"
VOLUME /usr/src/app/distribution/configs
VOLUME /usr/src/app/engine_logic_dir
EXPOSE 5000
CMD [ "python", "./setup.py" ]