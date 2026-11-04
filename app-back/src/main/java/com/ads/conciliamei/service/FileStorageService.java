package com.ads.conciliamei.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;

import java.io.IOException;
import java.util.Locale;
import java.util.UUID;

@Service
public class FileStorageService {

    private final S3Client s3Client;

    @Value("${b2.bucket}")
    private String bucket;

    public FileStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String upload(MultipartFile file, String empresaId)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "O arquivo enviado está vazio."
            );
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "O arquivo não pode ultrapassar 10 MB."
            );
        }

        String nomeOriginal = file.getOriginalFilename();

        if (nomeOriginal == null || !nomeOriginal.contains(".")) {
            throw new IllegalArgumentException(
                    "Arquivo inválido."
            );
        }

        String extensao = nomeOriginal
                .substring(nomeOriginal.lastIndexOf('.') + 1)
                .toLowerCase(Locale.ROOT);

        String contentType;

        if (extensao.equals("pdf")) {
            contentType = "application/pdf";
        } else if (extensao.equals("xml")) {
            contentType = "application/xml";
        } else {
            throw new IllegalArgumentException(
                    "Formato não permitido. Envie PDF ou XML."
            );
        }

        String fileKey = "notas/" + empresaId + "/"
                + UUID.randomUUID() + "." + extensao;

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(fileKey)
                .contentType(contentType)
                .build();

        s3Client.putObject(
                request,
                RequestBody.fromBytes(fileBytes(file))
        );

        return fileKey;
    }

    public void delete(String fileKey) {

        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(fileKey)
                .build();

        s3Client.deleteObject(request);
    }

    private byte[] fileBytes(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();

        if (bytes.length >= 5
                && bytes[0] == '%'
                && bytes[1] == 'P'
                && bytes[2] == 'D'
                && bytes[3] == 'F'
                && bytes[4] == '-') {
            return bytes;
        }

        if (file.getOriginalFilename().toLowerCase(Locale.ROOT).endsWith(".xml")) {
            String conteudo = new String(bytes, java.nio.charset.StandardCharsets.UTF_8)
                    .replace("\uFEFF", "")
                    .stripLeading();

            if (conteudo.startsWith("<")) {
                return bytes;
            }
        }

        throw new IllegalArgumentException(
                "O conteúdo do arquivo não corresponde ao formato informado."
        );
    }
}
