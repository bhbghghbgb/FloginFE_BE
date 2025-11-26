package com.flogin.backend.exception;

public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(String message) {
        super(message);
    }

    public static EntityNotFoundException forId(Class<?> entityClass, Long id) {
        String entityName = entityClass.getSimpleName();
        return new EntityNotFoundException(String.format("%s not found with id: %d", entityName, id));
    }

    public static EntityNotFoundException forField(Class<?> entityClass, String fieldName, Object fieldValue) {
        String entityName = entityClass.getSimpleName();
        return new EntityNotFoundException(String.format("%s not found with %s: %s", entityName, fieldName, fieldValue));
    }
}