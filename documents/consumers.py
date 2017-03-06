import json
import binascii
import logging
import crcmod
import struct
import pprint
import traceback

import requests

from django.conf import settings
from django.http import HttpResponse
from channels import Group
from channels.sessions import enforce_ordering
from channels.auth import channel_session_user, channel_session_user_from_http
from channels.handler import AsgiHandler
from cassandra.cluster import Cluster

from nsdocuments.lib.cryptile import cryptile as cryp

logger = logging.getLogger(__name__)


class BasePacketParser:
    SRC_DST_BYTE_INDEX = 0
    SRC_MASK = 0xF0
    SRC_BITSHIFT = 4
    DST_MASK = 0x0F
    DST_BITSHIFT = 0

    PACKET_LENGTH_BYTE_INDEX = 1

    ENC_RPL_CMD_BYTE_INDEX = 2
    ENC_MASK = 0x80
    ENC_BITSHIFT = 7
    RPL_MASK = 0x40
    RPL_BITSHIFT = 6
    CMD_MASK = 0x3F
    CMD_BITSHIFT = 0

    TIMESTAMP_BYTE_INDEX = 3
    TIMESTAMP_BYTE_LENGTH = 4

    PAYLOAD_BYTE_INDEX = 7

    payload_type_map = {
        # 0x04: 'timestamp',
        # 0x05: 'state',
        0x07: 'voltageA',
        0x08: 'voltageB',
        0x09: 'currentB',
        0x0A: 'temperature',
        0x0B: 'SOC',
        # 0x0B: 'duty',
    }

    source_map = {
        0: 'Mobile App',
        1: 'AP (NRF)',
        2: 'DPC (STM32)',
    }

    encrypted_map = {
        0: 'no',
        1: 'yes',
    }

    reply_type_map = {
        0: 'reply',
        1: 'response',
    }

    command_type_map = {
        0x00: 'ping',
        0x40: 'ping_reply',
        0x01: 'get_uid',
        0x41: 'get_uid_reply',
        0x02: 'get_version',
        0x42: 'get_version_reply',
        0x03: 'set_time',
        0x43: 'set_time_reply',
        0x04: 'get_reglist_info',
        0x44: 'get_reglist_info_reply',
        0x05: 'get_register_name',
        0x45: 'get_register_name_reply',
        0x06: 'get_register_info',
        0x46: 'get_register_info_reply',
        0x07: 'read_register',
        0x47: 'read_register_reply',
        0x08: 'push_register',
        0x48: 'push_register_reply',
        0x09: 'write_register',
        0x49: 'write_register_reply',
    }

    def __init__(self, raw_packet=None):
        self._raw_packet = None
        self.byte_packet = None
        self.array_packet = None
        if raw_packet is not None:
            self.set_raw_packet(raw_packet)

        self.source_id = None
        self.source = None
        self.destination_id = None
        self.destination = None

        self.payload_length = None

        self.is_encrypted_id = None
        self.is_encrypted = None

        self.reply_type_id = None
        self.reply_type = None

        self.command_type_id = None
        self.command_type = None

        self.timestamp_array = None
        self.timestamp = None

        self.payload_type_id = None
        self.payload_type = None
        self.payload_array = None
        self.payload = None

        self.packet_crc = None

    def assemble_packet(self):
        head = bytes([0x20])
        length = bytes([0x05])
        enc_rpl_cmd = bytes([0x47])
        timestamp = struct.pack('<I', self.timestamp)
        payload_type = bytes([self.payload_type_id])
        payload = struct.pack('<f', self.payload)
        crc = self.calc_crc(payload)
        crc = bytes([crc])
        return binascii.hexlify(head + length + enc_rpl_cmd + timestamp + payload_type + payload + crc)
        # return binascii.hexlify(head + length + enc_rpl_cmd + timestamp + payload_type + payload)

    def set_raw_packet(self, raw_packet):
        self._raw_packet = raw_packet
        self.byte_packet = binascii.unhexlify(self._raw_packet)
        self.array_packet = [x for x in self.byte_packet]

    @staticmethod
    def break_byte(byte_value, mask, shift):
        return (byte_value & mask) >> shift

    @staticmethod
    def calc_crc(byte_array):
        # byte_array.reverse()
        hex_number = binascii.hexlify(bytes(byte_array))
        crc8_func = crcmod.mkCrcFun(0x1D5)
        crc = crc8_func(hex_number)
        return int(hex(crc), 16)


