package com.quantumshop.productservice.exception;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Ürün Bulunamadı Hatası (404)
/*    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleProductNotFound(ProductNotFoundException ex) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", HttpStatus.NOT_FOUND.value());
        errorBody.put("error", "Not Found");
        errorBody.put("message", ex.getMessage());
        return new ResponseEntity<>(errorBody, HttpStatus.NOT_FOUND);
    }
*/
/*        @ExceptionHandler(ProductNotFoundException.class)
        public ResponseEntity<Object> handleProductNotFound(ProductNotFoundException ex){
            Map<String,Object> body=new LinkedHashMap<>();
            body.put("timestamp", LocalDateTime.now());
            body.put("status",404);
            body.put("error","NOT_FOUND");
            body.put("message",ex.getMessage());
            return new ResponseEntity<>(body,HttpStatus.NOT_FOUND);
        }
*/
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProductNotFound(ProductNotFoundException ex, HttpServletRequest request) {
        ErrorResponse response = new ErrorResponse(LocalDateTime.now(), HttpStatus.NOT_FOUND.value(),
                "Product Not Found", ex.getMessage(), request.getRequestURI() );
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }


    // 2. ② Bean Validation Hataları (400 Bad Request)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationErrors(MethodArgumentNotValidException ex){
        Map<String,Object> body=new LinkedHashMap<>();
        body.put("timestamp",LocalDateTime.now());
        body.put("status",400);
        body.put("error","Validation Failed");
        Map<String,String> errors=new LinkedHashMap<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error-> errors.put(error.getField(), error.getDefaultMessage()) );
        body.put("errors",errors);
        return new ResponseEntity<>(body,HttpStatus.BAD_REQUEST);
    }
/*
        // 2. ② Bean Validation Hataları (400 Bad Request)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", HttpStatus.BAD_REQUEST.value());
        errorBody.put("error", "Validation Failed");
        errorBody.put("validationErrors", errors);

        return new ResponseEntity<>(errorBody, HttpStatus.BAD_REQUEST);
    }
*/
    // 3. Genel Beklenmeyen Sistem Hataları (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorBody.put("error", "Internal Server Error");
        errorBody.put("message", "Sistemde beklenmeyen bir hata oluştu.");
        return new ResponseEntity<>(errorBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
