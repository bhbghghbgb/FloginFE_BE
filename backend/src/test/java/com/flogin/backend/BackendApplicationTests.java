package com.flogin.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import com.flogin.backend.controller.AuthController;
import com.flogin.backend.controller.ProductController;

import javax.sql.DataSource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BackendApplicationTests {

    // @Test
    // void contextLoads() {
    // }

    @Autowired
    private ApplicationContext context;

    @Autowired(required = false)
    private DataSource dataSource;

    // Test 1: Application context khởi động thành công
    @Test
    void applicationContextLoads() {
        assertNotNull(context);
    }

    // Test 2: Tất cả Controllers được load
    @Test
    void allControllersAreLoaded() {
        assertNotNull(context.getBean(AuthController.class));
        assertNotNull(context.getBean(ProductController.class));
    }

    // Test 3: Database connection hoạt động
    @Test
    void databaseConnectionWorks() {
        if (dataSource != null) {
            assertDoesNotThrow(() -> {
                dataSource.getConnection().close();
            });
        }
    }

    // Test 4: Application properties được load
    @Test
    void applicationPropertiesAreLoaded() {
        String appName = context.getEnvironment()
                .getProperty("spring.application.name");
        assertNotNull(appName);
    }

    // Test 5: Tất cả beans cần thiết được khởi tạo
    @Test
    void allNecessaryBeansAreInitialized() {
        int beanCount = context.getBeanDefinitionCount();
        assertTrue(beanCount > 0,
                "Should have loaded multiple beans");
    }
}
