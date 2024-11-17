package be.pxl.config;

import be.pxl.domain.Author;
import be.pxl.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@RequiredArgsConstructor
@Component
public class DataLoader implements CommandLineRunner {
    private final AuthorRepository authorRepository;
    Logger logger = LoggerFactory.getLogger(DataLoader.class);
    @Override
    public void run(String... args){
        if (authorRepository.findAll().size() != 3){
            authorRepository.save(Author.builder().firstName("Dries").lastName("Swinnen").posts(null).build());
            authorRepository.save(Author.builder().firstName("Tom").lastName("Schuyten").build());
            authorRepository.save(Author.builder().firstName("John").lastName("Doe").build());
            logger.info("Saved 3 initial authors into database.");
        }else{
            logger.info("Authors already initialized.");
        }
    }
}
