from channels.routing import route
from documents import consumers as graph_consumers

channel_routing = [
    route('websocket.connect', graph_consumers.ws_connect,
          path=r'^/cassandra/plot'),
    route('websocket.disconnect', graph_consumers.ws_disconnect,
          path=r'^/cassandra/plot'),
    route('websocket.connect', graph_consumers.ws_connect,
          path=r'^/postgres/plot'),
    route('websocket.disconnect', graph_consumers.ws_disconnect,
          path=r'^/postgres/plot'),
]
