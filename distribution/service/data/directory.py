import json

from flask import Blueprint, request

from ...component import mymysql
from ...exception import MyServiceException

app = Blueprint('distribution_data_directory', __name__,
                url_prefix='/distribution/data/directory')


@app.route('/select', methods=['POST'])
def select():
    return json.dumps(mymysql.execute("""
        select id, pid, name, description
        from designer_data_directory
    """, {

    }))


@app.route('/insert', methods=['POST'])
def insert():
    request_data = json.loads(request.get_data())

    if not request_data.__contains__("pid"):
        raise MyServiceException("missing param: pid")
    pid = request_data["pid"]

    if not request_data.__contains__("name"):
        raise MyServiceException("missing param: name")
    name = request_data["name"]

    print("pid:", pid, "name: ", name)

    return json.dumps(mymysql.execute("""
        insert into designer_data_directory(pid, name) values (%(pid)s, %(name)s)
    """, {
        "pid": pid,
        "name": name,
    }))


def update():
    pass


def delete():
    pass


def fork():
    pass
