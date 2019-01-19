from bs4 import BeautifulSoup
import requests
import psycopg2 as psy
from psycopg2 import extras
from psycopg2.extras import Json, DictCursor
import smtplib
import os
from pprint import pprint
from twilio.rest import Client
from datetime import datetime

postgres_file = open("{}/postgres.txt".format(os.getcwd())).read().split('\n')
twilio_file = open("{}/twilio.txt".format(os.getcwd())).read().split('\n')

ACCOUNT = twilio_file[0]
AUTH = twilio_file[1]

def execute(cmd, param=None, fetch=None):
    conn = psy.connect(postgres_file[0], sslmode='require')
    psy.extras.register_hstore(conn, globally=True)

    cur = conn.cursor(cursor_factory=DictCursor)

    if param == None:
        cur.execute(cmd)
        conn.commit()
    else:
        cur.execute(cmd, param)
        conn.commit()

    if fetch == True:
        item = cur.fetchall()

        cur.close()
        conn.close()
        # print(item)
        return item

    cur.close()
    conn.close()

def send_text(message, to_ad):
    fr_ad = "+16046708672"
    client = Client(ACCOUNT, AUTH)
    client.messages.create(to=to_ad, from_=fr_ad, body=message)

"""
COURSES SCHEMA:

year 
term
dept
course
section
"""

#test = execute("SELECT * FROM coursereq", None, True)
#test = execute("UPDATE courses SET year = %s WHERE term = %s or term = %s", ('2018', 'W', 'F'))
test = execute("INSERT INTO courses (year, term, dept, course, section) VALUES (%s, %s, %s, %s, %s)", ('2019', 'S', 'ECON', '340', '145'))
test = execute("SELECT * FROM courses",None, True)
pprint(test)

#send_text('hello', '7788988820') // this works to send a message

# def get_course_seats():
#     course_url = ("https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=5&dept={}&course={}&section={}".format(dept, course, section))
#     sess_url = "https://courses.students.ubc.ca/cs/main?sessyr={}&sesscd={}".format(year, sess)

test = execute("UPDATE courses SET year = %s WHERE term = %s or term = %s", ('2018', 'W', 'F'))
