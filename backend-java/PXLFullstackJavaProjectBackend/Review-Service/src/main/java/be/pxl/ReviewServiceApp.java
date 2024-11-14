package be.pxl;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

/**
 * ReviewServiceApp
 */
@SpringBootApplication
public class ReviewServiceApp
{
    public static void main( String[] args )
    {
        new SpringApplicationBuilder(ReviewServiceApp.class).run(args);
    }
}
