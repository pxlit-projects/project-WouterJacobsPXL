package be.pxl.service;

import be.pxl.api.dto.PostRequestDto;
import be.pxl.api.dto.PostResponseDto;
import be.pxl.domain.Author;
import be.pxl.domain.Post;

import java.util.List;

public interface IPostService {
    void addPost(PostRequestDto postRequestDto);
    void addConcept(PostRequestDto postRequestDto);
    void deleteConcept(Long id);
    List<PostResponseDto> getPosts();
    PostResponseDto getPostById(Long id);
    List<PostResponseDto> getConcepts();
    PostResponseDto getConceptById(Long id);
    void updatePost(PostRequestDto postRequestDto);
}
