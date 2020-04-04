MAINTAINER tristan "https://github.com/tristan-tsl"
FROM python:3.6
WORKDIR /usr/src/app
RUN rm -rf *
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD [ "python", "-m", "compileall", "." ]
CMD [ "find", ".", "-name", "*.py", "|xargs", "rm", "-rf"]
# 编译nodejs为js
VOLUME /usr/src/app/distribution/configs
VOLUME /usr/src/app/engine_logic_dir
EXPOSE 5000
CMD [ "python", "./setup.py" ]