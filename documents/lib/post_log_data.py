from nsdocuments.lib.debug_config import *
import json
import traceback

from django.conf import settings
from documents.consumers import BasePacketParser

import numpy as np
import requests

DEVICE_SERVER_API_TOKEN = 'da7967ff3fadc52efdee96b5d773a3c6772e77ef'
DEVICE_SERVER_API_URL = 'https://fcappdev.nucleusscientific.com/api/v1'
DEVICE_SERVER_API_URL = 'http://192.168.1.72:9000/api/v1'

settings.DEVICE_SERVER_API_URL = DEVICE_SERVER_API_URL
# settings.DEVICE_SERVER_API_TOKEN = DEVICE_SERVER_API_TOKEN

logs_url = settings.DEVICE_SERVER_API_URL + '/logs/'
sessions_url = settings.DEVICE_SERVER_API_URL + '/sessions/'
auth_token = settings.DEVICE_SERVER_API_TOKEN


def post_log_data(data):
    headers = {'Authorization': 'Token {}'.format(auth_token)}
    return requests.post(logs_url, data=data, headers=headers)


def create_session(data):
    headers = {'Authorization': 'Token {}'.format(auth_token)}
    res = requests.post(sessions_url, data=data, headers=headers)
    res = res.json()
    session_id = res.get('id')
    return session_id


class PacketStreamer(BasePacketParser):
    @staticmethod
    def stream_log_data():
        session_data = {
            'handset': 'd5204e182d6ee2c1',
            'hardware_device': "F1:E4:71:ED:62:83",
            'firmware_version': '0.10',
            'ip_address': settings.HOST_IP
        }
        session_id = create_session(session_data)

        batch_size = 1000
        count = 0
        offset_reference_time = 0
        bpp = BasePacketParser()
        while True:
            batch = []
            try:
                for entry in range(batch_size):
                    for data_type in bpp.payload_type_map.keys():
                        random_number = np.random.randn()

                        bpp.timestamp = count
                        bpp.payload_type_id = data_type
                        bpp.payload = random_number
                        raw_packet = bpp.assemble_packet()
                        raw_packet = raw_packet.decode('utf8')

                        batch.append({
                            'session_id': session_id,
                            'time': offset_reference_time,
                            'raw_packet': raw_packet,
                            'log_data': 'null'
                        })
                    count += 1
                res = post_log_data({'bulk_entries': json.dumps(batch)})
                if res.status_code == 201:
                    print("Log success: session_id {}".format(session_id))
                else:
                    logger.warn("Post logs failed with {}".format(res.status_code))
                    logger.warn("Post logs failed with {}".format(res))

                print(count)
            except KeyboardInterrupt as e:
                return {}
            except Exception as e:
                traceback.print_exc()
                logger.warn(e)


ps = PacketStreamer()
ps.stream_log_data()
