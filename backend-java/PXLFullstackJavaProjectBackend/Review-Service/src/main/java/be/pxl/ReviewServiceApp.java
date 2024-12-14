package be.pxl;

import be.pxl.client.PostServiceClient;
import be.pxl.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * ReviewServiceApp
 */
@EnableDiscoveryClient
@SpringBootApplication
@EnableFeignClients
public class ReviewServiceApp
{
    public static void main( String[] args )
    {
        new SpringApplicationBuilder(ReviewServiceApp.class).run(args);
    }
}
