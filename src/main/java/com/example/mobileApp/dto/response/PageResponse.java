package com.example.mobileApp.dto.response;

import java.util.List;

import org.springframework.data.domain.Page;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PageResponse<T> {

    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private List<T> content;

    public static <T> PageResponse<T> of(Page<T> pageData) {
        PageResponse<T> res = new PageResponse<>();
        res.setPage(pageData.getNumber());
        res.setSize(pageData.getSize());
        res.setTotalElements(pageData.getTotalElements());
        res.setTotalPages(pageData.getTotalPages());
        res.setContent(pageData.getContent());
        return res;
    }
}