import json

from flask import Blueprint

from ...component import form
from ...component import mymysql
from ...exception import MyServiceException

app = Blueprint('distribution_logic_data', __name__,
                url_prefix='/distribution/logic/data')


@app.route('/insert', methods=['POST'])
def insert():
    request_data = form.check(["file"])
