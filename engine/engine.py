import json

from flask import Blueprint, request, make_response

# from distribution.component import mymysql
from distribution.exception import MyServiceException
from .component.myengine import MyEngine

app = Blueprint('engine_engine', __name__,
                url_prefix='/engine/engine')


@app.route('/trigger', methods=['POST'])
def trigger():
    try:
        request_data = json.loads(request.get_data())
        if not request_data.__contains__("data_id"):
            raise MyServiceException("missing param: data_id")
        if not request_data.__contains__("data_data_id"):
            raise MyServiceException("missing param: data_data_id")
        if not request_data.__contains__("type"):
            raise MyServiceException("missing param: type")
        if not request_data.__contains__("logic_id"):
            raise MyServiceException("missing param: logic_id")
        if not request_data.__contains__("func_name"):
            raise MyServiceException("missing param: func_name")

        data_id = request_data["data_id"]
        data_data_id = request_data["data_data_id"]
        type = request_data["type"]
        logic_id = request_data["logic_id"]
        func_name = request_data["func_name"]

        MyEngine(data_id, data_data_id, type, logic_id, func_name).start()
        return "SUCCESS"
    except MyServiceException as e:
        print("e.msg: ", e.msg)
        custom_res = make_response(e.msg)
        custom_res.status = "500"
        return custom_res
