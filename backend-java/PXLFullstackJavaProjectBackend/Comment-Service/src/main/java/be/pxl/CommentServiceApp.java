package be.pxl;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

/**
 * CommentServiceApp
 */
@SpringBootApplication
public class CommentServiceApp
{
    public static void main( String[] args )
    {
        new SpringApplicationBuilder(CommentServiceApp.class).run(args);
    }
}
