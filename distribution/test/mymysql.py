from component import mymysql
from component.mymysql import execute

mymysql.init({
    'host': "192.168.121.133",
    'port': 3306,
    'database': 'laashub',
    'user': 'laashub',
    'password': 'laashub123',
    'charset': 'utf8mb4',
})

if __name__ == '__main__':
    target_id = 38
    # 查询多条
    print(execute("""
    select * from designer_data_directory
    """))
    # 查询一条
    print(execute("""
    select * from designer_data_directory where id = %(id)s
    """, {
        "id": target_id
    }))
    # 新增
    print(execute("""
        insert into designer_data_directory(pid, name) values (%(pid)s,%(name)s)
        """, {
        "pid": target_id,
        "name": "test2"
    }))
    # 修改
    print(execute("""
        update designer_data_directory set name = %(name)s where id = %(id)s
        """, {
        "id": target_id,
        "name": "test",
    }))
    # 删除
    print(execute("""
            delete from designer_data_directory where id = %(id)s
            """, {"id": target_id}))