class PacketDeconstructor(BasePacketParser):
    def __init__(self, raw_packet=None):
        super().__init__(raw_packet)
        self._timestamp = 0

    @property
    def timestamp(self):
        return self._timestamp

    @timestamp.setter
    def timestamp(self, timestamp):
        if timestamp is None:
            timestamp = 0
        self._timestamp = timestamp

    def deconstruct_packet(self):
        self.source_id = self.break_byte(self.array_packet[self.SRC_DST_BYTE_INDEX],
                                         self.SRC_MASK,
                                         self.SRC_BITSHIFT)
        self.source = self.source_map.get(self.source_id)

        self.destination_id = self.break_byte(self.array_packet[self.SRC_DST_BYTE_INDEX],
                                              self.DST_MASK,
                                              self.DST_BITSHIFT)
        self.destination = self.source_map.get(self.destination_id)

        self.payload_length = self.array_packet[self.PACKET_LENGTH_BYTE_INDEX]

        self.is_encrypted_id = self.break_byte(self.array_packet[self.ENC_RPL_CMD_BYTE_INDEX],
                                               self.ENC_MASK, self.ENC_BITSHIFT)
        self.is_encrypted = self.encrypted_map.get(self.is_encrypted_id)

        self.reply_type_id = self.break_byte(self.array_packet[self.ENC_RPL_CMD_BYTE_INDEX],
                                             self.RPL_MASK,
                                             self.RPL_MASK)
        self.reply_type = self.reply_type_map.get(self.reply_type_id)

        self.command_type_id = self.break_byte(self.array_packet[self.ENC_RPL_CMD_BYTE_INDEX],
                                               self.CMD_MASK,
                                               self.CMD_BITSHIFT)
        self.command_type = self.command_type_map.get(self.command_type_id)

        start_timestamp = self.TIMESTAMP_BYTE_INDEX
        end_timestamp = start_timestamp + self.TIMESTAMP_BYTE_LENGTH
        self.timestamp_array = self.array_packet[start_timestamp:end_timestamp]
        self.timestamp = struct.unpack('<I', bytes(self.timestamp_array))[0]

        start_payload = self.PAYLOAD_BYTE_INDEX
        end_payload = start_payload + self.payload_length
        self.payload_type_id = self.array_packet[start_payload]
        if self.payload_type_id in self.payload_type_map.keys():
            self.payload_type = self.payload_type_map.get(self.payload_type_id)
            self.payload_array = self.array_packet[start_payload + 1:end_payload]
            try:
                self.payload = struct.unpack('<f', bytes(self.payload_array))[0]
            except Exception as e:
                self.payload = 0
                traceback.print_exc()
        else:
            self.payload_type = 'unknown'
            self.payload = 0

        self.packet_crc = self.array_packet[end_payload]


def deconstruct_packet(raw_packet='200547cb1200000999fc53bde7'):
    packet_parser = PacketDeconstructor(raw_packet=raw_packet)
    packet_parser.deconstruct_packet()
    data = {
        'source_id': packet_parser.source_id,
        'source': packet_parser.source,
        'destination_id': packet_parser.destination_id,
        'destination': packet_parser.destination,
        'packet_length': packet_parser.payload_length,
        'is_encrypted_id': packet_parser.is_encrypted_id,
        'is_encrypted': packet_parser.is_encrypted,
        'message_type_id': packet_parser.reply_type_id,
        'message_type': packet_parser.reply_type,
        'command_type_id': packet_parser.command_type_id,
        'command_type': packet_parser.command_type,
        'timestamp_array': packet_parser.timestamp_array,
        'timestamp': packet_parser.timestamp,
        'payload_array': packet_parser.payload_array,
        'payload_type_id': packet_parser.payload_type_id,
        'payload_type': packet_parser.payload_type,
        'payload': packet_parser.payload,
        'packet_crc': packet_parser.packet_crc
    }

    pprint.pprint(data, indent=2)
    packet_parser.calc_crc(packet_parser.payload_array)


def http_consumer(message):
    response = HttpResponse('Hello hhhworld')
    for chunk in AsgiHandler.encode_response(response):
        message.reply_channel.send(chunk)


