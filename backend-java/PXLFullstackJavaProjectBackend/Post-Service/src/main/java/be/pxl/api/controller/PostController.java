package be.pxl.api.controller;

import be.pxl.api.dto.PostRequestDto;
import be.pxl.api.dto.PostResponseDto;
import be.pxl.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    //TODO add 400ths , 500ths error codes


    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createPost(@Valid @RequestBody PostRequestDto postRequestDto) {
        postService.addPost(postRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        return ResponseEntity.ok(postService.getPosts());
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping(value = "/concepts", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PostResponseDto>> getAllConcepts() {
        return ResponseEntity.ok(postService.getConcepts());
    }

    @PostMapping(value = "/concepts", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createConcept(@Valid @RequestBody PostRequestDto postRequestDto) {
        postService.addConcept(postRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping(value = "/concepts/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> deleteConcept(@PathVariable Long id) {
        postService.deleteConcept(id);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
