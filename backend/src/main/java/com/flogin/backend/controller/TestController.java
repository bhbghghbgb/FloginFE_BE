package com.flogin.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Special controller used ONLY for E2E testing to reset the database state.
 * This endpoint is only enabled when the 'e2e' Spring profile is active,
 * preventing its accidental use in staging or production.
 */
@RestController
@RequestMapping("/api/test-utils")
@Profile("e2e")
@Slf4j
public class TestController {

    private final JdbcTemplate jdbcTemplate;

    private static final String[] TABLE_NAMES = {"products",};

    public TestController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Resets the entire database by deleting all records from known tables.
     * This makes tests idempotent and repeatable.
     */
    @PostMapping("/reset-db")
    @Transactional
    public String resetDatabase() {
        log.warn("!!! E2E TEST ACTION: Clearing database tables !!!");

        // Disable foreign key checks for safe deletion order (H2/SQLite compatibility)
        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0;");

        for (String tableName : TABLE_NAMES) {
            // Note: Use TRUNCATE if available and faster, but DELETE is safer across DB types.
            jdbcTemplate.update("DELETE FROM " + tableName);
        }

        // Re-enable foreign key checks
        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1;");

        log.info("Database reset complete for E2E tests.");
        return "Database reset successful.";
    }
}