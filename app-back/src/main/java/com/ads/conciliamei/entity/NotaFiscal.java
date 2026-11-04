package com.ads.conciliamei.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class NotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numero;
    private String cnpjPrestador;
    private String cnpjTomador;

    private BigDecimal valor;

    private LocalDateTime dataEmissao;

    private String status;

    private String fileKey;
    private String fileName;
    private String fileType;

}
