import {
  webSocketServerConfig,
  linkServerConfig
} from './config';
import ConnectionServer from './connectionLinkServer';

const connectionServer = new ConnectionServer(
  webSocketServerConfig,
  linkServerConfig
);
connectionServer.init();