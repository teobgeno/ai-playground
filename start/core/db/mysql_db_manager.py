"""
Copyright (c) 2022 Amine Asli, "MIAGE SIDI SLIMANE" 

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
"""
# https://gist.github.com/amineasli/398063a66739b438512dec06ef290040

import mysql.connector
from mysql.connector import errorcode


class MySqlDBManager:
    def __init__(self, user, password, host):
        self.user = user
        self.password = password
        self.host = host
        self.cnx = None
        self.cursor = None
        self.result = None

    # creates a connection to the MySQL server and returns a MySQLConnection object otherwise catch all errors using the errors.Error exception
    def connect(self):
        try:
            self.cnx = mysql.connector.connect(
                user=self.user, password=self.password, host=self.host)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print('User/password error')
            elif err.errno == errorcode.CR_SERVER_GONE_ERROR:
                print('Server down error')
            else:
                print(err)
                self.end_connection()
        else:
            self.cursor = self.cnx.cursor()

    def create_database(self, db):
        try:
            self.cursor.execute(f"CREATE DATABASE {db}")
        except mysql.connector.Error as err:
            print(f"Failed creating database: {err}")
            self.end_connection()

    # make sure the database exists, and create it if not
    def use_database(self, db):
        try:
            self.cursor.execute(f"USE {db}")
        except mysql.connector.Error as err:
            print(f"Database {db} donesn't exists.")
            if err.errno == errorcode.ER_BAD_DB_ERROR:
                self.create_database(db)
                print(f"Database {db} created successfully.")
                self.cnx.database = db
            else:
                print(err.msg)
                self.end_connection()

    def delete_database(self, db):
        try:
            self.cursor.execute(f"DROP DATABASE {db}")
        except mysql.connector.Error as err:
            print(f"Failed deleting database: {err}")
            self.end_connection()

    # the parameters found in the tuple or dictionary 'data' are bound to the variables in 'stmt'. Set commit to True if you want to make sure the data is committed to the database
    def query_database(self, stmt, data=None, commit=False):
        try:
            if data:
                self.cursor.execute(stmt, data)
            else:
                self.cursor.execute(stmt)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                print('Table already exists')
                print(err.msg)
            else:
                print(err.msg)
                self.end_connection()
        if commit:
            # Make sure data is committed to the database
            self.cnx.commit()

    def get_result(self):
        return self.cursor

    # returns the value generated for an AUTO_INCREMENT column by the previous statement or None
    def get_last_id(self):
        return self.cursor.lastrowid

    def end_connection(self):
        print('Terminate the script following an error')
        exit(1)

    # shut down the connection upon the execution of python's destructor method
    def __del__(self):
        self.cursor.close()
        self.cnx.close()
