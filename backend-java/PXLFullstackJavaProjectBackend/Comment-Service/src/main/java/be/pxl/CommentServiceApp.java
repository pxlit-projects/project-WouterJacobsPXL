package be.pxl;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * CommentServiceApp
 */
@EnableDiscoveryClient
@SpringBootApplication
public class CommentServiceApp
{
    public static void main( String[] args )
    {
        new SpringApplicationBuilder(CommentServiceApp.class).run(args);
    }
}
