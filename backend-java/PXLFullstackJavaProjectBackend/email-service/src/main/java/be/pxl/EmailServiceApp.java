package be.pxl;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * email-service
 */
@EnableDiscoveryClient
@SpringBootApplication
public class EmailServiceApp
{
    public static void main( String[] args )
    {
        new SpringApplicationBuilder(EmailServiceApp.class).run(args);
    }
}
