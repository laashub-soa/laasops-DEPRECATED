import json

from flask import Blueprint

from ...component import form
from ...component import mymysql

app = Blueprint('distribution_data_logic_trigger', __name__,
                url_prefix='/distribution/data_logic/trigger')


@app.route('/select', methods=['POST'])
def select():
    request_data = form.check(['data_id'])
    return json.dumps(
        mymysql.execute(
            'select data_id, logic_id, func_name, type from designer_data_logic_trigger where data_id = %(data_id)s',
            request_data))
