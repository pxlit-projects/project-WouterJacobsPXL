package be.pxl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * DiscoveryServiceApp
 */
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServiceApp
{
    public static void main( String[] args )
    {
        SpringApplication.run(DiscoveryServiceApp.class, args);
    }
}
