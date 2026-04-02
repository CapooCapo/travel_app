package com.example.mobileApp.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10); // Số luồng luôn hoạt động
        executor.setMaxPoolSize(50);  // Số luồng tối đa khi tải cao
        executor.setQueueCapacity(100); // Số tác vụ chờ trong hàng đợi
        executor.setThreadNamePrefix("OsmAsync-");
        executor.initialize();
        return executor;
    }
}