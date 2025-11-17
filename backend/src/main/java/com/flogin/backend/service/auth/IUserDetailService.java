package com.flogin.backend.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface IUserDetailService {

    UserDetails loadUserByUsername(String username);
}
