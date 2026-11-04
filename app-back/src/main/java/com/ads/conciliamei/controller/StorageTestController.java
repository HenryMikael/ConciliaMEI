package com.ads.conciliamei.controller;

import com.ads.conciliamei.domain.company.Company;
import com.ads.conciliamei.domain.user.User;
import com.ads.conciliamei.exception.CompanyNotFoundException;
import com.ads.conciliamei.repositories.CompanyRepository;
import com.ads.conciliamei.service.FileStorageService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/storage")
public class StorageTestController {

    private final FileStorageService fileStorageService;
    private final CompanyRepository companyRepository;

    public StorageTestController(
            FileStorageService fileStorageService,
            CompanyRepository companyRepository
    ) {
        this.fileStorageService = fileStorageService;
        this.companyRepository = companyRepository;
    }

    @PostMapping(
            value = "/test-upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> testUpload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ) throws IOException {

        Company company = companyRepository
                .findByUsuarioId(user.getId())
                .orElseThrow(() -> new CompanyNotFoundException(
                        "Nenhuma empresa cadastrada."
                ));

        String fileKey = fileStorageService.upload(
                file,
                company.getId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "message", "Arquivo enviado com sucesso!",
                        "fileKey", fileKey
                )
        );
    }
}
