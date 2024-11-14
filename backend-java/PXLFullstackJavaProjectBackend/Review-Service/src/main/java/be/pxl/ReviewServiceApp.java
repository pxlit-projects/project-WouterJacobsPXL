package be.pxl;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * ReviewServiceApp
 */
@EnableDiscoveryClient
@SpringBootApplication
public class ReviewServiceApp
{
    public static void main( String[] args )
    {
        new SpringApplicationBuilder(ReviewServiceApp.class).run(args);
    }
}
