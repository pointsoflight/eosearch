#!/usr/bin/env python3.5 # noqa
# coding: utf-8
from urllib.request import urlopen
import psycopg2

from config import constants, constants_sql, settings


conn = psycopg2.connect(**settings.credentials)
cur = conn.cursor()

# TODO: Add error handling
# TODO: Add logging
def download_data(filename): # noqa
    response = urlopen(constants.base_url + filename)
    html = response.read()
    with open(constants.path + filename, 'wb') as f:
        f.write(html)


def insert_data(filename): # noqa
    with open(constants.path + filename, 'r') as f:
        cur.copy_expert(sql=constants_sql.copy_sql, file=f)
        conn.commit()
        cur.close

# We do a complete data load each time...
cur.execute(constants_sql.truncate_table_sql)

# Found a significant speed increase by removing indexes,
# doing the inserts and then rebuilding the indexes...
cur.execute(constants_sql.tear_down_indexes_sql)

for file in constants.files:
    print('---------------------------------')
    download_data(file)
    print('File (' + file + ') downloaded...')
    insert_data(file)
    print('File (' + file + ') inserted...')

# Rebuilding the indexes...
cur.execute(constants_sql.build_indexes_sql)
