#!/usr/bin/env python3

from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import requests
from requests.auth import HTTPBasicAuth

# HTTPRequestHandler class


class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):

    # GET
    def do_GET(self):
        self.send_response(401)

# POST

    def do_POST(self):

        contentLen = int(self.headers.getheaders('content-length'))
        contentRaw = self.rfile.read(contentLen)
        data = json.loads(contentRaw)

        r = requests.post('http://localhost:7474/db/data/transaction/commit ',
                          data=data, auth=HTTPBasicAuth('neo4j', 'PASSWORD'))
        print(r.text)

        # Send response status code
        self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        self.wfile.write(r.text)
        # # Send message back to client
        # message = "Hello world!"
        # # Write content as utf-8 data
        # self.wfile.write(bytes(message, "utf8"))
        return


def run():
    print('starting server...')

    # Server settings
    # Choose port 8080, for port 80, which is normally used for a http
    # server, you need root access
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('running server...')
    httpd.serve_forever()


run()
