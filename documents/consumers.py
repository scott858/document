import logging

from django.http import HttpResponse
from channels import Group
from channels.auth import channel_session_user, channel_session_user_from_http
from channels.handler import AsgiHandler

logger = logging.getLogger(__name__)


def http_consumer(message):
    response = HttpResponse('Hello hhhworld')
    for chunk in AsgiHandler.encode_response(response):
        message.reply_channel.send(chunk)


# @enforce_ordering(slight=True)
@channel_session_user_from_http
def ws_connect(message):
    logger.warning("Called ws connect")
    user = message.user.username
    Group('plot-{}'.format(user)).add(message.reply_channel)


# @enforce_ordering(slight=True)
@channel_session_user
def ws_receive(message):
    logger.warning("Called ws receive")
    user = message.user.username
    Group('plot-{}'.format(user)).send({
        'text': message['text'],
    })


# @enforce_ordering(slight=True)
@channel_session_user
def ws_disconnect(message):
    logger.warning("Called ws disconnect")
    user = message.user.username
    Group('plot-{}'.format(user)).discard(message.reply_channel)
