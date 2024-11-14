package be.pxl;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.config.server.EnableConfigServer;

/**
 * Hello world!
 *
 */
@EnableConfigServer
@SpringBootApplication
public class ConfigServiceApp
{
    public static void main( String[] args )
    {
        new SpringApplicationBuilder(ConfigServiceApp.class).run(args);
    }
}
