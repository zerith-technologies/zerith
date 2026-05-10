package com.zerith.backend.config;

import com.zerith.backend.service.TelemetriaService;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

@Configuration
@ConditionalOnProperty(name = "mqtt.enabled", havingValue = "true")
public class MqttConfig {

    @Value("${mqtt.broker.url}")
    private String brokerUrl;

    @Value("${mqtt.client.id}")
    private String clientId;

    private final TelemetriaService telemetriaService;

    public MqttConfig(TelemetriaService telemetriaService) {
        this.telemetriaService = telemetriaService;
    }

    @Bean
    public DefaultMqttPahoClientFactory mqttClientFactory() {
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{brokerUrl});
        options.setCleanSession(true);
        options.setAutomaticReconnect(true);
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageProducer mqttInbound() {
        MqttPahoMessageDrivenChannelAdapter adapter =
            new MqttPahoMessageDrivenChannelAdapter(
                clientId + "-inbound",
                mqttClientFactory(),
                "zerith/vehicles/+/telemetry"
            );
        adapter.setCompletionTimeout(5000);
        DefaultPahoMessageConverter converter = new DefaultPahoMessageConverter();
        converter.setPayloadAsBytes(false);
        adapter.setConverter(converter);
        adapter.setQos(0);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler mqttMessageHandler() {
        return message -> telemetriaService.handleMqttMessage((String) message.getPayload());
    }
}
