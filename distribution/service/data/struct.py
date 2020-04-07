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


@app.route('/insert', methods=['POST'])
def insert():
    request_data = form.check(["did", "code", "meaning", "reference_type"])
    return json.dumps(mymysql.execute("""
                insert into designer_data_struct(did, code, meaning, reference_type ) 
                values (%(did)s, %(code)s, %(meaning)s, %(reference_type)s)
    """, request_data))


@app.route('/update', methods=['POST'])
def update():
    request_data = form.check(["did", "code", "meaning", "reference_type"])
    return json.dumps(mymysql.execute("""
                update designer_data_struct 
                set code = %(code)s ,meaning = %(meaning)s
                where id = %(id)s
    """, request_data))


@app.route('/delete', methods=['POST'])
def delete():
    request_data = form.check(["id"])
    return json.dumps(mymysql.execute("""
                delete from designer_data_struct
                where id = %(id)s
    """, request_data))
