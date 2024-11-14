package be.pxl;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

/**
 * PostServiceApp
 */
@SpringBootApplication
public class PostServiceApp
{
    public static void main( String[] args )
    {
        new SpringApplicationBuilder(PostServiceApp.class).run(args);
    }
}