@enforce_ordering(slight=True)
@channel_session_user_from_http
def ws_connect(message):
    logger.warn("Called ws connect")
    user = message.user.username
    Group('plot-{}'.format(user)).add(message.reply_channel)


@enforce_ordering(slight=True)
@channel_session_user
def ws_receive(message):
    logger.warn("Called ws receive")
    user = message.user.username
    Group('plot-{}'.format(user)).send({
        'text': message['text'],
    })


@enforce_ordering(slight=True)
@channel_session_user
def ws_disconnect(message):
    logger.warn("Called ws disconnect")
    user = message.user.username
    Group('plot-{}'.format(user)).discard(message.reply_channel)


@enforce_ordering(slight=True)
@channel_session_user
def session_postgres_plot(message):
    logger.error("postgres plot called")

    sessions = json.loads(message.content['text'])
    auth_token = settings.DEVICE_SERVER_API_TOKEN
    url = settings.DEVICE_SERVER_API_URL
    log_url = url + '/logs'
    headers = {'Authorization': 'Token {}'.format(auth_token)}

    packet_deconstructor = PacketDeconstructor()

    count = 100000
    traces = []

    unimplemented_count = 0
    for session in sessions['sessionIds']:
        session_id = session['session_id']
        query_string = 'count={0}&session_id={1}'.format(count, session['session_id'])

        res = requests.get(log_url + '?' + query_string, headers=headers)
        res_json = res.json()
        data = res_json['results']

        trace_lists = {}
        for payload_type in packet_deconstructor.payload_type_map.values():
            trace_lists[payload_type] = {
                'data': [],
                'time': [],
            }

        for datum in data:
            raw_packet = datum['raw_packet']
            packet_deconstructor.set_raw_packet(raw_packet)
            packet_deconstructor.deconstruct_packet()
            packet_time = packet_deconstructor.timestamp
            payload_type = packet_deconstructor.payload_type
            try:
                trace_lists[payload_type]['data'].append(str(round(packet_deconstructor.payload, 4)))
                trace_lists[payload_type]['time'].append(str(packet_time))
            except Exception as e:
                unimplemented_count += 1
                logger.warn('Unimplemented register {0}, count = {1}'.format(
                    payload_type, unimplemented_count)
                )

        for payload_type, data_list in trace_lists.items():
            traces.append({
                'x': data_list['time'],
                'y': data_list['data'],
                'dataType': str(payload_type),
                'plotType': 'scatter',
                'sessionId': str(session_id)
            })

    user = message.user.username
    Group('plot-{}'.format(user)).send({
        'text': json.dumps(traces),
    })


@enforce_ordering(slight=True)
@channel_session_user
def cassandra_plot(message):
    logger.error("cassandra plot called")

    cluster = Cluster([settings.CASSANDRA_HOST],
                      port=settings.CASSANDRA_PORT)
    cassandra_session = cluster.connect('device_data')

    # This whole thing is a dirty hack for now.
    sessions = json.loads(message.content['text'])

    packet_deconstructor = PacketDeconstructor()

    traces = []
    unimplemented_count = 0
    for session in sessions['sessionIds']:
        session_id = session['session_id']

        # device_data = cassandra_session.execute('select * from data_stream limit 5000;')
        device_data = cassandra_session.execute(
            'select * from data_stream where device_id=\'{}\' limit 100000;'.format(session_id)
        )

        trace_lists = {}
        for payload_type in packet_deconstructor.payload_type_map.values():
            trace_lists[payload_type] = {
                'data': [],
                'time': [],
            }

        # TODO: figure out if you can convert directly to pandas dataframe
        for row in device_data:
            packet_time = row.sample_time
            payload_type_id = row.data_type
            try:
                payload_type = packet_deconstructor.payload_type_map[payload_type_id]
                trace_lists[payload_type]['data'].append(str(round(row.data_value, 4)))
                trace_lists[payload_type]['time'].append(str(packet_time))
            except Exception as e:
                unimplemented_count += 1
                logger.warn('Unimplemented register {0}, count = {1}'.format(
                    payload_type_id, unimplemented_count)
                )

        for payload_type, data_list in trace_lists.items():
            traces.append({
                'x': data_list['time'],
                'y': data_list['data'],
                'dataType': str(payload_type),
                'plotType': 'scatter',
                'sessionId': str(session_id)
            })

    user = message.user.username
    Group('plot-{}'.format(user)).send({
        'text': json.dumps(traces),
    })
