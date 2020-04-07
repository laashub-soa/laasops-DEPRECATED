import json

from flask import Blueprint

from ...component import form
from ...component import mymysql

app = Blueprint('distribution_data_struct', __name__,
                url_prefix='/distribution/data/struct')


@app.route('/select', methods=['POST'])
def select():
    request_data = form.check(["did"])
    return json.dumps(mymysql.execute("""
                select id, code, meaning, reference_type
                from designer_data_struct
                where did = %(did)s
    """, request_data))

