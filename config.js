var config = {};

config.TemperatureTopic = {};

config.TemperatureTopic = '/sense';
config.CardTopic = '/card';


config.SubSense = '/subsense';
config.PubSense = '/pubsense';

//config.BrokerAddress = 'mqtt://broker.hivemq.com';
config.BrokerAddress = 'mqtt://192.168.137.1';

module.exports = config;