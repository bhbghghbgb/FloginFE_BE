package com.flogin.backend.service.auth;

import org.springframework.security.core.userdetails.UserDetails;

public interface IUserDetailService {

    UserDetails loadUserByUsername(String username);
}
