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

    return json.dumps(mymysql.execute("""
        insert into designer_data_directory(pid, name) values (%(pid)s, %(name)s)
    """, {
        "pid": pid,
        "name": name,
    }))


@app.route('/update', methods=['POST'])
def update():
    request_data = json.loads(request.get_data())
    params = {}
    update_set_sql_str = ""

    if not request_data.__contains__("id"):
        raise MyServiceException("missing param: id")
    params["id"] = request_data["id"]

    if request_data.__contains__("name"):
        params["name"] = request_data["name"]
        update_set_sql_str = "set name=%(name)s"

    if request_data.__contains__("pid"):
        params["pid"] = request_data["pid"]
        update_set_sql_str = "set pid=%(pid)s"

    if "" == update_set_sql_str:
        raise MyServiceException("no content for update set")

    return json.dumps(mymysql.execute("""
        update designer_data_directory
        %s
        where id = %(id)s
    """ % update_set_sql_str, params))


def delete():
    pass


def fork():
    pass
