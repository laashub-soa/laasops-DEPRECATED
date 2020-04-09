import json

from flask import Blueprint

from . import struct
from ...component import form
from ...component import mymysql

app = Blueprint('distribution_data_data', __name__,
                url_prefix='/distribution/data/data')


@app.route('/insert', methods=['POST'])
def insert():
    request_data = form.check(['did'])
    did = request_data['did']
    designer_data_data_table_name = 'designer_data_data_' + str(did)
    insert_sql_keys = ''
    insert_sql_values = ''
    # got the data table' column
    data_struct_list = json.loads(struct.select())
    for item in data_struct_list:
        data_data_table_column = item['code']
        if request_data.__contains__(data_data_table_column):
            insert_sql_keys += data_data_table_column + ', '
            insert_sql_values += '%(' + data_data_table_column + ')s, '
    insert_sql_keys = insert_sql_keys[:len(insert_sql_keys) - 2]
    insert_sql_values = insert_sql_values[:len(insert_sql_values) - 2]

    return json.dumps(mymysql.execute(
        'insert into ' + designer_data_data_table_name + '(' + insert_sql_keys + ') values(' + insert_sql_values + ')',
        json.loads(json.dumps(request_data))))


@app.route('/select', methods=['POST'])
def select():
    request_data = form.check(['did'])
    did = request_data['did']
    designer_data_data_table_name = 'designer_data_data_' + str(did)
    select_sql_keys = 'id, '
    select_sql_values = ''
    # got the data table' column
    data_struct_list = json.loads(struct.select())
    for item in data_struct_list:
        data_data_table_column = item['code']
        select_sql_keys += data_data_table_column + ', '
        if request_data.__contains__(data_data_table_column):
            select_sql_values += '%(' + data_data_table_column + ')s, '
    select_sql_keys = select_sql_keys[:len(select_sql_keys) - 2]
    select_sql_values = select_sql_values[:len(select_sql_values) - 2]

    return json.dumps(mymysql.execute(
        'select ' + select_sql_keys + ' from ' + designer_data_data_table_name,
        json.loads(json.dumps(request_data))))
