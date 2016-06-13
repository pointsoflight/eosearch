copy_sql = """
    COPY irs_eo_records FROM stdin WITH CSV HEADER
    DELIMITER as ',';
"""

truncate_table_sql = """
    TRUNCATE TABLE irs_eo_records;
"""

tear_down_indexes_sql = """
    DROP INDEX IF EXISTS ix_irs_eo_records_name;
    DROP INDEX IF EXISTS ix_irs_eo_records_ico;
    DROP INDEX IF EXISTS ix_irs_eo_records_street;
    DROP INDEX IF EXISTS ix_irs_eo_records_city;
    DROP INDEX IF EXISTS ix_irs_eo_records_state;
    DROP INDEX IF EXISTS ix_irs_eo_records_zip;
"""

build_indexes_sql = """
    CREATE INDEX IF NOT EXISTS ix_irs_eo_records_name ON irs_eo_records(name);
    CREATE INDEX IF NOT EXISTS ix_irs_eo_records_ico ON irs_eo_records(ico);
    CREATE INDEX IF NOT EXISTS ix_irs_eo_records_street ON irs_eo_records(street);
    CREATE INDEX IF NOT EXISTS ix_irs_eo_records_city ON irs_eo_records(city);
    CREATE INDEX IF NOT EXISTS ix_irs_eo_records_state ON irs_eo_records(state);
    CREATE INDEX IF NOT EXISTS ix_irs_eo_records_zip ON irs_eo_records (zip);
"""
