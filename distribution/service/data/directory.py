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
    if not request_data.__contains__("sql"):
        raise MyServiceException("missing param: sql")
    sql = request_data["sql"]
    if request_data.__contains__("parameters"):
        parameters = request_data["parameters"]
    else:
        parameters = {}
    print("distribution/distribution: ", "sql: ", sql, "parameters: ", str(parameters))
    execute_result = mymysql.execute(sql, parameters)
    return json.dumps(execute_result)


def update():
    pass


def delete():
    pass


def fork():
    pass
