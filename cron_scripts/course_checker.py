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
#twilio_file = open("{}/twilio.txt".format(os.getcwd())).read().split('\n')

#ACCOUNT = twilio_file[0]
#AUTH = twilio_file[1]

class Course:
    def parse_course_id(self):
        temp_id_lst = self.course_id.split('_')
        self.year = temp_id_lst[0]
        self.term = temp_id_lst[1]
        self.dept = temp_id_lst[2]
        self.num = temp_id_lst[3]
        self.section = temp_id_lst[4]

    def __init__(self, course_id):
        self.course_id = course_id
        self.year = self.term = self.dept = self.num = self.section = None
        self.parse_course_id()
        self.general = 0
        self.restricted = 0
        self.raw_dic = {'Total Seats Remaining:': None,
                       'Currently Registered:': None,
                       'General Seats Remaining:': None,
                       'Restricted Seats Remaining*:': None}

    def __repr__(self):
        return "Course({}, {}, {}, {}, {})".format(self.year, self.term, self.dept, self.num, self.section)

    def get_course_seats(self):
        course_url = (
            "https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-section&dept={}&course={}&section={}".format(
                self.dept, self.num, self.section))
        sess_url = "https://courses.students.ubc.ca/cs/main?sessyr={}&sesscd={}".format(self.year, self.term)
        sess = requests.Session()
        sess.get(sess_url)
        raw = sess.get(course_url)
        data = raw.text
        soup = BeautifulSoup(data, 'html.parser')
        tr = soup.find_all('td')
        acc = None
        for x in tr:
            text = x.text
            # print(text, 1)
            if text in self.raw_dic:
                # print('yes')
                acc = text
                continue
            if acc in self.raw_dic:
                self.raw_dic[acc] = int(text)
                acc = None
        self.general = self.raw_dic['General Seats Remaining:']
        self.restricted = self.raw_dic['Restricted Seats Remaining*:']


test_course = Course('2018_W_CPSC_110_L13')
test_course.get_course_seats()
print(test_course.raw_dic, test_course.general, test_course.restricted)



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

#test = execute("SELECT * FROM coursereq", None, True)
#test = execute("UPDATE courses SET term = %s WHERE term = %s", ('W', 'F'))
#test = execute("UPDATE courses SET year = %s WHERE term = %s or term = %s", ('2018', 'W', 'F'))
#test = execute("INSERT INTO courses (year, term, dept, course, section) VALUES (%s, %s, %s, %s, %s)", ('2019', 'S', 'ECON', '340', '145'))
test = execute("SELECT * FROM courses",None, True)
pprint(test)
#execute("CREATE TABLE coursereq (email varchar, course jsonb, details jsonb, boo bool);",None,None)
#test = execute("DROP TABLE customer")



"""
#test = execute("CREATE TABLE customer (name varchar, phone varchar primary key)", None, None)
test = execute("ALTER TABLE customer ADD UNIQUE (phone)")
test = execute("INSERT INTO customer (phone, name) VALUES (%s, %s)", ("Test" , "7783231234"))
test = execute("SELECT * FROM customer", None, True)
pprint(test)


#send_text('hello', '7788988820') // this works to send a message

def get_course_seats(year, sess, dept, course, section):
    course_url = ("https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-section&dept={}&course={}&section={}".format(dept, course, section))
    sess_url = "https://courses.students.ubc.ca/cs/main?sessyr={}&sesscd={}".format(year, sess)

