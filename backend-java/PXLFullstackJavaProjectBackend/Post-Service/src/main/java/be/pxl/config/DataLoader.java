package be.pxl.config;

import be.pxl.domain.Author;
import be.pxl.domain.Post;
import be.pxl.repository.AuthorRepository;
import be.pxl.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@RequiredArgsConstructor
@Component
public class DataLoader implements CommandLineRunner {
    private final AuthorRepository authorRepository;
    private final PostRepository postRepository;

    Logger logger = LoggerFactory.getLogger(DataLoader.class);

    @Override
    public void run(String... args) {
        List<Author> authors = ensureAuthors();

        addMockPosts(authors);
    }

    private List<Author> ensureAuthors() {
        if (authorRepository.findAll().size() != 3) {
            authorRepository.save(Author.builder().firstName("Dries").lastName("Swinnen").build());
            authorRepository.save(Author.builder().firstName("Tom").lastName("Schuyten").build());
            authorRepository.save(Author.builder().firstName("John").lastName("Doe").build());
            logger.info("Saved 3 initial authors into database.");
        } else {
            logger.info("Authors already initialized.");
        }
        return authorRepository.findAll();
    }

    private void addMockPosts(List<Author> authors) {
        List<String> categories = Arrays.asList("Tech", "Lifestyle", "News", "History");
        if (postRepository.findAll().isEmpty()) {
            authors.forEach(author -> {
                // Generate random counts for published and concept posts
                int publishedPostsCount = ThreadLocalRandom.current().nextInt(1, 5); // Random between 1 and 4
                int conceptPostsCount = ThreadLocalRandom.current().nextInt(1, 4);   // Random between 1 and 3
                int reviewPostsCount = ThreadLocalRandom.current().nextInt(1, 4);   // Random between 1 and 3

                logger.info("Creating {} published and {} concept posts for author {} {}",
                        publishedPostsCount, conceptPostsCount, author.getFirstName(), author.getLastName());

                // Add published posts
                for (int i = 1; i <= publishedPostsCount; i++) {
                    Post post = Post.builder()
                            .title("Published Post " + i + " by " + author.getFirstName())
                            .content("This is the content of published post " + i + " by " + author.getFirstName()
                                    + " lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum" +
                                    " lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.")
                            .previewContent("Preview content of the published post " + i + " lorem ipsum lorem ipsum lorem ipsum.")
                            .imageUrl("https://example.com/images/post" + i + ".jpg")
                            .isConcept(false)
                            .category(categories.get(i -1))
                            .author(author)
                            .inReview(false)
                            .build();
                    postRepository.save(post);
                }

                // Add concept posts
                for (int i = 1; i <= conceptPostsCount; i++) {
                    Post concept = Post.builder()
                            .title("Concept Post " + i + " by " + author.getFirstName())
                            .content("This is the content of concept post " + i + " by " + author.getFirstName()
                                    + " lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum" +
                                    " lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.")
                            .previewContent("Preview of concept post " + i + " lorem ipsum lorem ipsum lorem ipsum." )
                            .imageUrl("https://example.com/images/concept" + i + ".jpg")
                            .isConcept(true)
                            .category(categories.get(i -1))
                            .author(author)
                            .inReview(false)
                            .build();
                    postRepository.save(concept);
                }

                // Add posts in review
                for (int i = 1; i <= 3; i++) {
                    Post post = Post.builder()
                            .title("In review Post " + i + " by " + author.getFirstName())
                            .content("This is the content of published post " + i + " by " + author.getFirstName()
                                    + " lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum" +
                                    " lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.")
                            .previewContent("Preview content of the published post " + i + " lorem ipsum lorem ipsum lorem ipsum.")
                            .imageUrl("https://example.com/images/post" + i + ".jpg")
                            .isConcept(false)
                            .category(categories.get(i - 1))
                            .author(author)
                            .inReview(true)
                            .build();
                    postRepository.save(post);
                }
            });
            logger.info("Random mock posts added for each author.");
        } else {
            logger.info("Posts already initialized.");
        }
    }
}
