package com.ads.conciliamei.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
public class B2Config {

    @Value("${b2.endpoint}")
    private String endpoint;

    @Value("${b2.region}")
    private String region;

    @Value("${b2.access-key}")
    private String accessKey;

    @Value("${b2.secret-key}")
    private String secretKey;

    @Bean(destroyMethod = "close")
    public S3Client s3Client() {

        return S3Client.builder()
                .endpointOverride(URI.create(endpoint)) // endpointOverride() - aponta para o servidor do Backblaze
                .region(Region.of(region))              //Region.of() informa a região usada na assinatura das requisições
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsSessionCredentials.create(
                                        accessKey,
                                        secretKey,
                                        ""
                                )
                        )
                )
                .serviceConfiguration(
                        S3Configuration.builder()
                                .pathStyleAccessEnabled(true)   //pathStyleAccessEnabled(true) utiliza o formato de endereço compatível com o B2
                                .build()
                )
                .build();
    }
}
