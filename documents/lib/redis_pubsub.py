from nsdocuments.lib.debug_config import *
import traceback
import time
import binascii
import struct
import crcmod
import redis

from django.conf import settings

import numpy as np
import requests

logs_url = settings.DEVICE_SERVER_API_URL + '/logs/'
sessions_url = settings.DEVICE_SERVER_API_URL + '/sessions/'
auth_token = settings.DEVICE_SERVER_API_TOKEN


def redis_pubsub():
    r = redis.StrictRedis(host=settings.SESSION_REDIS_HOST,
                          port=settings.SESSION_REDIS_PORT)

    p = r.pubsub()
    p.subscribe('device-log')
    while True:
        try:
            msg = p.get_message()
            if msg is not None:
                print(msg)
            time.sleep(.001)
        except KeyboardInterrupt as e:
            logger.info("Bye Bye")
        except Exception as e:
            logger.warn(e)


redis_pubsub()
