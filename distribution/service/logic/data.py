import json

from flask import Blueprint

from ...component import form
from ...component import mymysql

app = Blueprint('distribution_logic_data', __name__,
                url_prefix='/distribution/logic/data')


@app.route('/select', methods=['POST'])
def select():
    request_data = form.check(["did"])
    return json.dumps(mymysql.execute("""
        select id, file
        from designer_logic_data
        where did = %(did)s
    """, request_data))


@app.route('/update', methods=['POST'])
def update():
    request_data = form.check(["id", "file"])
    _id = request_data['id']
    file = request_data['file']
    update_designer_data_logic_associate(_id, file)
    return json.dumps(mymysql.execute("""
        update designer_logic_data
        set file = %(file)s
        where id = %(id)s
    """, request_data))


def update_designer_data_logic_associate(logic_id, file):

    pass
